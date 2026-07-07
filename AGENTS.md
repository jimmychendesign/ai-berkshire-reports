# AGENTS.md

# AI Project Working Instructions

本项目按 `prompts/templates/project-template/` 中的模板组织。除非用户明确要求，否则不要把生成文件直接放在项目根目录。

## 1. Project Structure

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
├── sessions/
├── assets/
├── README.md
├── PROJECT.md
├── AGENTS.md
├── package.json
└── .gitignore
```

## Documentation Rules

- 原始投研 Markdown → `docs/research/`
- VitePress 生成报告页 → `docs/reports/`
- 可复用脚本 → `src/scripts/`
- Python 工具 → `src/tools/`
- 子应用或实验项目 → `src/apps/`
- 生成 HTML → `output/html/`
- PDFs → `output/pdf/`
- Screenshots → `output/screenshots/`
- Exports → `output/exports/`
- 配置备份和素材 → `assets/`
- 模板和提示词 → `prompts/`
- 工作记录 → `sessions/YYYY-MM-DD/`

## Workflow

1. 先读 `AGENTS.md` 和 `PROJECT.md`
2. 检查目录结构
3. 在 `sessions/YYYY-MM-DD/` 记录本次工作
4. 把输出保存到对应目录
5. 修改报告后运行 `npm run sync`
6. 修改站点后运行 `npm run build`
7. 结束前更新 `PROJECT.md`、session 记录和必要文档

## Coding Rules

- 保留原始 Markdown 报告结构
- 不手动编辑 `docs/reports/` 里的生成报告，改源文件 `docs/research/`
- 不提交 `node_modules/` 或 `docs/.vitepress/dist/`
- 不删除用户文件；需要清理时先确认或只移动到明确分类目录
