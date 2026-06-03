# Tour Popover 内容高度过渡修复

## 背景和现象

用户在录屏慢放中发现：Tour 的 Popover 在上一步/下一步切换时，如果新旧 `content` 行数不同，旧内容淡出完成后 Popover 高度会突变到新内容高度，然后再执行新内容淡入动画。

## 根因

内容区使用 `AnimatePresence mode="wait"`。该模式会等待旧内容完成退出，再挂载新内容。由于新内容挂载发生在两段动画之间，Popover 的自动高度会在这一帧被同步重算，导致高度突变。

## 修复后行为

- 内容区容器参与 Motion layout 动画。
- 内容切换改为 `AnimatePresence mode="popLayout"`。
- 旧内容淡出时被弹出布局，新内容立即进入布局，Popover 高度由 Motion 从旧高度平滑过渡到新高度。
- Header、内容区、Footer 均加入 `layout`，降低步骤切换时的局部跳动。

## 影响文件

- `components/qiuye-ui/tour.tsx`
- `public/registry/tour.json`

## 验证结果

执行命令：

```text
pnpm lint
pnpm build
pnpm update-registry
```

结果：

- `pnpm lint` 通过，无错误；仍有项目既有未使用 import warning。
- `pnpm build` 通过；仍有同一批既有 warning。
- `pnpm update-registry` 通过，`tour.json` content 已同步。
