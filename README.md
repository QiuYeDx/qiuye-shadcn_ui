# QiuYe UI

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

QiuYe UI 是一个基于 shadcn/ui 的自定义组件库，提供可在线预览、可通过 shadcn CLI 安装的 React 组件，并额外提供 `@qiuye-ui/mcp`，方便 Cursor / Codex / Claude 等 AI 工具直接读取组件 registry 信息。

## ✨ 特性

- 🚀 **shadcn CLI 一键安装**：支持配置 registry alias 后用 `@qiuye-ui/[name]` 安装，也支持直接 URL 安装。
- 📦 **静态 Registry**：组件 registry 位于 `public/registry`，构建后通过 `/registry/[component].json` 提供。
- 🎨 **组件浏览器**：内置组件列表、分类筛选、搜索、安装命令复制和详情页 Demo。
- 🧩 **完整组件详情**：每个组件都有快速预览、基础用法、Props API、依赖信息和源码注册表。
- 🤖 **MCP Server**：`@qiuye-ui/mcp` 可列出、搜索、读取组件 registry，并生成 shadcn 安装命令。
- 💻 **TypeScript 优先**：组件、Demo、registry 元数据和工具脚本都使用类型化结构。
- 🌙 **主题支持**：基于 Tailwind CSS 4、shadcn/ui 与 `next-themes`，支持浅色 / 深色主题。
- 📱 **响应式设计**：组件和官网页面均适配桌面端与移动端。

## 🚀 快速开始

### 在线浏览

- **中国大陆镜像**：[ui.qiuyedx.com/components](https://ui.qiuyedx.com/components)
- **国际域名**：[qiuye-ui.vercel.app/components](https://qiuye-ui.vercel.app/components)

### 前置要求

目标项目需要先初始化 shadcn/ui：

```bash
npx shadcn@latest init
```

或使用 pnpm：

```bash
pnpm dlx shadcn@latest init
```

### 方式一：配置注册表后安装（推荐）

在目标项目的 `components.json` 中添加 QiuYe UI registry：

```json
{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}
```

也可以使用国际域名：

```json
{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}
```

安装单个组件：

```bash
pnpm dlx shadcn@latest add @qiuye-ui/responsive-tabs
```

安装多个组件：

```bash
pnpm dlx shadcn@latest add @qiuye-ui/code-block @qiuye-ui/markdown-renderer @qiuye-ui/tour
```

### 方式二：直接 URL 安装

```bash
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/responsive-tabs.json
```

或使用国际域名：

```bash
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/responsive-tabs.json
```

### 基础使用

```tsx
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("tab1");
  const items = [
    { value: "tab1", label: "标签一" },
    { value: "tab2", label: "标签二" },
  ];

  return (
    <ResponsiveTabs value={value} onValueChange={setValue} items={items}>
      <div className="p-4">
        {value === "tab1" && <div>标签一的内容</div>}
        {value === "tab2" && <div>标签二的内容</div>}
      </div>
    </ResponsiveTabs>
  );
}
```

## 📦 可用组件

| 组件 | CLI 名称 | 分类 | 简介 |
| --- | --- | --- | --- |
| Responsive Tabs | `responsive-tabs` | 导航 | 小屏横向滚动、大屏网格布局，支持图标、徽标、禁用态、滚动按钮、渐变遮罩与选中态动画。 |
| Segmented Control | `segmented-control` | 交互 | ChatGPT 风格的分段单选控件：使用 Motion layoutId 与 spring 弹性滑块过渡，提供内嵌与悬浮两种风格及中、小两档尺寸，并支持受控/非受控状态、键盘导航、禁用项与表单提交。 |
| Scrollable Dialog | `scrollable-dialog` | 弹窗 | 头部和底部固定、内容区域滚动的对话框，适合展示大量内容。 |
| Dot Glass | `dot-glass` | 特效 | 点阵开孔毛玻璃效果，只在点阵孔洞中露出背景模糊，适合 Header / Navbar 等视觉场景。 |
| Image Viewer | `image-viewer` | 媒体 | 带灯箱预览的图片查看器，支持点击放大、滚轮 / 触控缩放、拖拽平移和加载过渡。 |
| Dual State Toggle | `dual-state-toggle` | 交互 | 双状态图标按钮，内置点击缩放、图标切换动画和多种过渡效果。 |
| Theme Transition Toggle | `theme-transition-toggle` | 交互 | 基于浏览器 View Transition API 的深浅模式切换按钮，支持从触发点圆形 / 椭圆揭幕并自动降级。 |
| Code Block | `code-block` | 展示 | 基于 `prism-react-renderer` 的代码块，支持主题、折叠、滚动、Diff 高亮、行高亮、行号固定和复制按钮。 |
| Typewriter | `typewriter` | 特效 | 平滑打字机效果，支持多文案轮播、单次打字、自定义光标与弹簧宽度跟随。 |
| Markdown Renderer | `markdown-renderer` | 展示 | 通用 Markdown 渲染器，支持 Blog / Chat 预设、GFM、代码高亮、Mermaid、图片预览和可扩展 Widget。 |
| Color Picker | `color-picker` | 表单 | HSV 取色器，支持 Alpha、触屏拖拽、十六进制输入、预设色卡、最近颜色和 Popover / Inline 模式。 |
| Smooth Corners | `smooth-corners` | 特效 | Figma / iOS 风格平滑圆角组件，基于 `corner-shape` 渐进增强并自动回退到标准 `border-radius`。 |
| Tour | `tour` | 导航 | 产品引导组件，支持目标元素高亮、遮罩聚焦、步骤 Popover、进度、跳过和自动滚动定位。 |
| Matrix Effect | `matrix-effect` | 特效 | 通用 Canvas 矩阵视觉效果组件：将图片、外部 Canvas 或程序化信号场按响应式网格采样，通过可组合的 Mapper、Transform 与 Renderer 管线生成圆点矩阵、ASCII 艺术和自定义效果，并内置自适应帧率、DPR 限制、离屏暂停与 Reduced Motion 支持。 |

安装任意组件：

```bash
pnpm dlx shadcn@latest add @qiuye-ui/[component-name]
```

查看 registry 索引：

- [https://ui.qiuyedx.com/registry/registry.json](https://ui.qiuyedx.com/registry/registry.json)
- [https://qiuye-ui.vercel.app/registry/registry.json](https://qiuye-ui.vercel.app/registry/registry.json)

## 🛠️ CLI 与 Registry

QiuYe UI 不需要单独的组件安装器，直接使用官方 shadcn CLI。

### 常用命令

```bash
# 初始化 shadcn/ui
pnpm dlx shadcn@latest init

# 使用 registry alias 安装
pnpm dlx shadcn@latest add @qiuye-ui/code-block

# 批量安装
pnpm dlx shadcn@latest add @qiuye-ui/color-picker @qiuye-ui/tour

# 直接 URL 安装
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/code-block.json

# 查看 shadcn CLI 帮助
pnpm dlx shadcn@latest --help
```

### Registry 文件

- `public/registry/registry.json`：组件索引，由 `pnpm update-registry` 生成，请勿手动编辑。
- `public/registry/[component].json`：单个组件 registry item，包含依赖、registry 依赖和 `files[].content`。
- `scripts/update-registry.mjs`：读取组件源码并自动回填 registry JSON 的 `files[].content`。

更新 registry：

```bash
# 实际更新 public/registry/*.json
pnpm update-registry

# 预览将要更新的内容
pnpm update-registry:dry
```

## 🤖 MCP Server

仓库内包含 `packages/qiuye-ui-cli`，发布包名为 `@qiuye-ui/mcp`。它可以让 Cursor / Claude 等支持 MCP 的工具直接读取 QiuYe UI 组件 registry。

### Cursor 配置

在项目根目录创建 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "@qiuye-ui/mcp": {
      "command": "npx",
      "args": ["-y", "--package", "@qiuye-ui/mcp@latest", "qiuye-ui-mcp"]
    }
  }
}
```

### 命令行自检

```bash
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --check
```

### 支持能力

- `qiuye_ui_list_registry_items`：列出 registry 索引中的组件。
- `qiuye_ui_search_registry_items`：按关键词搜索组件。
- `qiuye_ui_get_registry_item`：读取指定组件 registry JSON。
- `qiuye_ui_get_registry_file_content`：读取组件源码内容。
- `qiuye_ui_get_shadcn_add_command`：生成 shadcn 安装命令。

更多说明见 [packages/qiuye-ui-cli/README.md](./packages/qiuye-ui-cli/README.md)。

## 📚 文档入口

### 官网

- [首页](https://ui.qiuyedx.com)
- [组件浏览器](https://ui.qiuyedx.com/components)
- [CLI 使用指南](https://ui.qiuyedx.com/cli)

### 国际域名

- [首页](https://qiuye-ui.vercel.app)
- [组件浏览器](https://qiuye-ui.vercel.app/components)
- [CLI 使用指南](https://qiuye-ui.vercel.app/cli)

### 本仓库文档

- [新增自定义组件指南](#新增自定义组件)
- [MCP Server 文档](./packages/qiuye-ui-cli/README.md)
- [博客：基于 Next.js 15 + shadcn/ui 打造可 CLI 安装的组件库](./blog-how-to-build-shadcn-component-library.md)
- [Tour 组件设计文档](./docs/设计并开发Tour组件/Tour组件开发设计文档.md)
- [CodeBlock 优化记录](./docs/优化CodeBlock组件/fix/2026-06-03_code-block-edge-line-number-styles.md)
- [官网首页与布局优化文档](./docs/优化官网首页与布局/官网首页与布局优化开发设计文档.md)
- [backdrop-filter 背景模糊避坑指南](./docs/前端通用经验/backdrop-filter-背景模糊避坑指南.md)

## 🏗️ 本地开发

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开发步骤

```bash
git clone https://github.com/qiuyedx/qiuye-shadcn_ui.git
cd qiuye-shadcn_ui

pnpm install
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。

### 常用脚本

```bash
pnpm dev                  # 启动 Next.js 开发服务器（Turbopack）
pnpm build                # 静态导出构建
pnpm start                # 使用 serve 预览 out 目录
pnpm preview              # 构建并预览
pnpm lint                 # ESLint 检查
pnpm update-registry      # 回填 registry files[].content
pnpm update-registry:dry  # registry 更新预览
```

### 项目结构

```text
qiuye-shadcn_ui/
├── app/                         # Next.js App Router 页面
│   ├── components/              # 组件列表页
│   ├── components/[id]/         # 组件详情页、Demo、API 和依赖信息
│   ├── cli/                     # CLI 使用指南页面
│   └── page.tsx                 # 首页
├── components/
│   ├── home/                    # 首页展示模块
│   ├── qiuye-ui/                # QiuYe UI 自定义组件源码
│   │   ├── code-block/          # CodeBlock 多文件组件
│   │   ├── markdown-renderer/   # MarkdownRenderer 多文件组件
│   │   └── demos/               # 组件演示
│   ├── site/                    # 站点导航、搜索、Shell
│   └── ui/                      # shadcn/ui 基础组件
├── docs/                        # 设计文档、实施记录与经验沉淀
├── hooks/                       # 可被 registry 引用的 hooks
├── lib/
│   ├── component-constants.ts   # 组件 ID 与基础用法示例
│   ├── registry.ts              # 官网组件元数据、分类、Props API
│   └── markdown/                # MarkdownRenderer 工具函数
├── packages/qiuye-ui-cli/       # @qiuye-ui/mcp 子包
├── public/registry/             # shadcn CLI 使用的静态 registry
└── scripts/update-registry.mjs  # registry content 自动回填脚本
```

## 🔧 技术栈

### 核心框架

- **Next.js 15**：App Router + 静态导出。
- **React 19**：用户界面构建。
- **TypeScript 5**：类型安全。
- **Tailwind CSS 4**：样式系统。
- **shadcn/ui + Radix UI**：基础 UI 原语与设计系统。

### 组件能力

- **Motion**：动画、过渡和布局迁移动画。
- **Lucide React / Heroicons**：图标。
- **prism-react-renderer / refractor**：代码高亮。
- **react-markdown / remark-gfm / rehype-raw**：Markdown 渲染。
- **Mermaid**：图表渲染。
- **next-themes**：主题切换。

### 工具与工程

- **ESLint 9**：代码检查。
- **Prettier 3**：格式化。
- **Zod + MCP SDK**：`@qiuye-ui/mcp` 参数校验与 MCP Server。
- **Vercel Analytics / Speed Insights**：线上分析与性能指标。

## 🚀 部署

项目使用 `next.config.ts` 中的 `output: "export"` 生成静态站点，`public/registry` 会随静态资源一起发布。

```bash
pnpm build
pnpm start
```

部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qiuyedx/qiuye-shadcn_ui)

## 🛠️ 开发者指南

### 新增自定义组件

新增组件需要同步组件源码、Demo、官网元数据和静态 registry。

#### 1. 创建组件源码

在 `components/qiuye-ui/` 下创建组件。文件名使用 kebab-case，组件名使用 PascalCase。

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border p-4",
          variant === "primary" && "bg-primary text-primary-foreground",
          className
        )}
        {...props}
      />
    );
  }
);

MyComponent.displayName = "MyComponent";

export { MyComponent };
```

#### 2. 创建 Demo

在 `components/qiuye-ui/demos/` 下创建完整 Demo，并在 `app/components/[id]/simple-demos.tsx` 中补充轻量预览组件。随后在 `app/components/[id]/page.tsx` 中接入完整 Demo 和简单预览 Demo 的映射。

```tsx
import { MyComponent } from "../my-component";

export function MyComponentDemo() {
  return <MyComponent variant="primary">Hello QiuYe UI</MyComponent>;
}
```

#### 3. 更新组件常量与官网元数据

需要同步：

- `lib/component-constants.ts`：新增 `ComponentId` 和基础用法示例。
- `lib/registry.ts`：新增组件名称、描述、分类、依赖、文件路径、Props API、版本、标签和 `cliName`。
- `app/cli/page.tsx`：在“可用组件列表”中加入新组件 ID。

#### 4. 创建 registry JSON

在 `public/registry/` 下创建对应 JSON：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "type": "registry:component",
  "title": "MyComponent",
  "author": "QiuYeDx <me@qiuyedx.com>",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/my-component.tsx",
      "content": ""
    }
  ]
}
```

组件类文件通常不需要写 `target`，交给用户项目的 `components.json` aliases 解析，从而兼容 `src/` 和非 `src/` 目录结构。

如果组件依赖本组件库内的其他组件，请使用 `@qiuye-ui/[name]` 形式写入 `registryDependencies`。如果依赖 shadcn/ui 基础组件，请写入基础组件名，例如 `button`、`dialog`、`table`。

#### 5. 更新 registry 索引和源码内容

确认 `public/registry/[component].json` 已创建后运行脚本，`public/registry/registry.json` 会自动更新：

```bash
pnpm update-registry:dry
pnpm update-registry
```

#### 6. 测试安装

在目标项目中配置 registry 后测试：

```bash
pnpm dlx shadcn@latest add @qiuye-ui/my-component
```

也可以通过本地开发服务测试直接 URL：

```bash
pnpm dev
pnpm dlx shadcn@latest add http://localhost:3000/registry/my-component.json
```

#### 7. 开发规范

- 使用 TypeScript 编写组件，并导出 Props 类型。
- 支持 `className`，并使用 `cn()` 合并样式。
- 需要 DOM ref 的组件使用 `React.forwardRef`。
- 组件文件使用 kebab-case，组件名使用 PascalCase。
- Demo 应覆盖基础用法和关键交互状态。
- 保持浅色 / 深色主题兼容。
- 组件说明、Props API、依赖和 registry 必须同步更新。
- 如果希望 MCP Server 在远端索引缺失时也能兜底列出新组件，同步更新 `packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs` 的 `DEFAULT_COMPONENT_NAMES`。

## 🤝 贡献

欢迎贡献新的组件、改进现有组件或完善文档。

1. Fork 仓库。
2. 创建特性分支：`git checkout -b feature/new-component`。
3. 按 [新增自定义组件](#新增自定义组件) 流程开发。
4. 运行 `pnpm update-registry` 更新 registry。
5. 运行必要检查：`pnpm lint`、`pnpm build`。
6. 提交更改并创建 Pull Request。

## 📄 许可证

MIT License © 2026 秋夜

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 📞 支持

如果这个项目对您有帮助，欢迎给它一个 ⭐️。

- [报告问题](https://github.com/qiuyedx/qiuye-shadcn_ui/issues)
- [功能建议](https://github.com/qiuyedx/qiuye-shadcn_ui/discussions)
- [贡献代码](https://github.com/qiuyedx/qiuye-shadcn_ui/pulls)

---

<div align="center">
  Made with ❤️ by 秋夜
</div>
