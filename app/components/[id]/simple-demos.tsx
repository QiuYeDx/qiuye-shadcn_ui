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
import { Button } from "@/components/ui/button";

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
