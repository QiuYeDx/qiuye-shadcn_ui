# MatrixEffect ASCII 比例与动态星旋修复

## 背景与现象

人工验收发现两项问题：

- ASCII Demo 缺少旋转中的星旋输入源，只有静态星旋图片和其他动态场。
- ASCII 输出中的主体明显横向压缩。字符格横向占用和纵向占用不是 1:1，使圆形或光团源显示成狭长形状。

移动端复验还发现共享上传控件的 `sr-only` 文件输入仍继承通用 Input 的 `w-full/h-9`，导致 390px 视口产生横向滚动。

## 根因与设计缺口

- `createAsciiRenderer()` 和 `AsciiEffect` 默认使用 `cellAspectRatio=0.6`，初衷是贴近常见等宽字体的 glyph 字面比例。
- MatrixEffect 的网格同时是 Source 的采样 Canvas。输入先按 `columns x rows` 栅格化，随后每个样本又映射到宽高比 0.6 的输出单元格，导致 x/y 缩放不一致，整体输入被横向压缩。
- glyph 墨迹宽高比与采样/布局格宽高比是两个不同概念，不应共享同一个默认值。
- 现有动态 Source 只有光团、圆环和波浪，没有直接覆盖星旋旋转这一视觉场景。
- `sr-only` 与通用 Input 尺寸类不属于 Tailwind Merge 的同一冲突组，最终 CSS 中 `w-full/h-9` 覆盖了视觉隐藏尺寸。

## 修复后的预期行为

- ASCII Renderer 与 AsciiEffect 的默认 `cellAspectRatio` 统一改为 `1`；图片和程序化 Source 在横、方、纵容器中都保持原始主体比例。
- 字符继续按字体自身宽度绘制并在方形单元格中居中，不横向拉伸 glyph。
- 调用方显式传入 `grid.cellAspectRatio` 时仍优先使用自定义值，保持高级定制能力。
- Demo 新增“旋转星旋”程序化 Source；多臂星旋持续围绕中心旋转，并复用 MatrixEffect 的 `time`、`playing`、Reduced Motion 和离屏暂停机制。
- 保留“静态星旋”图片选项，方便对比静态图片 Source 与程序化动态 Source。
- 上传输入使用 `sr-only !size-px`，保留键盘和读屏访问能力，并确保移动端文档宽度不被隐藏控件撑大。

## 影响文件与接口

- `components/qiuye-ui/matrix-effect/renderers.ts`
- `components/qiuye-ui/matrix-effect/presets.tsx`
- `components/qiuye-ui/matrix-effect/types.ts`
- `components/qiuye-ui/demos/matrix-effect-demo-sources.ts`
- `components/qiuye-ui/demos/matrix-effect-demo.tsx`
- `lib/registry.ts`
- `public/registry/matrix-effect.json`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件执行计划.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件实施记录/2026-07-23_DEMO-2_ASCII与自定义演示输入增强.md`
- `docs/设计并开发MatrixEffect组件/feat/2026-07-23_MatrixEffect_ASCII与自定义演示输入增强.md`

这是默认视觉契约修正：`grid.cellAspectRatio` 的类型和覆盖优先级不变，但 ASCII 默认值由 `0.6` 调整为 `1`。

## 实现摘要

- 将 `createAsciiRenderer().cellAspectRatio`、`AsciiEffect` 预设合并默认值、公共 Props JSDoc 和站点 API 元数据统一从 `0.6` 改为 `1`，并通过 Registry 生成脚本同步安装产物。
- 新增 Demo 级五臂旋转星旋 Source；旋转角直接来自 MatrixEffect 传入的 `time`，不增加额外 rAF、定时器或逐帧 React 状态。
- ASCII 场景默认选择旋转星旋；ASCII 与自定义场景共享的输入源菜单同时提供旋转星旋和静态星旋。
- 用 `sr-only !size-px` 覆盖隐藏上传输入继承的尺寸类，消除 390px 视口的横向溢出。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec prettier --check <本次交付文件与文档>
pnpm build
git diff --check
```

结果：

- 使用 pnpm `8.7.0`；Registry 同步后 dry-run 为 14 个 item、0 个待更新文件。
- ESLint、TypeScript、定向 Prettier、生产构建和 diff whitespace 检查通过；构建生成 21 个静态页面。
- 桌面与 `390 x 844` 浏览器验收确认 ASCII 初始源为旋转星旋，字符集默认值完整保留前导空格，输入源菜单同时包含旋转/静态星旋。
- 旋转星旋在 ASCII 和自定义场景中的间隔帧截图哈希均变化；暂停后连续两帧哈希一致，恢复后再次变化。
- 其余流动光团、呼吸圆环和流动波浪的间隔帧截图哈希也均变化；本地图片选择后显示文件名并禁用播放开关。
- 390px 视口中 ASCII Canvas 为 `322 x 241` CSS px，星旋主体保持近圆形；修复上传输入后页面 `scrollWidth=clientWidth=390`，控制台无 warning/error。

## 后续建议

- 后续若需要按特定字体精确控制字面密度，应新增独立的字形缩放/间距能力，不能再次用采样格比例代替 glyph 排版参数。
