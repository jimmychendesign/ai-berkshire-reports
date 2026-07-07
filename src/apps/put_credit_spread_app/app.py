
import math
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

import numpy as np
import pandas as pd
import requests
import streamlit as st
from scipy.stats import norm


st.set_page_config(page_title="Put Credit Spread Scanner", layout="wide")

st.title("Put Credit Spread Scanner")
st.caption("直接连接 Yahoo Finance 行情与期权链，筛选接近「87% 胜率、赚 1 亏 3」的 Put Credit Spread。")


SOURCE_NAME = "Yahoo Finance"
CACHE_TTL_SECONDS = 900
SAMPLE_PRICES = {
    "SPY": 607.0,
    "QQQ": 540.0,
    "NVDA": 155.0,
    "TSLA": 335.0,
    "AAPL": 200.0,
    "MSFT": 485.0,
}
YAHOO_OPTIONS_URL = "https://query2.finance.yahoo.com/v7/finance/options/{ticker}"
YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
YAHOO_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
}


class YahooFinanceError(RuntimeError):
    pass


@st.cache_resource
def yahoo_session():
    session = requests.Session()
    session.headers.update(YAHOO_HEADERS)
    return session


def bs_put_delta(S, K, T, r, sigma):
    if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
        return np.nan
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    return norm.cdf(d1) - 1


def lognormal_pop_above(S, breakeven, T, r, sigma):
    """Approx probability that price expires above breakeven."""
    if S <= 0 or breakeven <= 0 or T <= 0 or sigma <= 0:
        return np.nan
    z = (math.log(breakeven / S) - (r - 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    return 1 - norm.cdf(z)


def yahoo_quote_url(ticker):
    return f"https://finance.yahoo.com/quote/{quote(ticker)}"


def clean_ticker(raw_ticker):
    ticker = raw_ticker.upper().strip()
    if not ticker:
        raise ValueError("请输入股票代码。")
    return ticker


def _as_float(value):
    try:
        if value is None or pd.isna(value):
            return np.nan
        return float(value)
    except (TypeError, ValueError):
        return np.nan


def yahoo_request_json(url, params=None, referer=None):
    session = yahoo_session()
    headers = {}
    if referer:
        headers["Referer"] = referer

    response = session.get(url, params=params or {}, headers=headers, timeout=12)
    if response.status_code == 429:
        raise YahooFinanceError("Yahoo Finance 当前请求过于频繁，请稍后再试。")
    if response.status_code == 401:
        raise YahooFinanceError("Yahoo Finance 当前要求重新授权 cookie/crumb，请稍后刷新重试。")
    if response.status_code == 403:
        raise YahooFinanceError("Yahoo Finance 当前阻止了本机请求，请稍后再试。")
    if response.status_code >= 400:
        raise YahooFinanceError(f"Yahoo Finance 返回 HTTP {response.status_code}。")

    try:
        return response.json()
    except ValueError as exc:
        raise YahooFinanceError("Yahoo Finance 返回的不是 JSON 数据。") from exc


def yahoo_get_options(ticker, expiration_timestamp=None):
    params = {}
    if expiration_timestamp is not None:
        params["date"] = int(expiration_timestamp)

    payload = yahoo_request_json(
        YAHOO_OPTIONS_URL.format(ticker=quote(ticker)),
        params=params,
        referer=f"https://finance.yahoo.com/quote/{quote(ticker)}/options/",
    )
    error = payload.get("optionChain", {}).get("error")
    if error:
        description = error.get("description") or error.get("code") or "未知错误"
        raise YahooFinanceError(description)

    results = payload.get("optionChain", {}).get("result") or []
    if not results:
        raise YahooFinanceError("Yahoo Finance 没有返回 optionChain 数据。")

    return results[0]


def yahoo_get_chart_quote(ticker):
    payload = yahoo_request_json(
        YAHOO_CHART_URL.format(ticker=quote(ticker)),
        params={"range": "5d", "interval": "1d"},
        referer=f"https://finance.yahoo.com/quote/{quote(ticker)}/",
    )
    error = payload.get("chart", {}).get("error")
    if error:
        raise YahooFinanceError(error.get("description") or error.get("code") or "chart 接口错误")

    results = payload.get("chart", {}).get("result") or []
    if not results:
        raise YahooFinanceError("Yahoo Finance chart 接口没有返回价格数据。")

    result = results[0]
    meta = result.get("meta") or {}
    quote_series = ((result.get("indicators") or {}).get("quote") or [{}])[0]
    closes = [x for x in quote_series.get("close", []) if x is not None]
    price = _as_float(meta.get("regularMarketPrice"))
    if np.isnan(price) or price <= 0:
        price = _as_float(closes[-1] if closes else np.nan)
    if np.isnan(price) or price <= 0:
        raise YahooFinanceError("Yahoo Finance chart 接口没有返回可用价格。")

    previous_close = _as_float(meta.get("previousClose"))
    currency = meta.get("currency") or "USD"
    return price, previous_close, currency


def fallback_expirations(count=8):
    today = datetime.now(timezone.utc).date()
    days_until_friday = (4 - today.weekday()) % 7
    first_friday = today + timedelta(days=days_until_friday or 7)
    return [(first_friday + timedelta(days=7 * i)).strftime("%Y-%m-%d") for i in range(count)]


def fallback_price(ticker):
    if ticker not in SAMPLE_PRICES:
        raise YahooFinanceError("无法获取实时价格。请稍后刷新，或换一个 Yahoo Finance 支持的 ticker。")
    return SAMPLE_PRICES[ticker], np.nan, "USD"


def make_sample_put_chain(ticker, price, expiration):
    exp_dt = datetime.strptime(expiration, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    days = max((exp_dt - datetime.now(timezone.utc)).days, 1)
    base_iv = 0.18 + min(days / 365, 1.0) * 0.08
    step = 1 if price < 150 else 5
    center = round(price / step) * step
    strikes = np.arange(center * 0.65, center * 1.02, step)

    rows = []
    for strike in strikes:
        moneyness = max((price - strike) / price, -0.15)
        distance = abs(price - strike) / price
        time_value = price * base_iv * math.sqrt(days / 365) * max(0.08, 0.45 - distance * 2.5)
        intrinsic = max(strike - price, 0)
        mid = max(0.05, intrinsic + time_value)
        spread = max(0.02, min(0.5, mid * 0.08))
        bid = max(0.01, mid - spread / 2)
        ask = bid + spread
        oi = int(max(10, 2000 * (1 - min(distance * 5, 0.95))))
        rows.append({
            "contractSymbol": f"{ticker}{expiration.replace('-', '')}P{int(strike * 1000):08d}",
            "strike": float(round(strike, 2)),
            "bid": float(round(bid, 2)),
            "ask": float(round(ask, 2)),
            "lastPrice": float(round(mid, 2)),
            "impliedVolatility": float(round(base_iv + distance * 0.45 + max(-moneyness, 0) * 0.15, 4)),
            "volume": int(max(0, oi * 0.08)),
            "openInterest": oi,
        })
    return pd.DataFrame(rows)


@st.cache_data(ttl=CACHE_TTL_SECONDS, show_spinner=False)
def load_market_snapshot(ticker, demo_mode=False):
    """Load quote, recent history, and expirations from Yahoo Finance."""
    fetched_at = datetime.now(timezone.utc)
    try:
        price, previous_close, currency = yahoo_get_chart_quote(ticker)
    except Exception as exc:
        if not demo_mode:
            raise
        price, previous_close, currency = fallback_price(ticker)
        return {
            "price": price,
            "previous_close": previous_close,
            "currency": currency,
            "expirations": fallback_expirations(),
            "expiration_timestamps": [],
            "fetched_at": fetched_at.isoformat(),
            "source_mode": "演示数据",
            "source_warning": f"Yahoo quote 暂不可用：{exc}",
        }

    try:
        result = yahoo_get_options(ticker)
        expirations_ts = result.get("expirationDates") or []
        expirations = [
            datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
            for ts in expirations_ts
        ]
    except Exception as exc:
        if not demo_mode:
            raise
        expirations_ts = []
        expirations = fallback_expirations()
        return {
            "price": price,
            "previous_close": previous_close,
            "currency": currency,
            "expirations": expirations,
            "expiration_timestamps": expirations_ts,
            "fetched_at": fetched_at.isoformat(),
            "source_mode": "Yahoo 价格 + 演示期权链",
            "source_warning": f"Yahoo options 暂不可用：{exc}",
        }

    if not expirations:
        raise YahooFinanceError("Yahoo Finance 没有返回该 ticker 的期权到期日。")

    return {
        "price": price,
        "previous_close": previous_close,
        "currency": currency,
        "expirations": expirations,
        "expiration_timestamps": expirations_ts,
        "fetched_at": fetched_at.isoformat(),
        "source_mode": "Yahoo Finance 实时数据",
        "source_warning": "",
    }


@st.cache_data(ttl=CACHE_TTL_SECONDS, show_spinner=False)
def load_options(ticker, expiration, price, use_sample_fallback):
    expiration_timestamp = int(datetime.strptime(expiration, "%Y-%m-%d").replace(tzinfo=timezone.utc).timestamp())
    try:
        result = yahoo_get_options(ticker, expiration_timestamp)
        options = result.get("options") or []
        if not options:
            raise YahooFinanceError("Yahoo Finance 没有返回该到期日的期权链。")
        puts = pd.DataFrame(options[0].get("puts") or [])
        return puts, datetime.now(timezone.utc).isoformat(), "Yahoo options", ""
    except Exception as exc:
        if not use_sample_fallback:
            raise
        puts = make_sample_put_chain(ticker, price, expiration)
        return puts, datetime.now(timezone.utc).isoformat(), "示例期权链", str(exc)


def prepare_put_chain(raw_puts, min_open_interest, max_leg_spread):
    required_cols = [
        "contractSymbol",
        "strike",
        "bid",
        "ask",
        "lastPrice",
        "impliedVolatility",
        "volume",
        "openInterest",
    ]
    puts = raw_puts[[c for c in required_cols if c in raw_puts.columns]].copy()
    for col in ["strike", "bid", "ask", "lastPrice", "impliedVolatility", "volume", "openInterest"]:
        if col in puts.columns:
            puts[col] = pd.to_numeric(puts[col], errors="coerce")

    puts = puts.dropna(subset=["strike", "bid", "ask", "impliedVolatility"])
    puts = puts[(puts["bid"] > 0) & (puts["ask"] > 0) & (puts["impliedVolatility"] > 0)]
    puts = puts[puts["ask"] >= puts["bid"]]
    puts["Mid"] = (puts["bid"] + puts["ask"]) / 2
    puts["Bid/Ask Spread"] = puts["ask"] - puts["bid"]

    if "openInterest" in puts.columns and min_open_interest > 0:
        puts = puts[puts["openInterest"].fillna(0) >= min_open_interest]
    if max_leg_spread > 0:
        puts = puts[puts["Bid/Ask Spread"] <= max_leg_spread]

    return puts.sort_values("strike").reset_index(drop=True)


def build_spreads(puts, price, T, risk_free_rate, target_pop, min_width, max_width):
    rows = []
    # Short put = higher strike. Long put = lower strike.
    for _, short in puts.iterrows():
        long_candidates = puts[puts["strike"] < short["strike"]]
        for _, long in long_candidates.iterrows():
            width = float(short["strike"] - long["strike"])
            if width < min_width or width > max_width:
                continue

            net_credit = float(short["bid"] - long["ask"])
            if net_credit <= 0:
                continue

            max_profit = net_credit
            max_loss = width - net_credit
            if max_loss <= 0:
                continue

            credit_ratio = net_credit / width
            breakeven = float(short["strike"] - net_credit)

            # Use short leg IV as rough strategy IV.
            sigma = float(short["impliedVolatility"])
            put_delta = bs_put_delta(price, float(short["strike"]), T, risk_free_rate, sigma)
            pop = lognormal_pop_above(price, breakeven, T, risk_free_rate, sigma)

            target_ev = target_pop * max_profit - (1 - target_pop) * max_loss
            estimated_ev = pop * max_profit - (1 - pop) * max_loss if not np.isnan(pop) else np.nan

            rows.append({
                "Short Put Strike": float(short["strike"]),
                "Long Put Strike": float(long["strike"]),
                "Width": width,
                "Short Bid": float(short["bid"]),
                "Long Ask": float(long["ask"]),
                "Short Mid": float(short["Mid"]),
                "Long Mid": float(long["Mid"]),
                "Net Credit": net_credit,
                "Credit/Width": credit_ratio,
                "Max Profit": max_profit,
                "Max Loss": max_loss,
                "Break Even": breakeven,
                "Short Put Delta": put_delta,
                "Estimated POP": pop,
                "Target EV": target_ev,
                "Estimated EV": estimated_ev,
                "Short OI": short.get("openInterest", np.nan),
                "Long OI": long.get("openInterest", np.nan),
                "Short Volume": short.get("volume", np.nan),
                "Long Volume": long.get("volume", np.nan),
            })

    return pd.DataFrame(rows)


with st.sidebar:
    if "active_ticker" not in st.session_state:
        st.session_state["active_ticker"] = None

    with st.form("ticker_form"):
        ticker_input = st.text_input("股票代码", value=st.session_state["active_ticker"] or "SPY")
        submitted = st.form_submit_button("加载 Yahoo 数据", width="stretch")
        if submitted:
            st.session_state["active_ticker"] = clean_ticker(ticker_input)
            st.cache_data.clear()

    target_pop = st.slider("目标胜率 / POP", 0.50, 0.99, 0.87, 0.01)
    target_credit_ratio = st.slider("目标 Credit / Width", 0.05, 0.50, 0.25, 0.01)
    risk_free_rate = st.number_input("无风险利率", value=0.045, step=0.005, format="%.3f")
    pop_tolerance = st.slider("胜率容忍区间", 0.01, 0.20, 0.05, 0.01)
    credit_tolerance = st.slider("Credit/Width 容忍区间", 0.01, 0.20, 0.08, 0.01)
    min_width = st.number_input("最小 spread 宽度", value=1.0, min_value=0.5, step=0.5)
    max_width = st.number_input("最大 spread 宽度", value=20.0, min_value=1.0, step=0.5)
    min_open_interest = st.number_input("单腿最小 Open Interest", value=0, min_value=0, step=10)
    max_leg_spread = st.number_input("单腿最大 bid/ask spread", value=0.0, min_value=0.0, step=0.05, help="0 表示不限制。")
    use_sample_fallback = st.toggle("演示模式：使用示例期权链", value=False)
    max_rows = st.slider("最多显示结果", 10, 200, 60, 10)

try:
    ticker = st.session_state["active_ticker"]
    if not ticker:
        st.caption("输入股票代码后，点击侧边栏的“加载 Yahoo 数据”。")
        st.stop()

    with st.spinner(f"正在连接 {SOURCE_NAME} 获取 {ticker} 行情..."):
        snapshot = load_market_snapshot(ticker, use_sample_fallback)

    price = snapshot["price"]
    expirations = snapshot["expirations"]
    currency = snapshot["currency"]
    fetched_at = datetime.fromisoformat(snapshot["fetched_at"]).astimezone()

    expiration = st.selectbox("选择到期日", expirations, index=min(2, len(expirations)-1))
    exp_dt = datetime.strptime(expiration, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    T = max((exp_dt - now).days / 365, 1 / 365)

    try:
        with st.spinner(f"正在连接 {SOURCE_NAME} 获取 {expiration} 期权链..."):
            raw_puts, options_fetched_at, options_source, options_warning = load_options(
                ticker,
                expiration,
                price,
                use_sample_fallback,
            )
    except Exception:
        metric_cols = st.columns(4)
        metric_cols[0].metric("当前股票", ticker)
        metric_cols[1].metric("当前价格", f"{currency} {price:,.2f}")
        metric_cols[2].metric("可用到期日", f"{len(expirations)}")
        metric_cols[3].metric("数据模式", "Yahoo chart")
        st.caption(
            f"Yahoo 行情获取时间：{fetched_at:%Y-%m-%d %H:%M:%S %Z}。"
            f" [在 Yahoo Finance 打开 {ticker}]({yahoo_quote_url(ticker)})"
        )
        st.warning("暂时无法获取 Yahoo 实时期权链。可以稍后刷新，或打开侧边栏的演示模式查看筛选界面。")
        st.stop()

    puts = prepare_put_chain(raw_puts, min_open_interest, max_leg_spread)
    options_fetched_at = datetime.fromisoformat(options_fetched_at).astimezone()

    metric_cols = st.columns(5)
    metric_cols[0].metric("当前股票", ticker)
    metric_cols[1].metric("当前价格", f"{currency} {price:,.2f}")
    metric_cols[2].metric("可用到期日", f"{len(expirations)}")
    metric_cols[3].metric("Put 合约数", f"{len(puts):,}")
    metric_cols[4].metric("数据模式", snapshot.get("source_mode", options_source))

    st.caption(
        f"Yahoo 数据获取时间：行情 {fetched_at:%Y-%m-%d %H:%M:%S %Z}；"
        f"期权链 {options_fetched_at:%Y-%m-%d %H:%M:%S %Z}。"
        f" [在 Yahoo Finance 打开 {ticker}]({yahoo_quote_url(ticker)})"
    )
    if "示例" in snapshot.get("source_mode", "") or options_source == "示例期权链":
        st.caption("当前使用示例数据。点击侧边栏的刷新按钮可重试实时 Yahoo Finance 数据。")

    if puts.empty:
        st.warning("清洗和流动性过滤后没有可用 Put 报价。可以降低 OI / bid-ask 限制，或换一个到期日。")
        st.stop()

    df = build_spreads(puts, price, T, risk_free_rate, target_pop, min_width, max_width)
    if df.empty:
        st.warning("没有找到可用的 Put Credit Spread 报价。可以放宽 spread 宽度、流动性限制，或换一个到期日。")
        st.stop()

    df["POP Gap"] = (df["Estimated POP"] - target_pop).abs()
    df["Credit Gap"] = (df["Credit/Width"] - target_credit_ratio).abs()

    filtered = df[
        (df["POP Gap"] <= pop_tolerance) &
        (df["Credit Gap"] <= credit_tolerance)
    ].copy()

    if filtered.empty:
        st.caption("严格条件下没有结果，下面显示最接近目标的组合。")
        filtered = df.copy()

    filtered["Score"] = filtered["POP Gap"] * 2 + filtered["Credit Gap"]
    filtered = filtered.sort_values(["Score", "Estimated EV"], ascending=[True, False]).head(max_rows)

    show = filtered.drop(columns=["POP Gap", "Credit Gap", "Score"], errors="ignore")
    pct_cols = ["Credit/Width", "Estimated POP", "Short Put Delta"]
    for c in pct_cols:
        if c in show.columns:
            show[c] = show[c].astype(float)

    st.subheader("筛选结果")
    st.caption(f"共扫描 {len(df):,} 个 put credit spread，当前显示 {len(show):,} 个。")
    st.dataframe(
        show.style.format({
            "Short Put Strike": "{:.2f}",
            "Long Put Strike": "{:.2f}",
            "Width": "{:.2f}",
            "Short Bid": "{:.2f}",
            "Long Ask": "{:.2f}",
            "Short Mid": "{:.2f}",
            "Long Mid": "{:.2f}",
            "Net Credit": "{:.2f}",
            "Credit/Width": "{:.1%}",
            "Max Profit": "{:.2f}",
            "Max Loss": "{:.2f}",
            "Break Even": "{:.2f}",
            "Short Put Delta": "{:.2%}",
            "Estimated POP": "{:.1%}",
            "Target EV": "{:.2f}",
            "Estimated EV": "{:.2f}",
        }),
        width="stretch",
        height=600
    )

    st.subheader("怎么看")
    st.markdown("""
- **Short Put Strike**：卖出的 Put 执行价。
- **Long Put Strike**：买入保护的 Put 执行价。
- **数据源**：优先连接 Yahoo Finance 获取价格、到期日和期权链；如果 Yahoo 临时限流，App 会切到示例数据并在页面上标注。
- **Net Credit = Short Bid - Long Ask**，这是更保守的可成交估算。
- **Credit/Width ≈ 25%** 时，接近「赚 1 亏 3」。
- **Estimated POP** 是用 Black-Scholes / 对数正态分布粗略估算的到期盈利概率，不等于真实胜率。
- 实盘还要看 bid/ask spread、成交量、Open Interest、财报日、宏观数据日和止损规则。
""")

except Exception as e:
    st.error(f"{SOURCE_NAME} 数据连接失败：{e}")
    st.info("可以点击侧边栏的刷新按钮重试；如果 Yahoo Finance 暂时限制访问，稍后再试通常会恢复。")
