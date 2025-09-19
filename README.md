# 🎨 秋夜组件库 (QiuYe UI Components)

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

🎨 精心设计的自定义UI组件库，基于 Shadcn/ui 构建，支持一键CLI安装。让您的项目开发更加高效、优雅。

## ✨ 特性

- 🚀 **一键CLI安装** - 使用 `npx shadcn-ui@latest add qiuye-ui/[component]` 命令一键安装组件
- 🎨 **精美设计** - 精心设计的自定义组件，提升应用视觉效果
- 📦 **即插即用** - 无需复杂配置，安装后立即可用
- 🔍 **组件浏览器** - 内置组件浏览页面，可视化查看组件效果
- 💻 **TypeScript** - 完整的类型定义，优秀的开发体验
- ⚡ **基于Shadcn/ui** - 继承优秀的设计理念和可定制性
- 🌙 **主题支持** - 支持深色/浅色主题切换
- 📱 **响应式设计** - 完美适配各种设备尺寸

## 🚀 快速开始

### 浏览组件

访问 [组件浏览器](https://qiuye-ui.vercel.app/components) 查看所有可用组件和在线演示。

### 安装组件

```bash
# 安装单个组件
npx shadcn-ui@latest add qiuye-ui/animated-button

# 安装多个组件
npx shadcn-ui@latest add qiuye-ui/animated-button qiuye-ui/gradient-card qiuye-ui/typing-text

# 查看可用组件（访问在线浏览器）
open https://qiuye-ui.vercel.app/components
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

| 组件名称 | 描述 | 分类 | CLI命令 |
|---------|------|-----|---------|
| **Animated Button** | 带动画效果的按钮组件，支持多种动画风格 | 按钮 | `npx shadcn-ui@latest add qiuye-ui/animated-button` |
| **Gradient Card** | 渐变色卡片组件，支持多种渐变主题 | 卡片 | `npx shadcn-ui@latest add qiuye-ui/gradient-card` |
| **Typing Text** | 打字机效果文本组件，支持循环播放 | 文本 | `npx shadcn-ui@latest add qiuye-ui/typing-text` |

> 更多组件正在开发中...

## 🛠️ CLI 工具

### 前置要求

首先确保您的项目已安装并配置了 shadcn/ui：

```bash
npx shadcn-ui@latest init
```

### 配置注册表

在项目的 `components.json` 文件中添加秋夜组件库注册表：

```json
{
  "registries": {
    "qiuye-ui": {
      "baseUrl": "https://qiuye-ui.vercel.app/registry",
      "style": "new-york"
    }
  }
}
```

### 常用命令

```bash
# 初始化 shadcn/ui（如果还没有）
npx shadcn-ui@latest init

# 安装秋夜组件
npx shadcn-ui@latest add qiuye-ui/[component-name]

# 批量安装多个组件
npx shadcn-ui@latest add qiuye-ui/animated-button qiuye-ui/gradient-card

# 查看 CLI 帮助
npx shadcn-ui@latest --help
```

## 📚 文档

- 🏠 [官网首页](https://qiuye-ui.vercel.app)
- 🎨 [组件浏览器](https://qiuye-ui.vercel.app/components)
- 💻 [CLI 使用指南](https://qiuye-ui.vercel.app/cli)
- 🔌 [API 文档](https://qiuye-ui.vercel.app/api/components)

## 🏗️ 本地开发

### 环境要求

- Node.js >= 18.17
- pnpm >= 8.0 (推荐) 或 npm/yarn

### 开发步骤

```bash
# 1. 克隆项目
git clone https://github.com/qiuye/qiuye-ui-components.git
cd qiuye-ui-components

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 访问应用
# 打开 http://localhost:3000
```

### 项目结构

```text
qiuye-ui-components/
├── app/                        # Next.js 应用目录
│   ├── components/            # 组件浏览页面
│   ├── cli/                   # CLI 使用指南页面
│   ├── api/                   # API 端点
│   └── page.tsx               # 首页
├── components/
│   ├── qiuye-ui/             # 自定义组件库
│   │   ├── animated-button.tsx
│   │   ├── gradient-card.tsx
│   │   ├── typing-text.tsx
│   │   └── demos/            # 组件演示
│   └── ui/                   # Shadcn/ui 基础组件
├── lib/
│   └── registry.ts           # 组件注册表
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

- `/registry/index.json` - 所有可用组件列表
- `/registry/[component].json` - 单个组件的详细配置和源代码
- 兼容 shadcn/ui CLI 工具标准

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qiuye/qiuye-ui-components)

### 自定义部署

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

## 🤝 贡献

欢迎贡献新的组件或改进现有组件！

### 贡献步骤

1. Fork 这个仓库
2. 创建特性分支 (`git checkout -b feature/new-component`)
3. 在 `components/qiuye-ui/` 中添加你的组件
4. 在 `lib/registry.ts` 中注册组件
5. 创建演示组件 (`components/qiuye-ui/demos/`)
6. 提交更改 (`git commit -m 'Add new component'`)
7. 推送分支 (`git push origin feature/new-component`)
8. 创建 Pull Request

### 组件开发指南

每个新组件应该包含：

- ✅ 组件源代码 (TypeScript + React)
- ✅ Props 类型定义
- ✅ 演示组件
- ✅ 在注册表中的配置
- ✅ 支持主题切换
- ✅ 响应式设计

## 📄 许可证

MIT License © 2024 秋夜

## 🙏 致谢

- [Shadcn/ui](https://ui.shadcn.com/) - 优秀的组件库设计理念
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍的 UI 原语

## 📞 支持

如果这个项目对您有帮助，请给它一个 ⭐️！

- 🐛 [报告问题](https://github.com/qiuye/qiuye-ui-components/issues)
- 💡 [功能建议](https://github.com/qiuye/qiuye-ui-components/discussions)
- 🤝 [贡献代码](https://github.com/qiuye/qiuye-ui-components/pulls)

---

<div align="center">
  Made with ❤️ by 秋夜
</div>
