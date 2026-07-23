# MatrixEffect Source 身份 JSDoc 示例修复

## 背景与现象

QA-1 独立源码复审发现，`MatrixEffect` 与 `AsciiEffect` 的 JSDoc 示例在 JSX 中内联创建 Source descriptor。调用方若照抄并因其他状态更新触发 React render，会在每次 render 创建新的 Source 身份，核心据此开启新的 Source epoch、重建 adapter 并重新触发首次 ready 流程。

## 根因或设计缺口

设计文档已经规定 Source、Mapper、Transform 与 Renderer 是按身份失效的不可变管线配置，并要求使用模块常量或 `useMemo` / `useCallback` 保持稳定身份；但公共 `source` 属性说明与两个组件示例没有把该约束暴露给使用者，示例还与约束相反。

## 修复后的预期行为

- 公共 `source` 属性明确说明 descriptor 按对象身份作为切换边界，并应保持稳定。
- 核心与 ASCII 示例先创建稳定 Source 常量，再传给组件。
- 不改变 Source epoch、重绘调度、公共类型或任何运行时行为。

## 影响文件与接口

- `components/qiuye-ui/matrix-effect/types.ts`
- `components/qiuye-ui/matrix-effect/matrix-effect.tsx`
- `components/qiuye-ui/matrix-effect/presets.tsx`
- `public/registry/matrix-effect.json`（由 Registry 脚本同步源码 content）

公共 API 与数据结构无变化，仅完善 JSDoc 使用契约。

## 实现摘要

- 在 `MatrixEffectProps.source` 中补充稳定身份与不可变 descriptor 约束。
- 将 `MatrixEffect` 和 `AsciiEffect` 示例中的内联 Source 改为模块级 `const`。
- 执行 `pnpm update-registry` 同步 Registry content。

## 验证命令与结果

执行命令：

```text
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
./node_modules/.bin/prettier --check <MatrixEffect 三个源码文件、Registry item 与本 fix 文档>
pnpm build
node verify.mjs
git diff --check
```

结果：

- Registry 只同步了 `matrix-effect` item 中三个被修改源码文件的 content；随后 dry-run 扫描 14 个 item，报告 0 个待更新文件。
- 全量 ESLint、TypeScript、定向 Prettier、生产构建与 `git diff --check` 通过；Next 静态导出 21 个页面。
- 从最终 Registry URL 新建的 shadcn 临时项目安装恰好七个文件，三个 JSDoc 修正与仓库源码、Registry content 逐字一致。
- 严格 TypeScript 消费夹具继续通过，公共入口保持 12 个运行时导出与 32 个类型导出，未改变组件类型边界。
- `package.json` 与 `pnpm-lock.yaml` 无差异。

## 后续建议

- 后续新增管线配置示例时继续使用模块常量或 `useMemo` / `useCallback`。
- QA-2 仍按原计划验证性能、暂停、清理和多视口风险，不因本次纯文档修复扩大范围。
