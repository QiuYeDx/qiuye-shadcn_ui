import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getComponent, componentRegistry } from "@/lib/registry";
import { 
  BackButton, 
  CopyCommandButton, 
  CopyCodeButton, 
  CopyDependencyButton, 
  CopyAllDependenciesButton 
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

// TODO: 新增 qiuye-ui 自定义组件时需要完善 demo 文件
const demoComponents = {
  "animated-button": AnimatedButtonDemo,
  "gradient-card": GradientCardDemo,
  "typing-text": TypingTextDemo,
  "responsive-tabs": ResponsiveTabsDemo,
};

interface ComponentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const { id: componentId } = await params;
  const component = getComponent(componentId);

  if (!component) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">组件未找到</h1>
          <p className="text-muted-foreground mb-6">
            请检查组件ID是否正确
          </p>
          <Button asChild>
            <Link href="/components">返回组件列表</Link>
          </Button>
        </div>
      </div>
    );
  }

  const DemoComponent = demoComponents[componentId as keyof typeof demoComponents];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <Badge variant="outline">{component.category}</Badge>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {component.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {component.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {component.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="lg:w-80 space-y-4">
            {/* CLI Command */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">安装命令</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/50 rounded-md p-3">
                  <code className="text-sm font-mono break-all">
                    npx shadcn@latest add @qiuye-ui/{component.cliName}
                  </code>
                </div>
                <CopyCommandButton cliName={component.cliName} />
              </CardContent>
            </Card>

            {/* Import Code */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">导入代码</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/50 rounded-md p-3">
                  <code className="text-sm font-mono break-all">
                    {`import { ${component.name.replace(/\s+/g, "")} } from "@/components/qiuye-ui/${component.cliName}";`}
                  </code>
                </div>
                <CopyCodeButton componentName={component.name} cliName={component.cliName} />
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">组件信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">版本</span>
                  <span>{component.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">作者</span>
                  <span>{component.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">分类</span>
                  <span>{component.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <CardDescription>
                  查看组件的各种使用方式和效果
                </CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle>Props API</CardTitle>
                <CardDescription>
                  组件支持的属性和参数
                </CardDescription>
              </CardHeader>
              <CardContent>
                {component.props && component.props.length > 0 ? (
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
                                <Badge variant="destructive" className="text-xs">
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    该组件暂无API文档
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dependencies Tab */}
          <TabsContent value="dependencies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>依赖项</CardTitle>
                <CardDescription>
                  使用此组件需要安装的依赖包
                </CardDescription>
              </CardHeader>
              <CardContent>
                {component.dependencies.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {component.dependencies.map((dep) => (
                        <div
                          key={dep}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <code className="font-mono text-sm">{dep}</code>
                          <CopyDependencyButton dependency={dep} />
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">一键安装所有依赖</h4>
                      <div className="bg-muted/50 rounded-md p-3 mb-3">
                        <code className="text-sm font-mono">
                          npm install {component.dependencies.join(" ")}
                        </code>
                      </div>
                      <CopyAllDependenciesButton dependencies={component.dependencies} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    该组件无额外依赖
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
