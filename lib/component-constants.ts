/**
 * 组件常量和枚举定义
 * 统一管理所有组件的标识符，避免硬编码字符串
 */

// 组件 ID 枚举
// TODO: 新增自定义组件时需要更新这里
export enum ComponentId {
  RESPONSIVE_TABS = "responsive-tabs",
  SCROLLABLE_DIALOG = "scrollable-dialog",
  DOT_GLASS = "dot-glass",
  IMAGE_VIEWER = "image-viewer",
  DUAL_STATE_TOGGLE = "dual-state-toggle",
  CODE_BLOCK = "code-block",
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
  [ComponentId.DOT_GLASS]: {
    import: `import { DotGlass } from "@/components/qiuye-ui/dot-glass";`,
    usage: `<DotGlass
  className="absolute inset-0 left-1/2"
  dotSize={3}
  dotGap={6}
  blur={4}
  saturation={140}
  glassAlpha={0.45}
  coverColor={"#ffffff"}
></DotGlass>`,
  },
  [ComponentId.IMAGE_VIEWER]: {
    import: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";`,
    usage: `<ImageViewer
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  alt="荒漠公路"
  maxHeight={400}
  className="w-full"
  wrapperClassName="flex justify-center items-center"
/>`,
  },
  [ComponentId.DUAL_STATE_TOGGLE]: {
    import: `import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";`,
    usage: `const [isOpen, setIsOpen] = useState(false);

return (
  <DualStateToggle
    active={isOpen}
    onToggle={setIsOpen}
    activeIcon={<X />}
    inactiveIcon={<Menu />}
    activeLabel="关闭"
    inactiveLabel="打开"
    effect="rotate"
  />
);`,
  },
  [ComponentId.CODE_BLOCK]: {
    import: `import { CodeBlock } from "@/components/qiuye-ui/code-block";`,
    usage: `<CodeBlock language="typescript" isDark={true}>
  {\`const greeting = "Hello, World!";
console.log(greeting);\`}
</CodeBlock>`,
  },
};

// 获取基础使用示例的辅助函数
export function getBasicUsageExample(
  componentId: string
): BasicUsageExample | null {
  return basicUsageExamples[componentId as ComponentId] || null;
}
