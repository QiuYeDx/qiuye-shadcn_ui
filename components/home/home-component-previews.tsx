"use client";

import * as React from "react";
import {
  BellIcon,
  CheckIcon,
  FolderKanbanIcon,
  GripVerticalIcon,
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
import { Tour, type TourStep } from "@/components/qiuye-ui/tour";
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
  const navigationRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const projectsRef = React.useRef<HTMLDivElement>(null);

  const steps = React.useMemo<TourStep[]>(
    () => [
      {
        id: "home-tour-navigation",
        target: () => navigationRef.current,
        title: "Menu",
        content: "Start from the compact navigation area.",
        placement: "right",
      },
      {
        id: "home-tour-search",
        target: () => searchRef.current,
        title: "Search",
        content: "Move the spotlight to the quick action target.",
        placement: "bottom",
      },
      {
        id: "home-tour-projects",
        target: () => projectsRef.current,
        title: "Progress",
        content: "Finish on the primary workspace panel.",
        placement: "top",
      },
    ],
    [],
  );

  return (
    <div className="w-full max-w-[320px]">
      <div className="relative h-[220px] overflow-hidden rounded-lg border bg-background p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Release hub</div>
              <div className="truncate text-[11px] leading-4 text-muted-foreground">
                Interactive tour preview
              </div>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-7 shrink-0 gap-1 px-2.5 text-xs"
            onClick={() => setOpen(true)}
          >
            <SparklesIcon className="size-3.5" />
            <span>Start</span>
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-[76px_minmax(0,1fr)] gap-2">
          <div
            ref={navigationRef}
            className="min-w-0 space-y-1.5 rounded-md border bg-muted/30 p-1.5"
          >
            {["Map", "Tasks", "Ship"].map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  index === 1
                    ? "h-7 w-full truncate rounded-md bg-primary px-2 text-left text-xs font-medium text-primary-foreground"
                    : "h-7 w-full truncate rounded-md bg-background px-2 text-left text-xs text-muted-foreground"
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="min-w-0 space-y-3">
            <div
              ref={searchRef}
              className="flex h-9 min-w-0 items-center gap-2 rounded-md border bg-muted/30 px-2.5 text-xs text-muted-foreground"
            >
              <SparklesIcon className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">Search</span>
              <span className="ml-auto rounded bg-background px-1.5 py-0.5 text-[10px] leading-none">
                K
              </span>
            </div>

            <div
              ref={projectsRef}
              className="rounded-md border bg-muted/30 p-2"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0 truncate text-xs font-semibold">
                  Progress
                </div>
                <span className="shrink-0 rounded bg-background px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground">
                  live
                </span>
              </div>
              <div className="space-y-1.5">
                {["Design", "Build"].map((item, index) => (
                  <div key={item} className="rounded bg-background px-2 py-1">
                    <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[11px]">
                      <span className="min-w-0 truncate">{item}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {index === 0 ? "82%" : "64%"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: index === 0 ? "82%" : "64%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Tour
          open={open}
          onOpenChange={setOpen}
          steps={steps}
          allowTargetInteraction
          maskClosable
          popoverWidth={260}
          viewportPadding={10}
        />
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
