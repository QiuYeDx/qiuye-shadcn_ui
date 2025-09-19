# 🤖 AI Agent 开发指南

> 本文档专为 AI 大模型/代理提供项目开发指导，包含技术架构、代码规范、开发模式等详细信息。

## 📋 项目概览

### 基本信息

- **项目名称**: 秋夜 Next.js 模板 (Qiuye Next.js Template)
- **技术栈**: Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- **UI 框架**: shadcn/ui + Radix UI
- **包管理器**: pnpm (推荐)
- **构建工具**: Turbopack
- **环境要求**: Node.js >= 20 (shadcn/ui 要求), 开发需 >= 18
- **主要特性**: SSR/SSG、主题切换、响应式设计、动画效果

### 目录结构

```text
qiuye-nextjs-template/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式和 Tailwind 配置
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面组件
├── components/            # React 组件库
│   ├── ui/               # shadcn/ui 基础组件
│   ├── app-sidebar.tsx   # 应用侧边栏
│   ├── header.tsx        # 头部导航
│   ├── theme-provider.tsx # 主题上下文提供者
│   └── theme-toggle.tsx  # 主题切换组件
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数和配置
├── public/               # 静态资源
└── 配置文件...
```

## 🏗️ 技术架构

### Next.js App Router 架构

- **路由系统**: 基于文件系统的 App Router
- **渲染模式**: 支持 SSR、SSG、ISR 和客户端渲染
- **数据获取**: 使用 Server Components 和 Server Actions
- **布局系统**: 嵌套布局和模板系统

### 组件架构

```typescript
// 组件层次结构
RootLayout (app/layout.tsx)
├── ThemeProvider (全局主题)
├── Header (导航头部)
├── Sidebar (侧边栏)
└── Page Content (页面内容)
    ├── UI Components (shadcn/ui)
    └── Custom Components (自定义组件)
```

### 状态管理

- **全局状态**: Zustand (轻量级状态管理)
- **主题状态**: next-themes (主题切换)
- **表单状态**: React Hook Form (表单处理)
- **服务器状态**: React Query/SWR (数据同步)

### 样式系统

```css
/* Tailwind CSS 配置层次 */
1. Base Layer (基础样式)
2. Components Layer (组件样式)
3. Utilities Layer (工具类)
4. CSS Variables (主题变量)
```

## 🎨 UI 组件系统

### shadcn/ui 组件分类

#### 布局组件

- `Card`: 内容容器，支持 header/content/footer
- `Sheet`: 侧边抽屉，可配置方向和大小
- `Sidebar`: 导航侧边栏，可折叠
- `Resizable`: 可调整大小的面板

#### 表单组件

```typescript
// 表单组件使用模式
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 标准表单结构
<form>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">邮箱</Label>
      <Input id="email" type="email" placeholder="输入邮箱" />
    </div>
    <Button type="submit">提交</Button>
  </div>
</form>
```

#### 反馈组件

- `Alert Dialog`: 确认对话框
- `Toast`: 消息提示 (使用 sonner)
- `Progress`: 进度条
- `Skeleton`: 加载骨架屏

#### 导航组件

- `Navigation Menu`: 主导航菜单
- `Breadcrumb`: 面包屑导航
- `Pagination`: 分页组件
- `Tabs`: 标签页切换

### 组件使用规范

#### 1. 导入规范

```typescript
// ✅ 正确的导入方式
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ❌ 避免的导入方式
import Button from "@/components/ui/button"
```

#### 2. 类名组合

```typescript
// 使用 cn 工具函数组合类名
import { cn } from "@/lib/utils"

<Button 
  className={cn(
    "base-classes",
    variant === "primary" && "primary-classes",
    size === "large" && "large-classes",
    className
  )}
>
  按钮文本
</Button>
```

#### 3. 类型安全

```typescript
// 组件 Props 类型定义
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "outline"
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
}
```

## 🎯 开发模式和最佳实践

### 1. 服务器组件 vs 客户端组件

#### 服务器组件 (默认)

```typescript
// app/page.tsx - 服务器组件
import { getData } from "@/lib/api"

export default async function Page() {
  const data = await getData() // 在服务器端获取数据
  
  return (
    <div>
      <h1>服务器渲染内容</h1>
      <p>{data.content}</p>
    </div>
  )
}
```

#### 客户端组件

```typescript
// components/interactive-component.tsx
"use client" // 客户端组件标识

import { useState } from "react"

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      点击次数: {count}
    </button>
  )
}
```

### 2. 布局和模板模式

#### 根布局

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### 嵌套布局

```typescript
// app/dashboard/layout.tsx
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

### 3. 数据获取模式

#### 服务器端数据获取

```typescript
// 在服务器组件中
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // 缓存策略
  })
  
  if (!res.ok) {
    throw new Error('获取数据失败')
  }
  
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

#### 客户端数据获取

```typescript
"use client"

import { useState, useEffect } from "react"

export function ClientComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>加载中...</div>
  return <div>{data?.title}</div>
}
```

### 4. 样式和主题模式

#### CSS 变量主题系统

```css
/* app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

#### 主题切换组件

```typescript
// components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### 5. 动画和交互模式

#### Motion 动画

```typescript
import { motion } from "motion/react"

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      动画内容
    </motion.div>
  )
}
```

#### 滚动触发动画

```typescript
import { motion, useInView } from "motion/react"
import { useRef } from "react"

export function ScrollTriggeredAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      滚动触发的动画内容
    </motion.div>
  )
}
```

## 🔧 常见开发任务

### 1. 创建新页面

```bash
# 创建新页面
touch app/about/page.tsx

# 创建带布局的页面组
mkdir app/dashboard
touch app/dashboard/layout.tsx
touch app/dashboard/page.tsx
```

### 2. 添加新组件

```typescript
// components/custom-component.tsx
interface CustomComponentProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function CustomComponent({
  title,
  children,
  className
}: CustomComponentProps) {
  return (
    <div className={cn("default-classes", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### 3. 集成新的 shadcn/ui 组件

```bash
# 添加新组件
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add data-table
```

### 4. 创建 API 路由

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  
  // 处理逻辑
  
  return NextResponse.json({ data: "用户数据" })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // 处理 POST 请求
  
  return NextResponse.json({ success: true })
}
```

### 5. 状态管理设置

```typescript
// lib/store.ts
import { create } from 'zustand'

interface AppState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

## 🚨 故障排除和调试

### 常见问题和解决方案

#### 1. 主题闪烁问题

```typescript
// 确保在 html 标签添加 suppressHydrationWarning
<html lang="zh-CN" suppressHydrationWarning>
```

#### 2. 客户端/服务器组件混用错误

```typescript
// ❌ 错误：在服务器组件中使用客户端 hooks
export default function ServerComponent() {
  const [state, setState] = useState(0) // 错误！
  return <div>{state}</div>
}

// ✅ 正确：分离客户端逻辑
export default function ServerComponent() {
  return (
    <div>
      <ClientComponent /> {/* 客户端组件处理状态 */}
    </div>
  )
}
```

#### 3. CSS 样式优先级问题

```typescript
// 使用 cn 工具函数确保类名正确合并
import { cn } from "@/lib/utils"

<div className={cn(
  "base-styles",
  "override-styles", // 后面的类名会覆盖前面的
  conditionalClass && "conditional-styles"
)}>
```

#### 4. TypeScript 类型错误

```typescript
// 扩展组件 props 类型
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

// 使用泛型约束
interface GenericComponentProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
}
```

### 开发调试工具

#### 1. React DevTools

- 安装 React DevTools 浏览器扩展
- 查看组件树和 props
- 调试 hooks 状态

#### 2. Next.js 开发工具

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopack: true, // 开启 Turbopack
  },
  logging: {
    fetches: {
      fullUrl: true, // 显示完整的请求 URL
    },
  },
}
```

#### 3. Tailwind CSS 调试

```bash
# 安装 Tailwind CSS IntelliSense
# VS Code 扩展：bradlc.vscode-tailwindcss
```

## 📚 开发资源和参考

### 官方文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [React 19 文档](https://react.dev/)
- [Tailwind CSS 4 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com/)

### 关键配置文件

- `next.config.ts`: Next.js 配置
- `tailwind.config.js`: Tailwind CSS 配置
- `components.json`: shadcn/ui 配置
- `tsconfig.json`: TypeScript 配置
- `eslint.config.mjs`: ESLint 配置

### 开发命令

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 添加 shadcn/ui 组件
pnpm dlx shadcn@latest add [component-name]
```

---

*本文档为 AI 助手提供项目开发指导，定期更新以反映最新的开发实践和项目结构变化。*
