# MatrixEffect 圆点示例默认视觉参数调整

## 背景与现象

人工验收发现，组件详情页“快速预览”和“组件演示”的圆点场景默认圆点偏大、运动偏慢。尤其在 `cellSize=10` 的网格中，原完整演示使用 `maximumRadius=4.5`，圆点接近填满单元格，削弱了矩阵间隙与明暗层次；原始速度 `0.24` 也不利于快速感知动态效果。

## 修复后的预期行为

- 两个详情页示例均以 `cellSize=10` 作为默认响应式网格尺寸。
- 两个示例的默认圆点半径范围统一为 `[0.25, 3]` CSS px。
- 两个示例的柔和光团默认速度统一为 `0.4`。
- 完整演示仍允许用户通过滑块修改单元格尺寸、最大半径和速度。
- 不改变 `DotMatrixEffect`、`createDotRenderer` 或 `createSoftBlobSource` 的公共 API 默认值，避免影响详情页之外的既有调用方。

## 影响文件与接口

- `app/components/[id]/simple-demos.tsx`
- `components/qiuye-ui/demos/matrix-effect-demo.tsx`

公共 API、类型和 Registry 分发内容均无变化。本次只调整站点详情页示例的初始配置。

## 实现摘要

- 快速预览将 `cellSize` 从 `12` 调整为 `10`，最大半径从 `4` 调整为 `3`，速度从 `0.14` 调整为 `0.4`。
- 完整演示将最大半径从 `4.5` 调整为 `3`，速度从 `0.24` 调整为 `0.4`。
- 同步更新完整演示滑块在空值情况下的回退值，确保受控状态不会恢复到旧参数。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec prettier --check <本次两个源码文件与 fix 文档>
pnpm build
git diff --check
```

结果：

- 当前 pnpm 为 `8.7.0`；Registry 正式同步与 dry-run 均扫描 14 个 item，报告 0 个文件需要更新。
- 全量 ESLint、TypeScript、定向 Prettier 和生产构建通过；Next 成功生成 21 个静态页面。
- `package.json` 与 `pnpm-lock.yaml` 无变化。
- 按人工验收安排，本次未启动前端服务或浏览器；新默认参数的最终视觉观感由后续人工验收确认。

## 后续建议

- QA-2 人工验收继续重点观察不同画布比例下的圆点疏密与运动节奏。
- 若未来需要调整公共预设默认值，应作为独立兼容性变更评估，而不是由站点示例参数隐式带动。
