"use client";

import * as React from "react";
import {
  ArrowUpRightIcon,
  BellOffIcon,
  BellIcon,
  CheckIcon,
  FolderKanbanIcon,
  GripVerticalIcon,
  MenuIcon,
  MousePointer2Icon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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
import { Tour, type TourStep } from "@/components/qiuye-ui/tour";
import { Typewriter } from "@/components/qiuye-ui/typewriter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentId } from "@/lib/component-constants";
import { cn } from "@/lib/utils";

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
  const reviewItems = [
    ["图标语义", "切换前后状态保持同一对象"],
    ["滚动内容", "长内容分组清晰，遮罩提示保留"],
    ["底部操作", "取消与确认按钮固定居中"],
  ];

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="w-full rounded-lg border bg-background p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckIcon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium">发布确认</div>
              <div className="text-xs text-muted-foreground">
                固定头部、滚动正文、居中操作
              </div>
            </div>
          </div>
          <Badge variant="secondary">Review</Badge>
        </div>
        <div className="space-y-2 text-xs">
          {reviewItems.map(([label, detail]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-md bg-muted/50 px-3 py-2"
            >
              <span className="font-medium">{label}</span>
              <span className="truncate text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
      </div>
      <Button size="sm" onClick={() => setOpen(true)}>
        查看确认单
      </Button>
      <ScrollableDialog
        open={open}
        onOpenChange={setOpen}
        maxWidth="sm:max-w-lg"
      >
        <ScrollableDialogHeader>
          <DialogTitle>组件发布确认</DialogTitle>
          <DialogDescription>
            滚动查看变更、风险和后续动作，底部操作始终可见。
          </DialogDescription>
        </ScrollableDialogHeader>
        <ScrollableDialogContent>
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 text-sm font-semibold">本次调整</div>
              <p className="text-muted-foreground">
                优化首页示例的状态语义与对话框内容结构，让预览更接近真实发布检查流。
              </p>
            </div>
            {reviewItems.map(([label, detail], index) => (
              <div key={label} className="rounded-lg border bg-background p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-muted-foreground">{detail}</p>
              </div>
            ))}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-1 font-medium text-primary">发布建议</div>
              <p className="text-muted-foreground">
                保留固定 footer，用户滚动到底部前也能随时取消或确认。
              </p>
            </div>
          </div>
        </ScrollableDialogContent>
        <ScrollableDialogFooter className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row">
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
          >
            稍后处理
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
          >
            确认发布
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialog>
    </div>
  );
}

const dotGlassMarqueeTiles = [
  {
    width: "5.75rem",
    background: "linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)",
  },
  {
    width: "7rem",
    background: "linear-gradient(135deg, #fb7185 0%, #c026d3 100%)",
  },
  {
    width: "4.75rem",
    background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
  },
  {
    width: "6.5rem",
    background: "linear-gradient(135deg, #34d399 0%, #0f766e 100%)",
  },
  {
    width: "5.25rem",
    background: "linear-gradient(135deg, #a78bfa 0%, #4f46e5 100%)",
  },
  {
    width: "6rem",
    background: "linear-gradient(135deg, #f472b6 0%, #be123c 100%)",
  },
];

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function DotGlassMarqueeStrip({
  duration,
  reverse = false,
}: {
  duration: number;
  reverse?: boolean;
}) {
  const tiles = reverse
    ? [...dotGlassMarqueeTiles].reverse()
    : dotGlassMarqueeTiles;
  const longTileSet = Array.from({ length: 3 }).flatMap(() => tiles);

  return (
    <div aria-hidden="true" className="relative h-14 w-full overflow-hidden">
      <div
        className="dot-glass-home-marquee-track flex w-max"
        style={{
          animation: `dot-glass-home-marquee-track ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} className="flex shrink-0 gap-5 pr-5">
            {longTileSet.map((tile, tileIndex) => (
              <div
                key={`${groupIndex}-${tileIndex}`}
                className="h-14 rounded-md shadow-sm ring-1 ring-white/45 dark:ring-white/10"
                style={{ width: tile.width, background: tile.background }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DotGlassPreview() {
  const [split, setSplit] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const draggingRef = React.useRef(false);

  const updateSplitFromClientX = React.useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
    setSplit(Math.round(clampPercent(ratio * 100)));
  }, []);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      updateSplitFromClientX(event.clientX);

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // 嵌入式预览里指针捕获尽量启用即可。
      }

      event.preventDefault();
    },
    [updateSplitFromClientX]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateSplitFromClientX(event.clientX);
      event.preventDefault();
    },
    [updateSplitFromClientX]
  );

  const handlePointerEnd = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;

      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // 指针捕获可能已被浏览器释放。
      }

      event.preventDefault();
    },
    []
  );

  const handleLostPointerCapture = React.useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 2;

      if (event.key === "ArrowLeft") {
        setSplit((value) => clampPercent(value - step));
        event.preventDefault();
      }

      if (event.key === "ArrowRight") {
        setSplit((value) => clampPercent(value + step));
        event.preventDefault();
      }

      if (event.key === "Home") {
        setSplit(0);
        event.preventDefault();
      }

      if (event.key === "End") {
        setSplit(100);
        event.preventDefault();
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[230px] w-full overflow-hidden rounded-lg border bg-background text-foreground"
    >
      <style>
        {`
          @keyframes dot-glass-home-marquee-track {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }

          .dot-glass-home-marquee-track {
            will-change: transform;
          }

          @media (prefers-reduced-motion: reduce) {
            .dot-glass-home-marquee-track {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="absolute inset-0 flex flex-col justify-center gap-5 overflow-hidden bg-muted/40">
        <div className="w-full">
          <DotGlassMarqueeStrip duration={26} />
        </div>
        <div className="w-full">
          <DotGlassMarqueeStrip duration={32} reverse />
        </div>
        <div className="w-full">
          <DotGlassMarqueeStrip duration={38} />
        </div>
        <div className="absolute inset-0 bg-background/10" />
      </div>

      <DotGlass
        absolute
        className="pointer-events-none inset-y-0 left-0"
        style={{ width: `${split}%` }}
        dotSize={3}
        dotGap={6}
        dotFade={0}
        blur={5}
        saturation={150}
        glassAlpha={0}
        coverColor="var(--background)"
      />
      <div
        className="pointer-events-none absolute inset-y-0 z-20 w-px bg-foreground/35"
        style={{ left: `${split}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="调整 Dot Glass 覆盖区域"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={split}
        className="absolute top-1/2 z-30 flex h-16 w-8 -translate-x-1/2 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full border bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ left: `${split}%`, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handleLostPointerCapture}
        onKeyDown={handleKeyDown}
      >
        <GripVerticalIcon className="size-4" />
      </div>
    </div>
  );
}

const imageViewerPreviewSrc =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&h=1080&q=80";

function ImageViewerPreview() {
  return (
    <div className="relative flex h-full min-h-[320px] w-full items-center justify-center overflow-visible py-3">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[82%] max-h-[360px] w-[72%] max-w-[260px] rounded-2xl bg-cover bg-center opacity-20 blur-xl saturate-125 dark:opacity-25"
        style={{ backgroundImage: `url(${imageViewerPreviewSrc})` }}
      />
      <ImageViewer
        src={imageViewerPreviewSrc}
        alt="Road crossing a desert landscape"
        maxHeight={340}
        maxWidth={250}
        hoverScale={1.045}
        rounded="2xl"
        lightboxRounded="2xl"
        className="shadow-2xl shadow-black/25 dark:shadow-black/45"
        wrapperClassName="relative z-10 my-0 flex w-full items-center justify-center overflow-visible py-4"
      />
    </div>
  );
}

function DualStateTogglePreview() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState(false);
  const [notificationsMuted, setNotificationsMuted] = React.useState(false);

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
        active={notificationsMuted}
        onToggle={setNotificationsMuted}
        activeIcon={<BellOffIcon />}
        inactiveIcon={<BellIcon />}
        activeLabel="通知关闭"
        inactiveLabel="通知开启"
        effect="scale"
        variant="ghost"
        shape="circle"
      />
    </div>
  );
}

function CodeBlockPreview() {
  const code = `import { useState, useCallback } from "react";

interface UseCounterOptions {
  min?: number;
  max?: number;
}

export function useCounter(initial = 0, opts?: UseCounterOptions) {
  const [count, setCount] = useState(initial);

  const increment = useCallback(
    () => setCount((c) => opts?.max != null ? Math.min(c + 1, opts.max) : c + 1),
    [opts?.max]
  );

  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, increment, reset } as const;
}`;

  return (
    <div className="w-full max-w-xl">
      <CodeBlockPanel
        filename="use-counter.ts"
        code={code}
        isDark
        colorTheme="github"
        className="shadow-none"
      >
        <CodeBlock
          language="typescript"
          isDark
          colorTheme="github"
          displayMode="scroll"
          maxHeight={200}
          highlightLines="3-6,11-14"
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
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [ctaVisible, setCtaVisible] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const steps = React.useMemo<TourStep[]>(
    () => [
      {
        id: "home-tour-toolbar",
        target: () => toolbarRef.current,
        title: "顶部工具栏",
        content: "Tour 会聚焦到指定目标，并把说明贴近目标展示。",
        placement: "bottom",
        align: "center",
      },
      {
        id: "home-tour-sidebar",
        target: () => sidebarRef.current,
        title: "侧边区域",
        content: "步骤可以绑定页面上的任意元素。",
        placement: "bottom",
        align: "start",
      },
      {
        id: "home-tour-panel",
        target: () => panelRef.current,
        title: "主要内容",
        content: "最后一步收束到关键内容区，完成一次引导流程。",
        placement: "top",
        align: "center",
      },
    ],
    [],
  );

  const startTour = () => {
    setCtaVisible(false);
    setCurrentStep(0);
    setOpen(true);
  };

  const showCta = () => {
    if (open) return;
    setCtaVisible(true);
  };

  const hideCta = () => {
    if (open) return;
    setCtaVisible(false);
  };

  return (
    <div className="group/tour-preview relative -m-4 flex h-[calc(100%+2rem)] min-h-[260px] w-[calc(100%+2rem)] items-center justify-center overflow-hidden p-5 sm:p-6">
      <div className="relative z-0 h-full min-h-[210px] w-full max-w-2xl overflow-hidden rounded-lg border bg-background p-3 transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover/tour-preview:saturate-[0.88] group-hover/tour-preview:opacity-90 group-hover/tour-preview:duration-300 sm:p-4">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div
            ref={toolbarRef}
            className="flex h-10 shrink-0 items-center gap-2 rounded-md border bg-muted/35 px-3 sm:h-12 sm:px-4"
          >
            <div className="size-5 shrink-0 rounded-full bg-muted-foreground/25 sm:size-6" />
            <div className="h-2.5 w-24 max-w-[44%] rounded-full bg-muted-foreground/20 sm:w-40" />
            <div className="ml-auto flex shrink-0 gap-1.5 sm:gap-2">
              <div className="size-5 rounded bg-muted-foreground/15 sm:size-7" />
              <div className="size-5 rounded bg-muted-foreground/15 sm:size-7" />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[76px_minmax(0,1fr)] gap-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-4">
            <div
              ref={sidebarRef}
              className="space-y-2 rounded-md border bg-muted/25 p-2 sm:p-3"
            >
              <div className="h-6 rounded bg-muted-foreground/20 sm:h-8" />
              <div className="h-6 rounded bg-muted-foreground/12 sm:h-8" />
              <div className="h-6 rounded bg-muted-foreground/12 sm:h-8" />
            </div>

            <div
              ref={panelRef}
              className="flex min-h-0 flex-col justify-between rounded-md border bg-muted/20 p-3 sm:p-4"
            >
              <div className="space-y-2">
                <div className="h-3 w-28 max-w-[48%] rounded-full bg-muted-foreground/20 sm:w-44" />
                <div className="h-2.5 rounded-full bg-muted-foreground/14" />
                <div className="h-2.5 w-5/6 rounded-full bg-muted-foreground/14" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="h-10 rounded bg-muted-foreground/12 sm:h-14" />
                <div className="h-10 rounded bg-muted-foreground/12 sm:h-14" />
                <div className="h-10 rounded bg-muted-foreground/12 sm:h-14" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="体验 Tour 引导"
        onPointerEnter={showCta}
        onPointerLeave={hideCta}
        onFocus={showCta}
        onBlur={hideCta}
        onClick={startTour}
        className={cn(
          "absolute inset-0 z-10 isolate flex items-center justify-center overflow-hidden bg-background/0 px-6 text-center",
          "transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          "hover:bg-background/20 hover:backdrop-blur-[0.75px] hover:duration-300 focus-visible:bg-background/20 focus-visible:backdrop-blur-[0.75px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-inset",
          "[&:focus-visible_.tour-preview-glow]:scale-100 [&:focus-visible_.tour-preview-glow]:opacity-100 [&:focus-visible_.tour-preview-glow]:duration-500",
          "[&:hover_.tour-preview-glow]:scale-100 [&:hover_.tour-preview-glow]:opacity-100 [&:hover_.tour-preview-glow]:duration-500",
          open
            ? "pointer-events-none"
            : "cursor-pointer",
        )}
      >
        <span
          aria-hidden
          className="tour-preview-glow pointer-events-none absolute size-64 scale-75 rounded-full bg-background/70 opacity-0 blur-3xl transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        />
        <motion.span
          className="tour-preview-cta relative flex items-center gap-2.5 rounded-full border border-foreground/10 bg-background/88 py-1.5 pr-3.5 pl-1.5 text-foreground shadow-[0_14px_36px_-18px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur-xl transition-shadow duration-500 ease-out hover:shadow-[0_18px_42px_-18px_rgba(0,0,0,0.58),0_1px_0_rgba(255,255,255,0.7)_inset] dark:border-white/80 dark:bg-white/95 dark:text-zinc-950 dark:shadow-[0_18px_48px_-18px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.95)_inset] dark:hover:shadow-[0_20px_52px_-18px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.95)_inset]"
          initial={false}
          animate={{
            opacity: ctaVisible ? 1 : 0,
            y: prefersReducedMotion ? 0 : ctaVisible ? 0 : 16,
            scale: ctaVisible ? 1 : 0.975,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : ctaVisible ? 0.28 : 0.36,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-sm dark:bg-zinc-950 dark:text-white">
            <MousePointer2Icon className="size-3.5" />
          </span>
          <span className="text-sm font-medium tracking-[-0.01em]">
            体验 Tour 引导
          </span>
          <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-transform duration-300 ease-out group-hover/tour-preview:translate-x-0.5 group-hover/tour-preview:-translate-y-0.5 group-focus-within/tour-preview:translate-x-0.5 group-focus-within/tour-preview:-translate-y-0.5 motion-reduce:transition-none dark:text-zinc-500" />
        </motion.span>
      </button>

      <Tour
        open={open}
        onOpenChange={setOpen}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        steps={steps}
        popoverWidth={260}
        viewportPadding={12}
        scrollIntoView={false}
        maskClosable
        allowTargetInteraction
      />
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
