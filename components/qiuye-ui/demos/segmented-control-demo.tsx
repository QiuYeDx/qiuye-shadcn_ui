"use client";

import { useState } from "react";
import {
  BriefcaseBusinessIcon,
  ChartNoAxesCombinedIcon,
  CheckIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  Settings2Icon,
} from "lucide-react";

import {
  SegmentedControl,
  type SegmentedControlItem,
} from "@/components/qiuye-ui/segmented-control";
import { ViewSourceButton } from "@/components/view-source-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sourceCodes = {
  basic: `import { useState } from "react";
import { SegmentedControl } from "@/components/qiuye-ui/segmented-control";

export function Demo() {
  const [mode, setMode] = useState("chat");

  return (
    <SegmentedControl
      aria-label="工作模式"
      value={mode}
      onValueChange={setMode}
      items={[
        { value: "chat", label: "Chat" },
        { value: "work", label: "Work" },
      ]}
    />
  );
}`,
  sizes: `<SegmentedControl size="lg" fullWidth items={pageItems} />
<SegmentedControl size="md" items={cardItems} />
<SegmentedControl size="sm" items={settingItems} />`,
  pageLevel: `const [section, setSection] = useState("overview");

<SegmentedControl
  aria-label="页面内容"
  size="lg"
  fullWidth
  value={section}
  onValueChange={setSection}
  items={[
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
    { value: "settings", label: "Settings" },
  ]}
/>

<main>{renderSection(section)}</main>`,
  states: `<SegmentedControl
  aria-label="响应风格"
  size="sm"
  defaultValue="balanced"
  name="response-style"
  items={[
    { value: "brief", label: "Brief" },
    { value: "balanced", label: "Balanced" },
    { value: "detailed", label: "Detailed", disabled: true },
  ]}
/>`,
};

const chatItems: SegmentedControlItem[] = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
];

const pageItems: SegmentedControlItem[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <LayoutDashboardIcon />,
  },
  {
    value: "activity",
    label: "Activity",
    icon: <ChartNoAxesCombinedIcon />,
  },
  { value: "settings", label: "Settings", icon: <Settings2Icon /> },
];

const cardItems: SegmentedControlItem[] = [
  { value: "conversation", label: "Conversation", icon: <MessageCircleIcon /> },
  { value: "workspace", label: "Workspace", icon: <BriefcaseBusinessIcon /> },
];

const settingItems: SegmentedControlItem[] = [
  { value: "brief", label: "Brief" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed", disabled: true },
];

const sectionContent = {
  overview: {
    eyebrow: "Workspace overview",
    title: "A focused view of the work that matters now.",
    description:
      "Use the large control for top-level sections where the selected value changes most of the page.",
  },
  activity: {
    eyebrow: "Recent activity",
    title: "Review decisions, updates, and handoffs in one place.",
    description:
      "The spring indicator preserves spatial context while moving between peer sections.",
  },
  settings: {
    eyebrow: "Workspace settings",
    title: "Tune defaults without leaving the current workflow.",
    description:
      "Keyboard users can move with arrow keys and jump with Home or End.",
  },
} as const;

export function SegmentedControlDemo() {
  const [mode, setMode] = useState("chat");
  const [largeValue, setLargeValue] = useState("overview");
  const [mediumValue, setMediumValue] = useState("conversation");
  const [smallValue, setSmallValue] = useState("balanced");
  const [section, setSection] = useState<keyof typeof sectionContent>("overview");
  const content = sectionContent[section];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>ChatGPT 风格</CardTitle>
              <CardDescription>
                浅灰轨道与白色选中胶囊，切换时使用 spring 弹性过渡
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基础用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedControl
              aria-label="工作模式"
              value={mode}
              onValueChange={setMode}
              items={chatItems}
              className="w-full max-w-md"
            />
            <Badge variant="secondary">{mode}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>三种尺寸</CardTitle>
              <CardDescription>
                大尺寸用于页面级切换，中尺寸用于局部内容，小尺寸用于配置项
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.sizes} title="三种尺寸 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Badge variant="outline">lg</Badge>
            <SegmentedControl
              aria-label="页面级示例"
              size="lg"
              fullWidth
              value={largeValue}
              onValueChange={setLargeValue}
              items={pageItems}
            />
          </div>

          <div className="space-y-2">
            <Badge variant="outline">md</Badge>
            <SegmentedControl
              aria-label="局部内容示例"
              size="md"
              value={mediumValue}
              onValueChange={setMediumValue}
              items={cardItems}
            />
          </div>

          <div className="space-y-2">
            <Badge variant="outline">sm</Badge>
            <SegmentedControl
              aria-label="配置项示例"
              size="sm"
              value={smallValue}
              onValueChange={setSmallValue}
              items={settingItems}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>页面级内容切换</CardTitle>
              <CardDescription>
                fullWidth 配合 lg 尺寸，适合驱动主要页面区域
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.pageLevel}
              title="页面级切换 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <SegmentedControl
            aria-label="页面内容"
            size="lg"
            fullWidth
            value={section}
            onValueChange={(value) =>
              setSection(value as keyof typeof sectionContent)
            }
            items={pageItems}
          />

          <div className="mt-6 min-h-36 border-t pt-6" aria-live="polite">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {content.eyebrow}
            </p>
            <h3 className="mt-2 max-w-2xl text-xl font-semibold">
              {content.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {content.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>非受控、表单与禁用项</CardTitle>
              <CardDescription>
                可通过 defaultValue 独立管理状态，并用 name 参与表单提交
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.states} title="状态用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <SegmentedControl
              aria-label="响应风格"
              size="sm"
              defaultValue="balanced"
              name="response-style"
              items={settingItems}
            />
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckIcon className="size-3.5" />
              Detailed disabled
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
