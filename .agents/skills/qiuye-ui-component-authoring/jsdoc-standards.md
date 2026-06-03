# JSDoc / 注释规范

> 确保编辑器悬浮组件名或 prop 名时能看到清晰的中文说明、默认值与用法示例。

## Props Interface

每个导出的 interface/type 必须有简要 JSDoc：

```ts
/** ImageViewer 组件的属性 */
interface ImageViewerProps { ... }
```

每个 prop 必须有 JSDoc，有默认值的用 `@default` 标注：

```ts
/**
 * 灯箱遮罩层是否启用背景模糊效果
 * @default false
 */
overlayBlur?: boolean;
```

多种取值形式的 prop 说明每种含义：

```ts
/**
 * 非灯箱模式下图片的最大高度
 * - 传入 `number` 时单位为 px
 * - 传入 `string` 时作为 CSS 值（如 `"50vh"`）
 */
maxHeight?: number | string;
```

## 组件函数

每个导出的组件必须有：组件名概述 + 核心功能列表（3-6 条）+ `@example`：

```ts
/**
 * ImageViewer — 图片查看器组件
 *
 * 提供带灯箱预览的图片展示：
 * - 点击缩略图打开全屏灯箱，带 layoutId 过渡动画
 * - 灯箱内双指捏合缩放 / 鼠标滚轮缩放
 * - 图片加载骨架屏、加载失败占位符
 *
 * @example
 * ```tsx
 * <ImageViewer src="/photo.jpg" alt="示例" />
 * ```
 */
export function ImageViewer({ ... }: ImageViewerProps) { ... }
```

## 辅助类型与子组件

- 导出的辅助类型（如 `TabItem`、`ToggleEffectPreset`）也需要 JSDoc
- 多子组件导出时，每个子组件需单独 JSDoc，说明其在组合中的角色

## 规则要点

- 所有注释使用**中文（简体）**，`@example` 中代码可用英文命名
- **仅补充注释，不修改代码逻辑**
- `@default` 值应与代码解构默认值一致，如有出入以代码为准并更新注释
- 避免重复 TypeScript 已表达的类型信息（如不需要写"类型为 boolean"）
