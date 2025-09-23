> 基于 Next.js 15 + shadcn/ui，打造属于自己的组件库生态

## 前言

在现代前端开发中，组件库的重要性不言而喻。shadcn/ui 以其优雅的设计理念和灵活的定制性赢得了开发者的青睐。但是，当我们需要在多个项目中复用自定义组件时，如何像 shadcn/ui 一样，通过简单的 CLI 命令就能安装到任何项目中呢？

本文将基于实际项目（秋夜组件库）的开发经验，详细介绍如何从零搭建一个支持 CLI 安装的 shadcn/ui 组件库。

## 关键易错点（个人笔记）

### 关键理解

- **组件库这边**：先在`components/qiuye-ui/xxx.tsx`中写自定义组件，然后在`public/registry/xxx.json`中写这个自定义组件的注册表信息，注意`type`、`path`和`target`一定要写对，可以看下文的示例。最后执行`update-registry.mjs`脚本自动填充`content`。
- **应用方**：建议在`components.json`中配置`registries`，这样即可使用`npx shadcn@latest add @qiuye-ui/xxx`命令来安装指定的自定义组件；如果不配置`registries`，那么也可以用`npx shadcn@latest add "https://<部署后的域名>/registry/xxx.json`（即`add`后写能访问到指定组件注册表json文件的路径）命令安装。

> 配置 registries 示例
```json
"registries": {
    "@qiuye-ui": "http://localhost:3000/registry/{name}.json"
  },
```

### 标准的可用的组件 xxx.json 示例

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "typing-text",
  "title": "TypingText",
  "type": "registry:component",
  "author": "QiuYeDx <me@qiuyedx.com>",
  "dependencies": [
    "react"
  ],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/typing-text.tsx",
      "target": "src/components/qiuye-ui/typing-text.tsx",
      "content": "\"use client\";\n\nimport React, { useState, useEffect } from \"react\";\nimport { cn } from \"@/lib/utils\";\n\nexport interface TypingTextProps extends React.HTMLAttributes<HTMLDivElement> {\n  text: string | string[];\n  speed?: number;\n  loop?: boolean;\n  showCursor?: boolean;\n}\n\nconst TypingText = React.forwardRef<HTMLDivElement, TypingTextProps>(\n  ({ \n    className, \n    text, \n    speed = 100, \n    loop = false, \n    showCursor = true, \n    ...props \n  }, ref) => {\n    const [displayedText, setDisplayedText] = useState(\"\");\n    const [currentIndex, setCurrentIndex] = useState(0);\n    const [currentTextIndex, setCurrentTextIndex] = useState(0);\n    const [isDeleting, setIsDeleting] = useState(false);\n    const [isPaused, setIsPaused] = useState(false);\n\n    const textArray = Array.isArray(text) ? text : [text];\n    const currentText = textArray[currentTextIndex];\n\n    useEffect(() => {\n      if (isPaused) return;\n\n      const timeout = setTimeout(() => {\n        if (!isDeleting) {\n          // 正在输入\n          if (currentIndex < currentText.length) {\n            setDisplayedText(currentText.slice(0, currentIndex + 1));\n            setCurrentIndex(currentIndex + 1);\n          } else {\n            // 输入完成，如果是数组且启用循环，则暂停后开始删除\n            if (textArray.length > 1 && loop) {\n              setIsPaused(true);\n              setTimeout(() => {\n                setIsDeleting(true);\n                setIsPaused(false);\n              }, 1000); // 暂停1秒\n            } else if (textArray.length === 1 && loop) {\n              // 单个文本循环\n              setIsPaused(true);\n              setTimeout(() => {\n                setIsDeleting(true);\n                setIsPaused(false);\n              }, 1000);\n            }\n          }\n        } else {\n          // 正在删除\n          if (currentIndex > 0) {\n            setDisplayedText(currentText.slice(0, currentIndex - 1));\n            setCurrentIndex(currentIndex - 1);\n          } else {\n            // 删除完成，切换到下一个文本\n            setIsDeleting(false);\n            if (textArray.length > 1) {\n              setCurrentTextIndex((currentTextIndex + 1) % textArray.length);\n            }\n          }\n        }\n      }, isDeleting ? speed / 2 : speed); // 删除速度比输入速度快一倍\n\n      return () => clearTimeout(timeout);\n    }, [currentIndex, currentText, currentTextIndex, isDeleting, isPaused, loop, speed, textArray]);\n\n    return (\n      <div\n        className={cn(\"inline-flex items-center\", className)}\n        ref={ref}\n        {...props}\n      >\n        <span className=\"font-mono\">\n          {displayedText}\n          {showCursor && (\n            <span className=\"ml-0.5 animate-pulse text-foreground/60\">|</span>\n          )}\n        </span>\n      </div>\n    );\n  }\n);\n\nTypingText.displayName = \"TypingText\";\n\nexport { TypingText };\n"
    }
  ]
}
```

PS：
- `content`内容可以通过脚本一键生成
- `npx`可用`pnpm dlx`替换

## 项目概览

### 🎯 目标

- ✅ 基于 shadcn/ui 构建自定义组件
- ✅ 支持 `npx shadcn@latest add @your-lib/component` CLI 安装
- ✅ 提供在线组件浏览器
- ✅ 自动化注册表管理
- ✅ 支持多种安装方式

### 🛠️ 技术栈

- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS 4 + shadcn/ui
- **动画**: Motion（React Framer Motion 的新版本）
- **类型**: TypeScript 5
- **部署**: Vercel

## 核心架构设计

### 1. 项目结构

```
your-component-library/
├── app/                        # Next.js App Router
│   ├── components/            # 组件浏览页面
│   ├── cli/                   # CLI 使用指南
│   └── page.tsx               # 首页
├── components/
│   ├── qiuye-ui/             # 自定义组件库
│   │   ├── animated-button.tsx
│   │   ├── gradient-card.tsx
│   │   └── demos/            # 组件演示
│   └── ui/                   # shadcn/ui 基础组件
├── public/
│   └── registry/             # 组件注册表（核心）
│       ├── animated-button.json
│       ├── gradient-card.json
│       └── typing-text.json
├── scripts/
│   └── update-registry.mjs   # 自动更新脚本
└── lib/
    └── registry.ts           # 组件元数据
```

### 2. 注册表机制

shadcn/ui 的 CLI 工具基于**注册表（Registry）**机制工作。每个组件都需要一个 JSON 文件来描述其配置：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "animated-button",
  "title": "AnimatedButton", 
  "type": "registry:component",
  "author": "YourName <email@example.com>",
  "dependencies": [
    "motion",
    "class-variance-authority",
    "clsx"
  ],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/qiuye-ui/animated-button.tsx",
      "target": "src/components/qiuye-ui/animated-button.tsx",
      "content": "组件源代码..."
    }
  ]
}
```

## 详细实现步骤

### Step 1: 项目初始化

```bash
# 创建 Next.js 项目
npx create-next-app@latest my-component-library --typescript --tailwind --app

# 安装 shadcn/ui
npx shadcn@latest init

# 安装必要依赖
npm install motion class-variance-authority clsx
npm install lucide-react use-clipboard-copy sonner
```

### Step 2: 创建组件结构

在 `components/your-ui/` 目录下创建自定义组件：

```tsx
// components/your-ui/animated-button.tsx
"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2", 
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const animationVariants = {
  bounce: {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  },
  pulse: {
    hover: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, repeat: Infinity },
    },
    tap: { scale: 0.95 },
  },
};

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap">,
    VariantProps<typeof animatedButtonVariants> {
  animation?: "bounce" | "pulse";
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, animation = "bounce", children, ...props }, ref) => {
    const selectedAnimation = animationVariants[animation];

    return (
      <motion.button
        className={cn(animatedButtonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={selectedAnimation.hover}
        whileTap={selectedAnimation.tap}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
```

### Step 3: 创建注册表文件

在 `public/registry/` 目录下为每个组件创建 JSON 文件：

```json
// public/registry/animated-button.json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "animated-button",
  "title": "AnimatedButton",
  "type": "registry:component", 
  "author": "YourName <email@example.com>",
  "dependencies": [
    "motion",
    "class-variance-authority",
    "clsx"
  ],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "path": "components/your-ui/animated-button.tsx",
      "target": "src/components/your-ui/animated-button.tsx",
      "content": ""
    }
  ]
}
```

### Step 4: 自动化脚本

创建自动更新注册表的脚本 `scripts/update-registry.mjs`：

```javascript
// scripts/update-registry.mjs
import fs from "fs/promises";
import path from "path";

const argv = parseArgs(process.argv.slice(2));
const REGISTRY_DIR = argv.dir ?? "public/registry";
const COMPONENT_BASE = argv.base ?? ".";
const DRY_RUN = hasFlag(argv, "dry");

function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

function hasFlag(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== "false";
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

async function processRegistryJson(jsonPath) {
  const data = await JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  let changed = false;

  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];
    if (file.type !== "registry:component") continue;

    const componentPath = path.join(COMPONENT_BASE, file.path);
    try {
      const content = await fs.readFile(componentPath, "utf-8");
      if (file.content !== content) {
        if (!DRY_RUN) {
          data.files[i] = { ...file, content };
        }
        changed = true;
        console.log(`✅ 更新组件: ${file.path}`);
      }
    } catch (error) {
      console.error(`❌ 组件文件不存在: ${file.path}`);
    }
  }

  if (changed && !DRY_RUN) {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n");
  }

  return changed;
}

async function main() {
  console.log(`🔎 扫描注册表目录: ${REGISTRY_DIR}`);
  if (DRY_RUN) console.log(`🧪 预览模式 - 不会实际修改文件`);

  let total = 0;
  let updated = 0;

  for await (const filePath of walk(REGISTRY_DIR)) {
    if (!filePath.endsWith(".json")) continue;
    
    total++;
    if (await processRegistryJson(filePath)) {
      updated++;
    }
  }

  console.log(`\n✨ 完成！处理了 ${total} 个文件，更新了 ${updated} 个组件`);
}

main().catch(console.error);
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "update-registry": "node scripts/update-registry.mjs --dir public/registry --base .",
    "update-registry:dry": "node scripts/update-registry.mjs --dir public/registry --base . --dry"
  }
}
```

### Step 5: 组件浏览器

创建组件展示页面，让用户可以在线预览：

```tsx
// app/components/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

const components = [
  {
    id: "animated-button",
    name: "Animated Button",
    description: "带动画效果的按钮组件",
    category: "按钮",
    cliName: "animated-button",
  },
  // ... 其他组件
];

export default function ComponentsPage() {
  const clipboard = useClipboard();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyCommand = (componentId: string) => {
    const command = `npx shadcn@latest add @your-lib/${componentId}`;
    clipboard.copy(command);
    setCopiedStates(prev => ({ ...prev, [componentId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [componentId]: false }));
    }, 2000);
    toast.success("复制成功！", {
      description: `已复制命令: ${command}`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">组件库</h1>
        <p className="text-lg text-muted-foreground">
          浏览所有可用组件，一键复制安装命令
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <Card key={component.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{component.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {component.description}
                  </p>
                </div>
                <Badge variant="secondary">{component.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 组件演示区域 */}
              <div className="p-4 bg-muted/30 rounded-lg">
                {/* 这里放置组件演示 */}
              </div>

              {/* CLI 命令 */}
              <div className="bg-muted/50 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">
                    npx shadcn@latest add @your-lib/{component.cliName}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCommand(component.id)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedStates[component.id] ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Step 6: CLI 使用指南

创建详细的 CLI 使用指南页面：

```tsx
// app/cli/page.tsx
export default function CLIPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">CLI 工具使用指南</h1>
      
      <div className="space-y-8">
        {/* 安装方式一：配置注册表 */}
        <Card>
          <CardHeader>
            <CardTitle>方式一：配置注册表（推荐）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>在项目的 <code>components.json</code> 中添加注册表配置：</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`{
  "registries": {
    "@your-lib": "https://your-domain.com/registry/{name}.json"
  }
}`}</code>
            </pre>
            <p>然后使用简化命令安装：</p>
            <pre className="bg-muted p-4 rounded-lg">
              <code>npx shadcn@latest add @your-lib/animated-button</code>
            </pre>
          </CardContent>
        </Card>

        {/* 安装方式二：直接 URL */}
        <Card>
          <CardHeader>
            <CardTitle>方式二：直接 URL 安装</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>无需配置，直接使用 URL 安装：</p>
            <pre className="bg-muted p-4 rounded-lg">
              <code>npx shadcn@latest add https://your-domain.com/registry/animated-button.json</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 部署与发布

### 1. 部署到 Vercel

```bash
# 构建项目
npm run build

# 更新注册表
npm run update-registry

# 提交代码
git add .
git commit -m "feat: update component registry"
git push

# 部署到 Vercel
vercel deploy --prod
```

### 2. 配置自定义域名

在 Vercel 控制台配置自定义域名，确保注册表 URL 稳定可访问。

## 用户使用流程

### 1. 用户项目配置

用户在自己的项目中配置 `components.json`：

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@your-lib": "https://your-domain.com/registry/{name}.json"
  }
}
```

### 2. 安装组件

```bash
# 安装单个组件
npx shadcn@latest add @your-lib/animated-button

# 批量安装
npx shadcn@latest add @your-lib/animated-button @your-lib/gradient-card
```

### 3. 使用组件

```tsx
import { AnimatedButton } from "@/components/your-ui/animated-button";

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

## 关键技术点与最佳实践

### 1. 组件设计原则

- **继承 shadcn/ui 设计理念**: 使用 CVA (Class Variance Authority) 管理样式变体
- **支持 forwardRef**: 确保 ref 可以正确传递
- **TypeScript 友好**: 提供完整的类型定义
- **主题兼容**: 支持深色/浅色主题切换

### 2. 注册表管理

- **自动化更新**: 使用脚本自动同步组件源码到注册表
- **版本管理**: 可以根据需要添加版本字段
- **依赖声明**: 明确声明 npm 依赖和注册表依赖

### 3. 开发工作流

```bash
# 1. 开发新组件
# 在 components/your-ui/ 下创建组件

# 2. 创建注册表文件
# 在 public/registry/ 下创建 JSON 配置

# 3. 更新注册表
npm run update-registry

# 4. 测试安装
npx shadcn@latest add @your-lib/new-component

# 5. 部署发布
git push  # 自动触发 Vercel 部署
```

### 4. CLI 兼容性

⚠️ **重要**: 确保使用最新的 CLI 命令：

```bash
# ✅ 正确 - 使用最新命令
npx shadcn@latest add @your-lib/component

# ❌ 错误 - 废弃命令
npx shadcn-ui@latest add your-lib/component
```

## 进阶功能

### 1. 组件分类管理

```typescript
// lib/registry.ts
export const componentCategories = {
  button: "按钮",
  card: "卡片", 
  text: "文本",
  form: "表单",
} as const;

export const components = [
  {
    id: "animated-button",
    name: "Animated Button",
    category: "button",
    // ...
  },
];
```

### 2. 搜索和筛选

```tsx
// 在组件浏览器中添加搜索功能
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("all");

const filteredComponents = components.filter(component => {
  const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
  return matchesSearch && matchesCategory;
});
```

### 3. 组件依赖管理

```json
{
  "registryDependencies": ["button", "card"],
  "devDependencies": ["@types/node"],
  "peerDependencies": ["react", "react-dom"]
}
```

### 4. 多样式主题支持

```json
{
  "style": "new-york",
  "variants": [
    {
      "style": "default",
      "files": [...]
    },
    {
      "style": "new-york", 
      "files": [...]
    }
  ]
}
```

## 常见问题与解决方案

### 1. 组件路径问题

**问题**: 用户安装后组件路径不正确

**解决**: 在注册表中正确配置 `target` 路径：

```json
{
  "path": "components/your-ui/button.tsx",
  "target": "src/components/your-ui/button.tsx"  // 用户项目中的目标路径
}
```

### 2. 依赖版本冲突

**问题**: 组件依赖的包版本与用户项目冲突

**解决**: 使用 `peerDependencies` 而非 `dependencies`，让用户自己管理版本。

### 3. 样式不生效

**问题**: 安装后样式不生效

**解决**: 确保用户的 Tailwind 配置包含组件路径：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/your-ui/**/*.{js,ts,jsx,tsx}",  // 添加这行
  ],
};
```

### 4. TypeScript 类型问题

**问题**: 类型定义找不到

**解决**: 确保组件正确导出类型：

```tsx
export type { AnimatedButtonProps } from "./animated-button";
export { AnimatedButton } from "./animated-button";
```

## 监控与分析

### 1. 使用统计

可以在注册表 API 中添加简单的使用统计：

```javascript
// api/registry/[...component].js
export async function GET(request) {
  const component = getComponent(request.params.component);
  
  // 记录使用统计
  await logUsage(component.name, request.ip);
  
  return Response.json(component);
}
```

### 2. 错误监控

使用 Sentry 等工具监控注册表 API 的错误率和响应时间。

## 总结与展望

通过本文的详细介绍，我们成功构建了一个完整的 shadcn/ui 组件库生态，实现了：

✅ **开发体验**: 类似 shadcn/ui 的便捷 CLI 安装  
✅ **自动化**: 脚本自动管理注册表，减少人工维护  
✅ **可扩展**: 支持多种安装方式和组件分类  
✅ **类型安全**: 完整的 TypeScript 支持  
✅ **文档完善**: 在线浏览器和使用指南  

### 未来优化方向

1. **版本管理**: 支持组件版本控制和向后兼容
2. **主题系统**: 支持多套设计主题
3. **可视化编辑**: 在线组件编辑器
4. **AI 辅助**: 基于 AI 的组件生成和优化建议
5. **性能优化**: 按需加载和树摇优化

### 开源生态

考虑将你的组件库开源，为社区贡献力量：

- 选择合适的开源协议（如 MIT）
- 建立贡献指南和行为准则  
- 设置 CI/CD 自动化测试和发布
- 建立社区讨论和反馈渠道

通过本文的实践，相信你已经掌握了构建 shadcn/ui 组件库的核心技能。去创造属于你自己的组件库生态吧！🚀

---

*本文基于实际项目开发经验总结，代码示例已在生产环境验证。如有问题或建议，欢迎交流讨论。*
