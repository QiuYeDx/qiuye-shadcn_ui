# Tour 组件执行计划

创建日期：2026-06-03

## 使用方式

每次继续开发 Tour 前，先阅读：

- `docs/设计并开发Tour组件/Tour组件开发设计文档.md`
- `docs/设计并开发Tour组件/Tour组件执行计划.md`

实现时优先保持设计文档中的 API、Motion `layoutId` 动画、遮罩聚焦、popover 定位、registry 接入约束一致；若实现证明设计需要调整，先同步更新设计文档。

## 状态规则

- `未开始`：尚未动工。
- `进行中`：已有改动但未完成验证。
- `已完成`：实现与验证均已完成。
- `阻塞`：缺少外部信息或环境不可用。
- `废弃`：不再实施。

## 进度台账

| 工作包 | 状态 | 完成日期 | 关键文件 | 验证 | 实施记录 | 未决事项 |
| --- | --- | --- | --- | --- | --- | --- |
| FE-1 主组件实现 | 已完成 | 2026-06-03 | `components/qiuye-ui/tour.tsx` | `pnpm lint`, `pnpm build` | `docs/设计并开发Tour组件/Tour组件实施记录/2026-06-03_FE-1-REG-1_Tour组件完整实现.md` | 无 |
| FE-2 Demo 与详情页预览 | 已完成 | 2026-06-03 | `components/qiuye-ui/demos/tour-demo.tsx`, `app/components/[id]/simple-demos.tsx` | `pnpm lint`, `pnpm build` | `docs/设计并开发Tour组件/Tour组件实施记录/2026-06-03_FE-1-REG-1_Tour组件完整实现.md` | 无 |
| REG-1 Registry 与站点接入 | 已完成 | 2026-06-03 | `lib/component-constants.ts`, `lib/registry.ts`, `app/components/[id]/page.tsx`, `app/cli/page.tsx`, `public/registry/tour.json`, `public/registry/registry.json` | `pnpm update-registry`, `pnpm update-registry:dry` | `docs/设计并开发Tour组件/Tour组件实施记录/2026-06-03_FE-1-REG-1_Tour组件完整实现.md` | 无 |
| QA-1 本地验证 | 已完成 | 2026-06-03 | - | `pnpm lint`, `pnpm build`, `pnpm update-registry:dry` | `docs/设计并开发Tour组件/Tour组件实施记录/2026-06-03_FE-1-REG-1_Tour组件完整实现.md` | `pnpm lint` / `pnpm build` 仍显示项目既有未使用 import warning，无新增错误 |
| FIX-1 Popover 高度切换突变修复 | 已完成 | 2026-06-03 | `components/qiuye-ui/tour.tsx`, `public/registry/tour.json` | `pnpm lint`, `pnpm build`, `pnpm update-registry` | `docs/设计并开发Tour组件/fix/2026-06-03_tour_popover-height-transition.md` | 无 |

## 工程约束

- 主组件必须添加 `"use client"`。
- 导出的类型、props 与组件函数必须使用中文 JSDoc。
- 动画必须使用 `motion` / `motion/react`，spotlight 与 popover 都要有 `layoutId` 共享布局过渡。
- 组件源码依赖 `@/hooks/*` 时，对应 hook 必须加入 registry item 的 `files`。
- `public/registry/registry.json` 只能由 `pnpm update-registry` 生成，不能手改。
- 不更改已有组件导出名、文件名和无关组件行为。

## 实施记录模板

```markdown
# 工作包 <ID>：<标题>

## 基本信息

- 日期：
- 状态：
- 对应执行计划工作包：

## 本次实现内容

-

## 修改文件

-

## 接口或数据结构变化

-

## 验证结果

执行命令：

```text

```

结果：

-

## 未完成事项

-

## 下一步建议

-
```
