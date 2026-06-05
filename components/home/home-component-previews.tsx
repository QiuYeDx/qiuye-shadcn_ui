"use client";

import * as React from "react";
import {
  BellIcon,
  CheckIcon,
  FolderKanbanIcon,
  MenuIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
  XIcon,
} from "lucide-react";

import {
  DialogDescription,
  DialogTitle,
  ScrollableDialog,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from "@/components/qiuye-ui/scrollable-dialog";
import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block";
import { ColorPicker } from "@/components/qiuye-ui/color-picker";
import { DotGlass } from "@/components/qiuye-ui/dot-glass";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { ImageViewer } from "@/components/qiuye-ui/image-viewer";
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { Typewriter } from "@/components/qiuye-ui/typewriter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentId } from "@/lib/component-constants";

function ResponsiveTabsPreview() {
  const [value, setValue] = React.useState("overview");

  return (
    <div className="w-full max-w-sm space-y-4">
      <ResponsiveTabs
        value={value}
        onValueChange={setValue}
        items={[
          { value: "overview", label: "Overview" },
          { value: "tasks", label: "Tasks", badge: "8" },
          { value: "files", label: "Files" },
        ]}
        layout="grid"
        gridColsClass="grid-cols-3"
        size="sm"
        scrollButtons={false}
        fadeMasks={false}
      >
        <div className="rounded-md border bg-muted/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <FolderKanbanIcon className="size-4" />
            <span className="text-sm font-medium capitalize">{value}</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded bg-foreground/15" />
            <div className="h-2 w-1/2 rounded bg-foreground/10" />
          </div>
        </div>
      </ResponsiveTabs>
    </div>
  );
}

function ScrollableDialogPreview() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="w-full rounded-lg border bg-background p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Release notes</div>
            <div className="text-xs text-muted-foreground">
              Fixed header and footer
            </div>
          </div>
          <Badge variant="secondary">Dialog</Badge>
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded bg-muted" />
          <div className="h-2 w-4/5 rounded bg-muted" />
          <div className="h-2 w-2/3 rounded bg-muted" />
        </div>
      </div>
      <Button size="sm" onClick={() => setOpen(true)}>
        打开预览
      </Button>
      <ScrollableDialog open={open} onOpenChange={setOpen}>
        <ScrollableDialogHeader>
          <DialogTitle>Scrollable Dialog</DialogTitle>
          <DialogDescription>头部和底部保持固定。</DialogDescription>
        </ScrollableDialogHeader>
        <ScrollableDialogContent>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-md border p-3 text-sm">
                Content row {index + 1}
              </div>
            ))}
          </div>
        </ScrollableDialogContent>
        <ScrollableDialogFooter>
          <Button size="sm" onClick={() => setOpen(false)}>
            完成
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialog>
    </div>
  );
}

function DotGlassPreview() {
  return (
    <div className="relative h-[210px] w-full overflow-hidden rounded-lg border bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="absolute inset-0 p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Dot glass layer</div>
          <div className="rounded-full bg-zinc-950 px-2 py-0.5 text-xs text-white dark:bg-white dark:text-zinc-950">
            Live
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="h-16 rounded-lg bg-cyan-500/35" />
          <div className="h-16 rounded-lg bg-fuchsia-500/30" />
          <div className="h-16 rounded-lg bg-amber-500/30" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-4/5 rounded bg-zinc-950/15 dark:bg-white/20" />
          <div className="h-2 w-2/3 rounded bg-zinc-950/10 dark:bg-white/15" />
        </div>
      </div>
      <DotGlass
        absolute
        className="inset-y-0 left-0 w-[58%]"
        dotSize={3}
        dotGap={6}
        dotFade={0}
        blur={5}
        saturation={150}
        glassAlpha={0}
        coverColor="var(--background)"
      />
      <div className="absolute inset-y-0 left-[58%] w-px bg-border" />
    </div>
  );
}

function ImageViewerPreview() {
  return (
    <div className="w-full max-w-lg">
      <ImageViewer
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        alt="Road crossing a desert landscape"
        maxHeight={220}
        hoverScale={1.03}
        className="w-full"
        wrapperClassName="flex items-center justify-center overflow-hidden rounded-lg border"
      />
    </div>
  );
}

function DualStateTogglePreview() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(false);
  const [done, setDone] = React.useState(true);

  return (
    <div className="flex items-center justify-center gap-3 rounded-full border bg-muted/30 p-3">
      <DualStateToggle
        active={theme}
        onToggle={setTheme}
        activeIcon={<MoonIcon />}
        inactiveIcon={<SunIcon />}
        activeLabel="深色"
        inactiveLabel="浅色"
        effect="slide-up"
        variant="secondary"
        shape="circle"
      />
      <DualStateToggle
        active={menuOpen}
        onToggle={setMenuOpen}
        activeIcon={<XIcon />}
        inactiveIcon={<MenuIcon />}
        activeLabel="关闭菜单"
        inactiveLabel="打开菜单"
        effect="rotate"
        variant="outline"
      />
      <DualStateToggle
        active={done}
        onToggle={setDone}
        activeIcon={<CheckIcon />}
        inactiveIcon={<BellIcon />}
        activeLabel="完成"
        inactiveLabel="提醒"
        effect="scale"
        variant="ghost"
      />
    </div>
  );
}

function CodeBlockPreview() {
  const code = `import { DotGlass } from "@/components/qiuye-ui/dot-glass";

export function Preview() {
  return <DotGlass className="rounded-lg p-4" />;
}`;

  return (
    <div className="w-full max-w-xl">
      <CodeBlockPanel
        filename="preview.tsx"
        code={code}
        isDark
        colorTheme="github"
        className="shadow-none"
      >
        <CodeBlock
          language="tsx"
          isDark
          colorTheme="github"
          displayMode="scroll"
          maxHeight={180}
          showLineNumbers={false}
          noShadow
        >
          {code}
        </CodeBlock>
      </CodeBlockPanel>
    </div>
  );
}

function TypewriterPreview() {
  return (
    <div className="rounded-full border bg-muted/30 px-5 py-3 text-sm font-medium">
      <Typewriter
        phrases={["Install components", "Build your system", "Ship faster"]}
        typingSpeed={65}
        deletingSpeed={35}
        pauseDuration={1000}
        switchInterval={350}
      />
    </div>
  );
}

function MarkdownRendererPreview() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-background p-4 text-left shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">MarkdownRenderer</div>
        <Badge variant="secondary">GFM</Badge>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <div className="text-lg font-semibold">Release checklist</div>
          <p className="mt-1 text-muted-foreground">
            Tables, code blocks, widgets and safe links.
          </p>
        </div>
        <div className="rounded-md border">
          <div className="grid grid-cols-3 border-b bg-muted/40 px-3 py-2 text-xs font-medium">
            <span>Item</span>
            <span>Status</span>
            <span>Owner</span>
          </div>
          {["Docs", "CLI", "Preview"].map((item) => (
            <div
              key={item}
              className="grid grid-cols-3 border-b px-3 py-2 text-xs last:border-b-0"
            >
              <span>{item}</span>
              <span>Done</span>
              <span>QiuYe</span>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
          pnpm dlx shadcn@latest add @qiuye-ui/markdown-renderer
        </div>
      </div>
    </div>
  );
}

function ColorPickerPreview() {
  const [color, setColor] = React.useState("#6366F1");
  const swatches = ["#6366F1", "#06B6D4", "#F59E0B", "#22C55E"];

  return (
    <div className="flex flex-col items-center gap-4">
      <ColorPicker
        value={color}
        onChange={setColor}
        triggerSize="lg"
        presetColors={swatches}
        showRecent={false}
      />
      <div className="flex items-center gap-2">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            aria-label={`选择 ${swatch}`}
            onClick={() => setColor(swatch)}
            className="size-6 rounded-full border"
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
      <code className="rounded-md bg-muted px-2 py-1 text-xs">{color}</code>
    </div>
  );
}

function TourPreview() {
  return (
    <div className="relative h-[230px] w-full max-w-sm overflow-hidden rounded-lg border bg-background p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="size-8 rounded-full bg-primary" />
        <div className="space-y-1">
          <div className="h-2 w-24 rounded bg-foreground/20" />
          <div className="h-2 w-16 rounded bg-foreground/10" />
        </div>
      </div>
      <div className="grid grid-cols-[88px_1fr] gap-3">
        <div className="space-y-2 rounded-md border bg-muted/30 p-2">
          <div className="h-7 rounded bg-background" />
          <div className="h-7 rounded bg-background" />
          <div className="h-7 rounded bg-primary/15" />
        </div>
        <div className="space-y-3">
          <div className="h-16 rounded-md border bg-muted/30" />
          <div className="h-16 rounded-md border bg-muted/30" />
        </div>
      </div>
      <div className="absolute inset-0 bg-background/65" />
      <div className="absolute left-4 top-[92px] h-12 w-[88px] rounded-md ring-2 ring-primary ring-offset-4 ring-offset-background" />
      <div className="absolute right-5 top-20 w-44 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <SparklesIcon className="size-4" />
          Guided step
        </div>
        <p className="text-xs text-muted-foreground">
          Highlight, explain and move to the next target.
        </p>
      </div>
    </div>
  );
}

export const homePreviewComponents = {
  [ComponentId.RESPONSIVE_TABS]: ResponsiveTabsPreview,
  [ComponentId.SCROLLABLE_DIALOG]: ScrollableDialogPreview,
  [ComponentId.DOT_GLASS]: DotGlassPreview,
  [ComponentId.IMAGE_VIEWER]: ImageViewerPreview,
  [ComponentId.DUAL_STATE_TOGGLE]: DualStateTogglePreview,
  [ComponentId.CODE_BLOCK]: CodeBlockPreview,
  [ComponentId.TYPEWRITER]: TypewriterPreview,
  [ComponentId.MARKDOWN_RENDERER]: MarkdownRendererPreview,
  [ComponentId.COLOR_PICKER]: ColorPickerPreview,
  [ComponentId.TOUR]: TourPreview,
} satisfies Record<ComponentId, React.ComponentType>;
