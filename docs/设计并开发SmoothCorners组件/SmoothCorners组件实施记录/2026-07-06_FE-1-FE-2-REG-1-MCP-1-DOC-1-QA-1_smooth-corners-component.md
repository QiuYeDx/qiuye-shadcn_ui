# 工作包 FE-1/FE-2/REG-1/MCP-1/DOC-1/QA-1：SmoothCorners 组件完整接入

## 基本信息

- 日期：2026-07-06
- 状态：已完成
- 对应执行计划工作包：FE-1、FE-2、REG-1、MCP-1、DOC-1、QA-1

## 本次实现内容

- 新增 `SmoothCorners` React 包装组件，基于 `@qiuyedx/smooth-corners` 输出 CSS 变量并自动注入渐进增强 CSS。
- 支持 `radius`、`smoothing`、`observeSize`、`asChild`、`disabled`、`className`、`style` 等配置。
- 新增详情页完整 Demo，覆盖基础用法、`asChild`、参数 Playground、尺寸感知和 `corner-shape` 支持状态。
- 新增详情页快速预览和首页组件墙预览。
- 接入 `ComponentId.SMOOTH_CORNERS`、基础用法、组件元数据、Props API、CLI 可用组件列表。
- 新增并生成 `public/registry/smooth-corners.json`，同步 `public/registry/registry.json`。
- 同步 MCP fallback 列表，补齐 `color-picker`、`smooth-corners`、`tour`。
- 更新 README、AGENT 指引和组件库实战博客中的组件清单。

## 修改文件

- `components/qiuye-ui/smooth-corners.tsx`
- `components/qiuye-ui/demos/smooth-corners-demo.tsx`
- `app/components/[id]/simple-demos.tsx`
- `app/components/[id]/page.tsx`
- `components/home/home-component-previews.tsx`
- `lib/home-component-preview-config.ts`
- `lib/component-constants.ts`
- `lib/registry.ts`
- `app/cli/page.tsx`
- `public/registry/smooth-corners.json`
- `public/registry/registry.json`
- `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs`
- `README.md`
- `AGENT.md`
- `blog-how-to-build-shadcn-component-library.md`
- `package.json`
- `pnpm-lock.yaml`

## 接口或数据结构变化

- 新增组件 ID：`smooth-corners`。
- 新增导出：`SmoothCorners`、`SmoothCornersProps`、`smoothCornersBaseCSS`。
- 新增 registry dependency：`@qiuyedx/smooth-corners`、`@radix-ui/react-slot`。
- `public/registry/registry.json` items 数量从 11 增至 12。

## 验证结果

执行命令：

```text
npx -y pnpm@8.7.0 update-registry
npx -y pnpm@8.7.0 update-registry:dry
npx -y pnpm@8.7.0 lint
npx -y pnpm@8.7.0 build
```

结果：

- `update-registry` 成功，`smooth-corners.json` 已回填源码 content，`registry.json` items 为 12。
- `update-registry:dry` 成功，实际将要更新 0。
- `lint` 成功，仍有项目既有未使用 import warning，无新增错误。
- `build` 成功，Next.js 静态生成 19 个页面并完成 export。
- 本轮未启动 dev/preview 服务，因此无前端服务需要关闭。

## 未完成事项

- 未进行浏览器人工截图验收；本轮以 lint/build/registry dry-run 作为自动化验收。

## 下一步建议

- 部署后通过真实站点访问 `/components/smooth-corners` 和 `/registry/smooth-corners.json` 做一次浏览器抽检。
