"use client";

import { useMemo, useRef, useState } from "react";
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
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Layers,
  Zap,
  Shield,
  Code,
  Palette,
  Globe,
  Package,
} from "lucide-react";
import { ViewSourceButton } from "@/components/view-source-button";

type LayoutMode = "responsive" | "scroll" | "grid";

/* ── 源码片段（供 ViewSourceButton 展示） ──────────────── */

const sourceCodes = {
  basic: `const items: TabItem[] = [
  { value: "all", label: "全部" },
  { value: "forms", label: "表单组件" },
  { value: "data", label: "数据展示" },
  // ...更多
];

<ResponsiveTabs
  value={tab}
  onValueChange={setTab}
  items={items}
>
  <TabsContent value="all">全部内容…</TabsContent>
  <TabsContent value="forms">表单组件内容…</TabsContent>
</ResponsiveTabs>`,

  iconsAndBadges: `const items: TabItem[] = [
  { value: "inbox", label: "收件箱", icon: <Mail className="h-4 w-4" />, badge: 12 },
  { value: "starred", label: "星标邮件", icon: <Star className="h-4 w-4" />, badge: "新" },
  { value: "archive", label: "归档", icon: <Package className="h-4 w-4" />, disabled: true },
];

<ResponsiveTabs
  value={tab}
  onValueChange={setTab}
  items={items}
  gridColsClass="sm:grid-cols-3 md:grid-cols-5"
>
  <TabsContent value="inbox">…</TabsContent>
</ResponsiveTabs>`,

  animatedHighlight: `// 默认开启弹簧动画高亮
<ResponsiveTabs animatedHighlight={true} ... />

// 关闭动画高亮 → 回到默认即时切换
<ResponsiveTabs animatedHighlight={false} ... />`,

  layoutModes: `// 自适应（默认）：小屏横向滚动 → 大屏网格
<ResponsiveTabs layout="responsive" ... />

// 始终横向滚动
<ResponsiveTabs layout="scroll" scrollStep={200} ... />

// 始终网格布局
<ResponsiveTabs layout="grid" gridColsClass="grid-cols-5" ... />`,

  fadeMasks: `<ResponsiveTabs
  layout="scroll"
  fadeMasks={true}       // 开启渐变遮罩
  fadeMaskWidth={48}     // 遮罩宽度(px)
  items={manyItems}
>
  <TabsContent value="docs">…</TabsContent>
</ResponsiveTabs>`,

  dynamic: `const [items, setItems] = useState<TabItem[]>([...]);
const [active, setActive] = useState("d0");

// 新增标签
const addTab = () => {
  const id = \`d\${counter.current++}\`;
  setItems(prev => [...prev, { value: id, label: \`标签 \${prev.length + 1}\` }]);
  setActive(id);
};

// 删除当前标签
const deleteTab = () => {
  const idx = items.findIndex(i => i.value === active);
  const next = items.filter(i => i.value !== active);
  setItems(next);
  setActive(next[Math.max(0, idx - 1)].value);
};

<ResponsiveTabs
  layout="scroll"
  value={active}
  onValueChange={setActive}
  items={items}
/>`,

  customStyles: `<ResponsiveTabs
  layout="grid"
  animatedHighlight={false}  // 自定义选中态时建议关闭
  gridColsClass="grid-cols-4"
  listClassName="bg-muted/50"
  triggerClassName="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  items={items}
>
  <TabsContent value="home">…</TabsContent>
</ResponsiveTabs>`,
};

/* ── 通用内容面板 ──────────────────────────────────────── */

function ContentPanel({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string | number;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{title}</h3>
        {badge !== undefined && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/* ── Demo 主组件 ───────────────────────────────────────── */

export function ResponsiveTabsDemo() {
  /* ── 1. 基本用法 ── */
  const [basicTab, setBasicTab] = useState("all");
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

  /* ── 2. 图标 & 徽标 & 禁用 ── */
  const [badgeTab, setBadgeTab] = useState("inbox");
  const badgeItems: TabItem[] = [
    {
      value: "inbox",
      label: "收件箱",
      icon: <Mail className="h-4 w-4" />,
      badge: 12,
    },
    {
      value: "starred",
      label: "星标邮件",
      icon: <Star className="h-4 w-4" />,
      badge: "新",
    },
    {
      value: "sent",
      label: "已发送",
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      value: "drafts",
      label: "草稿箱",
      icon: <FileText className="h-4 w-4" />,
      badge: 3,
    },
    {
      value: "archive",
      label: "归档",
      icon: <Package className="h-4 w-4" />,
      disabled: true,
    },
  ];

  /* ── 3. 动画高亮 ── */
  const [hlTab, setHlTab] = useState("overview");
  const [hlEnabled, setHlEnabled] = useState(true);
  const hlItems: TabItem[] = [
    { value: "overview", label: "概览", icon: <Home className="h-4 w-4" /> },
    { value: "design", label: "设计", icon: <Palette className="h-4 w-4" /> },
    { value: "develop", label: "开发", icon: <Code className="h-4 w-4" /> },
    { value: "test", label: "测试", icon: <Search className="h-4 w-4" /> },
    { value: "deploy", label: "部署", icon: <Globe className="h-4 w-4" /> },
  ];

  /* ── 4. 布局模式 ── */
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("responsive");
  const [layoutTab, setLayoutTab] = useState("t0");
  const layoutItems: TabItem[] = useMemo(() => {
    const icons = [Layers, Zap, Star, Heart, Shield];
    return Array.from({ length: 10 }).map((_, i) => {
      const Icon = icons[i % icons.length];
      return {
        value: `t${i}`,
        label: `分类 ${i + 1}`,
        icon: <Icon className="h-3.5 w-3.5" />,
      };
    });
  }, []);

  /* ── 5. 渐变遮罩 ── */
  const [fadeTab, setFadeTab] = useState("docs");
  const fadeItems: TabItem[] = [
    { value: "docs", label: "文档" },
    { value: "components", label: "组件库" },
    { value: "examples", label: "示例代码" },
    { value: "tutorials", label: "教程指南" },
    { value: "api", label: "API 参考" },
    { value: "changelog", label: "更新日志" },
    { value: "practices", label: "最佳实践" },
    { value: "troubleshoot", label: "故障排除" },
    { value: "community", label: "社区" },
    { value: "support", label: "技术支持" },
    { value: "enterprise", label: "企业版" },
    { value: "pricing", label: "价格方案" },
  ];

  /* ── 6. 动态增删 ── */
  const dynCounter = useRef(5);
  const [dynItems, setDynItems] = useState<TabItem[]>(
    Array.from({ length: 5 }).map((_, i) => ({
      value: `d${i}`,
      label: `标签 ${i + 1}`,
    }))
  );
  const [dynActive, setDynActive] = useState("d0");

  /* ── 7. 自定义样式 ── */
  const [styleTab, setStyleTab] = useState("home");
  const styleItems: TabItem[] = [
    { value: "home", label: "首页", icon: <Home className="h-4 w-4" /> },
    {
      value: "calendar",
      label: "日历",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      value: "mail",
      label: "邮件",
      icon: <Mail className="h-4 w-4" />,
      badge: 5,
    },
    {
      value: "settings",
      label: "设置",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  /* ── 8. Playground ── */
  const [playLayout, setPlayLayout] = useState<LayoutMode>("responsive");
  const [playScrollStep, setPlayScrollStep] = useState(200);
  const [playFadeMasks, setPlayFadeMasks] = useState(true);
  const [playFadeMaskWidth, setPlayFadeMaskWidth] = useState(64);
  const [playAnimatedHL, setPlayAnimatedHL] = useState(true);
  const [playTab, setPlayTab] = useState("p0");

  const playItems: TabItem[] = useMemo(() => {
    const icons = [Home, Settings, User, Bell, FileText, Star, Heart, Bookmark];
    return Array.from({ length: 14 }).map((_, i) => {
      const Icon = icons[i % icons.length];
      return {
        value: `p${i}`,
        label:
          i % 3 === 0 ? `这是一个很长的标签标题 ${i}` : `标签 ${i + 1}`,
        icon: <Icon className="h-3 w-3" />,
        badge: i % 4 === 0 ? i + 1 : undefined,
      } as TabItem;
    });
  }, []);

  /* ── 工具方法 ── */
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
      {/* ━━━━━━━━━━━━━ 1. 基本用法 ━━━━━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>基本用法</CardTitle>
              <CardDescription>
                默认 <code>responsive</code>{" "}
                布局：小屏横向滚动，≥sm&nbsp;断点自动切换为网格。
                尝试缩放浏览器宽度观察变化。
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基本用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={basicTab}
            onValueChange={setBasicTab}
            items={basicItems}
          >
            {basicItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  description={`当前选中「${item.label}」。缩小窗口宽度 → 标签栏自动变为横向滚动；放大窗口 → 自动切换为网格平铺。`}
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━ 2. 图标、徽标与禁用态 ━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>图标、徽标与禁用态</CardTitle>
              <CardDescription>
                每个 Tab 可独立配置{" "}
                <code>icon</code>（前置图标）、<code>badge</code>
                （数字/文字徽标）和 <code>disabled</code>（禁用）。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.iconsAndBadges}
              title="图标与徽标 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={badgeTab}
            onValueChange={setBadgeTab}
            items={badgeItems}
            gridColsClass="sm:grid-cols-3 md:grid-cols-5"
          >
            {badgeItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  badge={item.badge}
                  description={
                    item.badge !== undefined
                      ? `徽标值为「${item.badge}」。可以是数字表示数量，也可以是文字标记状态。`
                      : `「${item.label}」— 普通标签页，未配置徽标。注意：「归档」标签页处于 disabled 禁用状态，无法点击。`
                  }
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━ 3. 选中态动画高亮 ━━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>选中态动画高亮</CardTitle>
              <CardDescription>
                切换 Tab 时，高亮底色以弹簧动画平滑滑动到目标选项卡
                （默认开启，可通过 <code>animatedHighlight</code> 属性控制）。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.animatedHighlight}
              title="动画高亮 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            size="sm"
            variant={hlEnabled ? "default" : "outline"}
            onClick={() => setHlEnabled((v) => !v)}
            className="cursor-pointer"
          >
            {hlEnabled ? "animatedHighlight：开启" : "animatedHighlight：关闭"}
          </Button>

          <ResponsiveTabs
            value={hlTab}
            onValueChange={setHlTab}
            items={hlItems}
            animatedHighlight={hlEnabled}
            gridColsClass="sm:grid-cols-5"
          >
            {hlItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  description={
                    hlEnabled
                      ? "注意观察：选中高亮底色正以弹簧动画从前一个标签平滑滑动到当前标签。"
                      : "动画已关闭，选中态为默认的即时切换效果，无滑动过渡。"
                  }
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━━━ 4. 三种布局模式 ━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>三种布局模式</CardTitle>
              <CardDescription>
                <code>responsive</code>（自适应，默认）、
                <code>scroll</code>（始终横向滚动）、
                <code>grid</code>（始终网格平铺）。
                切换按钮实时对比差异。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.layoutModes}
              title="布局模式 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">
              layout =
            </span>
            {(["responsive", "scroll", "grid"] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={layoutMode === mode ? "default" : "outline"}
                onClick={() => setLayoutMode(mode)}
                className="cursor-pointer"
              >
                {`"${mode}"`}
              </Button>
            ))}
          </div>

          <ResponsiveTabs
            value={layoutTab}
            onValueChange={setLayoutTab}
            items={layoutItems}
            layout={layoutMode}
            scrollStep={200}
            gridColsClass={
              layoutMode === "grid"
                ? "grid-cols-5 lg:grid-cols-10"
                : "sm:grid-cols-5 lg:grid-cols-10"
            }
          >
            {layoutItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  description={
                    layoutMode === "responsive"
                      ? "当前为 responsive 模式：小屏自动横向滚动（可手势左右滑动），大屏切换为网格平铺展示。"
                      : layoutMode === "scroll"
                        ? "当前为 scroll 模式：所有屏幕尺寸均保持横向滚动，配合左右箭头按钮导航。适合标签数量不确定或频繁变化的场景。"
                        : "当前为 grid 模式：所有屏幕尺寸均为网格平铺，选项卡均匀分布。适合数量固定、需要一目了然的场景。"
                  }
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━━━ 5. 渐变遮罩效果 ━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>渐变遮罩效果</CardTitle>
              <CardDescription>
                滚动模式下，左右两侧显示渐变遮罩提示可滚动区域。通过{" "}
                <code>fadeMasks</code> 开关和 <code>fadeMaskWidth</code>{" "}
                设置宽度。遮罩会在滚到边界时自动消失。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.fadeMasks}
              title="渐变遮罩 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={fadeTab}
            onValueChange={setFadeTab}
            items={fadeItems}
            layout="scroll"
            fadeMasks={true}
            fadeMaskWidth={48}
          >
            {fadeItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  description="向左右滚动标签栏，注意观察两端的渐变遮罩 — 有更多内容可滚动时自动出现，滚到最边界时平滑消失。"
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━━━ 6. 动态增删标签 ━━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>动态增删标签</CardTitle>
              <CardDescription>
                支持运行时动态增删 Tab
                选项，组件自动维护激活态和滚动位置。配合外部控制（上一项/下一项）验证受控切换。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.dynamic}
              title="动态增删 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDynActive((v) => prevOf(dynItems, v))}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              上一项
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDynActive((v) => nextOf(dynItems, v))}
              className="cursor-pointer"
            >
              下一项
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-5 w-px bg-border" />

            <Button
              size="sm"
              onClick={() => {
                const id = `d${dynCounter.current++}`;
                setDynItems((arr) => [
                  ...arr,
                  { value: id, label: `标签 ${arr.length + 1}` },
                ]);
                setDynActive(id);
              }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              新增
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (dynItems.length <= 1) return;
                const idx = dynItems.findIndex((i) => i.value === dynActive);
                const next = dynItems.filter((i) => i.value !== dynActive);
                setDynItems(next);
                setDynActive(next[Math.max(0, idx - 1)].value);
              }}
              className="cursor-pointer"
              disabled={dynItems.length <= 1}
            >
              <Minus className="h-4 w-4" />
              删除当前
            </Button>

            <span className="text-xs text-muted-foreground">
              共 {dynItems.length} 个标签
            </span>
          </div>

          <ResponsiveTabs
            layout="scroll"
            value={dynActive}
            onValueChange={setDynActive}
            items={dynItems}
            scrollStep={180}
          >
            {dynItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  description={`动态生成的内容 · 标签 ID：${item.value} · 当前共 ${dynItems.length} 个标签。新增的标签会自动被选中并滚动到可见位置。`}
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━━━ 7. 自定义样式 ━━━━━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>自定义样式</CardTitle>
              <CardDescription>
                通过 <code>listClassName</code>、
                <code>triggerClassName</code>
                自定义容器与选项卡样式。自定义选中态时建议关闭{" "}
                <code>animatedHighlight</code> 以避免冲突。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.customStyles}
              title="自定义样式 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveTabs
            value={styleTab}
            onValueChange={setStyleTab}
            items={styleItems}
            layout="grid"
            animatedHighlight={false}
            gridColsClass="grid-cols-4"
            listClassName="bg-muted/50"
            triggerClassName="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {styleItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  badge={item.badge}
                  description="此示例使用了 primary 色系的选中态样式，容器添加了半透明背景色。关闭了 animatedHighlight 以避免与自定义样式冲突。"
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>

      {/* ━━━━━━━━━━━ 8. 交互式 Playground ━━━━━━━━━━━━━━ */}
      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>交互式 Playground</CardTitle>
            <CardDescription>
              调整所有可配置参数，实时观察行为变化。包含 14
              个标签项（含长标题、图标、徽标）以充分测试溢出与滚动。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 控制面板 */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* 布局模式 */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  layout
                </Label>
                <div className="flex gap-1.5">
                  {(["responsive", "scroll", "grid"] as const).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={playLayout === m ? "default" : "outline"}
                      onClick={() => setPlayLayout(m)}
                      className="cursor-pointer flex-1 text-xs"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 功能开关 */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  功能开关
                </Label>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={playAnimatedHL ? "default" : "outline"}
                    onClick={() => setPlayAnimatedHL((v) => !v)}
                    className="cursor-pointer flex-1 text-xs"
                  >
                    animatedHighlight
                  </Button>
                  <Button
                    size="sm"
                    variant={playFadeMasks ? "default" : "outline"}
                    onClick={() => setPlayFadeMasks((v) => !v)}
                    className="cursor-pointer flex-1 text-xs"
                  >
                    fadeMasks
                  </Button>
                </div>
              </div>

              {/* 数值参数 */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  数值参数
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      scrollStep(px)
                    </span>
                    <Input
                      className="h-8 text-xs"
                      type="number"
                      value={playScrollStep}
                      onChange={(e) =>
                        setPlayScrollStep(Number(e.target.value || 200))
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      fadeMaskWidth(px)
                    </span>
                    <Input
                      className="h-8 text-xs"
                      type="number"
                      value={playFadeMaskWidth}
                      onChange={(e) =>
                        setPlayFadeMaskWidth(Number(e.target.value || 64))
                      }
                      disabled={!playFadeMasks}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 外部切换按钮 */}
            <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPlayTab(prevOf(playItems, playTab))}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                上一项
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPlayTab(nextOf(playItems, playTab))}
                className="cursor-pointer"
              >
                下一项
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-[11px] text-muted-foreground ml-1">
                外部受控切换 · 验证滚动跟随定位
              </span>
            </div>
          </div>

          {/* 实际 Tabs */}
          <ResponsiveTabs
            value={playTab}
            onValueChange={setPlayTab}
            items={playItems}
            layout={playLayout}
            scrollStep={playScrollStep}
            fadeMasks={playFadeMasks}
            fadeMaskWidth={playFadeMaskWidth}
            animatedHighlight={playAnimatedHL}
            gridColsClass="sm:grid-cols-6 xl:grid-cols-8"
            triggerClassName="text-xs"
          >
            {playItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <ContentPanel
                  title={item.label}
                  badge={item.badge}
                  description={`layout: ${playLayout} · animatedHighlight: ${playAnimatedHL ? "on" : "off"} · fadeMasks: ${playFadeMasks ? "on" : "off"} · scrollStep: ${playScrollStep}px · fadeMaskWidth: ${playFadeMaskWidth}px`}
                />
              </TabsContent>
            ))}
          </ResponsiveTabs>
        </CardContent>
      </Card>
    </div>
  );
}
