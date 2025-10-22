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
          <CardTitle>基础用法</CardTitle>
          <CardDescription>
            展示带有固定头部、可滚动内容和固定底部的对话框
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setBasicOpen(true)}>打开基础对话框</Button>
          <ScrollableDialog open={basicOpen} onOpenChange={setBasicOpen}>
            <ScrollableDialogHeader>
              <DialogTitle>基础对话框标题</DialogTitle>
              <DialogDescription>这是一个可滚动的对话框示例</DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-4">
                <p>这是对话框的内容区域，当内容超过设定高度时会出现滚动条。</p>
                <p>您可以在这里放置任何内容，包括表单、列表、卡片等。</p>
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-semibold">提示</p>
                  <p className="text-sm text-muted-foreground">
                    头部和底部会固定在顶部和底部，只有中间内容区域可滚动。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setBasicOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setBasicOpen(false)}>确认</Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>长内容示例</CardTitle>
          <CardDescription>
            展示大量内容时的滚动效果，头部和底部保持固定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setLongContentOpen(true)}>
            打开长内容对话框
          </Button>
          <ScrollableDialog
            open={longContentOpen}
            onOpenChange={setLongContentOpen}
          >
            <ScrollableDialogHeader>
              <DialogTitle>长内容对话框</DialogTitle>
              <DialogDescription>
                滚动查看下方的大量内容，注意头部和底部始终可见
              </DialogDescription>
            </ScrollableDialogHeader>

            <ScrollableDialogContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">第一部分</h3>
                <p>
                  这是一个包含大量内容的对话框示例。当内容超过最大高度时，内容区域会自动出现滚动条。
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <h3 className="font-semibold text-lg">第二部分</h3>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="p-4 bg-muted rounded-md space-y-2">
                  <p className="font-semibold">特性列表：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>固定的头部区域</li>
                    <li>可滚动的内容区域</li>
                    <li>固定的底部操作区域</li>
                    <li>响应式设计</li>
                    <li>可自定义最大高度</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-lg">第三部分</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </p>

                <h3 className="font-semibold text-lg">第四部分</h3>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium.
                </p>
                <p>
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                  et quasi architecto beatae vitae dicta sunt explicabo.
                </p>

                <h3 className="font-semibold text-lg">第五部分</h3>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
                <div className="p-4 bg-primary/10 rounded-md">
                  <p className="font-semibold">注意事项</p>
                  <p className="text-sm text-muted-foreground">
                    请注意，即使内容很长，头部的标题和底部的操作按钮始终保持可见，方便用户操作。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setLongContentOpen(false)}
              >
                取消
              </Button>
              <Button onClick={() => setLongContentOpen(false)}>确认</Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>自定义整体高度</CardTitle>
          <CardDescription>
            可以通过 contentClassName 属性自定义对话框的整体高度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCustomHeightOpen(true)}>
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

            <ScrollableDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setCustomHeightOpen(false)}
              >
                取消
              </Button>
              <Button onClick={() => setCustomHeightOpen(false)}>确认</Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表单示例</CardTitle>
          <CardDescription>
            在对话框中使用表单，展示实际应用场景
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setFormOpen(true)}>打开表单对话框</Button>
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
                    💡
                    提示：当表单内容较多时，中间区域会自动滚动，确保所有字段都能被访问。
                  </p>
                </div>
              </form>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                取消
              </Button>
              <Button
                onClick={() => {
                  // 这里可以处理表单提交
                  setFormOpen(false);
                }}
              >
                创建项目
              </Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>无底部操作栏</CardTitle>
          <CardDescription>
            某些场景下可能不需要底部操作栏，比如纯信息展示
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setNoFooterOpen(true)}>
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
                    ℹ️ 点击对话框外部或按 ESC 键即可关闭
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>
          </ScrollableDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>自定义渐变遮罩</CardTitle>
          <CardDescription>
            可以控制上下渐变遮罩的显示和高度（默认开启，高度 40px）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setNoFadeOpen(true)}>
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
                  通过设置 <code className="bg-muted px-1 py-0.5 rounded text-sm">fadeMasks=&#123;false&#125;</code>{" "}
                  可以禁用这个效果。
                </p>

                <div className="p-4 bg-muted rounded-md space-y-2">
                  <p className="font-semibold">参数说明：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <code className="bg-background px-1 py-0.5 rounded">fadeMasks</code>：是否显示渐变遮罩（默认
                      true）
                    </li>
                    <li>
                      <code className="bg-background px-1 py-0.5 rounded">fadeMaskHeight</code>：渐变遮罩高度（默认
                      40px）
                    </li>
                  </ul>
                </div>

                <h3 className="font-semibold text-lg pt-4">使用示例</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">禁用渐变遮罩：</p>
                  <code className="block bg-muted px-3 py-2 rounded text-sm">
                    {'<ScrollableDialogContent fadeMasks={false}>'}
                  </code>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">自定义遮罩高度：</p>
                  <code className="block bg-muted px-3 py-2 rounded text-sm">
                    {'<ScrollableDialogContent fadeMaskHeight={60}>'}
                  </code>
                </div>

                <p>
                  渐变遮罩会根据滚动位置自动显示和隐藏：
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>滚动到顶部时，顶部遮罩隐藏</li>
                  <li>滚动到底部时，底部遮罩隐藏</li>
                  <li>在中间位置时，上下遮罩都显示</li>
                </ul>

                <div className="p-4 bg-primary/10 rounded-md">
                  <p className="text-sm">
                    💡 这个示例禁用了渐变遮罩，所以你看不到上下的渐变效果。
                  </p>
                </div>
              </div>
            </ScrollableDialogContent>

            <ScrollableDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button onClick={() => setNoFadeOpen(false)}>知道了</Button>
            </ScrollableDialogFooter>
          </ScrollableDialog>
        </CardContent>
      </Card>
    </div>
  );
}
