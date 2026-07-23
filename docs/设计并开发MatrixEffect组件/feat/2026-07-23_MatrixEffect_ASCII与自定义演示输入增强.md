# MatrixEffect ASCII 与自定义演示输入增强

## 背景与现象

详情页“组件演示”中的 ASCII 与自定义场景都固定使用同一张静态星旋图片。ASCII 字符集输入框的初始值还是 Demo 自选的精细字符集，不等于组件默认字符集，页面也没有展示动态 Source、其他形状或用户图片输入能力。

## 设计缺口

- Demo 初始字符集和公共组件默认值不同，容易让使用者误判默认行为。
- `AsciiEffect` 与 `MatrixEffect` 已支持静态图片、外部 Canvas、程序化动态 Source 和 `File` 图片，但现有控件没有暴露这些能力。
- 星旋图同时出现在两个场景，无法直观证明 Renderer、Transform 与 Source 相互独立。
- 形状与字符集预设的归属没有在页面和文档中明确，存在把演示审美误加到公共 API 的风险。

## 增强后的预期行为

- ASCII 字符集输入框默认显示组件默认值 `" .:-=+*#%@"`。
- 提供组件默认、精细层次、块元素、圆点四套 Demo 级字符集预设；编辑输入后状态切换为自定义。
- ASCII 与自定义场景都可选择流动光团、呼吸圆环、流动波浪和静态星旋，并可上传本地图片。
- 三种程序化场景由 MatrixEffect 自身的动态 Source 调度，播放开关直接使用 `playing`；不额外创建 rAF 或定时器。
- 上传文件直接作为 `File` Source，页面不上传、不持久化，也不自行创建 object URL。
- 字符集和形状预设只属于 Demo，不改变 MatrixEffect 公共 API、Registry item 或安装产物。

## 影响文件与接口

- `components/qiuye-ui/demos/matrix-effect-demo.tsx`
- `components/qiuye-ui/demos/matrix-effect-demo-sources.ts`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件开发设计文档.md`
- `docs/设计并开发MatrixEffect组件/MatrixEffect组件执行计划.md`

不修改 `components/qiuye-ui/matrix-effect/*` 的公共实现和类型，不新增 npm 依赖。

## 实现摘要

- 新增 Demo 专用 `matrix-effect-demo-sources.ts`，用稳定模块级 Source 提供流动光团、呼吸圆环、流动波浪和静态星旋；三个动态场直接实现 `MatrixProceduralSource`，没有额外 rAF 或 React 逐帧状态。
- 抽取 ASCII 与自定义场景共用的输入源控件和状态 Hook；动态源显示播放开关，静态图片与上传图片自动禁用该开关。
- 本地文件通过隐藏的原生文件输入选择，只接受图片 MIME；状态保存原始 `File`，由 MatrixEffect 图片 Source adapter 负责 object URL 的创建与清理。
- ASCII 初始字符集改为组件默认值，并提供组件默认、精细层次、块元素和圆点预设；直接编辑输入框后预设状态变为自定义。
- ASCII 默认展示流动光团，自定义管线默认展示呼吸圆环；两个场景仍可切回原有静态星旋资源。

## 验证命令与结果

执行命令：

```text
pnpm --version
pnpm update-registry
pnpm update-registry:dry
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec prettier --check <DEMO-2 交付文件与文档>
pnpm build
curl -I http://127.0.0.1:3013/components/matrix-effect
curl -I http://127.0.0.1:3013/examples/matrix-effect/source.webp
git diff --check
```

结果：

- 当前 pnpm 为 `8.7.0`；Registry 正式同步与 dry-run 均扫描 14 个 item，0 个文件变化，证明 Demo 专用 Source 未进入安装产物。
- 全量 ESLint、TypeScript、定向 Prettier、`git diff --check` 和生产构建通过；Next 成功生成 21 个静态页面。
- 临时 3013 开发服务可访问详情页规范化重定向，示例图返回 `200 image/webp`；检查后已关闭服务，端口无监听。
- 应用内浏览器当前无法把新建标签页绑定到本任务会话，因而没有完成字符集切换、三种动态源像素变化、播放暂停、图片上传和 390px 布局的真实浏览器验收；执行计划保持 `进行中`，不得把这些项目记录为已通过。

## 后续建议

- 浏览器连接恢复后优先补齐桌面/390px 交互与 Canvas 像素断言，再把 DEMO-2 标记为已完成。
- 远程 URL、视频、摄像头和音频输入继续作为未来版本能力单独设计。
