"use client";

import { useState } from "react";
import { Copy, CheckCircle, Terminal, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";
import { ComponentId } from "@/lib/component-constants";

export default function CLIPage() {
  const clipboard = useClipboard();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [packageManager, setPackageManager] = useState<"npm" | "pnpm">("pnpm");

  const getCommandPrefix = () => {
    return packageManager === "npm" ? "npx" : "pnpm dlx";
  };

  const generateCommand = (command: string) => {
    return command.replace(/^npx/, getCommandPrefix());
  };

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
      aria-label="复制代码"
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

  // --- Tabs 受控 + 方向判定 ---
  const tabOrder = ["installation", "usage", "commands", "api"] as const;
  type Tab = (typeof tabOrder)[number];
  const [tab, setTab] = useState<Tab>("installation");
  const [prevTab, setPrevTab] = useState<Tab>("installation");
  const direction =
    Math.sign(tabOrder.indexOf(tab) - tabOrder.indexOf(prevTab)) || 1; // 1:向右，-1:向左

  const panelVariants = {
    enter: (dir: number) => ({
      x: dir * 80, // 新面板从右进(向右切) / 从左进(向左切)
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      width: "100%",
    },
    exit: (dir: number) => ({
      x: -dir * 80, // 旧面板往左出(向右切) / 往右出(向左切)
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
  };

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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>基于 shadcn/ui CLI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">•</span>
              <span>官方工具支持</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">•</span>
              <span>无需额外安装</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <span className="text-sm text-muted-foreground">包管理器:</span>
            <Tabs
              value={packageManager}
              onValueChange={(value) =>
                setPackageManager(value as "npm" | "pnpm")
              }
            >
              <TabsList className="grid w-[140px] sm:w-[180px] grid-cols-2 h-8">
                <TabsTrigger value="npm" className="text-xs">
                  npm
                </TabsTrigger>
                <TabsTrigger value="pnpm" className="text-xs">
                  pnpm
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div>
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setPrevTab(tab);
            setTab(v as Tab);
          }}
          className="space-y-6"
        >
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
              <TabsTrigger id="tab-installation" value="installation">
                安装
              </TabsTrigger>
              <TabsTrigger id="tab-usage" value="usage">
                使用
              </TabsTrigger>
              <TabsTrigger id="tab-commands" value="commands">
                命令
              </TabsTrigger>
              <TabsTrigger id="tab-api" value="api">
                API
              </TabsTrigger>
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
            {/* Animated panels */}
            <div className="relative min-h-[480px]">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={tab}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.8,
                  }}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab}`}
                >
                  {tab === "installation" && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>使用 Shadcn/ui CLI</CardTitle>
                          <CardDescription>
                            使用官方 shadcn/ui CLI 工具安装 QiuYe UI 组件
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">
                              前置要求
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              确保您的项目已经安装并配置了 shadcn/ui：
                            </p>
                            <CodeBlock
                              code={generateCommand("npx shadcn@latest init")}
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
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>中国大陆用户注意:</strong> 如果访问
                                vercel.app 域名有困难，可以使用国内镜像域名：
                              </p>
                              <CodeBlock
                                code={`{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}`}
                                language="json"
                                copyKey="registry-config-cn"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 mb-3">
                              然后使用简化的命令安装组件：
                            </p>
                            <CodeBlock
                              code={generateCommand(
                                "npx shadcn@latest add @qiuye-ui/animated-button"
                              )}
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
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  国际域名（推荐）：
                                </p>
                                <CodeBlock
                                  code={generateCommand(
                                    "npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json"
                                  )}
                                  copyKey="install-component-url"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  中国大陆镜像域名：
                                </p>
                                <CodeBlock
                                  code={generateCommand(
                                    "npx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json"
                                  )}
                                  copyKey="install-component-url-cn"
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              直接指定组件的注册表JSON文件URL进行安装，中国大陆用户建议使用镜像域名
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {tab === "usage" && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>基本使用</CardTitle>
                          <CardDescription>
                            学习如何在您的项目中使用 QiuYe UI 组件
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">
                              1. 安装组件
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              方式一：使用注册表名称（需先配置注册表）
                            </p>
                            <div className="space-y-3">
                              <CodeBlock
                                code={generateCommand(
                                  "npx shadcn@latest add @qiuye-ui/animated-button"
                                )}
                                copyKey="add-single"
                              />
                              <CodeBlock
                                code={generateCommand(
                                  "npx shadcn@latest add @qiuye-ui/gradient-card @qiuye-ui/typing-text"
                                )}
                                copyKey="add-multiple"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 mb-3">
                              方式二：直接使用URL（无需配置）
                            </p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  国际域名：
                                </p>
                                <CodeBlock
                                  code={generateCommand(
                                    "npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json"
                                  )}
                                  copyKey="add-single-url"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  中国大陆镜像：
                                </p>
                                <CodeBlock
                                  code={generateCommand(
                                    "npx shadcn@latest add https://ui.qiuyedx.com/registry/animated-button.json"
                                  )}
                                  copyKey="add-single-url-cn"
                                />
                              </div>
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
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  国际域名：
                                </p>
                                <CodeBlock
                                  code="https://qiuye-ui.vercel.app/components"
                                  copyKey="component-browser"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  中国大陆镜像：
                                </p>
                                <CodeBlock
                                  code="https://ui.qiuyedx.com/components"
                                  copyKey="component-browser-cn"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>项目配置</CardTitle>
                          <CardDescription>
                            自定义CLI工具的行为和设置
                          </CardDescription>
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
                    </div>
                  )}

                  {tab === "commands" && (
                    <div className="space-y-6">
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
                                command: `${getCommandPrefix()} shadcn@latest init`,
                                description: "初始化 shadcn/ui 项目配置",
                                example: generateCommand(
                                  "npx shadcn@latest init"
                                ),
                              },
                              {
                                command: `${getCommandPrefix()} shadcn@latest add @qiuye-ui/[component]`,
                                description:
                                  "添加 QiuYe UI 组件（需配置注册表）",
                                example: generateCommand(
                                  "npx shadcn@latest add @qiuye-ui/animated-button"
                                ),
                              },
                              {
                                command: `${getCommandPrefix()} shadcn@latest add [URL]`,
                                description: "直接使用URL添加组件",
                                example: generateCommand(
                                  "npx shadcn@latest add https://qiuye-ui.vercel.app/registry/animated-button.json"
                                ),
                              },
                              {
                                command: `${getCommandPrefix()} shadcn@latest add @qiuye-ui/[multiple]`,
                                description: "批量添加多个组件",
                                example: generateCommand(
                                  "npx shadcn@latest add @qiuye-ui/gradient-card @qiuye-ui/typing-text"
                                ),
                              },
                              {
                                command: `${getCommandPrefix()} shadcn@latest --help`,
                                description: "查看CLI工具帮助信息",
                                example: generateCommand(
                                  "npx shadcn@latest --help"
                                ),
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
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
                            <h3 className="text-lg font-semibold mb-3">
                              可用组件列表
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                // TODO: 后续需要添加更多组件, 或支持动态加载组件列表
                                ComponentId.ANIMATED_BUTTON,
                                ComponentId.GRADIENT_CARD,
                                ComponentId.TYPING_TEXT,
                              ].map((component) => (
                                <div
                                  key={component}
                                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                  <code className="text-sm font-mono">
                                    @qiuye-ui/{component}
                                  </code>
                                  <CopyButton
                                    text={generateCommand(
                                      `npx shadcn@latest add @qiuye-ui/${component}`
                                    )}
                                    copyKey={`component-${component}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {tab === "api" && (
                    <div className="space-y-6">
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
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
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
                            <h3 className="text-lg font-semibold mb-3">
                              注册表配置
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              在您的项目中添加以下配置到{" "}
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                components.json
                              </code>
                              ：
                            </p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  国际域名（推荐）：
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
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  中国大陆镜像域名：
                                </p>
                                <CodeBlock
                                  code={`{
  "registries": {
    "@qiuye-ui": "https://ui.qiuyedx.com/registry/{name}.json"
  }
}`}
                                  language="json"
                                  copyKey="registry-config-final-cn"
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-semibold mb-3">
                              组件文件结构
                            </h3>
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
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
