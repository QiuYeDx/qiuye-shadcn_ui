"use client";

import { useState } from "react";
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  MessageCircleIcon,
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
  variants: `import { useState } from "react";
import { SegmentedControl } from "@/components/qiuye-ui/segmented-control";

const items = [
  { value: "chat", label: "Chat" },
  { value: "work", label: "Work" },
];

export function Demo() {
  const [containedValue, setContainedValue] = useState("chat");
  const [floatingValue, setFloatingValue] = useState("chat");

  return (
    <div className="space-y-8">
      <SegmentedControl
        aria-label="内嵌风格"
        size="md"
        variant="contained"
        value={containedValue}
        onValueChange={setContainedValue}
        items={items}
      />
      <SegmentedControl
        aria-label="悬浮风格"
        size="md"
        value={floatingValue}
        onValueChange={setFloatingValue}
        items={items}
      />
    </div>
  );
}`,
  sizes: `<SegmentedControl
  size="md"
  items={cardItems}
/>
<SegmentedControl
  size="md"
  variant="contained"
  items={cardItems}
/>
<SegmentedControl
  size="sm"
  items={settingItems}
/>
<SegmentedControl
  size="sm"
  variant="contained"
  items={settingItems}
/>`,
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

const cardItems: SegmentedControlItem[] = [
  { value: "conversation", label: "Conversation", icon: <MessageCircleIcon /> },
  { value: "workspace", label: "Workspace", icon: <BriefcaseBusinessIcon /> },
];

const settingItems: SegmentedControlItem[] = [
  { value: "brief", label: "Brief" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed", disabled: true },
];

export function SegmentedControlDemo() {
  const [mode, setMode] = useState("chat");
  const [floatingMode, setFloatingMode] = useState("chat");
  const [mediumFloatingValue, setMediumFloatingValue] =
    useState("conversation");
  const [mediumContainedValue, setMediumContainedValue] =
    useState("conversation");
  const [smallFloatingValue, setSmallFloatingValue] = useState("balanced");
  const [smallContainedValue, setSmallContainedValue] = useState("balanced");

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Variant 模式</CardTitle>
              <CardDescription>
                contained 保留内嵌胶囊，floating 让白色滑块外扩并悬浮在轨道之上
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.variants}
              title="风格模式 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">contained</Badge>
              <span className="text-xs text-muted-foreground">{mode}</span>
            </div>
            <SegmentedControl
              aria-label="内嵌风格"
              size="md"
              variant="contained"
              value={mode}
              onValueChange={setMode}
              items={chatItems}
              className="w-full max-w-md"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">floating</Badge>
              <span className="text-xs text-muted-foreground">
                {floatingMode}
              </span>
            </div>
            <SegmentedControl
              aria-label="悬浮风格"
              size="md"
              value={floatingMode}
              onValueChange={setFloatingMode}
              items={chatItems}
              className="w-full max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>两种尺寸</CardTitle>
              <CardDescription>
                md 用于局部内容切换，sm 用于紧凑配置项
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.sizes} title="两种尺寸 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-x-6">
            <Badge variant="outline" className="w-fit sm:mt-6">
              md
            </Badge>
            <div className="flex min-w-0 flex-wrap items-start gap-x-8 gap-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  floating · default
                </p>
                <SegmentedControl
                  aria-label="中尺寸悬浮风格"
                  size="md"
                  value={mediumFloatingValue}
                  onValueChange={setMediumFloatingValue}
                  items={cardItems}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">contained</p>
                <SegmentedControl
                  aria-label="中尺寸内嵌风格"
                  size="md"
                  variant="contained"
                  value={mediumContainedValue}
                  onValueChange={setMediumContainedValue}
                  items={cardItems}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-x-6">
            <Badge variant="outline" className="w-fit sm:mt-6">
              sm
            </Badge>
            <div className="flex min-w-0 flex-wrap items-start gap-x-8 gap-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  floating · default
                </p>
                <SegmentedControl
                  aria-label="小尺寸悬浮风格"
                  size="sm"
                  value={smallFloatingValue}
                  onValueChange={setSmallFloatingValue}
                  items={settingItems}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">contained</p>
                <SegmentedControl
                  aria-label="小尺寸内嵌风格"
                  size="sm"
                  variant="contained"
                  value={smallContainedValue}
                  onValueChange={setSmallContainedValue}
                  items={settingItems}
                />
              </div>
            </div>
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
