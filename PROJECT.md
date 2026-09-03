# PROJECT.md

## Project Information

**Project Name**

AI Berkshire 投研报告站点

**Goal**

将 ai-berkshire 生成的 Markdown 投研报告归档、同步并发布成适合阅读和部署的 VitePress 静态网站。

## Current Status

- Stage: 可运行静态站点
- Progress: 已完成基础目录归类、VitePress 首页、报告页、Summary 卡片和 GitHub Pages workflow
- Last Updated: 2026-08-21

## Tech Stack

- Framework: VitePress
- Language: Markdown, Vue, JavaScript
- UI Library: VitePress default theme with custom components
- Styling: CSS
- Build Tool: VitePress / Vite
- Deployment: GitHub Pages

## Folder Structure

```text
src/
public/
docs/
output/
prompts/
sessions/
assets/
```

## Architecture

`docs/research/` 保存原始投研 Markdown；`src/scripts/sync-reports.mjs` 读取这些源文件，生成 `docs/reports/` 下的 VitePress 报告页，并更新 `docs/.vitepress/reports.data.mjs` 供首页卡片和侧边栏使用。

VitePress 站点入口在 `docs/`。定制组件位于 `docs/components/`，主题样式位于 `docs/.vitepress/theme/`，静态站点构建到 `output/html/site/`。

## Features

### Completed

- [x] Markdown 报告网页化
- [x] 首页报告卡片
- [x] 左侧报告导航
- [x] 每篇报告顶部 Summary
- [x] 表格和移动端阅读样式
- [x] GitHub Pages workflow
- [x] 项目文件按模板归类
- [x] VitePress 静态 HTML 统一输出到 `output/html/site/`
- [x] 新增 ASTS 卫星直连手机 / NTN 行业研究报告
- [x] 新增 ASTS investment-team 综合研究报告

### In Progress

- [ ] 为更多报告补充更精准的自动摘要规则

### Planned

- [ ] 增加行业、评级、公司 ticker 过滤
- [ ] 增加报告发布日期排序
- [ ] 增加截图或 PDF 导出流程

## Roadmap

### Phase 1

- [x] 建立静态站点和报告同步流程

### Phase 2

- [ ] 增强报告元数据和首页筛选

### Phase 3

- [ ] 自动化部署和归档更多输出格式

## Known Issues

- `npm install` 后 npm audit 提示 3 个依赖安全项，当前不影响 VitePress 构建。
- 原根目录 `index.html` 在归类时未找到，未继续移动。

## TODO

- [ ] 决定是否需要保留或重建旧的根目录 `index.html`
- [ ] 根据新增报告继续完善摘要抽取规则

## Notes

根目录只保留项目入口和配置文件。研究源文件进入 `docs/research/`，生成页面进入 `docs/reports/`，VitePress 静态站点进入 `output/html/site/`，其他独立 HTML 可放在 `output/html/`。

2026-08-21：将 VitePress `outDir` 调整为 `output/html/site/`，并同步更新 GitHub Pages 部署路径。

2026-07-07：新增 `ASTS卫星直连手机NTN行业格局芒格视角_20260707.md`，聚焦 D2D/NTN 行业格局、竞争态势与 ASTS 位置。

2026-07-07：新增 `ASTS投资团队研究报告_20260707.md`，综合商业模式、财务估值、行业竞争、风险与管理层四维判断。

2026-07-09：更新 `ASTS投资团队研究报告_20260707.md`，刷新股价、市值、三情景估值，并加入 BlueBird 11/12/13 目标 2026 年 8 月上半月发射的催化剂。
