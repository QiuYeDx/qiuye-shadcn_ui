# 修改现有组件详细清单

## 组件引入新的本地文件

检查所有 `import ... from "@/..."` 路径：

| 导入来源 | 是否加入 `files[]` |
|----------|-------------------|
| `@/components/ui/*` | 否（由 `registryDependencies` 管理） |
| `@/lib/utils` | 否（shadcn 基础设施） |
| `@/hooks/*`、`@/lib/*`（非 utils）、`@/components/qiuye-ui/*` 子文件 | **是** |

示例（`image-viewer` 引入了自定义 hooks）：

```json
{
  "files": [
    { "type": "registry:component", "path": "components/qiuye-ui/image-viewer.tsx" },
    { "type": "registry:hook", "path": "hooks/use-hover-support.ts" },
    { "type": "registry:hook", "path": "hooks/use-prevent-scroll.ts" }
  ]
}
```

type 建议：

- `registry:hook` — 自定义 hooks（`hooks/use-xxx.ts`）
- `registry:lib` — 工具函数、常量、类型定义（`lib/xxx.ts`）
- `registry:component` — 子组件文件（`components/qiuye-ui/<id>/*.tsx`）

## 新增/移除 npm 或 shadcn 依赖

**新增 npm 依赖**：

1. `pnpm add <pkg>`
2. 更新 `public/registry/<id>.json` 的 `"dependencies"`
3. 更新 `lib/registry.ts` 对应条目的 `dependencies`

**新增 shadcn 组件依赖**（如组件内新 import 了 `@/components/ui/badge`）：

- 更新 `public/registry/<id>.json` 的 `"registryDependencies"`

**移除依赖**：反向操作，从上述位置删除对应条目。

## 修改后必须执行

```bash
pnpm update-registry
```

触发条件（任一）：

- 修改了 `components/qiuye-ui/<id>.tsx`
- 修改了 `hooks/*`、`lib/*` 等被 `files[]` 引用的文件
- 修改了 `public/registry/<id>.json`（`files[]`、`dependencies` 等字段）

## 修改后验证

- **Registry 验证**：访问 `http://localhost:3000/registry/<id>.json`
  - `files[].content` 与源码一致
  - 依赖完整、无多余项
  - 所有本地 import 文件都在 `files[]` 中
- **站点验证**（改了 props/demo/元信息时）：`/components/<id>` 详情页正常
- **可选 CLI 验证**：`pnpm dlx shadcn@latest add @qiuye-ui/<id>`

## 提交前自检

- `pnpm lint`
- 关键页面无报错：`/components`、`/components/<id>`、`/cli`
