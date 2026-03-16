# 🎨 秋夜组件库 (QiuYe UI Components)

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

🎨 精心设计的自定义UI组件库，基于 Shadcn/ui 构建，支持一键CLI安装。让您的项目开发更加高效、优雅。

## ✨ 特性

- 🚀 **一键CLI安装** - 支持 npm (`npx`) 和 pnpm (`pnpm dlx`) 两种包管理器一键安装组件
- 🎨 **精美设计** - 精心设计的自定义组件，提升应用视觉效果
- 📦 **即插即用** - 无需复杂配置，安装后立即可用
- 🔍 **组件浏览器** - 内置组件浏览页面，可视化查看组件效果
- 💻 **TypeScript** - 完整的类型定义，优秀的开发体验
- ⚡ **基于Shadcn/ui** - 继承优秀的设计理念和可定制性
- 🌙 **主题支持** - 支持深色/浅色主题切换
- 📱 **响应式设计** - 完美适配各种设备尺寸

## 🚀 快速开始

### 浏览组件

访问组件浏览器查看所有可用组件和在线演示：

- **国际域名**：[qiuye-ui.vercel.app/components](https://qiuye-ui.vercel.app/components)
- **中国大陆镜像**：[ui.qiuyedx.com/components](https://ui.qiuyedx.com/components)

### 安装组件

#### 方式一：配置注册表后安装（推荐）

首先在 `components.json` 中添加注册表配置：

**国际域名（推荐）：**

```json
{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}
```

**中国大陆镜像域名：**

```json
{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}
```

然后安装组件：

```bash
# 安装单个组件
npx shadcn@latest add @qiuye-ui/animated-button
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/animated-button

# 安装多个组件
npx shadcn@latest add @qiuye-ui/animated-button @qiuye-ui/gradient-card @qiuye-ui/typing-text @qiuye-ui/responsive-tabs @qiuye-ui/scrollable-dialog
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/animated-button @qiuye-ui/gradient-card @qiuye-ui/typing-text @qiuye-ui/responsive-tabs @qiuye-ui/scrollable-dialog
```

#### 方式二：直接URL安装

```bash
# 国际域名
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json

# 中国大陆镜像域名
npx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json

# 查看可用组件（访问在线浏览器）
# 国际域名
open https://qiuye-ui.vercel.app/components
# 中国大陆镜像
open https://ui.qiuyedx.com/components
```

### 使用组件

```tsx
import { AnimatedButton } from "@/components/qiuye-ui/animated-button";

export default function App() {
  return (
    <div>
      <AnimatedButton animation="bounce" variant="primary">
        点击我！
      </AnimatedButton>
    </div>
  );
}
```

## 📦 可用组件

| 组件名称              | 描述                                                       | 分类 | CLI命令                                                                                                          |
| --------------------- | ---------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------- |
| **Animated Button**   | 带动画效果的按钮组件，支持多种动画风格                     | 按钮 | `npx shadcn@latest add @qiuye-ui/animated-button`<br/>`pnpm dlx shadcn@latest add @qiuye-ui/animated-button`     |
| **Gradient Card**     | 渐变色卡片组件，支持多种渐变主题                           | 卡片 | `npx shadcn@latest add @qiuye-ui/gradient-card`<br/>`pnpm dlx shadcn@latest add @qiuye-ui/gradient-card`         |
| **Typing Text**       | 打字机效果文本组件，支持循环播放                           | 文本 | `npx shadcn@latest add @qiuye-ui/typing-text`<br/>`pnpm dlx shadcn@latest add @qiuye-ui/typing-text`             |
| **Responsive Tabs**   | 响应式标签页：小屏滚动/大屏网格，可选滚动按钮与渐变遮罩    | 导航 | `npx shadcn@latest add @qiuye-ui/responsive-tabs`<br/>`pnpm dlx shadcn@latest add @qiuye-ui/responsive-tabs`     |
| **Scrollable Dialog** | 可滚动对话框：头尾固定、内容滚动，支持渐变遮罩与横向滚动条 | 弹窗 | `npx shadcn@latest add @qiuye-ui/scrollable-dialog`<br/>`pnpm dlx shadcn@latest add @qiuye-ui/scrollable-dialog` |

> 更多组件持续更新中...

## 🛠️ CLI 工具

### 前置要求

首先确保您的项目已安装并配置了 shadcn/ui：

```bash
# 使用 npm
npx shadcn@latest init

# 或使用 pnpm
pnpm dlx shadcn@latest init
```

### 安装方法

#### 方式一：配置注册表（推荐）

在项目的 `components.json` 文件中添加秋夜组件库注册表：

**国际域名（推荐）：**

```json
{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}
```

**中国大陆镜像域名：**

```json
{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}
```

然后使用简化的命令安装组件：

```bash
# 安装单个组件
npx shadcn@latest add @qiuye-ui/animated-button
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/animated-button

# 批量安装多个组件
npx shadcn@latest add @qiuye-ui/animated-button @qiuye-ui/gradient-card @qiuye-ui/typing-text @qiuye-ui/responsive-tabs @qiuye-ui/scrollable-dialog
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/animated-button @qiuye-ui/gradient-card @qiuye-ui/typing-text @qiuye-ui/responsive-tabs @qiuye-ui/scrollable-dialog
```

#### 方式二：直接URL安装

如果不想配置注册表，可以直接使用URL安装组件：

```bash
# 国际域名
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json

# 中国大陆镜像域名
npx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json

# 批量安装（多个URL） - 国际域名
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/gradient-card.json https://qiuye-ui.vercel.app/registry/typing-text.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/gradient-card.json https://qiuye-ui.vercel.app/registry/typing-text.json

# 批量安装（多个URL） - 中国大陆镜像
npx shadcn@latest add https://ui.qiuyedx.com/registry/gradient-card.json https://ui.qiuyedx.com/registry/typing-text.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/gradient-card.json https://ui.qiuyedx.com/registry/typing-text.json
```

### 常用命令

```bash
# 初始化 shadcn/ui（如果还没有）
npx shadcn@latest init
# 或使用 pnpm
pnpm dlx shadcn@latest init

# 方式一：使用注册表名称安装
npx shadcn@latest add @qiuye-ui/[component-name]
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/[component-name]

# 方式二：使用完整URL安装
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/[component-name].json
# 或使用中国大陆镜像
npx shadcn@latest add https://ui.qiuyedx.com/registry/[component-name].json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/[component-name].json
pnpm dlx shadcn@latest add https://ui.qiuyedx.com/registry/[component-name].json

# 查看 CLI 帮助
npx shadcn@latest --help
# 或使用 pnpm
pnpm dlx shadcn@latest --help
```

## 📚 文档

### 国际域名

- 🏠 [官网首页](https://qiuye-ui.vercel.app)
- 🎨 [组件浏览器](https://qiuye-ui.vercel.app/components)
- 💻 [CLI 使用指南](https://qiuye-ui.vercel.app/cli)
- 📦 [Registry 示例（typing-text）](https://qiuye-ui.vercel.app/registry/typing-text.json)

### 中国大陆镜像

- 🏠 [官网首页](https://ui.qiuyedx.com)
- 🎨 [组件浏览器](https://ui.qiuyedx.com/components)
- 💻 [CLI 使用指南](https://ui.qiuyedx.com/cli)
- 📦 [Registry 示例（typing-text）](https://ui.qiuyedx.com/registry/typing-text.json)

### 其他

- 🛠️ [新增自定义组件指南](#新增自定义组件)
- 📝 [博客：基于 Next.js 15 + shadcn/ui 打造可 CLI 安装的组件库](./blog-how-to-build-shadcn-component-library.md)

## 🏗️ 本地开发

### 环境要求

- Node.js >= 18.17
- pnpm >= 8.0 (推荐) 或 npm/yarn

### 开发步骤

```bash
# 1. 克隆项目
git clone https://github.com/qiuyedx/qiuye-shadcn_ui.git
cd qiuye-shadcn_ui

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 访问应用
# 打开 http://localhost:3000
```

### 项目结构

```text
qiuye-shadcn_ui/
├── app/                        # Next.js 应用目录
│   ├── components/            # 组件浏览页面
│   ├── cli/                   # CLI 使用指南页面
│   └── page.tsx               # 首页
├── components/
│   ├── qiuye-ui/             # 自定义组件库
│   │   ├── animated-button.tsx
│   │   ├── gradient-card.tsx
│   │   ├── typing-text.tsx
│   │   ├── responsive-tabs.tsx
│   │   ├── scrollable-dialog.tsx
│   │   └── demos/            # 组件演示
│   └── ui/                   # Shadcn/ui 基础组件
├── lib/
│   └── registry.ts           # 组件注册表
├── public/
│   └── registry/             # shadcn/ui CLI 使用的静态 registry
└── scripts/
    └── update-registry.mjs   # 自动回填 registry 的 files[].content
└── ...
```

## 🔧 技术栈

### 核心框架

- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面构建库
- **TypeScript 5** - 类型安全

### UI 和样式

- **Tailwind CSS 4** - 样式框架
- **Shadcn/ui** - 基础组件库
- **Radix UI** - 底层 UI 原语
- **Class Variance Authority** - 组件变体管理

### 动画和交互

- **Motion** - 动画库
- **Lucide React** - 图标库

### 开发工具

- **ESLint** - 代码检查
- **TypeScript** - 类型检查
- **Turbopack** - 构建工具

## 🚀 部署

### 静态注册表

组件库使用静态文件提供组件信息：

- `/registry/[component].json` - 单个组件的详细配置和源代码
- 兼容 shadcn/ui CLI 工具标准

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qiuyedx/qiuye-shadcn_ui)

### 自定义部署

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

## 🛠️ 开发者指南

### 新增自定义组件

本指南将详细说明如何在秋夜组件库中新增自定义组件，并支持通过 shadcn/ui CLI 安装到其他项目中使用。

#### 1. 创建组件源码

在 `components/qiuye-ui/` 目录下创建您的组件：

```tsx
// components/qiuye-ui/my-component.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-4 rounded-lg border",
          {
            "bg-background": variant === "default",
            "bg-primary text-primary-foreground": variant === "primary",
            "bg-secondary text-secondary-foreground": variant === "secondary",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";

export { MyComponent };
```

#### 2. 创建演示组件（可选）

在 `components/qiuye-ui/demos/` 目录下创建演示组件：

```tsx
// components/qiuye-ui/demos/my-component-demo.tsx
import { MyComponent } from "../my-component";

export function MyComponentDemo() {
  return (
    <div className="space-y-4">
      <MyComponent variant="default">默认样式</MyComponent>
      <MyComponent variant="primary">主要样式</MyComponent>
      <MyComponent variant="secondary">次要样式</MyComponent>
    </div>
  );
}
```

#### 3. 创建注册表 JSON 文件

在 `public/registry/` 目录下创建组件的注册表文件：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "title": "MyComponent",
  "type": "registry:component",
  "author": "您的名字 <your-email@example.com>",
  "dependencies": ["react", "clsx"],
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

**注意**：初始创建时 `content` 字段留空，稍后通过脚本自动填充；组件类文件通常不需要写 `target`。

#### 4. 注册表 JSON 文件结构说明

每个注册表 JSON 文件包含以下关键字段：

- **`$schema`**: 指向 shadcn/ui 的 JSON Schema，用于验证文件格式
- **`name`**: 组件名称，用于 CLI 安装时的标识符
- **`title`**: 组件的显示标题
- **`type`**: 固定为 `"registry:component"`
- **`author`**: 组件作者信息
- **`dependencies`**: npm 依赖包列表
- **`registryDependencies`**: 其他 shadcn/ui 组件依赖
- **`files`**: 组件文件配置数组
  - **`type`**: 文件类型，通常为 `"registry:component"`
  - **`path`**: 组件在本项目中的相对路径
  - **`target`**: 可选；仅在 `registry:page` / `registry:file` 等需要固定落盘位置时使用
  - **`content`**: 组件的源代码内容（通过脚本自动填充）

**推荐做法**：组件类文件不写 `target`，交给用户项目的 `components.json` 的 aliases 去解析，
可自动适配 `src/` 与非 `src/` 目录结构。

#### 5. 自动填充源代码内容

使用内置的脚本自动将组件源代码填充到注册表 JSON 文件中：

```bash
# 实际执行，更新所有注册表文件
npm run update-registry

# 预览模式，仅查看将要更改的内容，不实际写入
npm run update-registry:dry
```

**脚本说明**：

- **`update-registry`**: 执行 `scripts/update-registry.mjs` 脚本，自动扫描 `public/registry/` 目录下的所有 JSON 文件，读取对应的组件源码并填充到 `content` 字段中
- **`update-registry:dry`**: 干运行模式，仅预览将要进行的更改，不实际修改文件，适合验证脚本行为

**脚本工作原理**：

1. 扫描 `public/registry/` 目录下的所有 `.json` 文件
2. 解析每个 JSON 文件的 `files` 数组
3. 根据 `path` 字段定位组件源码文件
4. 读取源码内容并更新到 `content` 字段
5. 保存更新后的 JSON 文件

#### 6. 完整开发流程

遵循以下步骤确保组件能够正确通过 CLI 安装：

1. **创建组件源码** - 在 `components/qiuye-ui/` 下编写组件
2. **创建注册表文件** - 在 `public/registry/` 下创建对应的 JSON 文件
3. **运行更新脚本** - 执行 `npm run update-registry` 填充源代码
4. **测试本地安装** - 使用 CLI 测试组件安装是否正常
5. **提交代码** - 将所有文件提交到版本控制

#### 7. CLI 安装测试

在其他项目中测试您的组件是否能正确安装：

##### 方式一：配置注册表后测试

```bash
# 在目标项目的 components.json 中添加注册表配置
# 然后安装您的新组件
npx shadcn@latest add @qiuye-ui/my-component
# 或使用 pnpm
pnpm dlx shadcn@latest add @qiuye-ui/my-component

# 验证文件是否正确生成（以 aliases.components 为准，可能在 src/ 或根目录）
ls src/components/qiuye-ui/my-component.tsx
ls components/qiuye-ui/my-component.tsx
```

##### 方式二：直接URL测试

```bash
# 直接使用URL安装
npx shadcn@latest add https://qiuye-ui.vercel.app/registry/my-component.json
# 或使用 pnpm
pnpm dlx shadcn@latest add https://qiuye-ui.vercel.app/registry/my-component.json

# 验证文件是否正确生成（以 aliases.components 为准，可能在 src/ 或根目录）
ls src/components/qiuye-ui/my-component.tsx
ls components/qiuye-ui/my-component.tsx
```

#### 8. 开发规范

为确保组件质量和一致性，请遵循以下规范：

- ✅ 使用 TypeScript 编写组件
- ✅ 使用 `React.forwardRef` 支持 ref 传递
- ✅ 导出清晰的 Props 接口
- ✅ 支持 `className` 属性并使用 `cn()` 工具函数
- ✅ 组件名称使用 PascalCase
- ✅ 文件名使用 kebab-case
- ✅ 支持深色/浅色主题
- ✅ 确保响应式设计
- ✅ 添加必要的 `displayName`

## 🤝 贡献

欢迎贡献新的组件或改进现有组件！

### 贡献步骤

1. **Fork 这个仓库**
2. **创建特性分支** (`git checkout -b feature/new-component`)
3. **开发新组件** - 参考上面的"新增自定义组件"指南
4. **测试组件** - 确保组件在本地正常工作
5. **运行脚本** - 执行 `npm run update-registry` 更新注册表
6. **提交更改** (`git commit -m 'Add new component: my-component'`)
7. **推送分支** (`git push origin feature/new-component`)
8. **创建 Pull Request** - 详细描述新组件的功能和特性

## 📄 许可证

MIT License © 2026 秋夜

## 🙏 致谢

- [Shadcn/ui](https://ui.shadcn.com/) - 优秀的组件库设计理念
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍的 UI 原语

## 📞 支持

如果这个项目对您有帮助，请给它一个 ⭐️！

- 🐛 [报告问题](https://github.com/qiuyedx/qiuye-shadcn_ui/issues)
- 💡 [功能建议](https://github.com/qiuyedx/qiuye-shadcn_ui/discussions)
- 🤝 [贡献代码](https://github.com/qiuyedx/qiuye-shadcn_ui/pulls)

---

<div align="center">
  Made with ❤️ by 秋夜
</div>
