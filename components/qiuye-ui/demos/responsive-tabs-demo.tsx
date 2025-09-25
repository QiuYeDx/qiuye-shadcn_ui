"use client";

import { useMemo, useState } from "react";
import { ResponsiveTabs, type TabItem } from "../responsive-tabs";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Settings,
  User,
  Bell,
  FileText,
  Heart,
  Star,
  Search,
  Bookmark,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";

type LayoutMode = "responsive" | "scroll" | "grid";

export function ResponsiveTabsDemo() {
  const [basicTab, setBasicTab] = useState("all");
  const [iconTab, setIconTab] = useState("home");
  const [badgeTab, setBadgeTab] = useState("forms");
  const [customTab, setCustomTab] = useState("docs");

  // Playground 状态
  const [playLayout, setPlayLayout] = useState<LayoutMode>("responsive");
  const [playEdgeGutter, setPlayEdgeGutter] = useState(false);
  const [playScrollStep, setPlayScrollStep] = useState(200);
  const [playTab, setPlayTab] = useState("t0");

  // 动态标签状态
  const [dynItems, setDynItems] = useState<TabItem[]>(
    Array.from({ length: 6 }).map((_, i) => ({
      value: `d${i}`,
      label: `动态标签 ${i + 1}`,
    }))
  );
  const [dynActive, setDynActive] = useState("d0");

  // 基本标签页
  const basicItems: TabItem[] = [
    { value: "all", label: "全部" },
    { value: "forms", label: "表单组件" },
    { value: "data", label: "数据展示" },
    { value: "navigation", label: "导航组件" },
    { value: "feedback", label: "反馈组件" },
    { value: "layout", label: "布局组件" },
    { value: "input", label: "输入组件" },
    { value: "display", label: "展示组件" },
  ];

  // 带图标的标签页
  const iconItems: TabItem[] = [
    { value: "home", label: "首页", icon: <Home className="h-4 w-4" /> },
    { value: "profile", label: "个人资料", icon: <User className="h-4 w-4" /> },
    {
      value: "settings",
      label: "设置",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      value: "notifications",
      label: "通知",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      value: "documents",
      label: "文档",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  // 带徽标和复杂状态的标签页
  const badgeItems: TabItem[] = [
    { value: "forms", label: "表单", badge: 12 },
    {
      value: "data",
      label: "数据",
      badge: "新",
      icon: <Star className="h-4 w-4" />,
    },
    { value: "nav", label: "导航", badge: 8 },
    {
      value: "feedback",
      label: "反馈",
      badge: 3,
      icon: <Heart className="h-4 w-4" />,
    },
    { value: "layout", label: "布局", disabled: true },
    { value: "input", label: "输入", badge: 25 },
    { value: "search", label: "搜索", icon: <Search className="h-4 w-4" /> },
    {
      value: "bookmarks",
      label: "收藏",
      badge: 99,
      icon: <Bookmark className="h-4 w-4" />,
    },
  ];

  // 自定义网格配置的标签页
  const customItems: TabItem[] = [
    { value: "docs", label: "文档", icon: <FileText className="h-4 w-4" /> },
    {
      value: "calendar",
      label: "日历",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      value: "mail",
      label: "邮件",
      badge: 5,
      icon: <Mail className="h-4 w-4" />,
    },
    { value: "phone", label: "电话", icon: <Phone className="h-4 w-4" /> },
  ];

  // Playground 用的很多项（测试溢出/滚动）
  const playItems: TabItem[] = useMemo(() => {
    const icons = [Home, Settings, User, Bell, FileText, Star, Heart, Bookmark];
    return Array.from({ length: 14 }).map((_, i) => {
      const Icon = icons[i % icons.length];
      const long = i % 3 === 0; // 加几个长标题测截断
      return {
        value: `t${i}`,
        label: long ? `这是一个很长很长很长的标签标题 ${i}` : `标签 ${i + 1}`,
        icon: <Icon className="h-4 w-4" />,
        badge: i % 4 === 0 ? i + 1 : undefined,
      } as TabItem;
    });
  }, []);

  // 工具方法
  const nextOf = (items: TabItem[], cur: string) => {
    const idx = items.findIndex((i) => i.value === cur);
    return items[(idx + 1) % items.length]?.value ?? cur;
  };
  const prevOf = (items: TabItem[], cur: string) => {
    const idx = items.findIndex((i) => i.value === cur);
    return items[(idx - 1 + items.length) % items.length]?.value ?? cur;
  };

  return (
    <div className="space-y-8 overflow-hidden">
      {/* 基本使用 */}
      <Card>
        <CardHeader>
          <CardTitle>基本使用</CardTitle>
          <CardDescription>移动端横向滚动，≥sm 网格布局</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={basicTab}
            onValueChange={setBasicTab}
            items={basicItems}
            edgeGutter={false}
          >
            <TabsContent value="all" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">全部组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  这里显示所有可用的组件...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="forms" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">表单组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  包含输入框、选择器、开关等...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="data" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">数据展示</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  表格、列表、卡片等...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="navigation" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">导航组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  菜单、面包屑、分页等...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="feedback" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">反馈组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  提示、通知、确认框等...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="layout" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">布局组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  网格、分割器、容器等...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="input" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">输入组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  各种输入控件和交互...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="display" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">展示组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  图片、头像、标签等...
                </p>
              </div>
            </TabsContent>
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 带图标 */}
      <Card>
        <CardHeader>
          <CardTitle>带图标的标签页</CardTitle>
          <CardDescription>每个标签页都可以配置图标</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={iconTab}
            onValueChange={setIconTab}
            items={iconItems}
            gridColsClass="sm:grid-cols-5"
            edgeGutter={false}
          >
            <TabsContent value="home" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">首页</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  系统概览...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="profile" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">个人资料</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  管理个人信息与偏好...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">设置</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  系统设置与配置...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">通知</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  查看与管理通知...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">文档</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  浏览与管理文档...
                </p>
              </div>
            </TabsContent>
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 徽标 + 禁用 */}
      <Card>
        <CardHeader>
          <CardTitle>徽标与状态</CardTitle>
          <CardDescription>支持徽标显示和禁用状态</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={badgeTab}
            onValueChange={setBadgeTab}
            items={badgeItems}
            scrollStep={150}
            gridColsClass="sm:grid-cols-4 lg:grid-cols-6"
            edgeGutter={false}
          >
            <TabsContent value="forms" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">表单组件</h3>
                  <Badge variant="secondary">12个</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  丰富的表单组件库...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="data" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">数据组件</h3>
                  <Badge>新</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  最新发布的数据展示组件...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="nav" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">导航组件</h3>
                  <Badge variant="secondary">8个</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  导航相关组件集合...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="feedback" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">反馈组件</h3>
                  <Badge variant="secondary">3个</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  交互提示与反馈...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="input" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">输入组件</h3>
                  <Badge variant="secondary">25个</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  输入与选择控件...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="search" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">搜索组件</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  搜索与过滤功能...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="bookmarks" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">收藏组件</h3>
                  <Badge variant="destructive">99+</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  收藏与标记功能...
                </p>
              </div>
            </TabsContent>
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 布局模式 Playground */}
      <Card>
        <CardHeader>
          <CardTitle>布局模式 Playground</CardTitle>
          <CardDescription>切换布局/步长/贴边，观察行为变化</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">布局：</span>
            <Button
              size="sm"
              variant={playLayout === "responsive" ? "default" : "outline"}
              onClick={() => setPlayLayout("responsive")}
            >
              responsive
            </Button>
            <Button
              size="sm"
              variant={playLayout === "scroll" ? "default" : "outline"}
              onClick={() => setPlayLayout("scroll")}
            >
              scroll
            </Button>
            <Button
              size="sm"
              variant={playLayout === "grid" ? "default" : "outline"}
              onClick={() => setPlayLayout("grid")}
            >
              grid
            </Button>

            <div className="mx-3 h-5 w-px bg-border" />

            <span className="text-sm text-muted-foreground">
              滚动步长(px)：
            </span>
            <Input
              className="h-8 w-24"
              type="number"
              value={playScrollStep}
              onChange={(e) => setPlayScrollStep(Number(e.target.value || 0))}
            />

            <div className="mx-3 h-5 w-px bg-border" />

            <Button
              size="sm"
              variant={playEdgeGutter ? "default" : "outline"}
              onClick={() => setPlayEdgeGutter((v) => !v)}
            >
              {playEdgeGutter ? "贴边已开" : "贴边已关"}
            </Button>

            <div className="mx-3 h-5 w-px bg-border" />

            <Button
              size="sm"
              variant="outline"
              onClick={() => setPlayTab(prevOf(playItems, playTab))}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> 上一项
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPlayTab(nextOf(playItems, playTab))}
            >
              下一项 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <ResponsiveTabs
            value={playTab}
            onValueChange={setPlayTab}
            items={playItems}
            layout={playLayout}
            edgeGutter={playEdgeGutter}
            scrollStep={playScrollStep}
            gridColsClass="sm:grid-cols-6 xl:grid-cols-8"
            triggerClassName="text-xs"
          >
            {playItems.map((it) => (
              <TabsContent key={it.value} value={it.value} className="mt-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{it.label}</h3>
                    {typeof it.badge !== "undefined" && (
                      <Badge variant="secondary">{it.badge}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    当前布局模式：<code>{playLayout}</code>，当前选中：
                    <code>{it.value}</code>
                  </p>
                </div>
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 桌面也滚动（长标题/多项） */}
      <Card>
        <CardHeader>
          <CardTitle>桌面也滚动（layout=&quot;scroll&quot;）</CardTitle>
          <CardDescription>测试长标题截断与左右按钮</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={playTab}
            onValueChange={setPlayTab}
            items={playItems}
            layout="scroll"
            edgeGutter={false}
            scrollStep={220}
            triggerClassName="text-xs"
          >
            {playItems.slice(0, 3).map((it) => (
              <TabsContent key={it.value} value={it.value} className="mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">{it.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    桌面也保留横向滚动，适合超多分类或标签数量不定的场景。
                  </p>
                </div>
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 始终网格 */}
      <Card>
        <CardHeader>
          <CardTitle>始终网格（layout=&quot;grid&quot;）</CardTitle>
          <CardDescription>均匀分布，信息密集展示</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={customTab}
            onValueChange={setCustomTab}
            items={customItems}
            layout="grid"
            gridColsClass="grid-cols-6 xl:grid-cols-8"
            listClassName="bg-muted/50"
            triggerClassName="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            edgeGutter={false}
          >
            <TabsContent value="docs" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">文档中心</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  均匀网格分布的选项卡。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">日历功能</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  日程管理和时间安排。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="mail" className="mt-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">邮件系统</h3>
                  <Badge variant="destructive">5个未读</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  收发与管理邮件。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="phone" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">通话功能</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  语音通话与视频会议。
                </p>
              </div>
            </TabsContent>
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* 动态增删 + 外部控制 */}
      <Card>
        <CardHeader>
          <CardTitle>动态增删标签 + 外部控制</CardTitle>
          <CardDescription>验证滚动定位与受控切换</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDynActive((v) => prevOf(dynItems, v))}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              上一项
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDynActive((v) => nextOf(dynItems, v))}
            >
              下一项
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <div className="mx-3 h-5 w-px bg-border" />

            <Button
              size="sm"
              onClick={() => {
                const id = `d${dynItems.length}`;
                setDynItems((arr) => [
                  ...arr,
                  { value: id, label: `动态标签 ${arr.length + 1}` },
                ]);
                setDynActive(`d${dynItems.length}`);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              新增
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (dynItems.length === 0) return;
                const idx = dynItems.findIndex((i) => i.value === dynActive);
                const next = dynItems.filter((i) => i.value !== dynActive);
                setDynItems(next);
                if (next.length === 0) return;
                const newIdx = Math.max(0, idx - 1);
                setDynActive(next[newIdx].value);
              }}
            >
              <Minus className="mr-1 h-4 w-4" />
              删除当前
            </Button>
          </div>

          <ResponsiveTabs
            layout="scroll"
            value={dynActive}
            onValueChange={setDynActive}
            items={dynItems}
            edgeGutter={false}
            scrollStep={180}
            triggerClassName="text-xs"
          >
            {dynItems.map((it) => (
              <TabsContent key={it.value} value={it.value} className="mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">{it.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    这是动态生成的内容。
                  </p>
                </div>
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>
    </div>
  );
}
