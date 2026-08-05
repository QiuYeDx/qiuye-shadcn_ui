"use client";

import { useState } from "react";
import {
  Archive,
  CircleCheck,
  Clock3,
  Image as ImageIcon,
  Inbox,
  Settings,
  Star,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SegmentedControl } from "../segmented-control";
import { ResponsiveTabs, TabsContent, type TabItem } from "../responsive-tabs";
import { ViewSourceButton } from "@/components/view-source-button";

type LayoutMode = "responsive" | "scroll" | "grid";
type PreviewWidth = "compact" | "medium" | "full";
type TabSize = "default" | "sm";

const adaptiveItems: TabItem[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "进行中", icon: <Clock3 className="size-4" /> },
  { value: "review", label: "等待审批", badge: 8 },
  { value: "media", label: "媒体资源", icon: <ImageIcon className="size-4" /> },
];

const comparisonItems: TabItem[] = [
  { value: "all", label: "全部" },
  { value: "processing", label: "处理中" },
  { value: "confirmation", label: "等待客户确认" },
  { value: "archived", label: "已归档" },
];

const stateItems: TabItem[] = [
  {
    value: "inbox",
    label: "收件箱",
    icon: <Inbox className="size-4" />,
    badge: 12,
  },
  { value: "starred", label: "星标", icon: <Star className="size-4" /> },
  { value: "archived", label: "归档", icon: <Archive className="size-4" /> },
  {
    value: "settings",
    label: "设置",
    icon: <Settings className="size-4" />,
    disabled: true,
  },
];

const previewWidths: Record<PreviewWidth, { label: string; width: string }> = {
  compact: { label: "320 px", width: "320px" },
  medium: { label: "560 px", width: "560px" },
  full: { label: "填满", width: "100%" },
};

const modeContracts = [
  {
    mode: "responsive",
    width: "所有选项始终等宽",
    overflow: "统一采用最长项宽度后滚动",
    rows: "单行",
    gridCols: "忽略",
  },
  {
    mode: "scroll",
    width: "按各自内容宽度",
    overflow: "直接横向滚动",
    rows: "单行",
    gridCols: "忽略",
  },
  {
    mode: "grid",
    width: "按配置列数等分",
    overflow: "换行展示",
    rows: "可多行",
    gridCols: "生效",
  },
] as const;

const comparisonModes: Array<{
  mode: LayoutMode;
  summary: string;
}> = [
  {
    mode: "responsive",
    summary: "等宽优先，放不下完整内容时滚动",
  },
  {
    mode: "scroll",
    summary: "每项保持自己的内容宽度，始终可滚动",
  },
  {
    mode: "grid",
    summary: "按指定列数等分，多出的选项换行",
  },
];

const sourceCodes = {
  adaptive: `const items: TabItem[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "进行中", icon: <Clock3 /> },
  { value: "review", label: "等待审批", badge: 8 },
  { value: "media", label: "媒体资源", icon: <ImageIcon /> },
];

<ResponsiveTabs
  value={value}
  onValueChange={setValue}
  items={items}
/>
// responsive 是默认模式：
// 宽度足够时单行等分；放不下时以最长项为统一宽度横向滚动。`,

  modes: `const items: TabItem[] = [
  { value: "all", label: "全部" },
  { value: "processing", label: "处理中" },
  { value: "confirmation", label: "等待客户确认" },
  { value: "archived", label: "已归档" },
];

<ResponsiveTabs layout="responsive" items={items} {...controlledProps} />
<ResponsiveTabs layout="scroll" items={items} {...controlledProps} />
<ResponsiveTabs
  layout="grid"
  gridColsClass="grid-cols-2"
  items={items}
  {...controlledProps}
/>`,

  states: `const items: TabItem[] = [
  { value: "inbox", label: "收件箱", icon: <Inbox />, badge: 12 },
  { value: "starred", label: "星标", icon: <Star /> },
  { value: "settings", label: "设置", icon: <Settings />, disabled: true },
];

<ResponsiveTabs
  value={value}
  onValueChange={setValue}
  items={items}
  size="sm"
  animatedHighlight
/>`,
};

function SectionHeader({
  title,
  description,
  source,
  sourceTitle,
}: {
  title: string;
  description: string;
  source?: string;
  sourceTitle?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {source && (
        <ViewSourceButton
          code={source}
          title={sourceTitle ?? `${title} - 源码`}
        />
      )}
    </div>
  );
}

function SelectedValue({ label }: { label: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 border-t pt-3 text-sm">
      <span className="text-muted-foreground">当前选中</span>
      <span className="truncate font-medium">{label}</span>
    </div>
  );
}

export function ResponsiveTabsDemo() {
  const [adaptiveValue, setAdaptiveValue] = useState("all");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("medium");
  const [modeValues, setModeValues] = useState<Record<LayoutMode, string>>({
    responsive: "all",
    scroll: "all",
    grid: "all",
  });
  const [stateValue, setStateValue] = useState("inbox");
  const [tabSize, setTabSize] = useState<TabSize>("default");
  const [animatedHighlight, setAnimatedHighlight] = useState(true);

  const adaptiveLabel =
    adaptiveItems.find((item) => item.value === adaptiveValue)?.label ?? "";
  const stateLabel =
    stateItems.find((item) => item.value === stateValue)?.label ?? "";

  return (
    <div className="space-y-10 overflow-hidden">
      <section className="space-y-4">
        <SectionHeader
          title="布局模式契约"
          description="先根据选项宽度、溢出方式和是否允许换行选择模式，再配置滚动提示或网格列数。"
        />

        <div className="overflow-hidden rounded-md border">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">模式</TableHead>
                <TableHead>选项宽度</TableHead>
                <TableHead>空间不足</TableHead>
                <TableHead>行数</TableHead>
                <TableHead className="pr-4">gridColsClass</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modeContracts.map((contract) => (
                <TableRow key={contract.mode}>
                  <TableCell className="pl-4">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
                      {contract.mode}
                    </code>
                  </TableCell>
                  <TableCell>{contract.width}</TableCell>
                  <TableCell>{contract.overflow}</TableCell>
                  <TableCell>{contract.rows}</TableCell>
                  <TableCell className="pr-4">{contract.gridCols}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4 border-t pt-8">
        <SectionHeader
          title="等宽分配与溢出回退"
          description="responsive 模式会把文案、图标和徽标都计入最小宽度。空间足够时平均分配整行；空间不足时以最长选项为统一宽度，并只在组件内部横向滚动。"
          source={sourceCodes.adaptive}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-[300px]">
            <SegmentedControl
              aria-label="预览容器宽度"
              value={previewWidth}
              onValueChange={(value) => setPreviewWidth(value as PreviewWidth)}
              items={Object.entries(previewWidths).map(([value, item]) => ({
                value,
                label: item.label,
              }))}
              size="sm"
              variant="contained"
              fullWidth
            />
          </div>
          <span className="text-xs text-muted-foreground">
            容器宽度：{previewWidths[previewWidth].label}
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border bg-muted/20 p-3 sm:p-4">
          <div
            className="mx-auto max-w-full"
            style={{ width: previewWidths[previewWidth].width }}
          >
            <ResponsiveTabs
              value={adaptiveValue}
              onValueChange={setAdaptiveValue}
              items={adaptiveItems}
            >
              <TabsContent value={adaptiveValue}>
                <SelectedValue label={adaptiveLabel} />
              </TabsContent>
            </ResponsiveTabs>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t pt-8">
        <SectionHeader
          title="同一组数据，三种布局"
          description="相同文案同时展示，宽度分配和换行差异无需来回切换即可直接比较。"
          source={sourceCodes.modes}
          sourceTitle="三种布局模式 - 源码"
        />

        <div className="divide-y overflow-hidden rounded-lg border">
          {comparisonModes.map(({ mode, summary }) => {
            const activeLabel =
              comparisonItems.find((item) => item.value === modeValues[mode])
                ?.label ?? "";

            return (
              <div
                key={mode}
                className="grid min-w-0 gap-4 p-4 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm font-semibold">{mode}</code>
                    <span className="truncate text-xs text-muted-foreground lg:hidden">
                      {activeLabel}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {summary}
                  </p>
                </div>

                <ResponsiveTabs
                  className="min-w-0"
                  value={modeValues[mode]}
                  onValueChange={(value) =>
                    setModeValues((current) => ({ ...current, [mode]: value }))
                  }
                  items={comparisonItems}
                  layout={mode}
                  gridColsClass={mode === "grid" ? "grid-cols-2" : undefined}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t pt-8">
        <SectionHeader
          title="内容、状态与尺寸"
          description="图标、徽标和禁用状态可以混合使用；尺寸与动画只改变视觉密度和切换反馈，不改变当前布局模式的宽度契约。"
          source={sourceCodes.states}
        />

        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <span className="text-xs font-medium text-muted-foreground">
              尺寸
            </span>
            <SegmentedControl
              aria-label="标签尺寸"
              value={tabSize}
              onValueChange={(value) => setTabSize(value as TabSize)}
              items={[
                { value: "default", label: "默认" },
                { value: "sm", label: "紧凑" },
              ]}
              size="sm"
              variant="contained"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <Label
              htmlFor="responsive-tabs-highlight"
              className="text-xs font-medium"
            >
              动画高亮
            </Label>
            <Switch
              id="responsive-tabs-highlight"
              checked={animatedHighlight}
              onCheckedChange={setAnimatedHighlight}
            />
          </div>
        </div>

        <ResponsiveTabs
          value={stateValue}
          onValueChange={setStateValue}
          items={stateItems}
          size={tabSize}
          animatedHighlight={animatedHighlight}
        >
          <TabsContent value={stateValue}>
            <div className="flex min-h-12 items-center justify-between gap-3 border-t pt-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-medium">
                <CircleCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{stateLabel}</span>
              </span>
              <span className="text-xs text-muted-foreground">可组合内容</span>
            </div>
          </TabsContent>
        </ResponsiveTabs>
      </section>
    </div>
  );
}
