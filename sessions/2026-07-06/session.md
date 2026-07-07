# Session 2026-07-06

## Goal

根据项目模板 Markdown 归类当前项目文件。

## Tasks Completed

- 创建独立项目文件夹 `ai-berkshire-reports/`
- 将当前投研站点项目文件整体迁移到独立项目文件夹
- 创建标准目录：`src/`, `public/`, `docs/`, `output/`, `prompts/`, `sessions/`, `assets/`
- 将原始投研报告移动到 `docs/research/`
- 将生成 HTML 移动到 `output/html/`
- 将子应用移动到 `src/apps/`
- 将工具脚本移动到 `src/tools/`
- 将 VitePress 同步脚本移动到 `src/scripts/`
- 将模板文件移动到 `prompts/templates/project-template/`
- 新增根目录 `README.md`, `PROJECT.md`, `AGENTS.md`

## Files Modified

- `package.json`
- `src/scripts/sync-reports.mjs`
- `README.md`
- `PROJECT.md`
- `AGENTS.md`

## Decisions

- `/Users/jimmychen/Documents/New project` 作为 workspace 使用
- `ai-berkshire-reports/` 作为当前投研站点项目根目录
- 原始 Markdown 统一放 `docs/research/`
- 网页版报告继续由脚本生成到 `docs/reports/`
- 根目录保留 npm/VitePress 项目入口文件

## Problems Encountered

- 原根目录 `index.html` 移动时未找到，未继续处理。

## Next Steps

- 根据新增报告完善摘要抽取规则
- 确认是否需要恢复或归档旧 `index.html`
