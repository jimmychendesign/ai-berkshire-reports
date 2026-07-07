#!/usr/bin/env python3
import argparse
import json
from decimal import Decimal, ROUND_HALF_UP, getcontext

getcontext().prec = 28


def d(value):
    return Decimal(str(value).replace(",", ""))


def pct(a, b):
    if a == 0:
        return Decimal("0") if b == 0 else Decimal("Infinity")
    return abs(a - b) / abs(a) * Decimal("100")


def q2(value):
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def verify_market_cap(args):
    price = d(args.price)
    shares = d(args.shares)
    reported = d(args.reported)
    calculated = price * shares
    diff = pct(reported, calculated)
    status = "OK" if diff <= Decimal("1") else "CHECK"
    print(json.dumps({
        "check": "market_cap",
        "status": status,
        "currency": args.currency,
        "price": str(price),
        "shares": str(shares),
        "calculated_market_cap": str(q2(calculated)),
        "reported_market_cap": str(reported),
        "difference_percent": str(q2(diff)),
    }, ensure_ascii=False, indent=2))


def cross_validate(args):
    values = {k: d(v) for k, v in json.loads(args.values).items()}
    items = list(values.items())
    base_name, base_value = items[0]
    results = []
    worst = Decimal("0")
    for name, value in items[1:]:
        diff = pct(base_value, value)
        worst = max(worst, diff)
        results.append({"source": name, "value": str(value), "difference_percent": str(q2(diff))})
    status = "OK" if worst <= Decimal("1") else ("WARN" if worst <= Decimal("5") else "CHECK")
    print(json.dumps({
        "check": "cross_validate",
        "field": args.field,
        "status": status,
        "unit": args.unit,
        "base_source": base_name,
        "base_value": str(base_value),
        "comparisons": results,
        "worst_difference_percent": str(q2(worst)),
    }, ensure_ascii=False, indent=2))


def verify_valuation(args):
    price = d(args.price)
    eps = d(args.eps)
    bvps = d(args.bvps)
    fcf = d(args.fcf_per_share)
    dividend = d(args.dividend)
    output = {
        "check": "valuation",
        "price": str(price),
        "pe": None if eps <= 0 else str(q2(price / eps)),
        "pb": None if bvps == 0 else str(q2(price / bvps)),
        "fcf_yield_percent": None if fcf <= 0 else str(q2(fcf / price * Decimal("100"))),
        "dividend_yield_percent": str(q2(dividend / price * Decimal("100"))),
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


def three_scenario(args):
    price = d(args.price)
    eps = d(args.eps)
    shares = d(args.shares)
    years = d(args.years)
    scenarios = []
    for label, growth, pe in zip(["optimistic", "base", "bear"], args.growth, args.pe):
        g = d(growth) / Decimal("100")
        terminal_eps = eps * ((Decimal("1") + g) ** int(years))
        terminal_price = terminal_eps * d(pe)
        market_cap = terminal_price * shares
        annual_return = ((terminal_price / price) ** (Decimal("1") / years) - Decimal("1")) * Decimal("100")
        scenarios.append({
            "scenario": label,
            "terminal_eps": str(q2(terminal_eps)),
            "terminal_price": str(q2(terminal_price)),
            "terminal_market_cap": str(q2(market_cap)),
            "annual_return_percent": str(q2(annual_return)),
        })
    print(json.dumps({"check": "three_scenario", "currency": args.currency, "scenarios": scenarios}, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("verify-market-cap")
    p.add_argument("--price", required=True)
    p.add_argument("--shares", required=True, help="Shares in the same unit as reported market cap; e.g. millions.")
    p.add_argument("--reported", required=True)
    p.add_argument("--currency", required=True)
    p.set_defaults(func=verify_market_cap)

    p = sub.add_parser("cross-validate")
    p.add_argument("--field", required=True)
    p.add_argument("--values", required=True)
    p.add_argument("--unit", required=True)
    p.set_defaults(func=cross_validate)

    p = sub.add_parser("verify-valuation")
    p.add_argument("--price", required=True)
    p.add_argument("--eps", required=True)
    p.add_argument("--bvps", required=True)
    p.add_argument("--fcf-per-share", required=True)
    p.add_argument("--dividend", required=True)
    p.set_defaults(func=verify_valuation)

    p = sub.add_parser("three-scenario")
    p.add_argument("--price", required=True)
    p.add_argument("--eps", required=True)
    p.add_argument("--shares", required=True)
    p.add_argument("--growth", nargs=3, required=True)
    p.add_argument("--pe", nargs=3, required=True)
    p.add_argument("--years", required=True)
    p.add_argument("--currency", required=True)
    p.set_defaults(func=three_scenario)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
