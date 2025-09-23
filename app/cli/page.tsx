"use client";

import { useState } from "react";
import { Copy, CheckCircle, Terminal, Package } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

export default function CLIPage() {
  const clipboard = useClipboard();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = (text: string, key: string) => {
    clipboard.copy(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
    toast.success("复制成功！", {
      description: `已复制: ${text}`,
    });
  };

  const CopyButton = ({ text, copyKey }: { text: string; copyKey: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, copyKey)}
      className="h-6 w-6 p-0"
    >
      {copiedStates[copyKey] ? (
        <CheckCircle className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  const CodeBlock = ({
    code,
    language = "bash",
    copyKey,
  }: {
    code: string;
    language?: string;
    copyKey: string;
  }) => (
    <div className="relative">
      <pre className="bg-muted/50 rounded-md p-4 pr-12 overflow-x-auto whitespace-pre-wrap break-words">
        <code className={`text-sm font-mono language-${language}`}>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} copyKey={copyKey} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 40,
          duration: 0.25,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">CLI 工具</h1>
            <p className="text-muted-foreground">
              一键安装和管理 QiuYe UI 组件
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>基于 shadcn/ui CLI</span>
          </div>
          <div className="flex items-center gap-2">
            <span>•</span>
            <span>官方工具支持</span>
          </div>
          <div className="flex items-center gap-2">
            <span>•</span>
            <span>无需额外安装</span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div>
        <Tabs defaultValue="installation" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 40,
              duration: 0.5,
              delay: 0.45,
            }}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="installation">安装</TabsTrigger>
              <TabsTrigger value="usage">使用</TabsTrigger>
              <TabsTrigger value="commands">命令</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 40,
              duration: 0.5,
              delay: 0.75,
            }}
          >
            {/* Installation Tab */}
            <TabsContent value="installation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>使用 Shadcn/ui CLI</CardTitle>
                  <CardDescription>
                    使用官方 shadcn/ui CLI 工具安装 QiuYe UI 组件
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">前置要求</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      确保您的项目已经安装并配置了 shadcn/ui：
                    </p>
                    <CodeBlock
                      code="npx shadcn@latest init"
                      copyKey="shadcn-init"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      如果还没有初始化 shadcn/ui，请先运行上述命令
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      方式一：配置注册表（推荐）
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      在项目根目录的{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        components.json
                      </code>{" "}
                      文件中添加QiuYe UI的注册表：
                    </p>
                    <CodeBlock
                      code={`{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}`}
                      language="json"
                      copyKey="registry-config"
                    />
                    <p className="text-sm text-muted-foreground mt-3 mb-3">
                      然后使用简化的命令安装组件：
                    </p>
                    <CodeBlock
                      code="npx shadcn@latest add @qiuye-ui/animated-button"
                      copyKey="install-component"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      方式二：直接URL安装
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      如果不想配置注册表，可以直接使用URL安装组件：
                    </p>
                    <CodeBlock
                      code="npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json"
                      copyKey="install-component-url"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      直接指定组件的注册表JSON文件URL进行安装
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>基本使用</CardTitle>
                  <CardDescription>
                    学习如何在您的项目中使用 QiuYe UI 组件
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. 安装组件</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      方式一：使用注册表名称（需先配置注册表）
                    </p>
                    <div className="space-y-3">
                      <CodeBlock
                        code="npx shadcn@latest add @qiuye-ui/animated-button"
                        copyKey="add-single"
                      />
                      <CodeBlock
                        code="npx shadcn@latest add @qiuye-ui/gradient-card @qiuye-ui/typing-text"
                        copyKey="add-multiple"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 mb-3">
                      方式二：直接使用URL（无需配置）
                    </p>
                    <div className="space-y-3">
                      <CodeBlock
                        code="npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json"
                        copyKey="add-single-url"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      支持单个组件安装或批量安装多个组件
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      2. 在代码中使用
                    </h3>
                    <CodeBlock
                      code={`import { AnimatedButton } from "@/components/qiuye-ui/animated-button";

export default function App() {
  return (
    <div>
      <AnimatedButton animation="bounce">
        点击我！
      </AnimatedButton>
    </div>
  );
}`}
                      language="tsx"
                      copyKey="usage-example"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      3. 查看可用组件
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      访问组件浏览器查看所有可用组件和演示：
                    </p>
                    <CodeBlock
                      code="https://qiuye-ui.vercel.app/components"
                      copyKey="component-browser"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>项目配置</CardTitle>
                  <CardDescription>自定义CLI工具的行为和设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">配置文件示例</h4>
                    <CodeBlock
                      code={`{
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
    "utils": "@/lib/utils",
    "qiuye-ui": "@/components/qiuye-ui"
  }
}`}
                      language="json"
                      copyKey="config-example"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commands Tab */}
            <TabsContent value="commands" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>常用命令</CardTitle>
                  <CardDescription>
                    使用官方 shadcn/ui CLI 管理 QiuYe UI 组件
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {[
                      {
                        command: "npx shadcn@latest init",
                        description: "初始化 shadcn/ui 项目配置",
                        example: "npx shadcn@latest init",
                      },
                      {
                        command: "npx shadcn@latest add @qiuye-ui/[component]",
                        description: "添加 QiuYe UI 组件（需配置注册表）",
                        example:
                          "npx shadcn@latest add @qiuye-ui/animated-button",
                      },
                      {
                        command: "npx shadcn@latest add [URL]",
                        description: "直接使用URL添加组件",
                        example:
                          "npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json",
                      },
                      {
                        command: "npx shadcn@latest add @qiuye-ui/[multiple]",
                        description: "批量添加多个组件",
                        example:
                          "npx shadcn@latest add @qiuye-ui/gradient-card @qiuye-ui/typing-text",
                      },
                      {
                        command: "npx shadcn@latest --help",
                        description: "查看CLI工具帮助信息",
                        example: "npx shadcn@latest --help",
                      },
                    ].map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {item.command}
                            </code>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                          <CopyButton
                            text={item.example}
                            copyKey={`cmd-${index}`}
                          />
                        </div>
                        <div className="bg-muted/30 rounded p-2 text-xs font-mono">
                          $ {item.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">可用组件列表</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        // TODO: 后续需要添加更多组件, 或支持动态加载组件列表
                        "animated-button",
                        "gradient-card",
                        "typing-text",
                      ].map((component) => (
                        <div
                          key={component}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <code className="text-sm font-mono">
                            @qiuye-ui/{component}
                          </code>
                          <CopyButton
                            text={`npx shadcn@latest add @qiuye-ui/${component}`}
                            copyKey={`component-${component}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>注册表结构</CardTitle>
                  <CardDescription>
                    静态注册表文件的结构和访问方式
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {[
                      {
                        endpoint: "/registry/[component].json",
                        description: "单个组件的详细配置和源代码",
                        example:
                          "https://qiuye-ui.vercel.app/registry/animated-button.json",
                      },
                    ].map((api, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">GET</Badge>
                          <code className="text-sm font-mono">
                            {api.endpoint}
                          </code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {api.description}
                        </p>
                        <div className="bg-muted/30 rounded p-2 text-xs font-mono flex items-center justify-between">
                          <span>{api.example}</span>
                          <CopyButton
                            text={api.example}
                            copyKey={`endpoint-${index}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">注册表配置</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      在您的项目中添加以下配置到{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        components.json
                      </code>
                      ：
                    </p>
                    <CodeBlock
                      code={`{
  "registries": {
    "@qiuye-ui": "https://qiuye-ui.vercel.app/registry/{name}.json"
  }
}`}
                      language="json"
                      copyKey="registry-config-final"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">组件文件结构</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      每个组件的JSON文件包含以下信息：
                    </p>
                    <CodeBlock
                      code={`{
  "name": "component-name",
  "type": "registry:component",
  "dependencies": ["react", "motion"],
  "registryDependencies": [],
  "files": [
    {
      "type": "registry:component",
      "name": "component-name.tsx",
      "content": "组件源代码..."
    }
  ]
}`}
                      language="json"
                      copyKey="component-structure"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
