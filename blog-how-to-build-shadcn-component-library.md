# 基于 Next.js 15 + shadcn/ui：打造可 CLI 安装的自定义组件库（QiuYe UI 实战）

> 面向 shadcn/ui Registry 机制的实战：静态部署、脚本回填、npx 一键安装、组件浏览器

## 前言：这篇文章解决什么问题？

shadcn/ui 的核心理念是“把组件源码拷进你的项目里”，而不是发布成一个黑盒 npm 包。问题随之而来：

- 你写了一些 **自定义 shadcn 风格组件**，想在多个项目里复用
- 你希望复用方式也像 shadcn/ui 一样优雅：一句命令即可安装、自动补齐依赖、文件落在你指定的目录结构中

本文基于实际项目 **QiuYe UI（秋夜组件库）** 的完整实现，讲清楚如何做一个“像 shadcn/ui 一样可安装”的组件库生态：**组件源码 + Registry JSON + 静态部署 + 一键 CLI 安装 + 在线组件浏览器**。

## TL;DR（先给结论）

你不需要发布 npm 包，也不需要自己写 CLI。

只要做到这 4 件事，就能让别人通过 `npx shadcn@latest add ...` 安装你的组件：

1. **把组件源码放在仓库里**（例如 `components/qiuye-ui/*.tsx`）
2. **为每个组件提供一个 registry JSON**（例如 `public/registry/typing-text.json`）
3. **把组件源码写进 registry JSON 的 `files[].content` 字段**（本仓库用脚本自动回填）
4. **把整个站点部署成静态站点**，让 `https://你的域名/registry/<name>.json` 可访问

shadcn CLI 的工作就是：下载这个 JSON → 按 `target` 写文件到用户项目 → 安装依赖。

## 在线示例（本项目）

- 组件浏览：[`/components`](https://qiuye-ui.vercel.app/components)
- CLI 使用指南：[`/cli`](https://qiuye-ui.vercel.app/cli)
- Registry 示例：[`/registry/typing-text.json`](https://qiuye-ui.vercel.app/registry/typing-text.json)

> 中国大陆如果访问 `vercel.app` 不稳定，可用镜像域名 `https://ui.qiuyedx.com`（同路径）。

## 项目结构（以本仓库为例）

```text
qiuye-ui-components/
├── app/
│   ├── components/                 # 组件浏览页
│   │   └── [id]/                   # 组件详情页（静态生成）
│   ├── cli/                        # CLI 使用指南页
│   ├── layout.tsx                  # 布局（Sidebar + Header + ThemeProvider）
│   └── page.tsx                    # 首页
├── components/
│   ├── qiuye-ui/                   # 自定义组件源码（被写入 registry 的来源）
│   │   ├── animated-button.tsx
│   │   ├── gradient-card.tsx
│   │   ├── responsive-tabs.tsx
│   │   ├── scrollable-dialog.tsx
│   │   ├── typing-text.tsx
│   │   └── demos/                  # 组件演示（用于站点展示）
│   └── ui/                         # shadcn/ui 基础组件（button/tabs/dialog...）
├── lib/
│   ├── component-constants.ts       # 组件 id 与基础用法示例
│   └── registry.ts                 # 组件元数据（仅供站点使用）
├── public/
│   └── registry/                   # 组件 registry（核心：给 shadcn CLI 用）
│       ├── animated-button.json
│       ├── gradient-card.json
│       ├── responsive-tabs.json
│       ├── scrollable-dialog.json
│       └── typing-text.json
└── scripts/
    └── update-registry.mjs          # 自动回填 files[].content
```

要特别强调：**shadcn CLI 只关心 `public/registry/*.json`**，组件浏览器、文档站点是“锦上添花”，但对推广/自用体验非常加分。

## 关键易错点（建议先看）

### 1) `dependencies` vs `registryDependencies` 别填反

- `dependencies`：npm 包依赖，例如 `motion`、`lucide-react`、`clsx`
- `registryDependencies`：shadcn/ui 的组件依赖，例如 `button`、`tabs`、`dialog`

举例：本仓库的 `responsive-tabs` 会 import `@/components/ui/tabs`、`@/components/ui/badge`、`@/components/ui/button`，因此它的 registry 是：

- `dependencies`: `["react","lucide-react","motion"]`
- `registryDependencies`: `["tabs","badge","button"]`

### 2) `files[].path` / `files[].target` 是最容易写错的两行

- `path`：**你组件库仓库里**的真实路径，例如 `components/qiuye-ui/typing-text.tsx`
- `target`：安装到用户项目的落地路径，例如 `src/components/qiuye-ui/typing-text.tsx`

这两个字段写错，CLI 会报错或生成到奇怪的位置。

### 3) `target` 里的 `src/` 是否要加？取决于你的“用户画像”

本仓库选择把文件安装到 `src/components/...`，适配 **shadcn init 选择了 srcDir 的项目**。

如果你的用户项目普遍没有 `src/`，你有两种选择：

- **方案 A（推荐）**：把 registry 的 `target` 改成 `components/qiuye-ui/...`
- **方案 B**：提供两套 registry（例如 `xxx.json` 和 `xxx-root.json`），在文档里告诉用户怎么选

### 4) 组件里只要用了 hooks / 事件 / 状态，就要写 `"use client"`

很多自定义组件（动画、交互类）都需要 client component。你可以像本仓库一样，让源码文件自带 `"use client"`，脚本会原样回填到 registry。

### 5) 想做“纯静态部署”，Next.js 需要 `output: "export"`

本仓库的 `next.config.ts` 采用静态导出（`out/` 目录可直接丢到任何静态托管）：

```ts
// next.config.ts（节选）
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
```

同时，像 `app/components/[id]` 这种动态路由必须提供 `generateStaticParams()`，否则 `next export` 无法生成页面。

## 核心机制：shadcn Registry 到底是什么？

shadcn CLI 支持的 registry item schema 见：

- `https://ui.shadcn.com/schema/registry-item.json`

你可以把它理解为“一份可远程下载的组件安装说明书”，关键字段包括：

- `name`：组件的唯一标识（CLI 安装时用）
- `dependencies`：需要安装的 npm 包
- `registryDependencies`：需要安装的 shadcn/ui 组件
- `files`：要写入用户项目的文件列表
  - `path`：组件库仓库里的文件路径（给维护脚本用）
  - `target`：写入到用户项目的目标路径（给 CLI 用）
  - `content`：文件内容（源码字符串）

CLI 流程（简化）：

1. 拉取 `https://你的域名/registry/<name>.json`
2. 解析 `files[].content` → 写入 `files[].target`
3. 根据 `dependencies` 安装 npm 包
4. 根据 `registryDependencies` 安装 shadcn/ui 基础组件

## Step 0：初始化一个 Next.js 15 + shadcn/ui 项目（一次性）

如果你想从 0 开始复刻本仓库的技术路线，可以按以下步骤初始化（你也可以用 npm/yarn，命令里的 `pnpm` 仅代表我的选择）。

### 0.1 创建 Next.js 项目

```bash
pnpm create next-app@latest qiuye-ui-components --typescript --tailwind --app
cd qiuye-ui-components
```

### 0.2 初始化 shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

建议选择与本仓库一致的偏好（便于减少路径差异带来的坑）：

- `style`: `new-york`
- `tsx`: `true`
- `rsc`: `true`
- aliases：保持 `@/components`、`@/lib/utils` 等默认约定

### 0.3 安装自定义组件会用到的 npm 依赖（按需）

你的 registry 里 `dependencies` 写了什么，用户安装时就会装什么；但**组件库仓库本身**也需要安装这些依赖来开发/预览。

例如本仓库的组件涉及动画与图标：

```bash
pnpm add motion lucide-react
pnpm add class-variance-authority clsx
```

> 小提示：本仓库使用的是 Motion（包名 `motion`），组件里 import 走 `motion/react`，不是 `framer-motion`。

## Step 1：编写自定义组件（components/qiuye-ui）

以 `TypingText` 为例：

- 源码位置：[`components/qiuye-ui/typing-text.tsx`](./components/qiuye-ui/typing-text.tsx)
- 对应 registry：[`public/registry/typing-text.json`](./public/registry/typing-text.json)

建议保持与 shadcn/ui 一致的开发习惯：

- `React.forwardRef` + `displayName`
- props 继承原生属性（如 `React.HTMLAttributes`）
- 支持 `className` 并统一使用 `cn()`（见 [`lib/utils.ts`](./lib/utils.ts)）

## Step 2：编写 registry JSON（public/registry）

### 2.1 先写一个“骨架文件”（content 留空）

例如新建 `public/registry/my-component.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "title": "MyComponent",
  "type": "registry:component",
  "author": "YourName <you@example.com>",
  "dependencies": ["react"],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/my-component.tsx",
      "target": "src/components/qiuye-ui/my-component.tsx",
      "content": ""
    }
  ]
}
```

### 2.2 再看一个“真实可用”的示例（本仓库）

你可以直接对照本仓库的 registry：

- `typing-text`：[`public/registry/typing-text.json`](./public/registry/typing-text.json)
- `responsive-tabs`：[`public/registry/responsive-tabs.json`](./public/registry/responsive-tabs.json)

注意点：

- `responsive-tabs` 同时声明了 `dependencies`（npm 包）与 `registryDependencies`（shadcn 组件），这是很多人第一次写 registry 时最容易漏的地方。

## Step 3：用脚本自动回填 `files[].content`

手写 `content` 基本等于“自找麻烦”：不仅要转义换行与引号，还要保证与源码同步。

本仓库提供脚本：[`scripts/update-registry.mjs`](./scripts/update-registry.mjs)，会递归扫描 registry 目录，把 `files[].path` 指向的源码读出来，写回到 `files[].content`。

### 3.1 package.json 脚本

本仓库已在 `package.json` 配好：

```json
{
  "scripts": {
    "update-registry": "node scripts/update-registry.mjs --dir public/registry --base .",
    "update-registry:dry": "node scripts/update-registry.mjs --dir public/registry --base . --dry"
  }
}
```

### 3.2 使用方式

```bash
# 真正写入 content
pnpm run update-registry

# 仅预览变更（不会写文件）
pnpm run update-registry:dry
```

脚本做了几件“为维护体验加分”的事：

- 支持 `--dir` / `--base` / `--dry`
- 对 registry JSON 做结构校验（不是 registry item 会跳过并提示）
- 对 `path` 做多候选尝试（例如 `src/` 前缀、`./` 前缀），降低迁移/重构时的痛点

## Step 4：让用户可以用 `@qiuye-ui/xxx` 安装

### 4.1 方式一：用户项目配置 registries（推荐）

让用户在自己的 `components.json` 里加一段：

```json
{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}
```

中国大陆如果访问 `vercel.app` 不稳定，可替换为镜像域名：

```json
{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}
```

然后就可以：

```bash
npx shadcn@latest add @qiuye-ui/typing-text
# 或
pnpm dlx shadcn@latest add @qiuye-ui/typing-text
```

本仓库本地开发时，`components.json` 默认指向：

```json
{
  "registries": {
    "@qiuye-ui": "http://localhost:3000/registry/{name}.json"
  }
}
```

### 4.2 方式二：直接用 URL 安装（不需要 registries）

```bash
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/typing-text.json
```

适合临时试用或不想改 `components.json` 的场景。

## Step 5：做一个组件浏览器（强烈推荐）

Registry 解决的是“安装”，组件浏览器解决的是“发现与选择”。

本仓库实现要点：

- 组件元数据：[`lib/registry.ts`](./lib/registry.ts)
  - 组件名称、描述、分类、tags、依赖、CLI 名称、基础用法示例等
- 组件列表页：[`app/components/page.tsx`](./app/components/page.tsx)
  - 搜索、分类、复制安装命令、切换 npm/pnpm
- 组件详情页：[`app/components/[id]/page.tsx`](./app/components/[id]/page.tsx)
  - Demo、基本用法、Props API、依赖一键复制等
- CLI 文档页：[`app/cli/page.tsx`](./app/cli/page.tsx)

> 注意：站点展示使用的 `lib/registry.ts` 与 shadcn CLI 使用的 `public/registry/*.json` 是两条线：前者用于 UI，后者用于安装。

## Step 6：部署成静态站点（让 /registry 可访问）

本仓库使用 `next export` 的思路（见 `next.config.ts` 的 `output: "export"`）。

### 6.1 本地预览 out 产物

```bash
pnpm install
pnpm run update-registry
pnpm build
pnpm start
```

其中：

- `pnpm build` 会产出 `out/`
- `pnpm start` 实际上是 `npx serve@latest out`

### 6.2 部署到 Vercel / 其他静态托管

只要你的托管平台能把 `out/` 当成静态目录发布，并且能访问：

- `/registry/<name>.json`

就可以给 shadcn CLI 用。

如果你用了自定义域名，强烈建议让 registry URL 稳定（不要轻易改路径），否则用户端的 `components.json` 配置会失效。

## 新增一个自定义组件：维护清单（按本仓库约定）

当你新增 `components/qiuye-ui/new-thing.tsx` 时，建议按这个顺序走：

1. 在 `components/qiuye-ui/` 编写组件源码（必要时加 `"use client"`）
2. （可选）在 `components/qiuye-ui/demos/` 增加 demo
3. 新增 `public/registry/new-thing.json`（先写骨架，`content` 留空）
4. 运行 `pnpm run update-registry` 回填 `content`
5. 更新站点元数据：
   - `lib/component-constants.ts`：追加组件 id + 基础用法示例
   - `lib/registry.ts`：追加组件详情（分类、依赖、tags、文件路径）
   - `app/components/[id]/page.tsx`：把 demo 组件加入映射（否则详情页会提示“演示组件正在开发中...”）
6. 在一个“外部项目”里验证安装：
   - 配置 `components.json -> registries`
   - 执行 `npx shadcn@latest add @qiuye-ui/new-thing`
   - 确认目标文件生成、依赖安装、运行无报错

## 常见问题（FAQ）

### Q1：用户安装后 import 路径不对 / 报 `@/lib/utils` 找不到？

这是“用户项目的 alias 与你的组件 import 约定不一致”导致的。

你有两种策略：

- **在文档里明确要求**：用户用 shadcn init 的默认 alias（`@/components`、`@/lib/utils`）
- **在组件里避免强约定**：改成相对路径或提供可配置版本（通常不推荐，会降低组件可读性）

### Q2：为什么我不建议把这些组件发成 npm 包？

不是不能发，而是“发包”与 shadcn 的使用哲学相反：

- shadcn 的优势是源码可控、可改、可追溯
- npm 包的优势是版本管理与封装边界

如果你非常需要“版本化分发”，可以考虑“registry + 版本号路径”（例如 `/registry/v1/<name>.json`）或在 registry JSON 中引入版本字段并配合文档约束。

### Q3：静态导出有什么限制？

`output: "export"` 意味着你不能依赖运行时的 Node 服务能力（例如动态 API 路由、按请求渲染）。

但对“组件库站点 + registry 静态文件”而言，这是优点：部署简单、成本低、稳定性高。

## 总结

用 shadcn 的 registry 机制，你可以把“可复用的自定义组件”以一种非常接近 shadcn 官方体验的方式分发出去：

- 组件库侧：维护源码 + registry JSON + 自动回填脚本
- 用户侧：配置 registries → 一句 `npx shadcn@latest add ...` 安装
- 部署侧：静态站点即可（`out/` 扔到任何静态托管都行）

如果你也在做自己的 shadcn 生态，建议先把“registry 与脚本”跑通，再逐步补齐组件浏览器、Props 文档、Demo 与最佳实践。

<!-- EOF -->