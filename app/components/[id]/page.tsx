import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getComponent,
  componentRegistry,
  type ComponentInfo,
} from "@/lib/registry";
import { ComponentId } from "@/lib/component-constants";
import {
  BackButton,
  CopyCommandButton,
  CopyCodeButton,
  DependenciesSection,
} from "./client-interactions";

// 生成静态参数，用于静态站点生成
export async function generateStaticParams() {
  return Object.keys(componentRegistry).map((id) => ({
    id: id,
  }));
}

// 导入演示组件
import { AnimatedButtonDemo } from "@/components/qiuye-ui/demos/animated-button-demo";
import { GradientCardDemo } from "@/components/qiuye-ui/demos/gradient-card-demo";
import { TypingTextDemo } from "@/components/qiuye-ui/demos/typing-text-demo";
import { ResponsiveTabsDemo } from "@/components/qiuye-ui/demos/responsive-tabs-demo";
import { ScrollableDialogDemo } from "@/components/qiuye-ui/demos/scrollable-dialog-demo";
import { DotGlassDemo } from "@/components/qiuye-ui/demos/dot-glass-demo";
import { ImageViewerDemo } from "@/components/qiuye-ui/demos/image-viewer-demo";

// TODO: 新增 qiuye-ui 自定义组件时需要完善 demo 文件
const demoComponents = {
  [ComponentId.ANIMATED_BUTTON]: AnimatedButtonDemo,
  [ComponentId.GRADIENT_CARD]: GradientCardDemo,
  [ComponentId.TYPING_TEXT]: TypingTextDemo,
  [ComponentId.RESPONSIVE_TABS]: ResponsiveTabsDemo,
  [ComponentId.SCROLLABLE_DIALOG]: ScrollableDialogDemo,
  [ComponentId.DOT_GLASS]: DotGlassDemo,
  [ComponentId.IMAGE_VIEWER]: ImageViewerDemo,
};

// 导入简单演示组件
import {
  AnimatedButtonSimpleDemo,
  GradientCardSimpleDemo,
  TypingTextSimpleDemo,
  ResponsiveTabsSimpleDemo,
  ScrollableDialogSimpleDemo,
  DotGlassSimpleDemo,
  ImageViewerSimpleDemo,
} from "./simple-demos";

// 精简的单例演示组件
const simpleDemoComponents = {
  [ComponentId.ANIMATED_BUTTON]: AnimatedButtonSimpleDemo,
  [ComponentId.GRADIENT_CARD]: GradientCardSimpleDemo,
  [ComponentId.TYPING_TEXT]: TypingTextSimpleDemo,
  [ComponentId.RESPONSIVE_TABS]: ResponsiveTabsSimpleDemo,
  [ComponentId.SCROLLABLE_DIALOG]: ScrollableDialogSimpleDemo,
  [ComponentId.DOT_GLASS]: DotGlassSimpleDemo,
  [ComponentId.IMAGE_VIEWER]: ImageViewerSimpleDemo,
};

// 简单的演示预览组件
function DemoPreview({
  componentId,
  component,
}: {
  componentId: string;
  component: ComponentInfo;
}) {
  const SimpleDemoComponent =
    simpleDemoComponents[componentId as keyof typeof simpleDemoComponents];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">快速预览</CardTitle>
        <CardDescription>查看 {component.name} 组件的基本效果</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg p-6 bg-background/50">
          {SimpleDemoComponent ? (
            <SimpleDemoComponent />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              演示组件正在开发中...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 简单的代码块组件
function CodeBlock({ component }: { component: ComponentInfo }) {
  // 从组件信息中获取基础用法示例
  const example = component.basicUsage;

  // 如果没有找到对应的示例，使用默认的简单格式
  const importCode =
    example?.import ||
    `import { ${String(component.name || "").replace(/\s+/g, "")} } from "@/components/qiuye-ui/${component.cliName}";`;
  const usageCode =
    example?.usage || `<${String(component.name || "").replace(/\s+/g, "")} />`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">基本用法</CardTitle>
        <CardDescription>使用 {component.name} 组件的基础示例</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              导入组件
            </h4>
            <div className="bg-muted/50 rounded-md p-3 overflow-x-auto">
              <code className="text-sm font-mono whitespace-pre">
                {importCode}
              </code>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              使用组件
            </h4>
            <div className="bg-muted/50 rounded-md p-3 overflow-x-auto">
              <code className="text-sm font-mono whitespace-pre">
                {usageCode}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComponentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComponentDetailPage({
  params,
}: ComponentDetailPageProps) {
  const { id: componentId } = await params;
  const component = getComponent(componentId);

  if (!component) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">组件未找到</h1>
          <p className="text-muted-foreground mb-6">请检查组件ID是否正确</p>
          <Button asChild>
            <Link href="/components">返回组件列表</Link>
          </Button>
        </div>
      </div>
    );
  }

  const DemoComponent =
    demoComponents[componentId as keyof typeof demoComponents];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-10 lg:mb-12">
        {/* 顶部返回 + 分类 */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <Badge variant="outline" className="hidden sm:inline-flex">
              {component.category}
            </Badge>
          </div>
          <Badge variant="outline" className="sm:hidden">
            {component.category}
          </Badge>
        </div>

        {/* 主体布局：12 栅格 */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          {/* 主内容列 */}
          <div className="lg:col-span-8 xl:col-span-9">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 lg:mb-4">
              {component.name}
            </h1>

            {component.description && (
              <p className="text-base lg:text-lg text-muted-foreground mb-4 lg:mb-6 max-w-[70ch]">
                {component.description}
              </p>
            )}

            {Array.isArray(component.tags) && component.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 你可以在此处继续放 Demo、示例代码、API 表格等模块 */}
            <div className="space-y-6">
              {/* 示例：代码或演示区块占满主列，避免留白 */}
              <DemoPreview componentId={componentId} component={component} />
              <CodeBlock component={component} />
            </div>
          </div>

          {/* 侧栏：sticky，避免出现右侧空白 */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* 安装命令 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg">
                    安装命令
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CopyCommandButton cliName={component.cliName} />
                </CardContent>
              </Card>

              {/* 导入代码 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg">
                    导入代码
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-md p-3">
                    <code className="text-xs lg:text-sm font-mono break-all">
                      {`import { ${String(component.name || "").replace(/\s+/g, "")} } from "@/components/qiuye-ui/${component.cliName}";`}
                    </code>
                  </div>
                  <CopyCodeButton
                    componentName={component.name}
                    cliName={component.cliName}
                  />
                </CardContent>
              </Card>

              {/* 组件信息 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg">
                    组件信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">版本</span>
                    <span className="truncate">{component.version}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">作者</span>
                    <span className="truncate">{component.author}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">分类</span>
                    <span className="truncate">{component.category}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Content Tabs */}
      <div>
        <Tabs defaultValue="demo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo">演示</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="dependencies">依赖</TabsTrigger>
          </TabsList>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>组件演示</CardTitle>
                <CardDescription>查看组件的各种使用方式和效果</CardDescription>
              </CardHeader>
              <CardContent>
                {DemoComponent ? (
                  <DemoComponent />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    演示组件正在开发中...
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            {/* 多组件 Props 展示 */}
            {component.propsInfo && component.propsInfo.length > 0 ? (
              component.propsInfo.map((propsInfo, index) => (
                <Card key={propsInfo.componentName}>
                  <CardHeader>
                    <CardTitle>
                      {propsInfo.componentName}
                      {index === 0 && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          (主组件)
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {propsInfo.componentName} 组件支持的属性和参数
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>属性名</TableHead>
                            <TableHead>类型</TableHead>
                            <TableHead>描述</TableHead>
                            <TableHead>必需</TableHead>
                            <TableHead>默认值</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {propsInfo.props.map((prop) => (
                            <TableRow key={prop.name}>
                              <TableCell className="font-mono text-sm">
                                {prop.name}
                              </TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground">
                                {prop.type}
                              </TableCell>
                              <TableCell>{prop.description}</TableCell>
                              <TableCell>
                                {prop.required ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    必需
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    可选
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {prop.default || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : component.props && component.props.length > 0 ? (
              /* 单组件 Props 展示（兼容旧格式） */
              <Card>
                <CardHeader>
                  <CardTitle>Props API</CardTitle>
                  <CardDescription>组件支持的属性和参数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>属性名</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>描述</TableHead>
                          <TableHead>必需</TableHead>
                          <TableHead>默认值</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {component.props.map((prop) => (
                          <TableRow key={prop.name}>
                            <TableCell className="font-mono text-sm">
                              {prop.name}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {prop.type}
                            </TableCell>
                            <TableCell>{prop.description}</TableCell>
                            <TableCell>
                              {prop.required ? (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  必需
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  可选
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {prop.default || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Props API</CardTitle>
                  <CardDescription>组件支持的属性和参数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    该组件暂无API文档
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Dependencies Tab */}
          <TabsContent value="dependencies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>依赖项</CardTitle>
                <CardDescription>使用此组件需要安装的依赖包</CardDescription>
              </CardHeader>
              <CardContent>
                <DependenciesSection dependencies={component.dependencies} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
