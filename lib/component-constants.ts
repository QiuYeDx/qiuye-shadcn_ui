/**
 * 组件常量和枚举定义
 * 统一管理所有组件的标识符，避免硬编码字符串
 */

// 组件 ID 枚举
// TODO: 新增自定义组件时需要更新这里
export enum ComponentId {
  ANIMATED_BUTTON = "animated-button",
  GRADIENT_CARD = "gradient-card",
  TYPING_TEXT = "typing-text",
  RESPONSIVE_TABS = "responsive-tabs",
  SCROLLABLE_DIALOG = "scrollable-dialog",
}

// 组件 ID 数组，方便遍历
export const COMPONENT_IDS = Object.values(ComponentId);

// 基础使用示例配置
export interface BasicUsageExample {
  import: string;
  usage: string;
}

export type BasicUsageExamples = Record<ComponentId, BasicUsageExample>;

// 基础使用示例数据
export const basicUsageExamples: BasicUsageExamples = {
  [ComponentId.ANIMATED_BUTTON]: {
    import: `import { AnimatedButton } from "@/components/qiuye-ui/animated-button";`,
    usage: `<AnimatedButton animation="bounce" variant="primary">
  点击我
</AnimatedButton>`,
  },
  [ComponentId.GRADIENT_CARD]: {
    import: `import { GradientCard } from "@/components/qiuye-ui/gradient-card";`,
    usage: `<GradientCard gradient="blue">
  <div className="p-6">
    <h3 className="text-lg font-semibold">卡片标题</h3>
    <p className="text-muted-foreground">这是卡片内容</p>
  </div>
</GradientCard>`,
  },
  [ComponentId.TYPING_TEXT]: {
    import: `import { TypingText } from "@/components/qiuye-ui/typing-text";`,
    usage: `<TypingText 
  text="Hello, 这是打字效果！" 
  speed={100}
  showCursor={true}
/>`,
  },
  [ComponentId.RESPONSIVE_TABS]: {
    import: `import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs";
import { useState } from "react";`,
    usage: `const [value, setValue] = useState("tab1");
const items = [
  { value: "tab1", label: "标签一" },
  { value: "tab2", label: "标签二" },
];

return (
  <ResponsiveTabs value={value} onValueChange={setValue} items={items}>
    <div className="p-4">
      {value === "tab1" && <div>标签一的内容</div>}
      {value === "tab2" && <div>标签二的内容</div>}
    </div>
  </ResponsiveTabs>
);`,
  },
  [ComponentId.SCROLLABLE_DIALOG]: {
    import: `import {
  ScrollableDialog,
  ScrollableDialogHeader,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/qiuye-ui/scrollable-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";`,
    usage: `const [open, setOpen] = useState(false);

return (
  <>
    <Button onClick={() => setOpen(true)}>打开对话框</Button>
    <ScrollableDialog open={open} onOpenChange={setOpen}>
      <ScrollableDialogHeader>
        <DialogTitle>标题</DialogTitle>
        <DialogDescription>描述</DialogDescription>
      </ScrollableDialogHeader>
      
      <ScrollableDialogContent>
        {/* 可滚动的内容 */}
        <p>这里是对话框的内容</p>
      </ScrollableDialogContent>
      
      <ScrollableDialogFooter>
        <Button onClick={() => setOpen(false)}>确认</Button>
      </ScrollableDialogFooter>
    </ScrollableDialog>
  </>
);`,
  },
};

// 获取基础使用示例的辅助函数
export function getBasicUsageExample(
  componentId: string
): BasicUsageExample | null {
  return basicUsageExamples[componentId as ComponentId] || null;
}
