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

// 仅显示复制按钮，不显示文件名
function PanelCopyOnlyDemo() {
  return (
    <CodeBlockPanel code={code}>
      <CodeBlock language="python" isDark>
        {code}
      </CodeBlock>
    </CodeBlockPanel>
  );
}`,
  noShadow: `import { CodeBlock } from "@/components/qiuye-ui/code-block";

function NoShadowDemo() {
  return (
    <CodeBlock language="typescript" noShadow>
      {\`const message = "无阴影代码块";
console.log(message);\`}
    </CodeBlock>
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
  const [selectedTheme, setSelectedTheme] = useState<string>("qiuvision");
  const [showPanel, setShowPanel] = useState(false);

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
          <CodeBlockPanel filename="hooks/use-list-manager.ts" code={sampleTypeScript.slice(0, sampleTypeScript.indexOf("\n\n  // 过滤 + 排序"))}>
            <CodeBlock
              language="typescript"
              isDark
              colorTheme="qiuvision"
            >
              {sampleTypeScript.slice(0, sampleTypeScript.indexOf("\n\n  // 过滤 + 排序"))}
            </CodeBlock>
          </CodeBlockPanel>

          {/* 仅复制按钮，不带文件名 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              不传 <code className="text-xs bg-muted px-1 py-0.5 rounded">filename</code> 时仅显示复制按钮：
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
              搭配 <code className="text-xs bg-muted px-1 py-0.5 rounded">displayMode=&quot;scroll&quot;</code> 使用：
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
            <ViewSourceButton code={sourceCodes.themes} />
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
              code={sampleTypeScript.slice(0, sampleTypeScript.indexOf("\n\n  // 分页"))}
              colorTheme={selectedTheme as "qiuvision"}
              isDark={isDark}
            >
              <CodeBlock
                language="typescript"
                colorTheme={selectedTheme as "qiuvision"}
                isDark={isDark}
              >
                {sampleTypeScript.slice(0, sampleTypeScript.indexOf("\n\n  // 分页"))}
              </CodeBlock>
            </CodeBlockPanel>
          ) : (
            <CodeBlock
              language="typescript"
              colorTheme={selectedTheme as "qiuvision"}
              isDark={isDark}
            >
              {sampleTypeScript.slice(0, sampleTypeScript.indexOf("\n\n  // 分页"))}
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
              <Badge variant="secondary">displayMode=&quot;collapse&quot;</Badge>
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
                高度自动适配父容器（如 Dialog），无需手动设置 maxHeight，适合弹窗 / Flex 布局场景
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">displayMode=&quot;auto-height&quot;</Badge>
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
          <CodeBlock
            language="python"
            isDark={isDark}
            colorTheme="vitesse"
          >
            {samplePython.slice(0, samplePython.indexOf("\n\nclass APIClient"))}
          </CodeBlock>
        </CardContent>
      </Card>

      {/* 8. 无阴影模式 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">无阴影模式</CardTitle>
              <CardDescription>
                通过 noShadow 属性移除代码块容器的 box-shadow，适合嵌入卡片等已有阴影的容器中
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">noShadow</Badge>
              <ViewSourceButton code={sourceCodes.noShadow} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">默认（有阴影）</p>
              <CodeBlock language="typescript" isDark={isDark}>
                {`const a = "有阴影";\nconsole.log(a);`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">noShadow（无阴影）</p>
              <CodeBlock language="typescript" isDark={isDark} noShadow>
                {`const b = "无阴影";\nconsole.log(b);`}
              </CodeBlock>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. 面板 + 折叠模式组合 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">面板 + 折叠模式组合</CardTitle>
              <CardDescription>
                CodeBlockPanel 搭配 displayMode=&quot;collapse&quot; 使用，面板自动重置内部样式
              </CardDescription>
            </div>
            <Badge variant="secondary">组合用法</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CodeBlockPanel filename="hooks/use-list-manager.ts" code={sampleTypeScript}>
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
    </div>
  );
}
