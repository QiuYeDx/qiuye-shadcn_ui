# MatrixEffect 设计文档与执行计划 Review 记录（临时）

- Review 日期：2026-07-22
- Review 对象：
  - `MatrixEffect组件开发设计文档.md`
  - `MatrixEffect组件执行计划.md`
- 性质：临时 Review 记录。问题处理完毕（更新设计文档/执行计划）后本文件可删除。

## 总体结论

两份文档整体质量高、可执行性强：管线分层（Source -> Mapper -> Transform -> Renderer）清晰，性能预算、错误处理、资源所有权、Reduced Motion 等边界都有明确约定；执行计划的工作包拆分、依赖顺序和台账规则符合项目既有惯例（与 SmoothCorners / Tour 文档结构一致）。

发现的问题主要是**API 契约层面的少量空白**和**个别验收条件的可验证性**，没有方向性错误。建议按下文 P1 项先补充设计文档，再启动 CORE-1。

## 已逐条验证无误的关键事实

以下文档中的仓库事实断言均已对照实际代码验证，无需修改：

| 文档断言 | 验证结果 |
| --- | --- |
| `pnpm-lock.yaml` 为 lockfileVersion 6.0，需显式使用 pnpm 8.x | ✅ 属实 |
| PRE-0 完成证据 commit `5e5a598` 与远端分支 `origin/codex/matrix-effect-design` | ✅ 均存在 |
| `app/cli/page.tsx` 数据来自 `getAllComponents()`，无需手改组件 ID 数组 | ✅ 属实（第 340 行）。注意 authoring skill 的 Step 5 描述已过时，设计文档的判断是对的 |
| 详情页导入名由 `component.name` 去空格推导（`Matrix Effect` -> `MatrixEffect`），导入路径 `@/components/qiuye-ui/<cliName>` | ✅ 属实（`app/components/[id]/page.tsx` 第 144、176 行）；`matrix-effect` 目录 + `index.ts` 可正常解析 |
| `scripts/update-registry.mjs` 回填 `files[].content`、生成 `registry.json`、递归扫描 | ✅ 属实 |
| 多文件 registry item 有 `code-block.json` 先例；Demo 不进入 item `files[]` | ✅ 属实 |
| MCP fallback `DEFAULT_COMPONENT_NAMES` 位于 `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs` | ✅ 属实（第 14 行） |
| 项目根目录组件清单文件为 `AGENT.md`（非 AGENTS.md） | ✅ 属实 |
| `rows = round(columns * cellAspectRatio * canvasHeight / canvasWidth)` 公式 | ✅ 数学自洽（与 cellHeight = cellSize / cellAspectRatio 一致） |
| `lib/registry.ts` 的 `ComponentInfo` 支持 `propsInfo` / `files.types` / `version` / `cliName` | ✅ 属实 |
| `React.HTMLAttributes` 含 `children` 与 `onError`，`Omit` 列表必要且正确 | ✅ 属实 |

## 发现的问题

### P1：建议在启动 CORE-1 前补充设计文档

#### P1-1 `MatrixEffectHandle` 的暴露方式未定义

设计文档定义了 `MatrixEffectHandle`（含 `canvas` 与 `invalidate()`），并在「颜色与主题行为」等多处引用 `ref.current.invalidate()`，但**没有写明 handle 如何暴露**：

- 是 React 19 的 ref-as-prop（`ref?: React.Ref<MatrixEffectHandle>`）还是 `forwardRef + useImperativeHandle`？
- `MatrixEffectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, ...>` 中未包含 ref 类型说明，实现者可能把 ref 理解为指向根 div。
- `DotMatrixEffect` / `AsciiEffect` 预设是否转发该 handle？（主题切换后 `invalidate()` 的典型用例恰恰发生在预设上。）

建议：在「MatrixEffect 核心 API」一节明确 ref 的类型与暴露机制，并声明两个预设组件同样转发 `MatrixEffectHandle`。

#### P1-2 「函数回调身份变化使管线失效」的范围过宽

设计文档写道：「Source、Renderer 或函数回调身份变化会使管线失效并重建必要缓存」。若「函数回调」包含 `onStatusChange` / `onReady` / `onError`，则调用方传内联箭头函数（极常见）会导致每次 React render 都重置动画与缓存——这与「风险与应对」中「内部缩小失效范围」的目标相矛盾。

建议：明确区分两类函数：

- **管线函数**（`source.draw`、`mapper`、`transforms[]`、`renderer`、canvas supplier）：身份变化触发管线失效，文档要求 `useMemo` / `useCallback`。
- **事件回调**（`onStatusChange` / `onReady` / `onError`）：内部存入 ref，身份变化**不**触发任何重建。

#### P1-3 预设组件的 `grid` 默认值合并语义未定义

`AsciiEffect` 默认 `maxCells 6000 / cellAspectRatio 0.6`，但当用户向预设显式传入 `grid`（例如只传 `{ mode: "fixed", columns: 100 }`）时：

- `maxCells` 取 6000 还是核心默认 10000？
- `cellAspectRatio` 按优先级规则会走 renderer 提示（0.6），但 `maxCells` 没有对应的「renderer 提示」机制。

建议：明确预设的 grid 处理规则，例如「预设对用户传入的 grid 做浅合并，未指定的 `maxCells` / `cellAspectRatio` 填充预设默认值」，并在 FX-1 / FX-2 完成条件中补一条对应验证。

#### P1-4 `createLuminanceMapper(options?)` 的 options 形状未定义

「内置转换器」一节的签名列表写了 `createLuminanceMapper(options?)`，但全文没有定义 options 有哪些字段。CORE-1 实现时会直接遇到该空白。

建议：要么删除 `options?`（首版无参数），要么定义清楚（例如自定义权重、是否预乘 alpha 等）。

### P2：建议补充，不阻塞开工

#### P2-1 `prefers-reduced-motion` 运行时变化是否监听未明确

设计文档与 FE-2 只约定了根据媒体查询冻结/正常，未写明是否监听 `matchMedia` 的 `change` 事件（用户在系统设置中切换后是否即时生效）。建议明确为「监听 change 并即时切换冻结/恢复，监听器纳入统一清理清单」，并加入 FE-2 范围。

#### P2-2 `invalidate()` 在暂停/隐藏/离屏状态下的行为未定义

「请求重绘一帧」在组件当前因页面隐藏或离屏而暂停时应如何表现（立即绘制、标记 dirty 待恢复后绘制、还是忽略）？主题切换 + 组件恰好离屏是真实场景。建议定义确定语义，例如：「标记 dirty；若组件可见则调度一次 rAF 绘制，否则在恢复可见后的首帧绘制」。

#### P2-3 `createCellRenderer` 的逐格对象分配约束应写死

设计将「避免逐格长期对象」列为热路径规则，而 `MatrixRenderCell` 天然是逐格数据。虽然已声明这是便利 API 非最高性能 API，仍建议明确实现要求：**适配器内部复用单个可变 scratch cell 对象（每格覆写字段），禁止每格新建对象**，避免便利 API 在动态源下制造无谓 GC 压力。

#### P2-4 QA-2「60 稳定降到 30」缺少可复现的施压方法

QA-2 完成条件要求「压力下能从 60 稳定降到 30，不在 30/60 之间快速抖动」，但未指定施压手段，验证者可能无法确定性复现。建议在 QA-2 范围中写明方法与判定标准，例如：Chrome DevTools CPU throttling 4x/6x + 提高 `maxCells` 的压力配置 + 观察降级后 N 秒内不回升。

#### P2-5 预设 API 轻微不对称（可接受，建议确认是有意为之）

`AsciiEffect` 隐藏 `clearColor` 并以 `backgroundColor` 代替；`DotMatrixEffect` 则直接暴露 `clearColor`。语义上可辩护（ASCII 常需背景色），但两个预设的「背景/清屏」入口命名不一致，可能让用户困惑。若为有意设计，建议在设计文档中加一句说明理由；否则统一命名。

### P3：信息类（与本需求无直接冲突）

#### P3-1 执行计划文件本身尚未提交

`git status` 显示 `MatrixEffect组件执行计划.md` 目前是未跟踪文件。台账 PRE-0 的完成证据仅覆盖设计文档 commit。若下一个会话从远端分支重新拉起，执行计划将缺失。建议尽快将执行计划（及本 Review 处理结果）提交到 `codex/matrix-effect-design` 分支。

#### P3-2 仓库既有问题：code-block 的 `files.component` 路径失真

`lib/registry.ts` 中 code-block 条目的 `files.component` 指向 `components/qiuye-ui/code-block/code-block.tsx`，该文件实际不存在（真实入口为 `code-block-root.tsx` / `index.ts`）。这说明该字段当前疑似仅作展示用途。Matrix Effect 设计选择指向 `index.ts`（真实存在）是正确的；code-block 的路径失真属于既有问题，可另行修复，不在本需求范围内。

#### P3-3 authoring skill 的 Step 5 描述已过时

`.agents/skills/qiuye-ui-component-authoring/SKILL.md` 的 Step 5 仍写「编辑 `app/cli/page.tsx` 的可用组件列表数组」，但该页面已改为 `getAllComponents()` 动态获取。设计文档已正确识别这一点。建议后续单独更新该 skill 文档，避免误导未来的实现会话。

## 建议的处理顺序

1. 将 P1-1 ~ P1-4 补充进设计文档（均为小幅增量，不改变架构结论）。
2. 将 P2-1、P2-2 并入 FE-2 范围，P2-3 并入 FX-1（`createCellRenderer` 所在工作包），P2-4 并入 QA-2 范围，同步更新执行计划对应工作包的范围/完成条件。
3. 确认 P2-5 是否有意为之，并在设计文档注明。
4. 提交执行计划与更新后的文档（P3-1）。
5. P3-2 / P3-3 不阻塞本需求，可各自建独立的小任务处理。

以上处理完成后，即可按执行计划启动 `CORE-1`。
