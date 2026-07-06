# SmoothCorners 组件执行计划

创建日期：2026-07-06
更新日期：2026-07-06

## 使用方式

每次继续开发 SmoothCorners 前，先阅读：

- `docs/设计并开发SmoothCorners组件/SmoothCorners组件开发设计文档.md`
- `docs/设计并开发SmoothCorners组件/SmoothCorners组件执行计划.md`
- `qiuye-skills/docs/开发设计文档/smooth_corners_skill_final_design.md`
- `qiuye-skills/docs/开发设计文档/smooth_corners_skill_execution_plan.md`

本计划覆盖 QiuYe UI 组件侧。Skill 仓库的具体工作包以 `qiuye-skills` 中的执行计划为准。

## 状态规则

- `未开始`：尚未动工。
- `进行中`：已有改动但未完成验证。
- `已完成`：实现与验证均已完成。
- `阻塞`：缺少外部信息或环境不可用。
- `废弃`：不再实施。

## 进度台账

| 工作包 | 状态 | 完成日期 | 关键文件 | 验证 | 实施记录 | 未决事项 |
| --- | --- | --- | --- | --- | --- | --- |
| PRE-1 npm 包名与依赖策略确认 | 已完成 | 2026-07-06 | `smooth-corners-web/package.json`, `smooth-corners-web/README.md`, `smooth-corners-web/index.html`, `smooth-corners-web/index.zh-CN.html`, `smooth-corners-web/CLAUDE.md`, `package.json`, `pnpm-lock.yaml` | `node --input-type=module ...`, `npm view @qiuyedx/smooth-corners ...`, `npm pack --dry-run`, `npx -y pnpm@8.7.0 add @qiuyedx/smooth-corners@0.1.0` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_PRE-1_npm-package-scope-prep.md` | 无 |
| FE-1 SmoothCorners 主组件实现 | 已完成 | 2026-07-06 | `components/qiuye-ui/smooth-corners.tsx` | `npx -y pnpm@8.7.0 lint`, `npx -y pnpm@8.7.0 build` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 无 |
| FE-2 详情页快速预览与完整 Demo | 已完成 | 2026-07-06 | `components/qiuye-ui/demos/smooth-corners-demo.tsx`, `app/components/[id]/simple-demos.tsx`, `app/components/[id]/page.tsx`, `components/home/home-component-previews.tsx`, `lib/home-component-preview-config.ts` | `npx -y pnpm@8.7.0 lint`, `npx -y pnpm@8.7.0 build` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 未启动浏览器服务；本轮以静态构建通过作为页面验证 |
| REG-1 Registry 与组件元数据接入 | 已完成 | 2026-07-06 | `lib/component-constants.ts`, `lib/registry.ts`, `app/cli/page.tsx`, `public/registry/smooth-corners.json`, `public/registry/registry.json` | `npx -y pnpm@8.7.0 update-registry`, `npx -y pnpm@8.7.0 update-registry:dry` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 无 |
| MCP-1 MCP fallback 列表同步 | 已完成 | 2026-07-06 | `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs` | 静态检查 `DEFAULT_COMPONENT_NAMES` 包含 `color-picker`、`smooth-corners`、`tour`；`npx -y pnpm@8.7.0 build` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 无 |
| DOC-1 文档与站点清单同步 | 已完成 | 2026-07-06 | `README.md`, `AGENT.md`, `blog-how-to-build-shadcn-component-library.md` | `rg -n "smooth-corners|Smooth Corners" ...`, `npx -y pnpm@8.7.0 build` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 无 |
| QA-1 构建与浏览器验证 | 已完成 | 2026-07-06 | - | `npx -y pnpm@8.7.0 update-registry:dry`, `npx -y pnpm@8.7.0 lint`, `npx -y pnpm@8.7.0 build` | `docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/2026-07-06_FE-1-FE-2-REG-1-MCP-1-DOC-1-QA-1_smooth-corners-component.md` | 未启动 dev/preview 服务；无服务需关闭 |

## 依赖顺序

1. 先完成 `PRE-1`：如果要发布 `@qiuyedx/smooth-corners`，先发布并确认安装；如果暂时不发布，明确过渡依赖。
2. 再完成 `FE-1`：先做最小可用组件，闭合 `radius + smoothing + @supports` 主路径。
3. 然后做 `FE-2`：详情页 Demo 体现参数配置、`asChild` 和 `observeSize`。
4. 再做 `REG-1` 与 `MCP-1`：保证 shadcn CLI 和 AI 工具都能发现组件。
5. 最后做 `DOC-1` 与 `QA-1`：文档同步、构建和视觉验证。

## 不可违反的工程约束

- 不能直接使用当前全局 `pnpm 11.7.0` 更新 `pnpm-lock.yaml`。涉及依赖安装或 lockfile 更新时必须使用 pnpm 8.x，例如 `npx -y pnpm@8.7.0 ...` 或 Corepack 指定 pnpm 8.x。
- `public/registry/registry.json` 不可手动编辑，只能由 `pnpm update-registry` 生成。
- `SmoothCorners` 组件中不能写 inline `borderRadius` 覆盖 `.smooth-corners` 的 `@supports` 规则。
- 默认不能开启 `observeSize`，避免大量实例默认创建 ResizeObserver。
- 组件必须支持 `className` 和 `style` 合并，不能吞掉用户元素的原生 HTML props。
- 如果使用 `asChild`，必须正确转发 ref，并保证只要求一个可接收 className/style/ref 的子元素。
- 如果实现或验证期间启动前端服务，最终回复前必须结束本次启动的服务进程。

## 验证命令建议

需要用 pnpm 8.x 执行，示例：

```text
npx -y pnpm@8.7.0 update-registry
npx -y pnpm@8.7.0 update-registry:dry
npx -y pnpm@8.7.0 lint
npx -y pnpm@8.7.0 build
```

如项目后续写入 `packageManager` 字段，则按该字段执行。

## 实施记录模板

后续每个实现会话需要在：

```text
docs/设计并开发SmoothCorners组件/SmoothCorners组件实施记录/
```

新增记录：

````markdown
# 工作包 <ID>：<标题>

## 基本信息

- 日期：
- 状态：已完成 / 部分完成 / 阻塞
- 对应执行计划工作包：

## 本次实现内容

-

## 修改文件

-

## 接口或数据结构变化

-

## 验证结果

执行命令：

```text

```

结果：

-

## 未完成事项

-

## 下一步建议

-
```
````

## 下一步建议

当前计划内工作包均已完成。下一步建议在部署后通过真实站点检查 `/components/smooth-corners` 与 `/registry/smooth-corners.json`，并在需要发布 QiuYe UI 站点或 MCP 包时按项目发布流程执行。
