# 工作包 REG-1：Registry、MCP 与项目清单同步

## 基本信息

- 日期：2026-07-23
- 状态：已完成
- 对应执行计划工作包：`REG-1 Registry、MCP 与项目清单同步`

## 本次实现内容

- 新增 `matrix-effect` shadcn registry item，使用一个 item 分发核心、Source、Transform、Renderer、Dot/ASCII 预设和公共类型共七个源码文件。
- 使用仓库生成脚本回填七个 `files[].content`，并重新生成包含 14 个组件的总 manifest；总清单继续按组件 ID 排序且不携带源码 content。
- 将 `matrix-effect` 加入 MCP `DEFAULT_COMPONENT_NAMES`，确保远端 registry 索引不可用时仍能被 fallback 发现。
- 在 README 可用组件表和 AGENT 当前组件 ID 清单中加入 Matrix Effect。
- 同步补回 README 与 AGENT 既有清单遗漏的 `segmented-control`，使两处声明为“当前可用组件”的清单与生成 manifest 完整一致。
- 保持 `app/cli/page.tsx`、组件源码、Demo 和示例资产不变；CLI 页面继续从站点 Registry 自动读取组件，不新增重复硬编码。

## 修改文件

- `public/registry/matrix-effect.json`
- `public/registry/registry.json`
- `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs`
- `README.md`
- `AGENT.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件执行计划.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件实施记录/2026-07-23_REG-1_Registry与项目清单.md`

## 接口或数据结构变化

- 新增可通过 `/registry/matrix-effect.json` 和 `@qiuye-ui/matrix-effect` 消费的 registry item。
- item 的 `dependencies` 与 `registryDependencies` 均为空；React、同目录模块和 `@/lib/utils` 不产生额外安装依赖。
- item 精确包含 `index.ts`、`matrix-effect.tsx`、`sources.ts`、`transforms.ts`、`renderers.ts`、`presets.tsx`、`types.ts` 七个文件，不包含站点 Demo 或 `public/examples/matrix-effect/*`。
- registry schema 不增加非标准 `version` 字段；组件版本 `1.0.0` 继续由 `lib/registry.ts` 的站点元数据维护。
- 未改变 MatrixEffect 运行时 API，也未新增 npm 依赖；`package.json` 与 `pnpm-lock.yaml` 保持不变。

## 与设计文档的一致性

- 是否偏离设计：否。
- 多文件分发结构、空依赖契约、MCP fallback 和项目清单均按 REG-1 设计落地。
- `public/registry/registry.json` 完全由 `pnpm update-registry` 生成，没有手工编辑生成内容。
- README/AGENT 补齐 `segmented-control` 是修复本轮审计发现的既有清单遗漏，不改变 MatrixEffect 范围或产品行为。

## 验证结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
node --input-type=module -e <registry item、content、manifest 结构断言>
node --input-type=module -e <MCP、README、AGENT 与 manifest 集合断言>
node --input-type=module -e <静态导出 registry 产物一致性断言>
pnpm lint
pnpm exec tsc --noEmit
pnpm exec prettier --check <REG-1 新增 Registry item 与状态文档>
pnpm build
git diff --check
```

结果：

- 当前 pnpm 为 8.7.0；registry 更新成功生成 14 个 item，随后 dry-run 报告 14 个 JSON、0 个待同步文件。
- MatrixEffect item 的元数据、空依赖、七个唯一文件及顺序符合契约；每个 `content` 与对应源码逐字一致。
- 总 manifest 中仅有一个 `matrix-effect`，位于 `markdown-renderer` 与 `responsive-tabs` 之间；七个文件路径与 item 一致，且均不含 `content`。
- MCP、README、AGENT 各自包含 14 个唯一组件 ID，并与生成 manifest 的组件集合完全一致。
- 全量 ESLint、TypeScript 和生产构建通过；Next 生成 21 个静态页面，导出的 `out/registry/matrix-effect.json` 与源 item 完全一致，导出 manifest 包含 MatrixEffect。
- 新增 Registry item 和本工作包状态文档通过 Prettier；README、MCP 和生成 manifest 保持仓库既有/生成器格式，未为追求全文件格式化而扩大本工作包改动。
- `package.json`、`pnpm-lock.yaml` 无差异，`git diff --check` 通过；本工作包未启动前端服务。
- 独立只读复审覆盖七文件闭包、content 同步、manifest、项目清单和依赖边界，未发现遗留发布问题。

## 未完成事项

- shadcn CLI 临时项目安装、安装后公共导出及自定义 Source/Renderer 使用验证保留到 QA-1。
- 浏览器性能、自动 30/60 FPS 降档、后台/离屏暂停、运行时 Reduced Motion、资源清理和多视口长时验证保留到 QA-2。
- README、MCP 源文件及生成 manifest 的全文件 Prettier 差异属于仓库既有格式状态，不影响本工作包行为验收；若统一格式，应作为独立仓库维护任务处理。

## 下一步建议

- 下一工作包认领 `QA-1 构建、Registry 与功能验收`。
- 从实际 registry 安装产物验证七文件完整性、公共导出、自定义管线路径、静态路由和 Canvas 非空绘制，不重复修改已经通过结构断言的分发契约。
