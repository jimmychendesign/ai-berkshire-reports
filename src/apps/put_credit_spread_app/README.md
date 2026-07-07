# Put Credit Spread Scanner

这个 App 会直接连接 Yahoo Finance 的公开 JSON 数据接口，抓取股票价格、期权到期日和 put option chain，并筛选接近：

- 87% 胜率 / POP
- 赚 1 亏 3
- Credit / Width ≈ 25%

的 Put Credit Spread 组合。

## 本地运行

```bash
pip install -r requirements.txt
streamlit run app.py
```

然后在浏览器中输入 ticker，例如：

- SPY
- QQQ
- NVDA
- TSLA

## 说明

Bloomberg 数据通常需要付费 Terminal/API 权限，所以这个版本默认使用 Yahoo Finance 的公开行情接口。  
如果 Yahoo Finance 短时间内返回 `429 Too Many Requests`，说明当前网络/IP 被临时限流。App 默认只展示实时数据；如果只是想查看界面和筛选逻辑，可以手动打开侧边栏的演示模式。
App 中的 Estimated POP 是基于期权 IV 的粗略模型估算，不是保证胜率，也不是投资建议。
