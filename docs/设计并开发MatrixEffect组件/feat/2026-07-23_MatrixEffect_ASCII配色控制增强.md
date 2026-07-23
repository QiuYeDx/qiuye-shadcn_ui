# MatrixEffect ASCII 配色控制增强

## 背景与现象

`AsciiEffect` 公共 API 已支持 `colorMode`、`color` 和 `backgroundColor`，但详情页 ASCII 演示只开放固定色/源图色切换，字符色与背景色仍硬编码在 Demo 中。使用者无法在页面上直接验证白底深色字符、终端色等常见组合，也看不到两项颜色 Props 的实际效果。

## 设计结论

- 只增强站点 Demo，不修改 `AsciiEffect`、Renderer、公共类型或 Registry 安装产物。
- 增加源色夜幕、荧光终端、琥珀终端、雾灰和蓝图五套 Demo 级配色预设；配色预设不进入公共组件枚举。
- 增加字符颜色和背景颜色两个 `ColorPicker`，允许用户在预设基础上继续编辑。
- 选择固定色预设时自动进入固定色模式；选择源色夜幕时自动进入源图色模式。
- 源图色模式下禁用字符颜色取色器，因为实际字符 RGB 来自输入 Source；保留当前字符色值，切回固定色后继续使用。
- 任一颜色或模式偏离预设时，预设选择器显示“自定义”。

## 影响文件与接口

- `components/qiuye-ui/demos/matrix-effect-demo.tsx`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件执行计划.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件实施记录/2026-07-23_DEMO-2_ASCII与自定义演示输入增强.md`

公共组件 API、`public/registry/matrix-effect.json`、依赖和锁文件均不变化。

## 实现摘要

- 在 ASCII Demo 内新增配色预设元数据、取色器色板和 `@` 字符预览色块。
- 以受控状态保存 `colorMode`、`characterColor` 和 `backgroundColor`，原样传给 `AsciiEffect`。
- 复用已有 `ColorPicker`；背景色同时应用到预览容器和 Canvas 清屏，避免加载/切换期间出现不一致底色。

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

- 在 pnpm `8.7.0` 下通过 Registry 正式同步与 dry-run，14 个 item 均无待同步变化。
- 通过全量 ESLint、TypeScript、定向 Prettier、`git diff --check` 和生产构建；Next 成功生成 21 个静态页面。
- 真实浏览器确认 5 套配色预设可同步切换颜色模式、字符色和背景色；独立改色后预设状态正确变为“自定义”。
- 源图色模式下字符颜色按钮禁用但保留 `#2563EB`，切回固定色后恢复可编辑且颜色值不丢失。
- 背景色改为 `#09090B` 后，控件值、预览容器与 Canvas 清屏背景保持一致。
- `390 x 844` 视口下 Canvas 为 `322 x 241` CSS px，两个颜色控件各占一列且无重叠，页面 `scrollWidth=clientWidth=390`。
- ASCII 配色交互未产生新的 warning/error。Next 开发工具显示的 1 条 issue 为既有 `CodeBlock` 明暗主题 SSR 水合属性不一致，不在本次 ASCII Demo 变更范围内。

## 后续建议

- 如未来增加按亮度分段的字符调色板，应设计独立 Renderer 能力，不能把 Demo 配色预设扩充成隐式公共契约。
