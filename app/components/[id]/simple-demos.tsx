"use client";

import React from "react";
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import {
  ScrollableDialog,
  ScrollableDialogHeader,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/qiuye-ui/scrollable-dialog";
import { DotGlass } from "@/components/qiuye-ui/dot-glass";
import { ImageViewer } from "@/components/qiuye-ui/image-viewer";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { ThemeTransitionToggle } from "@/components/qiuye-ui/theme-transition-toggle";
import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";
import { Typewriter } from "@/components/qiuye-ui/typewriter";
import { MarkdownRenderer } from "@/components/qiuye-ui/markdown-renderer";
import { ColorPicker } from "@/components/qiuye-ui/color-picker";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { Tour, type TourStep } from "@/components/qiuye-ui/tour";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import {
  FolderKanban,
  Menu,
  Search,
  Sun,
  Moon,
  Volume2,
  VolumeOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ResponsiveTabs 简单演示
export function ResponsiveTabsSimpleDemo() {
  const [value, setValue] = React.useState("tab1");
  const items = [
    { value: "tab1", label: "标签一" },
    { value: "tab2", label: "标签二" },
    { value: "tab3", label: "标签三" },
  ];

  return (
    <ResponsiveTabs value={value} onValueChange={setValue} items={items}>
      <div className="p-4 border rounded-md">
        {value === "tab1" && <p>标签一的内容</p>}
        {value === "tab2" && <p>标签二的内容</p>}
        {value === "tab3" && <p>标签三的内容</p>}
      </div>
    </ResponsiveTabs>
  );
}

// ScrollableDialog 简单演示
export function ScrollableDialogSimpleDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex justify-center">
      <Button onClick={() => setOpen(true)}>打开对话框</Button>
      <ScrollableDialog open={open} onOpenChange={setOpen}>
        <ScrollableDialogHeader>
          <DialogTitle>可滚动对话框</DialogTitle>
          <DialogDescription>这是一个固定头部和底部的对话框</DialogDescription>
        </ScrollableDialogHeader>

        <ScrollableDialogContent>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <React.Fragment key={index}>
                <p>这是对话框的内容区域。</p>
                <p>当内容超过设定高度时会出现滚动条。</p>
                <p>头部和底部始终保持可见。</p>
              </React.Fragment>
            ))}
          </div>
        </ScrollableDialogContent>

        <ScrollableDialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={() => setOpen(false)}>确认</Button>
        </ScrollableDialogFooter>
      </ScrollableDialog>
    </div>
  );
}

// DotGlass 简单演示
export function DotGlassSimpleDemo() {
  const split = 50;

  return (
    <div className="space-y-4">
      {/* 白底黑字 */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl border border-black/10 bg-white text-zinc-900">
        <div className="absolute inset-0 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">白底黑字</div>
            <div className="text-xs text-zinc-500">左侧 {split}% 覆盖</div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-5/6 rounded bg-black/10" />
            <div className="h-2 w-4/6 rounded bg-black/5" />
            <div className="h-2 w-3/6 rounded bg-black/5" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-10 rounded-lg bg-cyan-500/35" />
            <div className="h-10 rounded-lg bg-fuchsia-500/30" />
            <div className="h-10 rounded-lg bg-amber-500/30" />
          </div>
        </div>

        <DotGlass
          absolute
          className="left-0 inset-y-0 pointer-events-none"
          style={{ width: `${split}%` }}
          dotSize={3}
          dotGap={6}
          dotFade={0}
          blur={4}
          saturation={140}
          glassAlpha={0}
          coverColor="#ffffff"
        />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/15" />
      </div>

      <Separator className="my-4" />

      {/* 黑底白字 */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl border border-white/10 bg-black text-white">
        <div className="absolute inset-0 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">黑底白字</div>
            <div className="text-xs text-white/70">左侧 {split}% 覆盖</div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-5/6 rounded bg-white/15" />
            <div className="h-2 w-4/6 rounded bg-white/10" />
            <div className="h-2 w-3/6 rounded bg-white/5" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-10 rounded-lg bg-cyan-400/30" />
            <div className="h-10 rounded-lg bg-fuchsia-400/25" />
            <div className="h-10 rounded-lg bg-amber-400/25" />
          </div>
        </div>

        <DotGlass
          absolute
          className="left-0 inset-y-0 pointer-events-none"
          style={{ width: `${split}%` }}
          dotSize={3}
          dotGap={6}
          dotFade={0}
          blur={4}
          saturation={140}
          glassAlpha={0}
          coverColor="#000000"
        />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
      </div>
    </div>
  );
}

// ImageViewer 简单演示
export function ImageViewerSimpleDemo() {
  return (
    <div className="flex justify-center items-center">
      <ImageViewer
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        alt="荒漠公路"
        maxHeight={400}
        hoverScale={1.05}
        rounded="2xl"
        lightboxRounded="2xl"
        smoothCorners
        smoothCornerSmoothing={0.72}
        className="w-full"
        wrapperClassName="flex justify-center items-center"
      />
    </div>
  );
}

// DualStateToggle 简单演示
export function DualStateToggleSimpleDemo() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(false);
  const [muted, setMuted] = React.useState(false);

  return (
    <div className="flex items-center justify-center gap-3">
      <DualStateToggle
        active={menuOpen}
        onToggle={setMenuOpen}
        activeIcon={<X />}
        inactiveIcon={<Menu />}
        effect="rotate"
        variant="outline"
      />
      <DualStateToggle
        active={theme}
        onToggle={setTheme}
        activeIcon={<Sun />}
        inactiveIcon={<Moon />}
        effect="slide-up"
        variant="secondary"
        shape="circle"
      />
      <DualStateToggle
        active={muted}
        onToggle={setMuted}
        activeIcon={<VolumeOff />}
        inactiveIcon={<Volume2 />}
        effect="scale"
        variant="ghost"
      />
    </div>
  );
}

// ThemeTransitionToggle 简单演示
export function ThemeTransitionToggleSimpleDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center justify-center gap-4 rounded-lg border bg-background p-5">
      <ThemeTransitionToggle
        isDark={isDark}
        onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
      />
      <div className="text-sm">
        <div className="font-medium">View Transition</div>
        <div className="text-muted-foreground">
          {isDark ? "深色模式" : "浅色模式"}
        </div>
      </div>
    </div>
  );
}

// Typewriter 简单演示
export function TypewriterSimpleDemo() {
  return (
    <div className="flex items-center gap-2 text-xl font-semibold">
      <span>I&apos;m a</span>
      <Typewriter
        phrases={["Developer", "Designer", "Creator"]}
        className="text-primary"
      />
    </div>
  );
}

// CodeBlock 简单演示
export function CodeBlockSimpleDemo() {
  const sampleCode = `import { useState } from "react";

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span className="text-xl font-bold">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`;

  return (
    <CodeBlockPanel filename="counter.tsx" code={sampleCode}>
      <CodeBlock language="tsx" isDark>
        {sampleCode}
      </CodeBlock>
    </CodeBlockPanel>
  );
}

// MarkdownRenderer 简单演示
export function MarkdownRendererSimpleDemo() {
  const content = [
    "## MarkdownRenderer",
    "",
    "支持 **GFM**、`inline code`、表格和代码块。",
    "",
    "| 场景 | 预设 |",
    "| --- | --- |",
    "| 长文 | Blog |",
    "| 会话 | Chat |",
    "",
    "```tsx title=\"demo.tsx\" {2}",
    "export function Demo() {",
    "  return <MarkdownRenderer content={content} />;",
    "}",
    "```",
  ].join("\n");

  return (
    <div className="">
      <MarkdownRenderer
        content={content}
        codeBlockDisplayMode="scroll"
        codeBlockMaxHeight={180}
      />
    </div>
  );
}

// ColorPicker 简单演示
export function ColorPickerSimpleDemo() {
  const [color, setColor] = React.useState("#6366F1");

  return (
    <div className="flex items-center gap-4">
      <ColorPicker value={color} onChange={setColor} />
      <span className="text-sm font-mono text-muted-foreground">{color}</span>
    </div>
  );
}

// SmoothCorners 简单演示
export function SmoothCornersSimpleDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        {
          label: "0",
          smoothing: 0,
          className:
            "border border-sky-500/35 bg-sky-50 text-sky-950 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.12)] dark:border-sky-400/35 dark:bg-sky-950/35 dark:text-sky-50",
        },
        {
          label: "0.6",
          smoothing: 0.6,
          className: "bg-primary text-primary-foreground",
        },
        {
          label: "0.95",
          smoothing: 0.95,
          className: "bg-foreground text-background",
        },
      ].map((item) => (
        <SmoothCorners
          key={item.label}
          radius={28}
          smoothing={item.smoothing}
          className={cn(
            "flex aspect-[4/3] min-h-24 flex-col justify-between p-4 shadow-sm",
            item.className
          )}
        >
          <span className="text-sm font-medium">smoothing</span>
          <span className="font-mono text-lg">{item.label}</span>
        </SmoothCorners>
      ))}
    </div>
  );
}

// Tour 简单演示
export function TourSimpleDemo() {
  const [open, setOpen] = React.useState(false);
  const steps = React.useMemo<TourStep[]>(
    () => [
      {
        target: "#tour-simple-search",
        title: "Search",
        content: "Use this field to jump across your workspace.",
        placement: "bottom",
      },
      {
        target: "#tour-simple-projects",
        title: "Projects",
        content: "Track the most important project status from this card.",
        placement: "top",
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          Start tour
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border bg-muted/20 p-3">
        <div
          id="tour-simple-search"
          className="flex min-h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground"
        >
          <Search className="size-4" />
          Search workspace
        </div>

        <div
          id="tour-simple-projects"
          className="rounded-md border bg-background p-4"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FolderKanban className="size-4 text-primary" />
            Project health
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {["Design", "Build", "Review"].map((item, index) => (
              <div
                key={item}
                className="rounded-md bg-muted/60 px-3 py-2 text-xs"
              >
                <div className="font-medium">{item}</div>
                <div className="mt-2 h-1.5 rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${72 - index * 16}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tour open={open} onOpenChange={setOpen} steps={steps} />
    </div>
  );
}
