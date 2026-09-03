# HTML 输出路径调整记录

- 日期：2026-08-21
- 任务：将 VitePress 静态站点输出到 `output/html/`
- 实现：
  - 将 VitePress `outDir` 设置为 `../output/html/site`
  - 将 GitHub Pages artifact 路径更新为 `output/html/site`
  - 忽略生成目录 `output/html/site/`
  - 保留 `output/html/` 作为其他独立 HTML 的容器，避免构建时误删
- 验证：`npm run build` 通过；VitePress 1.6.4 完成构建，入口页和报告页均生成于 `output/html/site/`
