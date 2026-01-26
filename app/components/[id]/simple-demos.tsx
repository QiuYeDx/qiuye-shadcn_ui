"use client";

import React from "react";
import { AnimatedButton } from "@/components/qiuye-ui/animated-button";
import { GradientCard } from "@/components/qiuye-ui/gradient-card";
import { TypingText } from "@/components/qiuye-ui/typing-text";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// AnimatedButton 简单演示
export function AnimatedButtonSimpleDemo() {
  return (
    <div className="flex justify-center">
      <AnimatedButton animation="bounce">点击我试试</AnimatedButton>
    </div>
  );
}

// GradientCard 简单演示
export function GradientCardSimpleDemo() {
  return (
    <div className="flex justify-center">
      <GradientCard gradient="blue" className="max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">渐变卡片</h3>
          <p className="text-sm text-muted-foreground">
            这是一个带有渐变背景的美观卡片组件。
          </p>
        </div>
      </GradientCard>
    </div>
  );
}

// TypingText 简单演示
export function TypingTextSimpleDemo() {
  return (
    <div className="flex justify-center">
      <TypingText
        text="Hello, 这是打字效果演示！"
        className="text-lg font-mono"
        speed={150}
      />
    </div>
  );
}

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
          glassAlpha={0.45}
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
          glassAlpha={0.45}
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
        className="w-full"
        wrapperClassName="flex justify-center items-center"
      />
    </div>
  );
}
