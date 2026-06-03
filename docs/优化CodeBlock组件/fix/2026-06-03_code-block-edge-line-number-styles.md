# CodeBlock 边缘贴合与行号列样式修复

## 背景和现象

用户验收 CodeBlock 组件时发现三个视觉细节问题：

- 代码块顶部和右侧存在空白 padding，导致行高亮背景、行号列边框没有贴到代码区域边缘。
- 移除 `pre` padding 后，`CodeBlockPanel + diff` 场景里 diff 行左侧红色 / 绿色指示条被 sticky 行号背景盖住。
- 行号列固定宽度过大，且数字右侧 padding / margin 组合让行号看起来不居中；短行数时列宽显得浪费。

## 根因

- `pre` 自身承担了顶部和右侧 padding，但行高亮背景绘制在每个代码行元素上，因此行背景无法覆盖 `pre` padding 区域。
- diff / highlight 左侧指示条原先使用行元素的 `inset box-shadow` 绘制；行号 sticky 后具有独立背景，位于左侧并覆盖了指示条。
- 行号列使用固定 `3rem` 宽度，同时行号元素带 `padding-right` 和 `margin-right`，数字视觉中心偏离列中心。

## 修复后行为

- `pre` padding 清零，行级元素负责右侧留白，让行高亮背景、行号列边框和代码区域边缘贴合。
- diff / highlight 左侧 3px 指示条改为行元素 `::before` 绘制，`z-index` 高于 sticky 行号背景，保证在 `CodeBlockPanel` 内也可见。
- 行号列宽根据最大行号位数动态计算：
  - 1 位数行号约 `2rem`
  - 2 位数行号约 `2.45rem`
  - 100+ 行继续随位数增宽
- 行号元素改为 `inline-flex` 居中，去掉右侧 padding，并使用 `font-variant-numeric: tabular-nums` 提升多位数字对齐稳定性。
- 折叠模式高度计算同步移除旧的 `pre` 顶部 padding 偏移。

## 影响文件

- `components/qiuye-ui/code-block/code-block-root.tsx`
- `public/registry/code-block.json`

## 实现摘要

- 在 `CodeBlock` 内根据 `lineCount` 计算 `lineNumberDigits` 和 `--cb-ln-width` CSS 变量。
- 将行号列宽从固定值改为 `var(--cb-ln-width)`。
- 将 diff / highlight 指示条从 `box-shadow` 迁移到 `::before`。
- 保留行背景贴边效果，同时恢复 diff 指示条可见性。
- 运行 `pnpm update-registry` 同步 registry content。

## 验证结果

执行命令：

```text
pnpm update-registry
pnpm lint
pnpm build
```

结果：

- `pnpm update-registry` 通过，`public/registry/code-block.json` 已同步源码 content。
- `pnpm lint` 通过，无错误；仍有项目既有 unused-vars warnings。
- `pnpm build` 通过；仍有同一批既有 unused-vars warnings。

浏览器验证：

- `pre` computed padding 为 `0px`。
- `CodeBlockPanel + diff` 场景中，新增 / 删除行的 `::before` 指示条宽度为 `3px`，且 `z-index: 2` 高于行号背景 `z-index: 1`。
- 行号列动态宽度生效：1 位行号列为 `2rem`，2 位行号列为 `2.45rem`，行号 padding 为 `0` 且居中显示。

用户验收：

- 2026-06-03 用户确认验收通过，无剩余问题。

## 后续建议

- 若后续新增 CodeBlock 主题或布局模式，保留 `pre padding: 0`、行级背景贴边、行号列动态宽度和 `::before` 指示条这四个约束。
