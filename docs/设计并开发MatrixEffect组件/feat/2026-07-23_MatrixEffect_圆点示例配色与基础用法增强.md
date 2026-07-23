# MatrixEffect 圆点示例配色与基础用法增强

## 背景与现象

人工验收发现，详情页的圆点示例都使用固定黑底白点，虽然 `DotMatrixEffect` 已支持 `color` 与 `backgroundColor`，但页面没有提供可交互的颜色入口，也没有直观展示其他配色组合。“使用组件”区域只有 `<DotMatrixEffect className="aspect-video w-full" />`，无法帮助使用者理解响应式网格、圆点映射、内置动态 Source、性能策略和可访问性等核心 API。

## 设计缺口

- 公共能力已存在，但完整 Demo 没有暴露圆点色和背景色控制。
- 快速预览与完整 Demo 的初始效果相近，不能直接证明浅色背景等组合可用。
- 基础用法代码只依赖全部默认值，缺少能迁移到真实页面的配置范例。

## 增强后的预期行为

- 完整圆点 Demo 提供“墨夜”“雾灰”“海盐”“珊瑚”四组配色预设。
- 圆点颜色与背景颜色可分别通过取色器继续自定义；自定义后预设状态明确显示为“自定义”。
- Canvas 外层占位背景与当前背景颜色同步，避免首帧绘制前出现错误底色。
- 快速预览默认使用 `#F6F6F6` 背景和 `#9C9C9C` 圆点，和完整 Demo 的深色初始组合形成对照。
- 基础用法示例展示 `color`、`backgroundColor`、`grid`、`radiusRange`、`blobOptions`、`levels`、帧率、DPR、离屏暂停和非装饰 Canvas 的可访问性配置。

## 影响文件与接口

- `components/qiuye-ui/demos/matrix-effect-demo.tsx`
- `app/components/[id]/simple-demos.tsx`
- `lib/component-constants.ts`

不改变 MatrixEffect 公共 API、类型或 Registry 分发文件；只增强站点 Demo 与基础用法内容。

## 实现摘要

- 完整 Demo 复用现有 `ColorPicker`，未新增 npm 依赖或新的颜色输入实现。
- 配色组合使用 Select 选项并同时展示背景与圆点色样；两个独立取色器使用同一组精简候选色。
- 快速预览改用验收提出的浅灰组合，保留此前确认的 `cellSize=10`、最大半径 `3` 和速度 `0.4`。
- 基础用法升级为可直接复制的完整 Dot 预设配置，同时保留自适应 FPS、DPR 上限和离屏暂停策略。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec prettier --check <本次三个源码文件与 feat 文档>
pnpm build
git diff --check
```

结果：

- 当前 pnpm 为 `8.7.0`；Registry 正式同步与 dry-run 均扫描 14 个 item，报告 0 个文件需要更新。
- 全量 ESLint、TypeScript、定向 Prettier 和生产构建通过；Next 成功生成 21 个静态页面。
- 真实浏览器在 1440 x 1000 下确认浅灰快速预览正常，21 行基础用法完整呈现；“雾灰”预设会同步得到 `#9C9C9C / #F6F6F6`，单独把圆点改为 `#E11D48` 后预设状态切换为“自定义”。
- 390 x 844 下页面 `scrollWidth=clientWidth=390`，快速预览与完整 Demo Canvas 分别为 `324 x 242.5`、`322 x 241` CSS px；配色菜单边界为 `left=33, right=359`，取色器边界为 `left=140, right=390`，均未越出视口。
- 浏览器控制台无 warning/error；临时浏览器标签、视口覆盖和 3012 开发服务均已清理。
- `package.json` 与 `pnpm-lock.yaml` 无变化；公共组件与 Registry item 内容无变化。

## 后续建议

- 后续可在 ASCII 场景增加固定色模式下的颜色控制，但不与本次圆点场景需求绑定。
- 若配色预设需要成为公共能力，应另行设计预设数据契约；当前预设只属于站点 Demo。
