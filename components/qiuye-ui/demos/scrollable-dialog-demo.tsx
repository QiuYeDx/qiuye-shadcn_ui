"use client";

import { useState } from "react";
import {
  ScrollableDialog,
  ScrollableDialogHeader,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  DialogTitle,
  DialogDescription,
} from "../scrollable-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ViewSourceButton } from "@/components/view-source-button";

// 源码数据
const sourceCodes = {
  basic: `<ScrollableDialog
  open={basicOpen}
  onOpenChange={setBasicOpen}
  maxWidth="sm:max-w-lg"
>
  <ScrollableDialogHeader>
    <DialogTitle>组件发布确认</DialogTitle>
    <DialogDescription>
      确认本次示例优化的范围、风险和后续动作
    </DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent>
    <div className="space-y-4 text-sm">
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="font-semibold">发布摘要</p>
        <p className="mt-1 text-muted-foreground">
          本次更新让首页示例更贴近真实使用场景，并保持固定 footer 可随时操作。
        </p>
      </div>
      <div className="grid gap-3">
        <div className="rounded-md border bg-background p-3">
          <p className="font-medium">Dual State Toggle</p>
          <p className="mt-1 text-muted-foreground">
            使用通知开/关、明暗模式、菜单展开/收起这类语义成对的图标。
          </p>
        </div>
        <div className="rounded-md border bg-background p-3">
          <p className="font-medium">Scrollable Dialog</p>
          <p className="mt-1 text-muted-foreground">
            内容按摘要、检查项和建议分组，滚动区域不再只是占位文本。
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="font-medium text-primary">交互重点</p>
        <p className="mt-1 text-muted-foreground">
          头部说明和底部按钮固定，中间内容独立滚动，适合承载长表单或确认清单。
        </p>
      </div>
    </div>
  </ScrollableDialogContent>

  <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
    <Button variant="outline" onClick={() => setBasicOpen(false)}>
      取消
    </Button>
    <Button onClick={() => setBasicOpen(false)}>确认</Button>
  </ScrollableDialogFooter>
</ScrollableDialog>`,

  longContent: `<ScrollableDialog
  open={longContentOpen}
  onOpenChange={setLongContentOpen}
  maxWidth="sm:max-w-xl"
>
  <ScrollableDialogHeader>
    <DialogTitle>发布评审记录</DialogTitle>
    <DialogDescription>
      滚动查看完整检查项，头部和底部始终可见
    </DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent>
    <div className="space-y-5 text-sm">
      <section className="rounded-lg border p-4">
        <h3 className="font-semibold">变更摘要</h3>
        <p className="mt-2 text-muted-foreground">
          本次发布包含首页预览、详情页示例和源码展示的同步优化。
        </p>
      </section>

      <section className="rounded-lg border p-4">
        <h3 className="font-semibold">质量检查</h3>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>图标切换前后语义成对</li>
          <li>长内容分区清晰，可扫读</li>
          <li>footer 按钮固定并居中</li>
        </ul>
      </section>

      <section className="rounded-lg border p-4">
        <h3 className="font-semibold">后续动作</h3>
        <p className="mt-2 text-muted-foreground">
          确认后执行 registry 更新和页面构建验证。
        </p>
      </section>
    </div>
  </ScrollableDialogContent>

  <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
    <Button variant="outline" onClick={() => setLongContentOpen(false)}>
      取消
    </Button>
    <Button onClick={() => setLongContentOpen(false)}>确认</Button>
  </ScrollableDialogFooter>
</ScrollableDialog>`,

  customHeight: `<ScrollableDialog
  open={customHeightOpen}
  onOpenChange={setCustomHeightOpen}
  contentClassName="max-h-[50vh]"
>
  <ScrollableDialogHeader>
    <DialogTitle>自定义高度对话框</DialogTitle>
    <DialogDescription>
      这个对话框的整体最大高度被设置为视口高度的50%
    </DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent>
    <div className="space-y-4">
      <p>对话框整体高度被限制为视口高度的 50%。</p>
      <p>通过设置 contentClassName="max-h-[50vh]" 即可实现。</p>
    </div>
  </ScrollableDialogContent>

  <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
    <Button variant="outline" onClick={() => setCustomHeightOpen(false)}>
      取消
    </Button>
    <Button onClick={() => setCustomHeightOpen(false)}>确认</Button>
  </ScrollableDialogFooter>
</ScrollableDialog>`,

  form: `<ScrollableDialog open={formOpen} onOpenChange={setFormOpen}>
  <ScrollableDialogHeader>
    <DialogTitle>创建新项目</DialogTitle>
    <DialogDescription>填写以下信息来创建一个新项目</DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">项目名称</Label>
        <Input id="project-name" placeholder="请输入项目名称" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">项目描述</Label>
        <Textarea id="project-description" placeholder="请输入项目描述" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-url">项目 URL</Label>
        <Input id="project-url" type="url" placeholder="https://example.com" />
      </div>
    </form>
  </ScrollableDialogContent>

  <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
    <Button variant="outline" onClick={() => setFormOpen(false)}>
      取消
    </Button>
    <Button onClick={() => setFormOpen(false)}>创建项目</Button>
  </ScrollableDialogFooter>
</ScrollableDialog>`,

  noFooter: `<ScrollableDialog open={noFooterOpen} onOpenChange={setNoFooterOpen}>
  <ScrollableDialogHeader>
    <DialogTitle>系统更新日志</DialogTitle>
    <DialogDescription>查看最新的系统更新内容</DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent>
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">版本 2.0.0（2024-03-15）</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>全新的用户界面设计</li>
          <li>性能优化，加载速度提升 50%</li>
          <li>新增暗色模式支持</li>
        </ul>
      </div>
    </div>
  </ScrollableDialogContent>
  {/* 注意：没有 ScrollableDialogFooter */}
</ScrollableDialog>`,

  noFade: `<ScrollableDialog open={noFadeOpen} onOpenChange={setNoFadeOpen}>
  <ScrollableDialogHeader>
    <DialogTitle>无渐变遮罩示例</DialogTitle>
    <DialogDescription>这个对话框禁用了渐变遮罩效果</DialogDescription>
  </ScrollableDialogHeader>

  <ScrollableDialogContent fadeMasks={false}>
    <div className="space-y-4">
      <p>通过设置 fadeMasks={false} 可以禁用渐变遮罩效果。</p>
      <div className="p-4 bg-muted rounded-md space-y-2">
        <p className="font-semibold">参数说明：</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>fadeMasks：是否显示渐变遮罩（默认 true）</li>
          <li>fadeMaskHeight：渐变遮罩高度（默认 40px）</li>
        </ul>
      </div>
    </div>
  </ScrollableDialogContent>

  <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
    <Button onClick={() => setNoFadeOpen(false)}>知道了</Button>
  </ScrollableDialogFooter>
</ScrollableDialog>`,
};

export function ScrollableDialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [longContentOpen, setLongContentOpen] = useState(false);
  const [customHeightOpen, setCustomHeightOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [noFooterOpen, setNoFooterOpen] = useState(false);
  const [noFadeOpen, setNoFadeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>基础用法</CardTitle>
              <CardDescription>
                展示带有固定头部、可滚动内容和固定底部的对话框
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.basic}
              title="基础用法 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setBasicOpen(true)} className="cursor-pointer">
            打开基础对话框
          </Button>
          <ScrollableDialog
            open={basicOpen}
            onOpenChange={setBasicOpen}
            maxWidth="sm:max-w-lg"
          >
            <ScrollableDialogHeader>
              <DialogTitle>组件发布确认</DialogTitle>
              <DialogDescription>
                确认本次示例优化的范围、风险和后续动作
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-4 text-sm">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-semibold">发布摘要</p>
                  <p className="mt-1 text-muted-foreground">
                    本次更新让首页示例更贴近真实使用场景，并保持固定
                    footer 可随时操作。
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-md border bg-background p-3">
                    <p className="font-medium">Dual State Toggle</p>
                    <p className="mt-1 text-muted-foreground">
                      使用通知开/关、明暗模式、菜单展开/收起这类语义成对的图标。
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <p className="font-medium">Scrollable Dialog</p>
                    <p className="mt-1 text-muted-foreground">
                      内容按摘要、检查项和建议分组，滚动区域不再只是占位文本。
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="font-medium text-primary">交互重点</p>
                  <p className="mt-1 text-muted-foreground">
                    头部说明和底部按钮固定，中间内容独立滚动，适合承载长表单或确认清单。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setBasicOpen(false)}
                className="cursor-pointer"
              >
                取消
              </Button>
              <Button
                onClick={() => setBasicOpen(false)}
                className="cursor-pointer"
              >
                确认
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>长内容示例</CardTitle>
              <CardDescription>
                展示大量内容时的滚动效果，头部和底部保持固定
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.longContent}
              title="长内容示例 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setLongContentOpen(true)}
            className="cursor-pointer"
          >
            打开长内容对话框
          </Button>
          <ScrollableDialog
            open={longContentOpen}
            onOpenChange={setLongContentOpen}
            maxWidth="sm:max-w-xl"
          >
            <ScrollableDialogHeader>
              <DialogTitle>发布评审记录</DialogTitle>
              <DialogDescription>
                滚动查看完整检查项，头部和底部始终可见
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-5 text-sm">
                <section className="rounded-lg border p-4">
                  <h3 className="font-semibold">变更摘要</h3>
                  <p className="mt-2 text-muted-foreground">
                    本次发布包含首页预览、详情页示例和源码展示的同步优化。
                  </p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-md bg-muted/50 px-3 py-2">
                      Dual State Toggle：使用关联明确的状态图标。
                    </div>
                    <div className="rounded-md bg-muted/50 px-3 py-2">
                      Scrollable Dialog：将占位内容替换为发布确认场景。
                    </div>
                    <div className="rounded-md bg-muted/50 px-3 py-2">
                      Footer：取消与确认按钮在固定操作栏中居中排列。
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border p-4">
                  <h3 className="font-semibold">质量检查</h3>
                  <ul className="mt-3 space-y-2 text-muted-foreground">
                    <li>图标切换前后语义成对，不再跨概念跳变。</li>
                    <li>长内容分区清晰，用户滚动时可以快速扫读重点。</li>
                    <li>固定头部说明当前任务，固定底部保留主要操作。</li>
                    <li>源码预览与页面实际示例保持一致。</li>
                  </ul>
                </section>

                <section className="rounded-lg border p-4">
                  <h3 className="font-semibold">风险与回滚</h3>
                  <p className="mt-2 text-muted-foreground">
                    本次只调整示例内容和布局，不改动 ScrollableDialog
                    的组件 API。若视觉密度不合适，可以单独回退 demo 文件。
                  </p>
                </section>

                <section className="rounded-lg border p-4">
                  <h3 className="font-semibold">发布窗口</h3>
                  <p className="mt-2 text-muted-foreground">
                    验证首页、组件详情页和 registry 输出后即可发布。长内容区域会继续滚动，footer
                    操作栏保持可见。
                  </p>
                </section>

                <section className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h3 className="font-semibold text-primary">后续动作</h3>
                  <p className="mt-2 text-muted-foreground">
                    确认后执行 registry 更新和页面构建验证，确保示例、文档和安装产物一致。
                  </p>
                </section>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setLongContentOpen(false)}
                className="cursor-pointer"
              >
                取消
              </Button>
              <Button
                onClick={() => setLongContentOpen(false)}
                className="cursor-pointer"
              >
                确认
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>自定义整体高度</CardTitle>
              <CardDescription>
                可以通过 contentClassName 属性自定义对话框的整体高度
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.customHeight}
              title="自定义高度 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setCustomHeightOpen(true)}
            className="cursor-pointer"
          >
            打开自定义高度对话框
          </Button>
          <ScrollableDialog
            open={customHeightOpen}
            onOpenChange={setCustomHeightOpen}
            contentClassName="max-h-[50vh]"
          >
            <ScrollableDialogHeader>
              <DialogTitle>自定义高度对话框</DialogTitle>
              <DialogDescription>
                这个对话框的整体最大高度被设置为视口高度的50%
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-4">
                <p>对话框整体高度被限制为视口高度的 50%。</p>
                <p>
                  内容区域会自动填充剩余空间，当内容超过可用高度时会出现滚动条。
                </p>
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-semibold">使用方法</p>
                  <p className="text-sm text-muted-foreground">
                    在 ScrollableDialog 组件上设置 contentClassName 属性即可。
                  </p>
                </div>
                <p>
                  例如：
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {'<ScrollableDialog contentClassName="max-h-[50vh]">'}
                  </code>
                </p>
                <p>这样可以灵活控制对话框的显示效果。</p>
                <p>头部和底部始终固定，中间内容区域自动滚动。</p>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setCustomHeightOpen(false)}
                className="cursor-pointer"
              >
                取消
              </Button>
              <Button
                onClick={() => setCustomHeightOpen(false)}
                className="cursor-pointer"
              >
                确认
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>表单示例</CardTitle>
              <CardDescription>
                在对话框中使用表单，展示实际应用场景
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.form} title="表单示例 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setFormOpen(true)} className="cursor-pointer">
            打开表单对话框
          </Button>
          <ScrollableDialog open={formOpen} onOpenChange={setFormOpen}>
            <ScrollableDialogHeader>
              <DialogTitle>创建新项目</DialogTitle>
              <DialogDescription>
                填写以下信息来创建一个新项目
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">项目名称</Label>
                  <Input
                    id="project-name"
                    placeholder="请输入项目名称"
                    defaultValue=""
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">项目描述</Label>
                  <Textarea
                    id="project-description"
                    placeholder="请输入项目描述"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-url">项目 URL</Label>
                  <Input
                    id="project-url"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-members">团队成员</Label>
                  <Input id="team-members" placeholder="使用逗号分隔成员邮箱" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-tags">项目标签</Label>
                  <Input
                    id="project-tags"
                    placeholder="React, TypeScript, UI"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-info">附加信息</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="其他需要说明的信息"
                    rows={4}
                  />
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    提示：当表单内容较多时，中间区域会自动滚动，确保所有字段都能被访问。
                  </p>
                </div>
              </form>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="cursor-pointer"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  // 这里可以处理表单提交
                  setFormOpen(false);
                }}
                className="cursor-pointer"
              >
                创建项目
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>无底部操作栏</CardTitle>
              <CardDescription>
                某些场景下可能不需要底部操作栏，比如纯信息展示
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.noFooter}
              title="无底部操作栏 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setNoFooterOpen(true)}
            className="cursor-pointer"
          >
            打开无底部对话框
          </Button>
          <ScrollableDialog open={noFooterOpen} onOpenChange={setNoFooterOpen}>
            <ScrollableDialogHeader>
              <DialogTitle>系统更新日志</DialogTitle>
              <DialogDescription>查看最新的系统更新内容</DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    版本 2.0.0（2024-03-15）
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>全新的用户界面设计</li>
                    <li>性能优化，加载速度提升 50%</li>
                    <li>新增暗色模式支持</li>
                    <li>修复了多个已知问题</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    版本 1.9.0（2024-02-20）
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>添加了新的图表组件</li>
                    <li>改进了移动端响应式布局</li>
                    <li>优化了数据加载机制</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    版本 1.8.5（2024-01-10）
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>修复了用户反馈的关键 Bug</li>
                    <li>增强了系统安全性</li>
                    <li>更新了依赖包版本</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    版本 1.8.0（2023-12-05）
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>推出了团队协作功能</li>
                    <li>新增了数据导出功能</li>
                    <li>优化了搜索算法</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/10 rounded-md">
                  <p className="text-sm">
                    点击对话框外部或按 ESC 键即可关闭。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>自定义渐变遮罩</CardTitle>
              <CardDescription>
                可以控制上下渐变遮罩的显示和高度（默认开启，高度 40px）
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.noFade}
              title="自定义渐变遮罩 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setNoFadeOpen(true)}
            className="cursor-pointer"
          >
            打开无渐变遮罩对话框
          </Button>
          <ScrollableDialog open={noFadeOpen} onOpenChange={setNoFadeOpen}>
            <ScrollableDialogHeader>
              <DialogTitle>无渐变遮罩示例</DialogTitle>
              <DialogDescription>
                这个对话框禁用了渐变遮罩效果
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent fadeMasks={false}>
              <div className="space-y-4">
                <p>
                  默认情况下，内容区域滚动时会在顶部和底部显示渐变遮罩，提示用户有更多内容可滚动。
                </p>
                <p>
                  通过设置{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    fadeMasks=&#123;false&#125;
                  </code>{" "}
                  可以禁用这个效果。
                </p>

                <div className="p-4 bg-muted rounded-md space-y-2">
                  <p className="font-semibold">参数说明：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <code className="bg-background px-1 py-0.5 rounded">
                        fadeMasks
                      </code>
                      ：是否显示渐变遮罩（默认 true）
                    </li>
                    <li>
                      <code className="bg-background px-1 py-0.5 rounded">
                        fadeMaskHeight
                      </code>
                      ：渐变遮罩高度（默认 40px）
                    </li>
                  </ul>
                </div>

                <h3 className="font-semibold text-lg pt-4">使用示例</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    禁用渐变遮罩：
                  </p>
                  <code className="block bg-muted px-3 py-2 rounded text-sm">
                    {"<ScrollableDialogContent fadeMasks={false}>"}
                  </code>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    自定义遮罩高度：
                  </p>
                  <code className="block bg-muted px-3 py-2 rounded text-sm">
                    {"<ScrollableDialogContent fadeMaskHeight={60}>"}
                  </code>
                </div>

                <p>渐变遮罩会根据滚动位置自动显示和隐藏：</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>滚动到顶部时，顶部遮罩隐藏</li>
                  <li>滚动到底部时，底部遮罩隐藏</li>
                  <li>在中间位置时，上下遮罩都显示</li>
                </ul>

                <div className="p-4 bg-primary/10 rounded-md">
                  <p className="text-sm">
                    这个示例禁用了渐变遮罩，所以你看不到上下的渐变效果。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
              <Button
                onClick={() => setNoFadeOpen(false)}
                className="cursor-pointer"
              >
                知道了
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>
    </div>
  );
}
