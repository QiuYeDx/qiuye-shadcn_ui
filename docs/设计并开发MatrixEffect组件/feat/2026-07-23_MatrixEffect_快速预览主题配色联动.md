# MatrixEffect 快速预览主题配色联动

## 背景与现象

详情页快速预览在配色增强后固定使用“雾灰”浅色组合。页面切换到深色主题时，浅色 Canvas 与页面背景对比过强，也没有利用已经定义的“墨夜”组合展示组件对不同主题的适配能力。

## 设计缺口

- 快速预览颜色写死为 `#F6F6F6 / #9C9C9C`，没有订阅页面实际明暗主题。
- 页面支持 `light`、`dark` 和 `system`，因此不能只读取用户选择值，必须使用解析后的实际主题。
- Canvas 首帧绘制前仍需要与页面主题一致的占位背景，避免短暂显示错误底色。

## 增强后的预期行为

- 浅色主题使用“雾灰”：背景 `#F6F6F6`、圆点 `#9C9C9C`。
- 深色主题使用“墨夜”：背景 `#09090B`、圆点 `#F4F4F5`。
- `theme="system"` 时跟随系统解析后的实际明暗主题。
- 页面主题切换后，现有 MatrixEffect 实例更新 Renderer 与清屏色，不重建网格配置或动态 Source。
- Canvas 外层占位背景同步使用 `dark:` 样式，覆盖首帧尚未绘制的短暂阶段。

## 影响文件与接口

- `app/components/[id]/simple-demos.tsx`

不改变 MatrixEffect 公共 API、类型、完整 Demo 或 Registry 分发内容；复用项目已经安装的 `next-themes`。

## 实现摘要

- 新增快速预览浅色/深色配色常量，避免在 JSX 中散落颜色值。
- `MatrixEffectSimpleDemo` 读取 `resolvedTheme`，在“雾灰”和“墨夜”之间选择实际传给 `DotMatrixEffect` 的颜色。
- 外层背景同时声明浅色和 `dark:` 颜色，确保主题样式与 Canvas 更新期间视觉连续。
- 更新 Canvas 无障碍名称，明确该预览会随页面主题切换配色。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec prettier --check <快速预览源码与本 feat 文档>
pnpm build
git diff --check
```

结果：

- 当前 pnpm 为 `8.7.0`；Registry 正式同步与 dry-run 均扫描 14 个 item，报告 0 个文件需要更新。
- 全量 ESLint、TypeScript、定向 Prettier 和生产构建通过；Next 成功生成 21 个静态页面。
- 真实浏览器在浅色主题下确认 `documentElement` 无 `dark` class，快速预览占位背景为 `rgb(246, 246, 246)`；切换深色主题后 class 与背景同步变为 `dark`、`rgb(9, 9, 11)`，截图确认 Canvas 呈现墨夜白点效果。
- 从深色切回浅色后背景恢复 `rgb(246, 246, 246)`；切换前后 Canvas CSS 尺寸保持 `766 x 430`，Backing Store 保持 `1149 x 645`，未发生尺寸重排。
- 浏览器控制台无 warning/error；临时浏览器标签和 3012 开发服务均已关闭。
- `package.json`、`pnpm-lock.yaml` 和 MatrixEffect Registry item 均无变化。

## 后续建议

- 若其他快速预览也存在写死的高对比背景，可按同一模式逐个评估，但不扩大本次 MatrixEffect 需求范围。
