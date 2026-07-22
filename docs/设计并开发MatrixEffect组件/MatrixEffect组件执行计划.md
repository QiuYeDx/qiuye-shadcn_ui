# MatrixEffect 组件执行计划

- 创建日期：2026-07-22
- 更新日期：2026-07-22
- 当前阶段：FE-1 已完成，待启动 FE-2
- 对应设计文档：`docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`

## 使用方式

每次继续开发 MatrixEffect 前，必须先完成以下步骤：

1. 阅读 `MatrixEffect组件开发设计文档.md` 和本执行计划。
2. 检查进度台账，选择依赖已完成的最高优先级未完成工作包。
3. 执行 `git status --short`，确认并保护用户已有改动。
4. 在编辑前声明本轮认领的工作包、预期产出和验证范围。
5. 把被认领工作包状态更新为 `进行中`；同一会话原则上只认领一个工作包，只有紧密耦合且能一起验证时才合并。
6. 实现完成后执行该工作包的验收命令，创建实施记录，再按真实结果更新台账。
7. 只有实现和验证都完成时才能标记 `已完成`；未完成验证时保持 `进行中`。

设计文档是行为和 API 的事实来源，本计划只负责任务拆分、依赖顺序和交接状态。如果实现证明设计假设不成立，先更新设计文档并记录原因，不能在代码中静默偏离。

## 状态规则

- `未开始`：尚未产生该工作包的实现改动。
- `进行中`：已有实现或验证工作，但尚未满足全部完成条件。
- `已完成`：代码、文档和该工作包要求的验证均已完成，并已创建实施记录。
- `阻塞`：缺少外部信息、权限、资源或环境能力，无法继续推进。
- `废弃`：经确认后不再实施；必须在未决事项中记录原因和替代方案。

台账中的完成日期统一使用 `YYYY-MM-DD`。工作包被重新打开时，状态改回 `进行中`，并在未决事项与新实施记录中说明原因。

## 进度台账

| 工作包                                | 状态   | 完成日期   | 关键文件                                                                                                                                                                                        | 验证                                                                     | 实施记录                                                            | 未决事项                                           |
| ------------------------------------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------- |
| PRE-0 需求澄清与设计定稿              | 已完成 | 2026-07-22 | `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`                                                                                                                               | Markdown 围栏闭合、无尾随空格；commit `5e5a598` 已推送                   | 无单独记录（设计会话）                                              | 无                                                 |
| PRE-1 文档 Review 与契约补全          | 已完成 | 2026-07-22 | 设计文档、本执行计划                                                                                                                                                                            | `git diff --check`、Markdown 围栏与尾随空格检查                          | 无单独记录（Review 会话）                                           | P3-2/P3-3 属独立仓库维护任务，不阻塞本功能         |
| CORE-1 公共类型与信号转换算法         | 已完成 | 2026-07-22 | `components/qiuye-ui/matrix-effect/types.ts`, `components/qiuye-ui/matrix-effect/transforms.ts`, `components/qiuye-ui/matrix-effect/index.ts`                                                   | pnpm 8.7.0 lint、TypeScript、Prettier、数值与类型断言通过                | `MatrixEffect组件实施记录/2026-07-22_CORE-1_公共类型与信号转换.md`  | FE-1 需实现管线末尾统一 finite/clamp               |
| SRC-1 Source 适配与采样底座           | 已完成 | 2026-07-22 | `components/qiuye-ui/matrix-effect/sources.ts`, `components/qiuye-ui/matrix-effect/types.ts`                                                                                                    | pnpm 8.7.0 lint、TypeScript、Prettier、SSR 与行为断言通过                | `MatrixEffect组件实施记录/2026-07-22_SRC-1_Source适配与采样底座.md` | FE-1 必须在安全错误或 Source 切换后重建采样 Canvas |
| FE-1 MatrixEffect 静态渲染核心        | 已完成 | 2026-07-22 | `components/qiuye-ui/matrix-effect/matrix-effect.tsx`, `components/qiuye-ui/matrix-effect/index.ts`, `components/qiuye-ui/matrix-effect/types.ts`                                               | pnpm 8.7.0 lint、TypeScript、build、SSR/纯函数及 23 项真实浏览器断言通过 | `MatrixEffect组件实施记录/2026-07-22_FE-1_静态渲染核心.md`          | FE-2 复用唯一 rAF、dirty generation 与错误锁       |
| FE-2 动态调度、暂停与错误韧性         | 未开始 | -          | `components/qiuye-ui/matrix-effect/matrix-effect.tsx`, `components/qiuye-ui/matrix-effect/types.ts`                                                                                             | 待执行                                                                   | 待创建                                                              | 无                                                 |
| FX-1 Dot Renderer 与 DotMatrixEffect  | 未开始 | -          | `components/qiuye-ui/matrix-effect/renderers.ts`, `components/qiuye-ui/matrix-effect/presets.tsx`, `components/qiuye-ui/matrix-effect/sources.ts`, `components/qiuye-ui/matrix-effect/index.ts` | 待执行                                                                   | 待创建                                                              | 无                                                 |
| FX-2 ASCII Renderer 与 AsciiEffect    | 未开始 | -          | `components/qiuye-ui/matrix-effect/renderers.ts`, `components/qiuye-ui/matrix-effect/presets.tsx`, `components/qiuye-ui/matrix-effect/index.ts`                                                 | 待执行                                                                   | 待创建                                                              | 无                                                 |
| DEMO-1 完整 Demo 与同源示例资产       | 未开始 | -          | `components/qiuye-ui/demos/matrix-effect-demo.tsx`, `public/examples/matrix-effect/*`                                                                                                           | 待执行                                                                   | 待创建                                                              | 示例资产需同源且许可明确，不使用临时剪贴板路径     |
| SITE-1 详情页、快速预览与站点元数据   | 未开始 | -          | `app/components/[id]/simple-demos.tsx`, `app/components/[id]/page.tsx`, `lib/component-constants.ts`, `lib/registry.ts`                                                                         | 待执行                                                                   | 待创建                                                              | 无                                                 |
| REG-1 Registry、MCP 与项目清单同步    | 未开始 | -          | `public/registry/matrix-effect.json`, `public/registry/registry.json`, `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs`, `README.md`, `AGENT.md`                                                    | 待执行                                                                   | 待创建                                                              | 无                                                 |
| QA-1 构建、Registry 与功能验收        | 未开始 | -          | 以上全部实现文件                                                                                                                                                                                | 待执行                                                                   | 待创建                                                              | 无                                                 |
| QA-2 视觉、响应式、性能与生命周期验收 | 未开始 | -          | 以上全部实现文件；必要时新增 `fix/` 文档                                                                                                                                                        | 待执行                                                                   | 待创建                                                              | 无                                                 |

## 里程碑与依赖顺序

### M1：渲染引擎基础

```text
PRE-1 -> CORE-1 -> SRC-1 -> FE-1 -> FE-2
```

完成标准：自定义 Source、Mapper、Transform 和 Renderer 能通过 MatrixEffect 完成静态与动态 Canvas 绘制，且具备尺寸、DPR、暂停和错误处理能力。

### M2：内置效果与易用 API

```text
FE-2 -> FX-1 -> FX-2
```

完成标准：`DotMatrixEffect` 和 `AsciiEffect` 均可独立使用，默认值、性能提示和导出符合设计文档。

### M3：站点展示与分发

```text
FX-1 + FX-2 -> DEMO-1 -> SITE-1 -> REG-1
```

完成标准：组件目录、详情页、快速预览、完整 Demo、registry item 和 MCP fallback 均能发现并正确展示/分发组件。

### M4：最终验收

```text
REG-1 -> QA-1 -> QA-2
```

`QA-1` 关闭构建、静态导出和 registry 正确性；`QA-2` 关闭浏览器视觉、性能、暂停、清理和移动端风险。未经两个 QA 包验证，不得宣称组件整体完成。

## 工作包定义

### PRE-0：需求澄清与设计定稿

状态：`已完成`

产出：

- 明确核心 + Dot/ASCII 预设的产品形态。
- 固化 Canvas 2D、响应式 `columns x rows`、Source/Mapper/Transform/Renderer 管线。
- 固化自适应 30/60 FPS、DPR 上限、离屏暂停和 Reduced Motion。
- 将指针输入、WebGL、视频和音频列为后续扩展。

完成证据：

- 设计文档 commit：`5e5a598 docs: design MatrixEffect component`。
- 远端分支：`origin/codex/matrix-effect-design`。

### PRE-1：文档 Review 与契约补全

状态：`已完成`

产出：

- 逐项复核 Review 的 P1/P2 建议，补齐 ref/handle、回调身份、预设 grid 合并和亮度权重契约。
- 补齐 Reduced Motion 运行时切换与监听清理、`invalidate()` dirty 状态机和 `createCellRenderer()` scratch cell 约束。
- 统一两个预设的 `backgroundColor` API，并增加可复现的自适应 FPS 压力验收方法。
- 将 Review 结论同步到具体工作包与不可违反约束；P3-2/P3-3 作为独立仓库维护问题留后续处理。

完成证据：

- 基础执行计划 commit `e2169d2 docs: plan MatrixEffect implementation` 已推送。
- 设计文档和执行计划已同步，不再依赖临时 Review 记录才能实施。
- 通过 `git diff --check`、Markdown 围栏闭合与尾随空格检查。

### CORE-1：公共类型与信号转换算法

目标：建立后续模块共同依赖的稳定类型和纯算法，不引入 React 帧循环。

范围：

- 创建 `types.ts`，实现设计文档中的 Source、Grid、Frame、Renderer、Error、Handle 和 Props 类型。
- 创建 `transforms.ts`。
- 实现并导出：
  - `createLuminanceMapper(options?: LuminanceMapperOptions)`，支持合法 RGB 权重归一化和非法权重回退。
  - `createInvertTransform()`。
  - `createLevelsTransform()`。
  - `createThresholdTransform()`。
  - `createTemporalSmoothingTransform()`。
- 对非法输入、NaN、Infinity、空范围和时间平滑首帧建立确定性规则。
- 创建初始 `index.ts`，只导出已经真实实现的 API，不导出占位符。
- 所有公共类型、函数和复杂算法使用简体中文 JSDoc。

非范围：

- React 组件、Canvas Source 加载、Renderer、预设、Demo。

完成条件：

- 类型与设计文档一致，没有为未来 Pointer/WebGL 提前增加无行为字段。
- 转换器原地操作 `Float32Array`，不为每个单元格创建长期对象。
- 默认 Rec.709 结果正确；`[1, 0, 0]`、`[0, 1, 0]`、`[0, 0, 1]` 分别提取对应通道，非法权重确定性回退且不改变 Alpha 语义。
- 时间平滑使用 `deltaTime` 和 `responseMs`，不使用固定帧系数。
- `npx -y pnpm@8.7.0 lint` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_CORE-1_公共类型与信号转换.md`。

依赖：`PRE-1`。

### SRC-1：Source 适配与采样底座

目标：把图片、外部 Canvas 和程序化绘制统一为可被核心调用的低分辨率采样输入。

范围：

- 创建 `sources.ts`。
- 实现 string URL、Blob/File、`HTMLImageElement`、`ImageBitmap` 图片输入。
- 实现 `HTMLCanvasElement`、可选 `OffscreenCanvas` 和 Canvas supplier 输入。
- 实现程序化 Source 调用协议。
- 实现 `cover`、`contain`、`fill`、position、smoothing 和透明/固定背景。
- 建立内部资源所有权：object URL、图片监听器、过期加载和外部资源不误关闭。
- 建立 CORS/tainted canvas 错误识别所需的结构化结果。
- 模块初始化不得直接访问 `window`、`document` 或 DOM 构造器。

非范围：

- 柔和光团预设、可见 Canvas、rAF、Dot/ASCII 绘制。

完成条件：

- 三类 Source 能被统一调用，并可在 Source 变化时安全清理。
- 慢图片完成后不会覆盖更新的 Source。
- Strict Mode 重复初始化/清理不泄漏资源。
- `npx -y pnpm@8.7.0 lint` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_SRC-1_Source适配与采样底座.md`。

依赖：`CORE-1`。

### FE-1：MatrixEffect 静态渲染核心

目标：关闭最小端到端路径，让静态 Source 经 Mapper/Transform/Renderer 输出到响应式 Canvas。

范围：

- 创建 `matrix-effect.tsx` 并添加 `"use client"`。
- 使用根容器 + 可见 Canvas 结构，支持 `className`、`style`、`canvasClassName`。
- 实现 ResizeObserver 与 window resize 降级。
- 实现 auto/fixed 网格计算、`columns x rows` 推导、cellAspectRatio 和 maxCells。
- 实现 DPR cap、backing-store 像素上限和 transform 重置。
- 创建内部 `columns x rows` 采样 Canvas，并使用 `{ willReadFrequently: true }`。
- 实现静态单帧管线：Source -> RGBA -> Mapper -> Transform -> clamp -> Renderer。
- 实现信号/上一帧缓冲复用和尺寸变化重置。
- 使用 `forwardRef + useImperativeHandle` 暴露稳定的 `MatrixEffectHandle`，ref 不指向根 div；`canvas` 始终读取当前节点，不能永久快照初始 null。
- 实现 `MatrixEffectHandle.invalidate()` 的 dirty 标记、重复调用合并和可绘制状态下一次性重绘；没有连续播放基准时使用 `deltaTime=0`。
- 实现静态状态变化、`onReady`、初始错误和 fallback。
- 管线配置按身份做最小失效；`onStatusChange`、`onReady`、`onError` 使用 latest ref，事件回调身份变化不重建管线。
- 实现 decorative/role/ariaLabel 语义；原生 ARIA 等 rest props 只传给根 div，Canvas 语义只由 decorative/ariaLabel 决定。

非范围：

- 连续动画、自适应 FPS、IntersectionObserver、Reduced Motion。
- Dot/ASCII 内置 Renderer。

完成条件：

- 2:1、1:1、1:2 容器能得到正确 `columns x rows`。
- 静态图片只在加载、尺寸、配置或 invalidate 变化时重绘。
- ref 能稳定读取 Canvas 并触发 invalidate；同一帧重复调用只产生一次绘制。
- 只改变事件回调身份不会重置 Source、Renderer、成功帧或状态。
- 零尺寸等待而不报错。
- 自定义整帧 Renderer 可完成非空绘制。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_FE-1_静态渲染核心.md`。

依赖：`SRC-1`。

### FE-2：动态调度、暂停与错误韧性

目标：在静态核心上补齐连续动态渲染的完整生命周期。

范围：

- 实现单一 rAF 调度器和 30/60 固定帧率上限。
- 实现 `frameRate="auto"`：Renderer FPS 提示、持续超预算降级、稳定窗口升级和冷却。
- 实现有效播放时间、暂停不累计、恢复基准重置和 deltaTime 上限。
- 实现 `playing`、document visibility、IntersectionObserver 离屏暂停。
- 监听 `prefers-reduced-motion` 的运行时 `change`：初始 reduce 使用 `time=0`，运行中切换冻结当前成功帧，恢复时不累计暂停时间；支持 `ignore` 覆盖。
- 把 dirty invalidation 接入动态调度：现有循环由下一帧消费且不创建第二条 rAF；`playing=false` 时可见状态重绘一次；页面隐藏、离屏或零尺寸时延迟到恢复首帧。
- 实现 Observer、事件监听和 rAF 的统一清理。
- 捕获 Source/Mapper/Transform/Renderer 运行时异常；单次上报并停止错误循环。
- 已有成功帧时保留最后画面；无成功帧时显示 fallback。
- 缺少 IntersectionObserver 时正常绘制，缺少 ResizeObserver 时保留降级路径。

非范围：

- 鼠标/触摸监听、视频、WebGL、调试面板。

完成条件：

- 暂停状态没有持续循环 rAF；可见状态下的 dirty invalidation 只允许一次性 rAF，绘制后必须结束。
- 离屏、后台标签页、`playing=false` 和 Reduced Motion 行为符合设计；运行中切换系统设置能即时冻结/恢复。
- 暂停或动态运行时重复 invalidate 均被合并，且全程只有一条连续 rAF 链。
- 恢复播放不会因大 deltaTime 跳跃。
- 运行时异常不会每帧重复触发 `onError`。
- React DevTools 不出现每帧 React commit。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_FE-2_动态调度与错误韧性.md`。

依赖：`FE-1`。

### FX-1：Dot Renderer 与 DotMatrixEffect

目标：完成图一方向的首个用户可用预设，并验证动态程序化 Source 的主路径。

范围：

- 在 `sources.ts` 实现 `createSoftBlobSource()`，使用确定性 seed 和径向渐变。
- 创建 `renderers.ts`，实现 `createDotRenderer()`。
- 实现 `createCellRenderer()`，每个实例只复用一个 scratch cell，并把它作为只读瞬时视图传给回调。
- 单色 Dot 模式批量构建 Path，避免逐点独立 fill。
- 支持固定色/源图色、radiusRange、opacityRange、源 Alpha 和值曲线。
- 创建 `presets.tsx`，实现 `DotMatrixEffect`。
- 使用 `forwardRef` 把 `MatrixEffectHandle` 原样转发给核心。
- 按 auto/fixed mode 合并调用方局部 grid，保留 Dot 的 `cellAspectRatio=1`、`maxCells=10000` 默认值。
- 只暴露预设级 `backgroundColor`，内部映射为核心 `clearColor`。
- 未传 source 时 memoize 默认 soft blob Source。
- 实现 Luminance -> Invert -> Levels -> additionalTransforms 的固定顺序。
- 补齐 `index.ts` 真实导出。

完成条件：

- 无 Props 即能输出连续、确定性的柔和光团圆点场。
- 相同 seed 在时间 0 得到相同画面。
- radius 不超过单元格可容纳范围，透明区不会因 invert 变为实心圆点。
- 默认 10000 cells，自动模式首选 60 FPS 并可降到 30。
- `{ mode: "fixed", columns: 100 }` 保留 100 列并补齐 Dot 宽高比和 maxCells；ref 可调用核心 handle。
- `createCellRenderer()` 在逐格绘制时不创建新 cell 对象。
- Reduced Motion 下得到构图完整的静止帧。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_FX-1_Dot预设.md`。

依赖：`FE-2`。

### FX-2：ASCII Renderer 与 AsciiEffect

目标：完成图二方向的字符艺术预设。

范围：

- 在 `renderers.ts` 实现 `createAsciiRenderer()`。
- 支持字符串/字符数组、固定色/源图色、字体、字重、fontScale、背景色。
- 字符按低密度到高密度映射；空字符和低 Alpha 单元格跳过。
- 字体指标只在 prepare/配置变化时测量，不逐格 `measureText()`。
- 在 `presets.tsx` 实现 `AsciiEffect`。
- 默认 cellAspectRatio 约 0.6、maxCells 6000、preferred FPS 30。
- 使用 `forwardRef` 转发 `MatrixEffectHandle`，并按 auto/fixed mode 合并调用方局部 grid。
- 保证 `backgroundColor` 是唯一预设清屏入口，不重复暴露 `clearColor`。
- 补齐 `index.ts` 真实导出。

完成条件：

- 静态图片正确映射为可辨认字符图形。
- 字符集为空和只有一个字符时行为确定。
- `contain` 保留主体，透明边缘不生成反相字符块。
- 纵横容器中字符单元格不被强制为正方形。
- `{ mode: "fixed", columns: 100 }` 最终保留 100 列并补齐 `cellAspectRatio=0.6`、`maxCells=6000`；ref 可调用核心 handle。
- 静态 Source 只绘制一次，动态 Source 默认不超过 30 FPS。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_FX-2_ASCII预设.md`。

依赖：`FX-1`。实现逻辑上可只依赖 `FE-2`，但顺序执行可减少对 `renderers.ts`、`presets.tsx` 和 `index.ts` 的并发冲突。

### DEMO-1：完整 Demo 与同源示例资产

目标：用三个可验证场景展示预设和核心扩展能力。

范围：

- 创建 `matrix-effect-demo.tsx`。
- 场景一：柔和光团圆点矩阵。
- 场景二：同源静态图片转 ASCII。
- 场景三：同一 Source 更换 Transform 或自定义 Cell Renderer。
- 使用现有 shadcn/QiuYe UI 控件提供必要的密度、半径、速度、字符集、反相和颜色模式控制。
- 添加稳定、许可明确的同源示例位图；不能依赖 `/var/folders/...` 剪贴板临时文件或运行时跨域图片。
- Demo 容器使用稳定 height/aspect-ratio，移动端控件不溢出、不重叠。
- Demo 尊重 Reduced Motion，不用可见说明文案替代真实效果。

非范围：

- 指针互动、音频、视频、导出按钮、性能基准编辑器。

完成条件：

- 三个场景都产生非空 Canvas。
- ASCII 资产在离线/同源环境可加载且无 CORS 错误。
- 控件变化能触发正确重绘，不造成 Source/Renderer 每次无关 render 都重建。
- 390px 宽度下控件和 Canvas 布局稳定。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_DEMO-1_完整演示.md`。

依赖：`FX-1`、`FX-2`。

### SITE-1：详情页、快速预览与站点元数据

目标：让组件在官网组件目录和详情页完整可见。

范围：

- `ComponentId` 新增 `MATRIX_EFFECT = "matrix-effect"`。
- `basicUsageExamples` 使用 `DotMatrixEffect` 提供最短可运行示例。
- `lib/registry.ts` 新增 Matrix Effect 元数据、`propsInfo`、版本、标签和文件路径。
- `simple-demos.tsx` 新增 `MatrixEffectSimpleDemo`，使用无网络的 Dot 预设。
- `page.tsx` 导入完整 Demo/简单 Demo并加入两个映射。
- 验证 `generateStaticParams()` 自动包含新 ID。
- 不因通用清单规则手工硬编码 `app/cli/page.tsx`；只有确认需要改变首页优先推荐时才单独修改。
- 首页组件墙不是首版完成条件。

完成条件：

- `/components` 能搜索和筛选 Matrix Effect。
- `/components/matrix-effect/` 包含快速预览、基础用法、完整 Demo、API 和依赖信息。
- 页面导入名为 `MatrixEffect`，与 `Matrix Effect` 元数据推导一致。
- `propsInfo` 至少分别覆盖 `MatrixEffect`、`DotMatrixEffect`、`AsciiEffect`。
- 静态导出构建成功。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_SITE-1_站点接入.md`。

依赖：`DEMO-1`。

### REG-1：Registry、MCP 与项目清单同步

目标：完成 shadcn CLI 分发和项目级发现能力。

范围：

- 创建 `public/registry/matrix-effect.json`，列出设计文档约定的全部源码文件。
- `dependencies`、`registryDependencies` 均保持空数组，除非设计先更新并重新确认。
- 执行 registry 更新脚本生成每个文件 content 和总清单。
- 把 `matrix-effect` 加入 MCP `DEFAULT_COMPONENT_NAMES`。
- 更新 README、AGENT 等真实组件清单和必要使用示例。
- 核对 `lib/registry.ts` 与 registry JSON 的名称、依赖、文件和版本一致。
- 不手工编辑 `public/registry/registry.json`。

完成条件：

- `npx -y pnpm@8.7.0 update-registry` 成功。
- `npx -y pnpm@8.7.0 update-registry:dry` 无待同步 content。
- `public/registry/matrix-effect.json` 的七个源码文件均有最新 content。
- MCP fallback 包含 `matrix-effect`。
- `package.json` 和 `pnpm-lock.yaml` 没有因本组件发生依赖变化。
- `npx -y pnpm@8.7.0 lint` 与 `npx -y pnpm@8.7.0 build` 通过。
- 创建 `MatrixEffect组件实施记录/<日期>_REG-1_Registry与项目清单.md`。

依赖：`SITE-1`。

### QA-1：构建、Registry 与功能验收

目标：从安装和用户使用角度关闭静态正确性及主要功能路径。

范围：

- 运行 lint、静态导出 build、registry update dry。
- 检查 registry JSON 的 content、导出入口和全部相对 import。
- 检查静态图片、外部 Canvas、程序化 Source。
- 检查 Mapper、Transform 顺序、自定义 Renderer 和 invalidate。
- 检查核心与两个预设的 `MatrixEffectHandle` ref 转发、重复 invalidate 合并和 `playing=false` 可见重绘。
- 检查事件回调身份变化不重建管线，管线函数身份变化只使对应阶段失效。
- 检查 Dot 与 ASCII 默认/自定义模式。
- 检查两个预设在 auto/fixed 下的局部 grid 合并及唯一 `backgroundColor` 入口。
- 检查 CORS 错误、图片加载失败、空字符集、非法数值和零尺寸。
- 检查 decorative/ariaLabel/fallback。
- 检查 Source 快速切换不出现过期结果。

完成条件：

- 所有必需命令通过，或对项目既有问题提供可复现证据并确认没有新增错误。
- `/components/matrix-effect/` 与 `/registry/matrix-effect.json` 可访问。
- Canvas 像素检查确认三类 Demo 均非全透明/纯背景。
- 没有遗漏 registry 文件或错误依赖。
- 创建 `MatrixEffect组件实施记录/<日期>_QA-1_构建与功能验收.md`。

依赖：`REG-1`。

### QA-2：视觉、响应式、性能与生命周期验收

目标：关闭 Canvas 组件最容易被静态构建遗漏的浏览器风险。

范围：

- 1440 x 900、390 x 844 以及横/方/纵容器截图检查。
- DPR 1、2、大于 2 和 backing-store 像素上限检查。
- auto/fixed 网格、100 列自动 rows、ASCII 0.6 宽高比检查。
- Dot 10000 cells 与 ASCII 6000 cells 的默认实际帧率检查。
- 使用 Dot fixed `160 x 100`、`maxCells=16000`、`frameRate="auto"` 执行压力场景；先使用 Chrome CPU throttling 4x，15 秒内未触发持续超预算时改为 6x，并记录实际倍率。
- 在压力下至少观察 15 秒以确认降到 30，降级后保持压力至少 10 秒以确认不回升；解除限速后观察至少 30 秒，只有冷却后允许一次 30 -> 60 升级，不得反复振荡。
- 通过仅开发环境指标或测试插桩记录当前目标 FPS、档位切换和网格，不新增公共高频帧回调。
- 离屏、后台、playing、Reduced Motion 暂停检查；在运行中切换系统 Reduced Motion 设置，验证冻结当前成功帧、恢复时间连续和监听器清理。
- 检查动态循环、`playing=false`、页面隐藏和离屏四种状态下的 invalidate dirty 消费时机。
- 恢复时间连续性、运行时异常单次上报检查。
- 重复挂载/卸载后的 rAF、Observer、事件和 object URL 清理检查。
- React DevTools 或等价方式确认没有每帧 React commit。
- 浅色/深色主题、移动端控制区域和文本溢出检查。

完成条件：

- 视觉截图和 Canvas 像素均通过。
- 规定的 4x/6x 压力步骤能从 60 稳定降到 30，降级后 10 秒不回升；解除限速后的 30 秒观察窗内最多升级一次，不反复振荡。
- 不可见或暂停时无活动渲染循环。
- 没有布局重叠、裁切、空白 Canvas 或明显资源泄漏。
- 如果发现问题，创建 `fix/` 文档并修复后重新执行受影响验收；不能带着已知问题把 QA-2 标记完成。
- 创建 `MatrixEffect组件实施记录/<日期>_QA-2_视觉性能与生命周期验收.md`。

依赖：`QA-1`。

## 不可违反的工程约束

- 首版只有 Canvas 2D，不引入 WebGL/WebGPU/Shader 依赖。
- 不内置鼠标、触摸、音频、视频、摄像头或 DOM 截图。
- 响应式网格必须为 `columns x rows`，默认不能强制方阵。
- Source、Mapper、Transform、Renderer 职责必须保持分离。
- 自定义 Transform 必须能访问完整网格和上一帧。
- 动态热路径不得逐格创建 DOM/React 节点，不得每帧 setState。
- `createCellRenderer()` 每个实例只能复用一个 scratch cell，不得逐格创建对象。
- 默认保留 maxCells、maxDpr、backing-store 像素上限、自适应 30/60 FPS、离屏暂停和页面隐藏暂停。
- Reduced Motion 必须监听运行时变化：初始 reduce 使用 `time=0`，运行中切换冻结当前成功帧，恢复时不累计暂停时间。
- `invalidate()` 必须始终标记并合并 dirty；动态循环不得创建第二条 rAF，隐藏或离屏时延迟到恢复首帧。
- 核心和两个预设必须通过 `forwardRef` 暴露同一个 `MatrixEffectHandle`；事件回调身份变化不得重建管线。
- Dot/ASCII 必须按 mode 合并局部 grid，保留各自 maxCells/宽高比默认值，并只暴露 `backgroundColor` 作为预设清屏入口。
- 所有公共 API、复杂算法和非显然生命周期逻辑使用简体中文 JSDoc/注释。
- 不新增 npm 依赖；若实现证明必须新增，先更新设计并取得确认。
- `pnpm-lock.yaml` 是 lockfile v6。只能显式使用 pnpm 8.x，例如 `npx -y pnpm@8.7.0 ...`，不能直接使用较新的全局 pnpm。
- `public/registry/registry.json` 只能由 `update-registry` 生成，不能手改。
- registry item 必须列出 `matrix-effect` 目录的全部交付文件；Demo 和 public 示例资产不进入组件 item。
- 外部 ImageBitmap、Image、Canvas 不归组件所有，卸载时不得误关闭或移除。
- 内部 rAF、Observer、事件监听、图片监听和 object URL 必须完整清理。
- 不修改无关组件，不为了展示效果顺带重构首页或组件详情页基础设施。
- 如果本轮启动任何前端服务，最终回复前必须终止本轮启动的全部服务进程。

## 验证命令

所有 pnpm 命令显式使用 8.7.0：

```text
npx -y pnpm@8.7.0 update-registry
npx -y pnpm@8.7.0 update-registry:dry
npx -y pnpm@8.7.0 lint
npx -y pnpm@8.7.0 build
npx -y pnpm@8.7.0 dev
```

说明：

- 仅修改尚未接入 registry 的基础模块时，可以先运行 lint；关闭 FE-1、FE-2、FX、SITE、REG 和 QA 工作包时必须按各自完成条件运行 build。
- `dev` 只用于浏览器验收，不属于常驻进程。记录 PID/端口，验收完成后停止，并确认端口已释放。
- 实现不涉及依赖新增，正常情况下不运行 install/add，也不应改动 lockfile。
- 浏览器验证必须记录视口、路由、关键行为和结果，不能只写“手测通过”。

## 实施记录规则

每个实现会话在以下目录创建记录：

```text
docs/设计并开发MatrixEffect组件/MatrixEffect组件实施记录/
```

文件名：

```text
YYYY-MM-DD_<工作包ID>_<简短标题>.md
```

如果一个会话实现多个紧密耦合工作包，可以共用一份记录，但台账中每个工作包必须独立更新状态、验证和记录路径。

模板：

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

## 与设计文档的一致性

- 是否偏离设计：否 / 是
- 如有偏离，原因与设计文档更新：

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
````

验收、自测或用户反馈产生新增需求时，在 `feat/` 下创建文档；发现缺陷时在 `fix/` 下创建文档。如果变更影响原始 API 或行为契约，同时更新开发设计文档和本计划。

## 下一步建议

下一工作包为 `FE-2 动态调度、暂停与错误韧性`。

开始实现前应读取 FE-1 实施记录，在既有唯一 rAF、dirty generation、generation/adapter 身份校验和结构化错误锁上扩展连续调度。不得创建第二条动画循环；优先关闭 `playing`、页面可见性、离屏暂停、Reduced Motion 与有效播放时间，再实现 30/60 自适应 FPS。Dot/ASCII、Demo 和 registry 仍不属于 FE-2。
