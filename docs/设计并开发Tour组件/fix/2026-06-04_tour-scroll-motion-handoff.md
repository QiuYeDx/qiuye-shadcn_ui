# Tour 自动滚动与 Motion 位移交接优化

## 背景和现象

当 `scrollIntoView=true`，上一步或下一步切换到视口外目标时，浏览器会执行平滑滚动。原实现同时监听 `scroll` 并持续更新 spotlight 与 popover 的位置，而它们又使用 Motion layout spring 对位置变化进行补间。

滚动过程中目标位置每帧都在变化，spring 的目标值也会被每帧重定向，导致透明洞和 popover 出现追赶、滞后、回弹或位移不够连贯的问题。

## 根因

浏览器平滑滚动和 Motion layout spring 同时承担了同一段位移的插值：

- `scrollIntoView({ behavior: "smooth" })` 持续改变目标元素的 viewport rect。
- `scroll` 监听持续测量并更新 `spotlightRect`。
- Motion layout spring 持续尝试从旧位置动画到最新位置。

两套动画系统对同一位置连续改写，无法形成稳定的单次过渡。

### 首版方案暴露的问题

首版优化尝试在 `scrolling` 阶段直接把 spotlight 与 popover 外层的 layout transition 设为 `duration: 0`，让它们跟随新目标。

但步骤切换时新目标位置会被立即提交，外层容器因此瞬移；popover 内部仍参与各自的 layout 过渡，导致容器已经位于新位置，而标题、Content、Footer 暂时残留在旧位置。外层和内层使用了不同的视觉坐标系，形成明显的分离画面。

## 优化方案

新增内部滚动阶段：

- `idle`：页面稳定，spotlight 与 popover 使用正常 Motion layout spring。
- `scrolling`：浏览器正在自动滚动，屏幕上仍保持旧视觉步骤，并让完整视觉单元淡出。
- `settling`：滚动结束后一次性提交新视觉步骤、最终位置与内容，等待两帧后恢复 `idle` 并整组淡入。

进入步骤时先判断目标是否真的需要滚动：

- 目标需要完整位于浏览器安全视口范围内。
- 目标不能被 `overflow: auto | scroll | hidden | clip` 祖先裁切。
- 已经可见的目标不会调用 `scrollIntoView`，仍保留原本的 layoutId 迁移动画。

逻辑步骤与视觉步骤分离：

- `resolvedStepIndex` 代表已经请求切换到的逻辑步骤。
- `visualStepIndex` 代表当前真正渲染的步骤。
- 需要滚动时不立即更新 `visualStepIndex`，旧 spotlight、popover、标题、Content 与 Footer 会保持为一个完整视觉单元并淡出。
- 滚动稳定后才更新 `visualStepIndex`，新步骤以最终位置整组淡入。
- 滚动与 settling 阶段，整棵 popover layout transition 都使用瞬时 layout，避免父子 layout 投影分离。

滚动结束使用目标矩形稳定帧检测：

- 连续 3 帧位置与尺寸变化不超过 `0.5px`。
- 设置最短等待时间，避免滚动启动前误判。
- 设置无位移与最大等待兜底，处理无法继续滚动或浏览器行为异常的情况。
- `settling` 阶段忽略迟到的 scroll/resize 测量，避免旧目标最后一帧覆盖新目标最终位置。

## Demo 覆盖

完整 Tour demo 新增 Release timeline 场景：

- 顶部目标：Planning。
- 底部目标：Launch readiness。
- 两个目标位于固定高度的滚动容器两端。
- 从第一步切换到第二步会稳定触发 `scrollIntoView`，用于观察旧视觉步骤整组淡出、滚动、新视觉步骤整组淡入的效果。

## 影响文件

- `components/qiuye-ui/tour.tsx`
- `components/qiuye-ui/demos/tour-demo.tsx`
- `public/registry/tour.json`
- `docs/设计并开发Tour组件/Tour组件开发设计文档.md`
- `docs/设计并开发Tour组件/Tour组件执行计划.md`

## 验证结果

执行命令：

```text
pnpm lint
pnpm build
pnpm update-registry
pnpm update-registry:dry
```

结果：

- `pnpm lint` 通过，无错误；仍有项目既有的 10 个未使用 import warning。
- `pnpm build` 通过；仍显示同一批既有 warning。
- `pnpm update-registry` 通过，`tour.json` content 已同步。
- `pnpm update-registry:dry` 通过，实际将要更新数量为 0。
