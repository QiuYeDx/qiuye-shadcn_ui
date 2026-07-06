# SmoothCorners 组件开发设计文档

创建日期：2026-07-06
更新日期：2026-07-06

## 设计结论

本需求横跨三个仓库：

- `/Users/qiuyedx/Documents/Github/smooth-corners-web`：提供平滑圆角算法、CSS 变量 API、尺寸感知计算和 DOM Observer。
- `/Users/qiuyedx/Documents/Github/qiuye-shadcn_ui`：新增一个可通过 shadcn/ui registry 安装的 `smooth-corners` 组件，并在组件详情页提供示例。
- `/Users/qiuyedx/Documents/Github/qiuye-skills`：新增一个面向 AI Agent 的 Smooth Corners Skill，让 Agent 在任意前端项目中按用户意图正确实现平滑圆角。

最终推荐主线：

1. `smooth-corners-web` 已整理并发布自有 npm 包：`@qiuyedx/smooth-corners@0.1.0`；非 scoped 的 `smooth-corners` 已被其他包占用，不建议争用。
2. `qiuye-shadcn_ui` 直接依赖 `@qiuyedx/smooth-corners@0.1.0`，组件 public API 与底层包名解耦，后续算法升级只需更新依赖和 registry。
3. `@lixiaolin94/smooth-corners@0.1.0` 仅保留为历史来源参考，不作为本实现的默认依赖。
4. `qiuye-shadcn_ui` 新增的组件不是重新发明算法，而是一个 shadcn/ui 体系里的 React 包装层：参数化、支持 `asChild`、支持可选尺寸感知、自动注入渐进增强 CSS，并能通过 registry 被其他项目复制安装。
5. `qiuye-skills` 的 Skill 不能只写“安装 npm 包”。它应先判断项目是否能安装包或是否使用 QiuYe UI registry，再提供包方案、shadcn 组件方案和无依赖内联方案三条路径。

## 需求摘要

借鉴 `smooth-corners-web` 项目，为 QiuYe UI 组件库新增一种平滑圆角组件，便于使用 shadcn/ui 体系的前端项目快速复用 Figma/iOS 风格的圆角平滑效果。

组件需要：

- 通过 shadcn/ui registry 安装。
- 支持 `radius`、`smoothing` 等参数配置。
- 带渐进增强逻辑：支持 `corner-shape: superellipse(...)` 的浏览器获得真实平滑圆角；不支持的浏览器回退为标准 `border-radius`。
- 在组件详情页提供快速预览、基础用法、完整示例和 Props API。
- 尽量复用 `smooth-corners-web` 的 npm 包，减少算法复制。

同时，需要在 `qiuye-skills` 中新增一个 Skill，让 AI Agent 在任意前端项目中能根据“平滑圆角 / Figma 圆角平滑 / iOS continuous corner / squircle”等意图选择正确实现路径。

## 目标

- 新增 QiuYe UI 组件 ID：`smooth-corners`。
- 新增 React 组件导出：`SmoothCorners`。
- 支持包装任意内容，默认渲染 `div`，也支持 `asChild` 将效果直接应用到子元素。
- 默认使用 CSS 变量 API，保持轻量和低运行成本。
- 可选开启尺寸感知模式，使用 `ResizeObserver` / package observer 在元素尺寸变化时自动压缩 smoothing，避免圆角相互重叠。
- 组件自动注入一次基础 CSS，安装后开箱即用；同时导出 CSS 字符串或说明，便于高级用户放入全局样式。
- 详情页 Demo 覆盖基础卡片、按钮/卡片 `asChild`、参数 Playground、尺寸感知示例和渐进增强状态。
- registry item 能被 shadcn CLI 安装，并自动安装平滑圆角算法包依赖。
- 保持现有 QiuYe UI 组件开发约束：中文 JSDoc、`cn()` 合并 `className`、registry 元数据同步、静态导出可构建。

## 非目标

- 不在本组件内实现 canvas/svg 路径级圆角 polyfill。
- 不在不支持 `corner-shape` 的浏览器中模拟真实超椭圆曲线；只回退到原始 `border-radius`。
- 不替换现有 shadcn/ui `Card`、`Button`、`Dialog` 等组件的默认圆角。
- 不在组件库中强制全局改写 Tailwind radius token。
- 不把完整 `smooth-corners-web` 演示站迁移进 QiuYe UI；只保留与组件使用相关的示例。
- 不在本阶段实现跨框架 Vue/Svelte 组件，Skill 可以提供跨框架指引。

## 当前工程背景

### smooth-corners-web

关键文件：

- `package.json`
  - 当前包名：`@qiuyedx/smooth-corners`
  - 当前版本：`0.1.0`
  - exports：`.`、`./css`、`./compute`、`./observer`、`./declarative`
- `src/css.js`
  - `smoothCorners(radius, smoothing = 0.6)` 返回 `--sc-r`、`--sc-i`、`--sc-s`
  - `smoothCornersCSS` 提供 `.smooth-corners` + `@supports` 渐进增强 CSS
- `src/compute.js`
  - `computeSmoothCorners(width, height, radius, smoothing)` 会把半径限制到 `min(width, height) / 2`，并在空间不足时降低 smoothing
- `src/observer.js`
  - `observe(el, { radius, smoothing })` / `unobserve(el)` 自动读取元素尺寸并写入 CSS 变量
  - 首次使用会自动注入 `smoothCornersCSS`

npm 状态，2026-07-06 检查：

- `@lixiaolin94/smooth-corners` 已存在，版本 `0.1.0`。
- `@qiuyedx/smooth-corners` 已由用户手动发布成功，版本 `0.1.0`。
- `smooth-corners` 已被其他包占用，不建议争用非 scoped 包名。

### qiuye-shadcn_ui

技术栈与约束：

- Next.js 15 App Router、React 19、TypeScript 5、Tailwind CSS 4、shadcn/ui。
- `pnpm-lock.yaml` 为 `lockfileVersion: '6.0'`，后续修改依赖时必须使用 pnpm 8.x，不能用当前全局 `pnpm 11.7.0` 直接更新 lockfile。
- 新增组件需要同步：
  - `components/qiuye-ui/<id>.tsx`
  - `components/qiuye-ui/demos/<id>-demo.tsx`
  - `app/components/[id]/simple-demos.tsx`
  - `lib/component-constants.ts`
  - `lib/registry.ts`
  - `app/components/[id]/page.tsx`
  - `app/cli/page.tsx`
  - `public/registry/<id>.json`
  - `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs` 的 `DEFAULT_COMPONENT_NAMES`
  - 运行 `pnpm update-registry`
- `public/registry/registry.json` 只能由 `pnpm update-registry` 生成，不能手动编辑。

当前还发现一个顺手修复点：`packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs` 的 `DEFAULT_COMPONENT_NAMES` 已落后于真实组件清单，缺少 `color-picker`、`tour`。新增 `smooth-corners` 时应一起补齐，避免 registry 远端索引不可用时 MCP fallback 漏组件。

### qiuye-skills

当前 Skills 组织方式：

```text
qiuye-skills/
  common/dev/skills/
  frontend/ui-ux/skills/
```

平滑圆角属于前端 UI/UX 能力，应新增在：

```text
frontend/ui-ux/skills/smooth-corners/
```

Skill 设计细节见 `qiuye-skills/docs/开发设计文档/smooth_corners_skill_final_design.md`。

## 包发布与依赖策略

### 已采用策略：使用已发布自有包

QiuYe UI 和 Skill 均引用自有包 `@qiuyedx/smooth-corners@0.1.0`。已在 `smooth-corners-web` 中完成包身份整理：

- 包名改为 `@qiuyedx/smooth-corners`。
- `repository.url` 指向 `https://github.com/QiuYeDx/smooth-corners-web.git`。
- `homepage` 指向实际 GitHub Pages 或项目主页。
- 保持现有 exports 和 public API 不变。
QiuYe UI registry 中写入：

```json
{
  "dependencies": ["@qiuyedx/smooth-corners", "@radix-ui/react-slot"]
}
```

优点：

- QiuYe UI、Skill、npm 包都归入统一命名体系。
- 后续算法升级只更新 npm 包即可。
- Skill 可以在非 shadcn 项目中推荐 `@qiuyedx/smooth-corners`；但只要目标项目能使用 shadcn/ui registry，应优先推荐 `@qiuye-ui/smooth-corners` 组件。

当前状态：

- 用户已手动发布 `@qiuyedx/smooth-corners@0.1.0`。
- 已用 pnpm 8.x 在 `qiuye-shadcn_ui` 安装该依赖，`pnpm-lock.yaml` 保持 `lockfileVersion: '6.0'`。
- 后续如升级底层算法，优先发布新版本 npm 包，再更新 QiuYe UI dependency 和 registry item。

### 过渡策略：先依赖已发布包

如果希望先把 QiuYe UI 组件落地，可暂时依赖：

```text
@lixiaolin94/smooth-corners@0.1.0
```

约束：

- 组件 API、文档和 registry 元数据中尽量不要把包名暴露成使用者必须理解的概念。
- 后续切换到 `@qiuyedx/smooth-corners` 时，只改 import、依赖和 registry，不改 `SmoothCorners` public props。

### 兜底策略：内联算法

如果不希望目标项目增加 npm 依赖，可把 `smoothCorners`、`computeSmoothCorners`、`smoothCornersCSS` 的最小实现内联到组件或项目工具文件中。

该策略只作为 Skill 的无依赖兜底，不建议作为 QiuYe UI registry 组件的默认实现，因为会造成算法复制和后续维护分叉。

## 组件形态

新增组件：

```text
components/qiuye-ui/smooth-corners.tsx
```

组件导出：

```tsx
export interface SmoothCornersProps
export function SmoothCorners(props: SmoothCornersProps): React.ReactElement
export const smoothCornersBaseCSS: string
```

组件定位：

- 视觉效果 wrapper，不负责布局语义。
- 默认渲染一个 `div`。
- `asChild` 为 `true` 时通过 Radix `Slot` 把 className、style、ref 应用到唯一子元素，避免额外 DOM。
- 参数通过 CSS 自定义属性表达，使用 `.smooth-corners` class 和 `@supports` 完成渐进增强。

## Public API 设计

```tsx
export interface SmoothCornersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 原始圆角半径，单位 px。
   * @default 16
   */
  radius?: number;

  /**
   * 平滑强度，范围 0..1。
   * 0 表示标准圆弧，1 表示最大平滑。
   * @default 0.6
   */
  smoothing?: number;

  /**
   * 是否根据元素实际尺寸自动压缩 smoothing。
   * 开启后会在客户端通过 ResizeObserver/observer 自动写入尺寸感知 CSS 变量。
   * @default false
   */
  observeSize?: boolean;

  /**
   * 是否把平滑圆角应用到子元素本身，而不是额外包一层 div。
   * 适合 Button、Card、图片、链接等已有语义元素。
   * @default false
   */
  asChild?: boolean;

  /**
   * 禁用平滑圆角效果。
   * @default false
   */
  disabled?: boolean;
}
```

基础用法：

```tsx
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";

export function Example() {
  return (
    <SmoothCorners radius={28} smoothing={0.7} className="bg-primary p-6 text-primary-foreground">
      Smooth corner card
    </SmoothCorners>
  );
}
```

`asChild` 用法：

```tsx
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <SmoothCorners asChild radius={18} smoothing={0.75}>
      <Button>Continuous button</Button>
    </SmoothCorners>
  );
}
```

尺寸感知用法：

```tsx
<SmoothCorners observeSize radius={72} smoothing={0.8} className="h-24 w-40 bg-primary" />
```

## 实现架构

### 核心渲染流程

1. 规范化 `radius` 与 `smoothing`。
2. 使用包里的 `smoothCorners(radius, smoothing)` 生成初始 CSS 变量。
3. 通过 `useInsertionEffect` 或 `useLayoutEffect` 在客户端注入一次 `smoothCornersCSS`。
4. `observeSize=false` 时只依赖 CSS 变量 API。
5. `observeSize=true` 时在 ref 可用后调用 `observe(el, { radius, smoothing })`，卸载或参数变化时调用 `unobserve(el)`。
6. 合并 className 为 `cn("smooth-corners", className)`。
7. 合并 style 时，调用者 style 先进入，组件生成的 `--sc-*` 后进入，确保 props 是权威参数。

伪代码：

```tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { smoothCorners, smoothCornersCSS } from "@qiuyedx/smooth-corners";
import { observe, unobserve } from "@qiuyedx/smooth-corners/observer";
import { cn } from "@/lib/utils";

export const smoothCornersBaseCSS = smoothCornersCSS;

export function SmoothCorners({
  radius = 16,
  smoothing = 0.6,
  observeSize = false,
  asChild = false,
  disabled = false,
  className,
  style,
  ...props
}: SmoothCornersProps) {
  ensureSmoothCornersStyles();

  const ref = React.useRef<HTMLElement | null>(null);
  const vars = React.useMemo(
    () => (disabled ? {} : smoothCorners(radius, smoothing)),
    [disabled, radius, smoothing]
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || disabled || !observeSize) return;
    observe(el, { radius, smoothing });
    return () => unobserve(el);
  }, [disabled, observeSize, radius, smoothing]);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={composeRefs(ref, props.ref)}
      className={cn(!disabled && "smooth-corners", className)}
      style={{ ...style, ...vars }}
      {...props}
    />
  );
}
```

实际实现时需要注意：

- React 19 下 `ref` 可以作为 prop 传递，但组件库现有代码仍可使用 `forwardRef`/compose refs 模式，保持兼容。
- `style` 类型需要允许 CSS 自定义属性，可用 `React.CSSProperties & Record<"--sc-r" | "--sc-i" | "--sc-s", string>` 或内部类型断言。
- `useInsertionEffect` 不在服务端运行，必须包一层 isomorphic fallback。
- `observeSize=true` 时，首帧仍保留静态 CSS 变量，observer 完成测量后再覆盖，避免空白样式。
- 不要写 inline `borderRadius`，否则会盖住 `@supports` 中的补偿半径。

### 渐进增强 CSS

CSS 必须保持与算法包一致：

```css
.smooth-corners {
  border-radius: var(--sc-r);
}
@supports (corner-shape: superellipse(2)) {
  .smooth-corners {
    border-radius: var(--sc-i);
    corner-shape: var(--sc-s);
  }
}
```

设计约束：

- 浏览器能力判断放在 CSS `@supports` 中，而不是 React render 中。
- 不支持 `corner-shape` 时仍有原始圆角。
- `smoothing=0` 或无有效半径时，`--sc-s` 为空，表现为标准圆角。
- 不把 `corner-shape` 写成 Tailwind class，因为当前能力是动态参数。

## 详情页与 Demo 设计

### 快速预览

在 `app/components/[id]/simple-demos.tsx` 增加 `SmoothCornersSimpleDemo`：

- 展示三块固定尺寸预览：`smoothing=0`、`0.6`、`1`。
- 使用相同 `radius`，让用户直观看到圆角过渡差异。
- 同时显示当前浏览器是否支持 `corner-shape` 的小状态，但不依赖该状态决定核心样式。

### 完整 Demo

新增：

```text
components/qiuye-ui/demos/smooth-corners-demo.tsx
```

建议示例：

1. 基础卡片：`radius=28`、`smoothing=0.6`。
2. `asChild` 应用到 shadcn `Button` 或普通 `img`。
3. 参数 Playground：用 `Slider` 调整 radius 和 smoothing，实时更新预览和代码。
4. 尺寸感知：宽高变化时使用 `observeSize`，展示 smoothing 被压缩后的稳定效果。
5. 渐进增强说明：展示“CSS 变量输出”和“`@supports` 回退逻辑”的源码片段。

Demo 可依赖站点内已有 shadcn/ui 组件，不需要把 demo 文件加入 registry item。

### Props API

在 `lib/registry.ts` 中为 `smooth-corners` 增加 props：

- `radius`
- `smoothing`
- `observeSize`
- `asChild`
- `disabled`
- `className`
- `children`

## Registry 设计

新增文件：

```text
public/registry/smooth-corners.json
```

推荐结构：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "smooth-corners",
  "title": "SmoothCorners",
  "type": "registry:component",
  "author": "QiuYeDx <me@qiuyedx.com>",
  "dependencies": [
    "@qiuyedx/smooth-corners",
    "@radix-ui/react-slot"
  ],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/smooth-corners.tsx"
    }
  ]
}
```

历史过渡方案曾考虑依赖已发布的原始包：

```json
"dependencies": ["@lixiaolin94/smooth-corners", "@radix-ui/react-slot"]
```

当前实现不采用该过渡方案。若未来切换底层包名，必须同步：

- `components/qiuye-ui/smooth-corners.tsx`
- `public/registry/smooth-corners.json`
- `package.json`
- `pnpm-lock.yaml`
- `qiuye-skills` 中的推荐包名说明

## 官网接入清单

新增或修改：

- `components/qiuye-ui/smooth-corners.tsx`
- `components/qiuye-ui/demos/smooth-corners-demo.tsx`
- `app/components/[id]/simple-demos.tsx`
- `app/components/[id]/page.tsx`
- `lib/component-constants.ts`
- `lib/registry.ts`
- `app/cli/page.tsx`
- `public/registry/smooth-corners.json`
- `public/registry/registry.json`，由脚本生成
- `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs`
- `README.md`，可用组件表和示例安装命令
- `AGENT.md`，如新增组件清单需要更新

## Skill 联动设计

`qiuye-skills` 中新增的 Skill 应把 QiuYe UI 组件作为一条优先路径：

```bash
pnpm dlx shadcn@latest add @qiuye-ui/smooth-corners
```

但 Skill 还必须覆盖：

- 只安装 npm 包，不使用 QiuYe UI registry。
- 无法安装依赖时内联 `smoothCorners` helper 和 CSS。
- 需要尺寸感知时使用 `computeSmoothCorners` 或 observer。
- 非 React 项目使用 CSS 变量 API。

这样 Agent 不会在所有项目中机械套用 shadcn 组件，而是根据项目上下文选择最小正确实现。

## 风险与边界

- `corner-shape` 是新 CSS 能力，不同浏览器支持进展会变化，因此文档和组件不要硬编码“只支持某浏览器”的逻辑，使用 `@supports` 即可。
- 如果组件写了 inline `borderRadius`，会破坏渐进增强，必须避免。
- 如果默认开启 `observeSize`，会让每个实例都使用 ResizeObserver，不适合大量列表。默认应为 `false`。
- 如果目标元素已有复杂 `border-radius` 分角设置，本组件第一版不支持每个角独立平滑。
- 如果使用者通过 Tailwind class 同时写 `rounded-*`，`.smooth-corners` 的 `border-radius` 可能被 class 顺序影响。文档应建议由 `radius` prop 作为唯一圆角来源。
- `@qiuyedx/smooth-corners` 已发布；后续发版仍需确认 npm token、scope 权限和 package metadata，避免发布到错误 scope。

## 验证策略

实现阶段至少验证：

```text
使用 pnpm 8.x：
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm build
```

注意：当前环境全局 `pnpm` 是 11.7.0，不能直接用它更新 `pnpm-lock.yaml`。需要通过 Corepack 或 `npx -y pnpm@8.7.0 ...` 明确使用 pnpm 8.x。

浏览器验证：

- `/components/smooth-corners` 详情页可静态生成。
- 快速预览、完整 Demo、参数 Playground 在桌面和移动端布局稳定。
- 支持 `corner-shape` 时使用补偿半径和 `superellipse(K)`。
- 不支持时保留原始 `border-radius`。
- `observeSize` 示例改变尺寸时不发生圆角重叠。
- 如果为了验证启动前端服务，最终回复前必须结束本次启动的服务进程。

## 明确排除

- 不在本阶段修改所有现有组件的圆角审美。
- 不把 `smooth-corners-web/index.html` 内容迁移进 QiuYe UI。
- 不把 Skill 实现和组件实现混在一个提交中；可以同一需求，但建议拆工作包提交。
