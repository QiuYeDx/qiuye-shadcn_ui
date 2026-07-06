# SmoothCorners 官网应用开发设计文档

创建日期：2026-07-06
更新日期：2026-07-06

## 设计结论

本项目已经完成 `SmoothCorners` 组件建设，并且 `package.json` 已固定依赖 `@qiuyedx/smooth-corners@0.1.0`，`pnpm-lock.yaml` 仍是 `lockfileVersion: '6.0'`。本次需求不需要新增依赖、不需要调整 registry、不需要运行安装命令。

推荐把平滑圆角作为官网展示层的精细化增强，而不是替换整个设计系统的圆角 token：

1. 第一优先级应用到首页组件墙卡片 `HomePreviewCard`。这里是官网最核心的品牌展示面，卡片有明确边界、阴影、裁切和稳定尺寸，收益最大。
2. 第二优先级应用到组件列表卡片、组件详情页快速预览容器和右侧 sticky 信息面板。它们都是页面级内容表面，不会影响被分发的 QiuYe UI 组件本体。
3. 第三优先级应用到 CLI 页面文档卡片和命令代码块。这里适合轻量增强，但应放在首页和组件页之后做视觉复核。
4. 暂不批量应用到 `components/qiuye-ui/**` 的组件源码或 demo 内部，也不改 `components/ui/**`。组件 demo 内部的圆角往往是组件自身语义或示例语义，批量替换会让所有 demo 看起来过度同质化。
5. 暂不应用到小型按钮、导航项、badge、`rounded-full` pill、图标按钮等密集控件。平滑圆角在半径较大、有清晰表面的容器上更有价值。

实现主线应使用现有组件：

```tsx
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
```

优先通过 `asChild` 把效果落到真实表面元素上，避免为了视觉效果多套一层 DOM。默认不启用 `observeSize`，避免列表、卡片墙等多实例区域创建不必要的 `ResizeObserver`。

## 需求摘要

用户希望梳理本项目中适合应用平滑圆角效果的位置，并进行合理设计，先产出开发设计文档，不提交代码。额外硬约束：

- 不修改 `components/ui/**` 下的 shadcn/ui 基础组件代码。
- 注意项目使用 pnpm 8.x 时代的 lockfile，不要用过新的 pnpm 直接更新 `pnpm-lock.yaml`。
- 若后续实现阶段启动前端服务，结束前必须关闭服务进程。

## 目标

- 找出官网中最适合 dogfood `SmoothCorners` 的页面级和展示级表面。
- 给出优先级、应用方式、推荐参数和不适用范围。
- 保持 QiuYe UI 组件库的可分发组件不被这次官网视觉增强反向污染。
- 保持 shadcn/ui 基础组件不改源码，只在页面或站点组件侧组合使用。
- 保证渐进增强模型不被破坏：支持 `corner-shape` 时使用平滑圆角，不支持时有稳定的 `border-radius` 回退。

## 非目标

- 不新增一个新的平滑圆角组件。
- 不重写 `components/ui/card.tsx`、`button.tsx`、`dialog.tsx` 等基础组件。
- 不全局替换 Tailwind `--radius` 或所有 `rounded-*` class。
- 不批量改 `components/qiuye-ui/**` 下已对外分发的组件实现。
- 不为了展示效果调整 `public/registry/*.json` 或运行 `update-registry`。
- 不在 unsupported 浏览器里模拟真实超椭圆曲线；仍按现有组件能力回退到普通圆角。

## 当前工程背景

技术栈和约束：

- Next.js 15 App Router、React 19、Tailwind CSS 4、shadcn/ui。
- `components.json` 存在，项目使用 shadcn/ui 结构和 `@/components/ui` alias。
- `components/qiuye-ui/smooth-corners.tsx` 已存在，支持 `radius`、`smoothing`、`observeSize`、`asChild`、`disabled`。
- `SmoothCorners` 基于 `@qiuyedx/smooth-corners` 输出 `--sc-r`、`--sc-i`、`--sc-s`，并注入 `.smooth-corners` 与 `@supports (corner-shape: superellipse(2))` CSS。
- `components/qiuye-ui/demos/smooth-corners-demo.tsx` 和 `app/components/[id]/simple-demos.tsx` 已经有 SmoothCorners 自身示例。
- `pnpm-lock.yaml` 为 `lockfileVersion: '6.0'`，后续验证命令应使用 `npx -y pnpm@8.7.0 lint`、`npx -y pnpm@8.7.0 build` 这类形式。

## 候选区域盘点

### P0：首页组件墙卡片

文件：

- `components/home/home-preview-card.tsx`
- `components/home/home-component-wall.tsx`

当前状态：

- `HomePreviewCard` 根节点是 `motion.article`。
- class 包含 `overflow-hidden rounded-lg border bg-card shadow-sm`。
- 卡片尺寸由 `wide`、`tall`、`square`、`compact` 四类固定规则控制。
- 首页组件墙是首页最重要的视觉记忆点。

适配结论：强烈适合。

设计方式：

- 在 `HomePreviewCard` 根表面应用 `SmoothCorners`。
- 首选 `asChild` 包裹现有 `motion.article`，保持语义和 Motion 动画不变。
- 推荐参数：`radius={18}` 或 `radius={20}`，`smoothing={0.72}`。
- `observeSize={false}`。组件墙最多十几个卡片，且卡片尺寸稳定，不需要 observer。
- `overflow-hidden` 必须保留在同一张卡片表面上，保证子预览内容被同一条平滑轮廓裁切。

实现形态参考：

```tsx
<SmoothCorners asChild radius={20} smoothing={0.72}>
  <motion.article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card ..." />
</SmoothCorners>
```

这里保留 `rounded-lg` 可以作为 SSR 和 hydration 前的粗略回退；平滑 CSS 注入后由 `.smooth-corners` 接管真实圆角。不能额外写 inline `borderRadius`。

### P1：组件列表页卡片

文件：

- `app/components/page.tsx`

当前状态：

- `ComponentCard` 使用 `Card` 作为外层表面。
- 卡片用于展示组件名称、描述、tags、CLI 命令和操作按钮。
- 外层卡片有 hover shadow 和列表布局，是目录页最主要的重复表面。

适配结论：适合。

设计方式：

- 不改 `components/ui/card.tsx`。
- 在 `ComponentCard` 内用 `SmoothCorners asChild` 包住实际 `Card` 实例。
- 推荐参数：`radius={18}`，`smoothing={0.68}`。
- 保留 `Card` 的内部结构和 hover 逻辑。
- CLI 命令小块 `bg-muted/50 rounded-md p-3` 暂不第一轮处理，避免目录页每张卡片内部同时出现多层平滑效果。

实现形态参考：

```tsx
<SmoothCorners asChild radius={18} smoothing={0.68}>
  <Card className="h-full transition-all duration-300 hover:shadow-lg">
    ...
  </Card>
</SmoothCorners>
```

### P1：组件详情页快速预览与侧栏信息面板

文件：

- `app/components/[id]/page.tsx`

当前状态：

- `DemoPreview` 的预览容器是 `rounded-lg bg-muted/30 p-4 sm:p-5`。
- 右侧安装和组件信息侧栏是 `space-y-5 rounded-lg border bg-muted/20 p-4 ... lg:sticky`。
- 两处都是页面级外壳，不属于具体组件 demo 的视觉语义。

适配结论：适合。

设计方式：

- `DemoPreview` 外层容器用 `SmoothCorners` 直接作为真实表面。
- 右侧 sticky 面板用 `SmoothCorners` 或 `SmoothCorners asChild` 应用到同一 `div`。
- 推荐参数：
  - 快速预览容器：`radius={20}`，`smoothing={0.7}`。
  - 右侧信息面板：`radius={18}`，`smoothing={0.68}`。
- `observeSize={false}`。
- 不包裹完整 Demo Tab 内容，不批量改 API 表格和 dependencies 内部小项。

实现形态参考：

```tsx
<SmoothCorners
  radius={20}
  smoothing={0.7}
  className="rounded-lg bg-muted/30 p-4 sm:p-5"
>
  {SimpleDemoComponent ? <SimpleDemoComponent /> : ...}
</SmoothCorners>
```

### P2：CLI 页面文档卡片与命令块

文件：

- `app/cli/page.tsx`

当前状态：

- 页面内容大量使用 `Card` 承载文档段落。
- 本地 `CodeBlock` helper 统一输出 `<pre className="bg-muted/50 rounded-md ...">`。
- 常用命令和 API endpoint 列表项使用 `border rounded-lg p-4`。

适配结论：适合二期处理。

设计方式：

- 先应用到 `CodeBlock` helper 的 `<pre>`，收益集中且改动点少。
- 再应用到主要 `Card` 表面和命令/API 列表项。
- 推荐参数：
  - `pre` 命令块：`radius={12}`，`smoothing={0.56}`。
  - 文档 `Card`：`radius={18}`，`smoothing={0.66}`。
  - 命令/API 列表项：`radius={14}`，`smoothing={0.6}`。
- 不处理 header 中的小图标方块和 package-manager tabs。

实现形态参考：

```tsx
<SmoothCorners asChild radius={12} smoothing={0.56}>
  <pre className="bg-muted/50 rounded-md p-4 pr-12 overflow-x-auto ...">
    ...
  </pre>
</SmoothCorners>
```

### 延后：首页预览内部 mock surface

文件：

- `components/home/home-component-previews.tsx`

当前状态：

- 文件内部有大量 `rounded-md`、`rounded-lg`、`rounded-xl`，用于构造各组件的轻量预览画面。
- 已经在 `SmoothCornersPreview` 中正式展示了平滑圆角组件。

适配结论：整体延后，少量可选。

原因：

- 这些内部元素多数是模拟应用界面、占位骨架、控件状态或具体组件展示的一部分。
- 批量替换会削弱每个组件预览的差异，尤其是 `DotGlass`、`Tour`、`ImageViewer`、`MarkdownRenderer` 这类本身就有独立视觉语言的展示。
- 若后续希望继续增强，只建议挑大型展示 frame，例如 `ScrollableDialogPreview` 或 `TourPreview` 的外层 mock app surface，并逐个做视觉 QA。

### 延后或不做：Header、Search、移动菜单和小控件

文件：

- `components/site/site-header.tsx`
- `components/site/site-search.tsx`
- `components/site/site-mobile-nav.tsx`
- `components/home/home-hero.tsx`
- `components/home/home-cta.tsx`

适配结论：暂不优先。

原因：

- Header nav item、搜索触发按钮、主题按钮、移动菜单按钮等都是小尺寸密集控件，圆角半径较小，平滑效果不明显。
- 按钮类控件依赖 focus ring、hover、active、`asChild` 链路，过早改动容易引入可访问性细节风险。
- `rounded-full` pill、badge、圆形 icon button 本身已经是明确几何语义，不应替换为 superellipse。

### 明确不动：基础 UI 组件和可分发组件本体

不动范围：

- `components/ui/**`
- `components/qiuye-ui/**` 的组件源码
- `components/qiuye-ui/demos/**` 的完整 demo 内部，除非后续有单独设计目标
- `public/registry/**`
- `lib/registry.ts`、`lib/component-constants.ts` 等组件注册元数据

原因：

- 用户明确要求不动 `/ui` 下组件代码。
- 本次是官网视觉增强，不是组件 API 或 registry 能力变更。
- 修改可分发组件本体会改变用户安装后的组件表现，超出本需求边界。

## 视觉参数规范

建议建立一套轻量参数，不新增全局 token：

| 场景 | radius | smoothing | observeSize | 说明 |
| --- | ---: | ---: | --- | --- |
| 首页组件墙主卡片 | 18-20 | 0.70-0.72 | false | 品牌展示重点，允许更明显 |
| 目录页组件卡片 | 18 | 0.66-0.68 | false | 重复列表，克制一些 |
| 详情页预览容器 | 20 | 0.70 | false | 展示内容外壳 |
| 详情页 sticky 信息面板 | 18 | 0.66-0.68 | false | 文档辅助面板 |
| CLI 命令代码块 | 12 | 0.54-0.58 | false | 小型内容面板，避免过软 |
| CLI 文档 Card | 18 | 0.66 | false | 与目录页一致 |

不建议为第一轮实现抽一个新的 `SmoothSurface` 组件。直接使用 `SmoothCorners` 能保持改动直观，避免过早抽象。若后续同一套参数在三个以上文件中重复，并且视觉验收稳定，再考虑增加站点级 preset 或小包装组件。

## 实现原则

1. 使用 `SmoothCorners` 组合现有页面结构，不修改 `components/ui/**`。
2. 优先用 `asChild` 应用到真实表面，避免额外 DOM 影响布局、sticky、Motion 和语义。
3. 对已有 `rounded-*` 的表面，保留 Tailwind 圆角作为 SSR/hydration 前回退是可以接受的，但不能再写 inline `borderRadius`。
4. 对非 `Card` 的普通 `div`，如果移除 `rounded-*`，要确认首屏不会出现未注入 CSS 前的圆角闪动；否则保留一个接近的 `rounded-*` 或 `rounded-[Npx]` class 作为粗回退。
5. `overflow-hidden` 必须和 `SmoothCorners` 在同一个真实表面上，特别是首页预览卡片和代码块。
6. 默认不启用 `observeSize`。只有当某个元素半径接近短边一半、尺寸持续动画变化，或视觉上出现圆角相撞时才单独开启。
7. 不把 `SmoothCorners` 应用到 `rounded-full`、圆形头像、圆形按钮、进度条填充、骨架线条等本身需要圆或胶囊语义的元素。
8. 不把平滑圆角作为 hover 状态动态切换，避免布局或边缘裁切抖动。

## 推荐落地顺序

### FE-1 首页组件墙

修改：

- `components/home/home-preview-card.tsx`

验收重点：

- 首页组件墙所有卡片边缘更柔和，但卡片高度、Motion 入场、hover 边框和内部裁切不变。
- `motion.article` 的动画、`className` 和 `style` 没有被 `asChild` 破坏。
- 移动端单列、桌面端四列布局无卡片跳动。

### FE-2 组件目录和详情页主表面

修改：

- `app/components/page.tsx`
- `app/components/[id]/page.tsx`

验收重点：

- 目录页卡片 hover shadow 和复制命令交互正常。
- 详情页快速预览、基本用法、侧栏 sticky 行为正常。
- `components/ui/card.tsx` 无修改。

### FE-3 CLI 页面文档表面

修改：

- `app/cli/page.tsx`

验收重点：

- 本地 `CodeBlock` helper 覆盖所有命令块，复制按钮定位不偏移。
- Tabs 切换动画不受平滑圆角 wrapper 影响。
- 长命令换行和横向滚动仍稳定。

### QA-1 验证

建议命令：

```text
npx -y pnpm@8.7.0 lint
npx -y pnpm@8.7.0 build
```

建议视觉检查：

- `/`
- `/components`
- `/components/smooth-corners`
- `/components/code-block`
- `/cli`

检查项目：

- 浅色和深色模式。
- 首页组件墙桌面、平板、移动端。
- 支持 `corner-shape` 的浏览器中是否有连续圆角。
- 不支持时是否保留普通 `border-radius` 回退。
- focus ring、hover、sticky、复制按钮定位没有被 wrapper 破坏。
- 控制台没有 ref、hydration 或 ResizeObserver 相关警告。

如果验证阶段启动 `pnpm dev` 或其他前端服务，结束前必须关闭该服务进程。

## 风险与规避

| 风险 | 影响 | 规避 |
| --- | --- | --- |
| `asChild` 与 Motion props 合并异常 | 首页卡片动画或 style 被覆盖 | 首页先单独实现和视觉验证，必要时改为 motion 外层 + SmoothCorners 内层 |
| `.smooth-corners` 与 Tailwind `rounded-*` 顺序冲突 | 平滑圆角没有生效 | 保持 `SmoothCorners` 自动注入 CSS，确认 computed style；普通 div 可移除冗余 rounded class |
| 首屏 hydration 前圆角闪动 | 首页短暂从普通圆角切换到平滑圆角 | 保留接近的 Tailwind rounded class 作为粗回退；如果仍明显，再考虑把基础 CSS 放入全局样式 |
| 过度应用到小控件 | UI 显得软、散，控件层次不清 | 第一轮只做大表面，不改按钮、badge、pill、nav item |
| 大量开启 `observeSize` | ResizeObserver 数量增加，影响性能 | 第一轮全部默认 `observeSize=false` |
| 改到 registry/demo 源码 | 影响用户安装后的组件表现 | 严格限制在官网页面和站点展示组件，不改 `components/qiuye-ui` 组件本体 |

## 本次文档结论

合理应用平滑圆角的最佳路径是“官网展示层优先、组件本体不动、页面主表面先行”。第一轮只需要覆盖首页组件墙、组件目录卡片和组件详情页主面板，就能让 SmoothCorners 成为 QiuYe UI 官网自身气质的一部分，同时保持实现边界清晰。CLI 页面和部分大型预览 frame 可以作为后续增强，不应一次性把项目里所有 `rounded-*` 都替换掉。
