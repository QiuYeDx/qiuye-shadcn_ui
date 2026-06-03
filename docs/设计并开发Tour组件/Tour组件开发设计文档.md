# Tour 组件开发设计文档

创建日期：2026-06-03

## 需求摘要

开发一个面向 QiuYe UI 组件库的 `Tour` 引导组件，用于在产品界面中按步骤高亮目标元素并展示说明弹层。核心 API 需要支持类似下面的步骤配置：

```tsx
{
  target: "#sidebar",
  title: "Navigation",
  content: "Browse your projects here.",
  placement: "right",
}
```

组件必须具备：

- 遮罩层与聚焦透明区域。
- 聚焦区域在步骤切换时具备位移和 resize 的 Motion `layoutId` 过渡效果。
- Popover 在步骤切换时具备 Motion `layoutId` 过渡效果。
- 步骤进度显示。
- 上一步、下一步、跳过能力。
- 简洁、流畅、优雅的用户体验。

## 目标

- 提供可直接通过 `steps` 配置使用的 Tour 组件，覆盖常见产品引导场景。
- 默认体验完整：打开后定位目标、滚动到目标、展示遮罩、高亮目标、展示说明、支持键盘退出。
- 动画统一使用 `motion` / `motion/react`，重点使用 `LayoutGroup` + `layoutId` 让 spotlight 和 popover 在不同步骤之间平滑迁移。
- API 既能满足简单用法，也保留受控状态、样式覆盖、目标交互、回调等必要扩展。
- 保持组件库现有风格：单文件主组件、中文 JSDoc、`cn` 合并 className、registry 可独立安装。

## 非目标

- 不实现跨路由持久化引导进度。
- 不内置后端记录、埋点上报或 A/B 实验能力。
- 不实现复杂分支流程，当前只支持线性步骤。
- 不依赖浏览器扩展级的页面录制或自动点击能力。

## 当前工程背景

项目技术栈为 Next.js App Router、React 19、TypeScript、Tailwind CSS、shadcn/ui、pnpm。

已有可复用能力：

- `motion` 已在 `package.json` 中依赖，可直接使用 `motion/react` 的 `AnimatePresence`、`LayoutGroup`、`motion`、`useReducedMotion`。
- `lucide-react` 已存在，可用于按钮图标。
- `components/ui/button.tsx`、`components/ui/badge.tsx`、`components/ui/separator.tsx` 可作为 popover 内部基础控件。
- `components/qiuye-ui/image-viewer.tsx` 已有 `createPortal` + `LayoutGroup` + `layoutId` 的灯箱实现，可作为 portal 与共享布局动画参考。
- `components/qiuye-ui/responsive-tabs.tsx` 已有 `layoutId` 高亮背景迁移动画，可作为小范围共享布局动画参考。
- `hooks/use-prevent-scroll.ts` 可用于 Tour 打开时阻止用户滚动；若 Tour 引入该 hook，registry item 需要把它加入 `files`。

## 最终组件形态

新增组件 ID：

```text
tour
```

新增导出：

```tsx
export function Tour(props: TourProps): React.ReactElement | null
```

计划主文件：

```text
components/qiuye-ui/tour.tsx
```

组件内部采用 portal 渲染到 `document.body`，避免受父容器 `overflow`、`transform`、`z-index` 影响。

## Public API 设计

### TourStep

```tsx
export type TourPlacement = "top" | "right" | "bottom" | "left";
export type TourAlign = "start" | "center" | "end";

export interface TourStep {
  /**
   * 步骤唯一标识。不传时使用数组下标生成稳定 fallback。
   */
  id?: string;
  /**
   * 被引导的目标元素。
   * - string: 使用 document.querySelector 查询，如 "#sidebar"
   * - HTMLElement: 直接使用元素
   * - function: 每次进入步骤时执行，适合动态渲染目标
   */
  target: string | HTMLElement | (() => HTMLElement | null);
  /**
   * Popover 标题。
   */
  title: React.ReactNode;
  /**
   * Popover 正文内容。
   */
  content: React.ReactNode;
  /**
   * Popover 相对目标的优先展示方向。
   * @default "bottom"
   */
  placement?: TourPlacement;
  /**
   * Popover 在交叉轴上的对齐方式。
   * @default "center"
   */
  align?: TourAlign;
  /**
   * Popover 与 spotlight 边缘的距离，单位 px。
   */
  offset?: number;
  /**
   * 目标外扩的透明聚焦区域 padding，单位 px。
   */
  spotlightPadding?: number;
  /**
   * 聚焦区域圆角，单位 px。
   */
  spotlightRadius?: number;
  /**
   * 单个步骤的 popover className 覆盖。
   */
  popoverClassName?: string;
  /**
   * 进入当前步骤后的回调。
   */
  onEnter?: () => void;
  /**
   * 离开当前步骤前的回调。
   */
  onLeave?: () => void;
}
```

### TourProps

```tsx
export interface TourProps {
  /**
   * 引导步骤列表。
   */
  steps: TourStep[];
  /**
   * 受控打开状态。
   */
  open?: boolean;
  /**
   * 非受控默认打开状态。
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * 打开状态变化回调。
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 受控当前步骤下标。
   */
  currentStep?: number;
  /**
   * 非受控默认步骤下标。
   * @default 0
   */
  defaultStep?: number;
  /**
   * 步骤变化回调。
   */
  onStepChange?: (stepIndex: number) => void;
  /**
   * 点击完成或走到最后一步后的回调。
   */
  onFinish?: () => void;
  /**
   * 点击跳过或按 Escape 关闭后的回调。
   */
  onSkip?: () => void;
  /**
   * 打开步骤时是否自动滚动目标元素到可视区域。
   * @default true
   */
  scrollIntoView?: boolean;
  /**
   * 是否允许用户点击聚焦区域内的目标元素。
   * @default false
   */
  allowTargetInteraction?: boolean;
  /**
   * 点击遮罩层外部时是否跳过并关闭 Tour。
   * @default false
   */
  maskClosable?: boolean;
  /**
   * 是否显示遮罩层。
   * @default true
   */
  showMask?: boolean;
  /**
   * 顶层 portal 容器 z-index。
   * @default 80
   */
  zIndex?: number;
  /**
   * Popover 最大宽度，单位 px。
   * @default 340
   */
  popoverWidth?: number;
  /**
   * 视口边缘安全距离，单位 px。
   * @default 16
   */
  viewportPadding?: number;
  /**
   * Popover className 覆盖。
   */
  popoverClassName?: string;
  /**
   * Spotlight className 覆盖。
   */
  spotlightClassName?: string;
  /**
   * 自定义底部操作区。
   */
  renderFooter?: (context: TourRenderContext) => React.ReactNode;
}
```

### TourRenderContext

```tsx
export interface TourRenderContext {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  previous: () => void;
  next: () => void;
  skip: () => void;
  finish: () => void;
}
```

## 基础用法

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tour } from "@/components/qiuye-ui/tour";

export function ProductTourExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Start tour</Button>

      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          {
            target: "#sidebar",
            title: "Navigation",
            content: "Browse your projects here.",
            placement: "right",
          },
          {
            target: "#search",
            title: "Search",
            content: "Find files, issues, and team activity quickly.",
            placement: "bottom",
          },
        ]}
      />
    </>
  );
}
```

## 视觉与交互设计

### 遮罩层与聚焦区域

采用一个视觉 spotlight 元素承担遮罩效果：

- `motion.div` 固定定位到目标元素外扩后的矩形区域。
- 元素自身透明，使用超大 `box-shadow` 形成全屏遮罩：
  `box-shadow: 0 0 0 9999px rgba(2, 6, 23, 0.56)`。
- 元素设置 `layoutId={`${tourId}-spotlight`}`，步骤切换时通过共享布局动画从旧目标迁移到新目标。
- 元素同时设置 `layout`，在同一步目标因 resize/scroll 改变尺寸时也能平滑补间。
- 使用 ring、outline 或内阴影强化高亮边界，避免透明洞和页面内容边界不清晰。

点击拦截单独由透明 hit layer 处理：

- 顶层容器默认 `pointer-events: none`。
- popover 区域设置 `pointer-events: auto`。
- spotlight 外围四个透明区域设置 `pointer-events: auto`，用于阻断页面外部点击；当 `maskClosable=true` 时点击这些区域触发跳过。
- 当 `allowTargetInteraction=false` 时，在 spotlight 透明洞上方渲染一个透明 hit layer 阻止点击目标。
- 当 `allowTargetInteraction=true` 时，不渲染洞内 hit layer，让目标元素可以被点击。

这个方案避免使用 `clip-path` 或 CSS mask 做命中测试，因为 mask 的透明区域不等于真实点击穿透区域。

### Popover

Popover 使用自定义固定定位容器，而不是直接使用 Radix Popover：

- Tour 的目标来自外部 selector，不天然拥有 Radix Trigger。
- 自定义定位更容易把 spotlight、arrow、popover 统一放进一个 `LayoutGroup`。
- 可以让 popover 本身使用 `layoutId={`${tourId}-popover`}`，在步骤切换时完成位置和尺寸迁移。

Popover 结构：

- 顶部：标题 + 进度徽标，如 `2 / 5`。
- 中部：正文内容，支持 `ReactNode`。
- 底部：`Skip`、`Previous`、`Next` / `Done`。
- 按钮使用 `components/ui/button.tsx`，上一/下一步按钮使用 `ChevronLeft` / `ChevronRight` 图标。
- 最后一步主按钮文案为 `Done`，点击后触发 `onFinish` 并关闭。

### 动画参数

默认使用清爽的弹簧动效：

```tsx
const tourTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.75,
};
```

进入/退出：

- portal 根节点使用 `AnimatePresence` 淡入淡出。
- spotlight 首次进入从 `opacity: 0` 到 `opacity: 1`，退出时淡出。
- popover 首次进入轻微 `opacity + scale + y`，步骤切换主要交给 `layoutId` 迁移。
- 内容区内部使用参与 layout 的容器 + `AnimatePresence mode="popLayout"`，让新内容立即进入布局、旧内容弹出淡出，从而让 popover 高度在内容行数变化时平滑过渡。

无障碍动效：

- 使用 `useReducedMotion()`。
- 当用户开启减少动态效果时，将弹簧切换为短时 opacity 过渡，并关闭明显的 scale / y 位移。

## 状态模型

组件内部状态分为：

- `resolvedOpen`：受控/非受控合并后的打开状态。
- `resolvedStepIndex`：受控/非受控合并后的当前步骤。
- `activeStep`：根据 `resolvedStepIndex` 从 `steps` 读取。
- `targetElement`：当前步骤解析出来的 DOM 元素。
- `targetRect`：目标元素的 viewport rect。
- `spotlightRect`：目标 rect 加上 `spotlightPadding` 后的高亮区域。
- `popoverRect`：popover 自身尺寸，用于碰撞计算。
- `computedPlacement`：最终展示方向，可能因视口碰撞从优先方向 fallback。

受控规则：

- 传入 `open` 时不在内部直接改变打开状态，只通过 `onOpenChange` 通知。
- 传入 `currentStep` 时不在内部直接改变步骤，只通过 `onStepChange` 通知。
- 非受控模式下，内部自行维护 `open` 和 `stepIndex`。
- 关闭后默认把非受控 `stepIndex` 重置为 `defaultStep`，下一次打开从起点开始。

## 目标解析与测量

### 目标解析

`target` 解析规则：

- `string`：`document.querySelector<HTMLElement>(target)`。
- `HTMLElement`：直接使用。
- `function`：每次进入步骤和重新测量时调用。

若目标不存在：

- 首次进入步骤后等待 `requestAnimationFrame` 重新查询，给 React 渲染留一帧时间。
- 仍不存在时触发内部 missing 状态，不渲染 spotlight，popover 居中提示当前步骤不可定位，并保留 `Skip` / `Next`。
- 后续 resize、scroll 或重新打开时继续尝试解析。

### 自动滚动

当 `scrollIntoView=true`：

1. 进入步骤后先解析目标。
2. 如果目标不在安全视口范围内，执行：

```ts
target.scrollIntoView({
  block: "center",
  inline: "center",
  behavior: prefersReducedMotion ? "auto" : "smooth",
});
```

3. 等待两帧 `requestAnimationFrame` 后重新测量，减少滚动中途定位抖动。

### 自动更新

打开状态下监听：

- `resize`
- `scroll`，capture 阶段
- `visualViewport.resize`
- `visualViewport.scroll`
- 当前目标的 `ResizeObserver`

测量更新统一通过 `requestAnimationFrame` 节流，避免滚动中高频 setState。

## Popover 定位算法

输入：

- `spotlightRect`
- `popoverRect`
- `placement`
- `align`
- `offset`
- `viewportPadding`

输出：

- `{ top, left, placement, arrowX, arrowY }`

定位策略：

1. 按步骤的 `placement` 计算候选位置。
2. 如果候选位置超出视口，按相反方向与剩余空间较大的方向 fallback。
3. 交叉轴根据 `align` 计算：`start`、`center`、`end`。
4. 最终 `top/left` 使用 `viewportPadding` clamp 到视口内。
5. arrow 使用 CSS 变量或 inline style 定位到 spotlight 中心附近，并在 clamp 后做边界限制。

移动端策略：

- 当视口宽度小于 480px，popover 默认宽度为 `calc(100vw - viewportPadding * 2)`。
- 若目标高度或位置导致任意方向空间不足，优先展示在底部并 clamp。
- 底部按钮允许换行，但按钮本身保持固定高度，避免文案挤压。

## 无障碍与键盘

- Popover 使用 `role="dialog"` 和 `aria-modal="true"`。
- 标题绑定 `aria-labelledby`，正文绑定 `aria-describedby`。
- 步骤变化后将焦点移动到 popover 容器或主按钮，并恢复明显的 focus ring。
- 关闭 Tour 后恢复打开前的焦点元素。
- `Escape`：触发 `skip`。
- `ArrowLeft`：上一步。
- `ArrowRight`：下一步。
- 当事件目标是 `input`、`textarea`、`select` 或 contenteditable 时，不拦截方向键。
- 进度文本使用 `aria-live="polite"`，让读屏器感知步骤变化。

## 文件接入方案

| 文件 | 操作 |
| --- | --- |
| `components/qiuye-ui/tour.tsx` | 新增 Tour 主组件，包含内部定位、遮罩、popover、状态逻辑 |
| `components/qiuye-ui/demos/tour-demo.tsx` | 新增完整交互 demo，使用 dashboard mock 展示多步骤引导 |
| `app/components/[id]/simple-demos.tsx` | 新增 `TourSimpleDemo`，用于详情页快速预览 |
| `app/components/[id]/page.tsx` | import demo，并加入 `demoComponents` / `simpleDemoComponents` |
| `lib/component-constants.ts` | 新增 `ComponentId.TOUR = "tour"` 与基础用法示例 |
| `lib/registry.ts` | 新增 Tour 元信息、props 表、依赖、tags、category |
| `app/cli/page.tsx` | 可用组件列表中加入 `ComponentId.TOUR` |
| `public/registry/tour.json` | 新增 registry item，声明依赖与文件 |
| `public/registry/registry.json` | 运行 `pnpm update-registry` 自动更新，不手改 |

若实现中引入 `hooks/use-prevent-scroll.ts`，`public/registry/tour.json` 需要包含：

```json
{
  "type": "registry:hook",
  "path": "hooks/use-prevent-scroll.ts"
}
```

## Registry 设计

`public/registry/tour.json` 初始结构：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "tour",
  "title": "Tour",
  "type": "registry:component",
  "author": "QiuYeDx <me@qiuyedx.com>",
  "dependencies": ["motion", "lucide-react"],
  "registryDependencies": ["button", "badge", "separator"],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/tour.tsx"
    },
    {
      "type": "registry:hook",
      "path": "hooks/use-prevent-scroll.ts"
    }
  ]
}
```

注意：

- 不手写 `files[].content`，由 `pnpm update-registry` 生成。
- 若最终不使用 `Separator` 或 `Badge`，从 `registryDependencies` 中移除。
- `@/lib/utils` 不需要写入 `files`。

## Demo 设计

完整 demo 使用一个可引导 dashboard mock：

- 左侧栏：`id="tour-sidebar"`，步骤标题 `Navigation`，`placement="right"`。
- 顶部搜索：`id="tour-search"`，步骤标题 `Search`，`placement="bottom"`。
- 项目卡片：`id="tour-projects"`，步骤标题 `Projects`，`placement="top"`。
- 右侧统计卡：`id="tour-insights"`，步骤标题 `Insights`，`placement="left"`。

Demo 需要展示：

- Start tour 按钮。
- 默认多步骤引导。
- 上一步/下一步/跳过/完成。
- 步骤切换时 spotlight 和 popover 的 layoutId 动画。
- 目标 resize 场景：其中一个目标可在 demo 中通过按钮切换宽度，验证 spotlight resize 过渡。

快速预览 demo 只保留 2-3 个目标，避免详情页首屏过重。

## 实现步骤

1. 新增 `components/qiuye-ui/tour.tsx`，先完成类型、受控/非受控状态、portal 渲染、按钮操作。
2. 实现目标解析、自动滚动、测量更新与 ResizeObserver。
3. 实现 spotlight：超大 box-shadow 遮罩、layoutId 迁移、点击 hit layer。
4. 实现 popover：固定定位、碰撞处理、arrow、layoutId 迁移、进度与操作区。
5. 补齐键盘与焦点管理。
6. 新增完整 demo 与简单 demo。
7. 更新 `ComponentId`、`basicUsageExamples`、`componentRegistry`、详情页映射、CLI 可用组件列表。
8. 新增 `public/registry/tour.json`。
9. 执行 `pnpm update-registry`。
10. 执行验证并根据浏览器截图微调动效、间距和移动端布局。

## 验证计划

命令验证：

```bash
pnpm lint
pnpm build
pnpm update-registry:dry
```

本地页面验证：

- `/components` 列表页能看到 Tour。
- `/components/tour` 详情页能看到快速预览、完整 demo、API 表格和基础用法。
- `/registry/tour.json` 可访问，且包含源码 content。

交互验收：

- 打开 Tour 后首个目标被正确高亮。
- 点击 Next，spotlight 位置和尺寸平滑过渡到下一个目标。
- Popover 跟随目标移动，并通过 `layoutId` 平滑迁移。
- Progress 正确展示，如 `1 / 4`、`2 / 4`。
- Previous 在首步 disabled 或不可触发。
- 最后一步按钮为 Done，点击后关闭并触发 `onFinish`。
- Skip 和 Escape 均关闭并触发 `onSkip`。
- 页面 resize、滚动、目标尺寸变化后 spotlight 和 popover 能重新定位。
- 移动端宽度下 popover 不溢出视口，按钮不挤压变形。
- `allowTargetInteraction=true` 时可以点击聚焦区域内目标；false 时被阻断。

视觉验收：

- 桌面 1440x900：popover 与目标间距自然，遮罩不压住 popover。
- 移动 390x844：popover 宽度、进度、按钮都不溢出。
- 深色模式：遮罩、popover、focus ring 对比度可读。
- 开启减少动态效果时，没有明显位移动画造成不适。

## 风险与处理

| 风险 | 处理 |
| --- | --- |
| selector 目标尚未渲染 | 进入步骤后延迟一帧重试；仍缺失时显示 fallback popover 并允许 Next/Skip |
| 目标在滚动容器中 | 使用 `scrollIntoView`，并在滚动后重新测量 |
| 父级 transform / overflow 影响浮层 | Tour 使用 `createPortal(document.body)` 和 fixed 定位 |
| CSS mask 透明洞不等于点击穿透 | 使用 box-shadow spotlight 做视觉，透明 hit layer 做命中控制 |
| popover 在边缘溢出 | 定位结果 clamp 到 viewportPadding，并做 placement fallback |
| 用户开启减少动态效果 | 使用 `useReducedMotion` 降低位移和 scale |
| registry 安装遗漏 hook | 若 import `hooks/use-prevent-scroll.ts`，必须加入 `public/registry/tour.json` 的 files |

## 后续可扩展项

- 增加 `renderProgress` 自定义进度。
- 增加 `labels` 属性支持按钮文案本地化。
- 增加 `initialFocus` / `restoreFocus` 配置。
- 增加 `onTargetMissing` 回调，允许业务自行决定跳过、等待或关闭。
- 增加 `TourProvider`，为跨组件触发和持久化进度预留能力。
