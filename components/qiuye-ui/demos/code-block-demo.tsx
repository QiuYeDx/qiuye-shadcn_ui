"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  CodeBlock,
  CodeBlockPanel,
  CODE_BLOCK_COLOR_THEME_NAMES,
} from "../code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewSourceButton } from "@/components/view-source-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

/* -------------------------------------------------------------------------- */
/*                              Source Codes                                   */
/* -------------------------------------------------------------------------- */

const sourceCodes = {
  basic: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function BasicDemo() {
  return (
    <CodeBlock language="typescript">
      {\`const greeting = "Hello, World!";
console.log(greeting);\`}
    </CodeBlock>
  );
}`,
  themes: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function ThemeDemo() {
  return (
    <CodeBlock
      language="typescript"
      colorTheme="dracula"
      isDark={true}
    >
      {\`function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}\`}
    </CodeBlock>
  );
}`,
  collapse: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function CollapseDemo() {
  return (
    <CodeBlock
      language="typescript"
      displayMode="collapse"
      maxLines={10}
    >
      {\`// 代码超过 maxLines 行时自动折叠
// 点击"展开全部"按钮查看完整代码\`}
    </CodeBlock>
  );
}`,
  scroll: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function ScrollDemo() {
  return (
    <CodeBlock
      language="typescript"
      displayMode="scroll"
      maxHeight="300px"
    >
      {\`// 代码超出 maxHeight 时纵向滚动
// 带滚动阴影指示器\`}
    </CodeBlock>
  );
}`,
  autoHeight: `import { CodeBlock } from "@/components/qiuye-ui/code-block";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function AutoHeightDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">打开代码预览</Button>
      </DialogTrigger>
      <DialogContent className="h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>代码预览</DialogTitle>
        </DialogHeader>
        {/* flex-1 + min-h-0 让 CodeBlock 自适应剩余高度 */}
        <div className="flex-1 min-h-0">
          <CodeBlock
            language="typescript"
            displayMode="auto-height"
          >
            {\`// 代码块高度跟随 Dialog 自适应
// 无需手动设置 maxHeight\`}
          </CodeBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
}`,
  panel: `import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";

const code = \`export function greet(name: string) {
  return \\\`Hello, \\\${name}!\\\`;
}\`;

function PanelDemo() {
  return (
    <CodeBlockPanel filename="utils.ts" code={code}>
      <CodeBlock language="typescript" isDark>
        {code}
      </CodeBlock>
    </CodeBlockPanel>
  );
}`,
  panelNoFilename: `import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";

// 不传 filename 时自动显示语言类型标签
function PanelLanguageLabelDemo() {
  return (
    <CodeBlockPanel language="python" code={code}>
      <CodeBlock language="python" isDark>
        {code}
      </CodeBlock>
    </CodeBlockPanel>
  );
}`,
  panelTrafficLights: `import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";

// 不传 filename 和 language 时，自动显示 macOS 风格装饰圆点
function PanelTrafficLightsDemo() {
  return (
    <CodeBlockPanel code={code}>
      <CodeBlock language="typescript" isDark>
        {code}
      </CodeBlock>
    </CodeBlockPanel>
  );
}`,
  shadow: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function ShadowDemo() {
  return (
    <CodeBlock language="typescript" noShadow={false}>
      {\`const message = "带阴影的代码块";
console.log(message);\`}
    </CodeBlock>
  );
}`,
  showLineNumbers: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function LineNumbersDemo() {
  return (
    <div className="space-y-4">
      {/* 始终隐藏行号 */}
      <CodeBlock language="typescript" showLineNumbers={false}>
        {\`const a = "始终隐藏行号";
console.log(a);\`}
      </CodeBlock>

      {/* 代码 >= 5 行时才显示行号 */}
      <CodeBlock language="typescript" showLineNumbers={5}>
        {\`const b = "少于 5 行时隐藏行号";
console.log(b);\`}
      </CodeBlock>
    </div>
  );
}`,
  highlightLines: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function HighlightDemo() {
  return (
    <div className="space-y-6">
      {/* 数组形式指定行号 */}
      <CodeBlock language="tsx" highlightLines={[3, 4, 8, 9, 10]}>
        {\`// code here...\`}
      </CodeBlock>

      {/* 范围字符串 */}
      <CodeBlock language="tsx" highlightLines="3-4,8-10">
        {\`// code here...\`}
      </CodeBlock>
    </div>
  );
}`,
  diff: `import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";

const diffCode = \`@@ -1,8 +1,12 @@
 import { useState, useCallback } from "react";

-export function useCounter(initial = 0) {
+interface CounterOptions { min?: number; max?: number }
+
+export function useCounter(initial = 0, opts?: CounterOptions) {
   const [count, setCount] = useState(initial);
-  const increment = useCallback(() => setCount(c => c + 1), []);
+  const increment = useCallback(() => {
+    setCount(c => opts?.max != null ? Math.min(c + 1, opts.max) : c + 1);
+  }, [opts?.max]);
   return { count, increment };
 }\`;

function DiffDemo() {
  return (
    <CodeBlockPanel filename="hooks/use-counter.ts" code={diffCode}>
      <CodeBlock language="diff" isDark diff>
        {diffCode}
      </CodeBlock>
    </CodeBlockPanel>
  );
}`,
};

/* -------------------------------------------------------------------------- */
/*                              Sample Codes                                  */
/* -------------------------------------------------------------------------- */

const sampleTypeScript = `import { useState, useEffect, useCallback, useMemo } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
}

type FilterFn<T> = (item: T) => boolean;

/**
 * 通用列表管理 Hook
 * 支持过滤、排序、分页
 */
export function useListManager<T extends { id: number }>(
  initialItems: T[],
  pageSize: number = 10,
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [filter, setFilter] = useState<FilterFn<T> | null>(null);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDesc, setSortDesc] = useState(false);

  // 过滤 + 排序
  const processed = useMemo(() => {
    let result = filter ? items.filter(filter) : [...items];

    if (sortKey) {
      result.sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (va < vb) return sortDesc ? 1 : -1;
        if (va > vb) return sortDesc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [items, filter, sortKey, sortDesc]);

  // 分页
  const paginated = useMemo(
    () => processed.slice(page * pageSize, (page + 1) * pageSize),
    [processed, page, pageSize],
  );

  const totalPages = Math.ceil(processed.length / pageSize);

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback((id: number, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }, []);

  // 重置分页
  useEffect(() => {
    setPage(0);
  }, [filter, sortKey, sortDesc]);

  return {
    items: paginated,
    totalItems: processed.length,
    totalPages,
    page,
    setPage,
    setFilter,
    setSortKey,
    setSortDesc,
    addItem,
    removeItem,
    updateItem,
  };
}`;

const samplePython = `from dataclasses import dataclass, field
from typing import Optional, List
import asyncio
import aiohttp


@dataclass
class Config:
    """应用配置"""
    base_url: str = "https://api.example.com"
    timeout: int = 30
    max_retries: int = 3
    headers: dict = field(default_factory=lambda: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    })


class APIClient:
    """异步 API 客户端"""

    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()
        self._session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self._session = aiohttp.ClientSession(
            headers=self.config.headers,
            timeout=aiohttp.ClientTimeout(total=self.config.timeout),
        )
        return self

    async def __aexit__(self, *args):
        if self._session:
            await self._session.close()

    async def get(self, endpoint: str, **params) -> dict:
        """发送 GET 请求"""
        url = f"{self.config.base_url}/{endpoint}"
        for attempt in range(self.config.max_retries):
            try:
                async with self._session.get(url, params=params) as resp:
                    resp.raise_for_status()
                    return await resp.json()
            except aiohttp.ClientError as e:
                if attempt == self.config.max_retries - 1:
                    raise
                await asyncio.sleep(2 ** attempt)


async def main():
    async with APIClient() as client:
        users = await client.get("users", page=1, limit=10)
        print(f"获取到 {len(users)} 个用户")


if __name__ == "__main__":
    asyncio.run(main())`;

const sampleDiff = `@@ -1,12 +1,18 @@
 import { useState, useCallback } from "react";
 
-export function useCounter(initial: number = 0) {
+interface UseCounterOptions {
+  min?: number;
+  max?: number;
+}
+
+export function useCounter(initial = 0, options?: UseCounterOptions) {
   const [count, setCount] = useState(initial);
 
-  const increment = useCallback(() => setCount(c => c + 1), []);
-  const decrement = useCallback(() => setCount(c => c - 1), []);
+  const increment = useCallback(() => {
+    setCount(c => options?.max != null ? Math.min(c + 1, options.max) : c + 1);
+  }, [options?.max]);
+
+  const decrement = useCallback(() => {
+    setCount(c => options?.min != null ? Math.max(c - 1, options.min) : c - 1);
+  }, [options?.min]);
 
-  return { count, increment, decrement };
+  return { count, increment, decrement, reset: () => setCount(initial) };
 }`;

const sampleJSX = `import React, { useState } from "react";

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span className="text-xl font-bold">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`;

/* -------------------------------------------------------------------------- */
/*                              Demo Component                                */
/* -------------------------------------------------------------------------- */

export function CodeBlockDemo() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedTheme, setSelectedTheme] = useState<string>("github");
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="space-y-8">
      {/* 1. 基础用法 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">基础用法</CardTitle>
              <CardDescription>
                最简单的代码块展示，自动语法高亮
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">TypeScript</Badge>
              <ViewSourceButton code={sourceCodes.basic} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlock language="tsx" isDark={isDark}>
            {sampleJSX}
          </CodeBlock>
        </CardContent>
      </Card>

      {/* 2. 面板容器 - 文件名 + 复制按钮 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">面板容器</CardTitle>
              <CardDescription>
                仿 Tailwind CSS 官网风格的深色面板外壳，支持文件名标签与复制按钮
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">CodeBlockPanel</Badge>
              <ViewSourceButton code={sourceCodes.panel} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 带文件名 + 复制按钮 */}
          <CodeBlockPanel
            filename="hooks/use-list-manager.ts"
            code={sampleTypeScript.slice(
              0,
              sampleTypeScript.indexOf("\n\n  // 过滤 + 排序"),
            )}
          >
            <CodeBlock language="typescript" isDark colorTheme="qiuvision">
              {sampleTypeScript.slice(
                0,
                sampleTypeScript.indexOf("\n\n  // 过滤 + 排序"),
              )}
            </CodeBlock>
          </CodeBlockPanel>

          {/* 不传 filename，自动显示语言类型标签 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              不传{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                filename
              </code>{" "}
              时自动显示语言类型标签：
            </p>
            <CodeBlockPanel language="tsx" code={sampleJSX}>
              <CodeBlock language="tsx" isDark>
                {sampleJSX}
              </CodeBlock>
            </CodeBlockPanel>
          </div>

          {/* 不传 filename 和 language，显示 macOS 装饰圆点 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              不传{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                filename
              </code>{" "}
              和{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                language
              </code>{" "}
              时，自动显示 macOS 风格装饰圆点：
            </p>
            <CodeBlockPanel code={sampleJSX}>
              <CodeBlock language="tsx" isDark>
                {sampleJSX}
              </CodeBlock>
            </CodeBlockPanel>
          </div>

          {/* 面板 + 滚动模式组合 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              搭配{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                displayMode=&quot;scroll&quot;
              </code>{" "}
              使用：
            </p>
            <CodeBlockPanel filename="api_client.py" code={samplePython}>
              <CodeBlock
                language="python"
                isDark
                displayMode="scroll"
                maxHeight="250px"
              >
                {samplePython}
              </CodeBlock>
            </CodeBlockPanel>
          </div>
        </CardContent>
      </Card>

      {/* 3. 配色主题切换 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">配色主题</CardTitle>
              <CardDescription>
                7 套内置主题，自动适配浅色 / 深色模式
              </CardDescription>
            </div>
            {/* <ViewSourceButton code={sourceCodes.themes} /> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Label htmlFor="theme-select">选择主题</Label>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger id="theme-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_BLOCK_COLOR_THEME_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch
                id="theme-panel"
                checked={showPanel}
                onCheckedChange={setShowPanel}
              />
              <Label htmlFor="theme-panel" className="cursor-pointer text-sm">
                Panel 面板
              </Label>
            </div>
            <Badge variant="outline">{isDark ? "深色" : "浅色"}</Badge>
          </div>

          {showPanel ? (
            <CodeBlockPanel
              filename="example.ts"
              code={sampleTypeScript.slice(
                0,
                sampleTypeScript.indexOf("\n\n  // 分页"),
              )}
              colorTheme={selectedTheme as "qiuvision"}
              isDark={isDark}
            >
              <CodeBlock
                language="typescript"
                colorTheme={selectedTheme as "qiuvision"}
                isDark={isDark}
              >
                {sampleTypeScript.slice(
                  0,
                  sampleTypeScript.indexOf("\n\n  // 分页"),
                )}
              </CodeBlock>
            </CodeBlockPanel>
          ) : (
            <CodeBlock
              language="typescript"
              colorTheme={selectedTheme as "qiuvision"}
              isDark={isDark}
            >
              {sampleTypeScript.slice(
                0,
                sampleTypeScript.indexOf("\n\n  // 分页"),
              )}
            </CodeBlock>
          )}
        </CardContent>
      </Card>

      {/* 4. 折叠模式 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">折叠模式</CardTitle>
              <CardDescription>
                超出行数自动折叠，渐变遮罩 + 展开/收起按钮
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                displayMode=&quot;collapse&quot;
              </Badge>
              <ViewSourceButton code={sourceCodes.collapse} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="typescript"
            isDark={isDark}
            displayMode="collapse"
            maxLines={10}
          >
            {sampleTypeScript}
          </CodeBlock>
        </CardContent>
      </Card>

      {/* 5. 滚动模式 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">滚动模式</CardTitle>
              <CardDescription>
                设置最大高度，超出部分纵向滚动，带滚动阴影指示器
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">displayMode=&quot;scroll&quot;</Badge>
              <ViewSourceButton code={sourceCodes.scroll} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="python"
            isDark={isDark}
            displayMode="scroll"
            maxHeight="300px"
          >
            {samplePython}
          </CodeBlock>
        </CardContent>
      </Card>

      {/* 6. 自适应高度模式 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">自适应高度模式</CardTitle>
              <CardDescription>
                高度自动适配父容器（如 Dialog），无需手动设置
                maxHeight，适合弹窗 / Flex 布局场景
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                displayMode=&quot;auto-height&quot;
              </Badge>
              <ViewSourceButton code={sourceCodes.autoHeight} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                打开代码预览
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[70vh] max-h-[70vh] sm:max-w-2xl flex flex-col gap-0 p-0 overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                <DialogTitle>自适应高度代码预览</DialogTitle>
                <DialogDescription>
                  代码块高度跟随 Dialog 剩余空间自适应，超出部分可滚动
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 min-h-0 px-6 pb-6">
                <CodeBlock
                  language="typescript"
                  isDark={isDark}
                  displayMode="auto-height"
                >
                  {sampleTypeScript}
                </CodeBlock>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* 7. 多语言示例 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">多语言支持</CardTitle>
              <CardDescription>
                支持 TypeScript、Python、JSX/TSX 等多种编程语言
              </CardDescription>
            </div>
            <Badge variant="secondary">Python</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlock language="python" isDark={isDark} colorTheme="vitesse">
            {samplePython.slice(0, samplePython.indexOf("\n\nclass APIClient"))}
          </CodeBlock>
        </CardContent>
      </Card>

      {/* 8. 容器阴影 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">容器阴影</CardTitle>
              <CardDescription>
                默认不显示容器阴影；通过 noShadow=&#123;false&#125; 可启用
                box-shadow，适合需要层次感的独立展示场景
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">noShadow</Badge>
              <ViewSourceButton code={sourceCodes.shadow} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                默认（无阴影）
              </p>
              <CodeBlock language="typescript" isDark={isDark}>
                {`const a = "默认无阴影";\nconsole.log(a);`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  noShadow=&#123;false&#125;
                </code>
                （有阴影）
              </p>
              <CodeBlock language="typescript" isDark={isDark} noShadow={false}>
                {`const b = "启用阴影";\nconsole.log(b);`}
              </CodeBlock>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. 行号显示控制 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">行号显示控制</CardTitle>
              <CardDescription>
                通过 showLineNumbers
                控制行号显示策略：始终显示、始终隐藏、或按行数阈值自动切换
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">showLineNumbers</Badge>
              <ViewSourceButton code={sourceCodes.showLineNumbers} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 始终隐藏行号 */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                showLineNumbers=&#123;false&#125;
              </code>{" "}
              — 始终隐藏行号
            </p>
            <CodeBlock language="tsx" isDark={isDark} showLineNumbers={false}>
              {sampleJSX}
            </CodeBlock>
          </div>

          {/* 按行数阈值自动切换 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  showLineNumbers=&#123;15&#125;
                </code>{" "}
                — 代码不足 15 行，自动隐藏
              </p>
              <CodeBlock language="tsx" isDark={isDark} showLineNumbers={15}>
                {sampleJSX}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  showLineNumbers=&#123;15&#125;
                </code>{" "}
                — 代码超过 15 行，自动显示
              </p>
              <CodeBlock
                language="typescript"
                isDark={isDark}
                showLineNumbers={15}
              >
                {sampleTypeScript.slice(
                  0,
                  sampleTypeScript.indexOf("\n\n  // 分页"),
                )}
              </CodeBlock>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 10. 面板 + 折叠模式组合 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">面板 + 折叠模式组合</CardTitle>
              <CardDescription>
                CodeBlockPanel 搭配 displayMode=&quot;collapse&quot;
                使用，面板自动重置内部样式
              </CardDescription>
            </div>
            <Badge variant="secondary">组合用法</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlockPanel
            filename="hooks/use-list-manager.ts"
            code={sampleTypeScript}
          >
            <CodeBlock
              language="typescript"
              isDark
              displayMode="collapse"
              maxLines={8}
            >
              {sampleTypeScript}
            </CodeBlock>
          </CodeBlockPanel>
        </CardContent>
      </Card>

      {/* 11. Diff 高亮模式 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Diff 高亮模式</CardTitle>
              <CardDescription>
                自动识别 +/- 行首标记，以绿色（新增）/
                红色（删除）背景高亮显示代码变更，搭配左侧彩色指示条
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">diff</Badge>
              <ViewSourceButton code={sourceCodes.diff} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <CodeBlockPanel
            filename="hooks/use-counter.ts"
            code={sampleDiff}
            isDark={isDark}
            colorTheme="github"
          >
            <CodeBlock colorTheme="github" language="ts" isDark={isDark} diff>
              {sampleDiff}
            </CodeBlock>
          </CodeBlockPanel>

          <div>
            <p className="text-sm text-muted-foreground mb-3">
              搭配{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                displayMode=&quot;scroll&quot;
              </code>{" "}
              使用：
            </p>
            <CodeBlockPanel
              filename="hooks/use-counter.ts"
              code={sampleDiff}
              isDark={isDark}
              colorTheme="github"
            >
              <CodeBlock
                colorTheme="github"
                language="ts"
                isDark={isDark}
                diff
                displayMode="scroll"
                maxHeight="200px"
              >
                {sampleDiff}
              </CodeBlock>
            </CodeBlockPanel>
          </div>
        </CardContent>
      </Card>

      {/* 12. 行高亮 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">行高亮</CardTitle>
              <CardDescription>
                通过 highlightLines
                标记指定行号，以淡蓝色背景高亮显示关键代码行，代码内容不附加任何标记
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">highlightLines</Badge>
              <ViewSourceButton code={sourceCodes.highlightLines} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              数组形式{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                highlightLines=&#123;[3, 4, 8, 9, 10]&#125;
              </code>
              ：
            </p>
            <CodeBlock
              language="tsx"
              isDark={isDark}
              highlightLines={[3, 4, 8, 9, 10]}
            >
              {sampleJSX}
            </CodeBlock>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">
              范围字符串{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                highlightLines=&quot;3-4,8-10&quot;
              </code>
              （等价写法）：
            </p>
            <CodeBlockPanel
              filename="components/counter.tsx"
              code={sampleJSX}
              isDark={isDark}
            >
              <CodeBlock
                language="tsx"
                isDark={isDark}
                highlightLines="3-4,8-10"
              >
                {sampleJSX}
              </CodeBlock>
            </CodeBlockPanel>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
