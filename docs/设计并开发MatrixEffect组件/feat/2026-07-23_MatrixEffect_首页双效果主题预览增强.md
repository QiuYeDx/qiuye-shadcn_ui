# MatrixEffect 首页双效果主题预览增强

## 背景与现象

Matrix Effect 已完成组件目录、详情页和 Registry 接入，但首页组件墙尚未注册对应预览。首页用户无法直接看到圆点矩阵与 ASCII 两个核心效果，组件在首屏后的发现性不足。

## 设计结论

- 在首页组件墙前排新增 Matrix Effect `wide` 特色卡片，与 Dot Glass 同级尺寸。
- 卡片内同时显示圆点与 ASCII，桌面端左右并排，窄屏上下排列。
- 两个预设共享一个模块级稳定 `createSoftBlobSource()`，以相同的流动光团信号展示 Renderer 差异。
- 使用深浅两套配色：主题变更时同步切换两个 Canvas 的背景和前景色。
- 使用 mounted 状态避免 `resolvedTheme` 在 SSR 与首次水合时产生属性不一致。
- 首页预览固定 30 FPS、`maxDpr=1.5`、离屏暂停与有界网格，控制组件墙动态成本。

## 影响文件与接口

- `components/home/home-component-previews.tsx`
- `lib/home-component-preview-config.ts`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件执行计划.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件实施记录/2026-07-23_SITE-2_首页双效果预览增强.md`

公共组件 API、Registry item、npm 依赖和锁文件均不变化。

## 实现摘要

- 新增 `MatrixEffectPreview`，两个稳定尺寸面板分别渲染 `DotMatrixEffect` 和 `AsciiEffect`。
- 模块级 Source 使用 4 个光团、`speed=0.4` 和确定性 seed；两个预设同时受同一信号场驱动。
- 深浅主题分别使用 `#09090B` 和 `#F6F6F6` 背景，并为圆点和 ASCII 配置独立前景色。
- 首页配置把 Matrix Effect 放在第一个优先位，设为 `wide` 和 `featured`。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm exec eslint components/home/home-component-previews.tsx lib/home-component-preview-config.ts
pnpm exec tsc --noEmit --pretty false
pnpm lint
pnpm build
pnpm exec prettier --check <本次交付文件>
git diff --check
```

结果：

- pnpm 版本为 `8.7.0`；Registry 正式同步与 dry-run 均为 14 个 item、0 个待更新文件。
- 定向与全量 ESLint、TypeScript 和生产构建通过；Next 成功生成 21 个静态页面。
- 1280px 浏览器中 Matrix Effect 为第一张卡片，与 Dot Glass 均为 `600 x 426` CSS px；内部两个 Canvas 均为 `275 x 228` CSS px。
- `1440 x 900` 视口下 Matrix Effect 为 `675.7 x 423.3` CSS px，与同排 Dot Glass 的 `672.8 x 421.5` CSS px 保持同级宽卡尺寸；内部两个 Canvas 均约为 `313 x 226.6` CSS px。
- 圆点与 ASCII 的间隔帧截图 SHA-256 哈希均变化，确认两个效果持续流动且均非空白。
- 浅色主题两个面板背景为 `rgb(246, 246, 246)`，深色主题为 `rgb(9, 9, 11)`，两种主题下字符和圆点均清晰可辨。
- `390 x 844` 视口下卡片为 `358 x 572.5` CSS px，两个 Canvas 均为 `322 x 180.25` CSS px，上下排列且无重叠；页面 `scrollWidth=clientWidth=390`。
- 浏览器控制台无 warning/error；临时浏览器标签、视口覆盖和 3015 开发服务均已清理。

## 后续建议

- 如首页未来继续增加 Canvas/WebGL 动态预览，应统一评估组件墙可见动画数量和帧预算，而不是单独提高本预览帧率。
