# AI Berkshire 投研报告站点

把 ai-berkshire 生成的 Markdown 投研报告整理成 VitePress 静态网站。

## Features

- 从 `docs/research/` 同步原始 Markdown 报告
- 自动生成 `docs/reports/` 网页版报告
- 首页展示所有报告卡片
- 左侧报告导航与右侧正文目录
- 每篇报告顶部生成 Summary 卡片
- 表格、长文阅读和移动端样式优化
- GitHub Pages 自动部署配置

## Tech Stack

- Framework: VitePress
- Language: Markdown, Vue, JavaScript
- Styling: VitePress theme CSS
- Build Tool: VitePress / Vite
- Deployment: GitHub Pages

## Project Structure

```text
project/
├── src/
│   ├── apps/
│   ├── scripts/
│   └── tools/
├── public/
├── docs/
│   ├── research/
│   ├── reports/
│   ├── components/
│   └── .vitepress/
├── output/
│   ├── html/
│   ├── pdf/
│   ├── screenshots/
│   └── exports/
├── prompts/
│   └── templates/
├── sessions/
├── assets/
├── README.md
├── PROJECT.md
├── AGENTS.md
└── package.json
```

## Getting Started

```bash
npm install
npm run dev
```

新增报告时，把 Markdown 放入 `docs/research/`，然后运行：

```bash
npm run sync
```

构建生产站点：

```bash
npm run build
```

构建产物位于 `docs/.vitepress/dist/`。
