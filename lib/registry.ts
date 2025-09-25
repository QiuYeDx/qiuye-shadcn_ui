import { ComponentId, basicUsageExamples, type BasicUsageExample } from './component-constants';

export interface ComponentInfo {
  name: string;
  description: string;
  category: string;
  dependencies: string[];
  files: {
    component: string;
    demo?: string;
    types?: string;
  };
  props?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: string;
  }>;
  version: string;
  author: string;
  tags: string[];
  cliName: string; // CLI 命令中使用的名称
  basicUsage?: BasicUsageExample; // 基础用法示例
}

export interface ComponentRegistry {
  [key: string]: ComponentInfo;
}

// 组件注册表
export const componentRegistry: ComponentRegistry = {
  [ComponentId.ANIMATED_BUTTON]: {
    name: "Animated Button",
    description: "带有动画效果的按钮组件，支持多种动画风格和悬停效果",
    category: "按钮",
    dependencies: ["motion", "class-variance-authority", "clsx"],
    files: {
      component: "components/qiuye-ui/animated-button.tsx",
      demo: "components/qiuye-ui/demos/animated-button-demo.tsx",
    },
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost"',
        description: "按钮变体",
        required: false,
        default: "primary",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        description: "按钮尺寸",
        required: false,
        default: "md",
      },
      {
        name: "animation",
        type: '"bounce" | "pulse" | "wiggle" | "spin"',
        description: "动画类型",
        required: false,
        default: "bounce",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "按钮内容",
        required: true,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "是否禁用",
        required: false,
        default: "false",
      },
    ],
    version: "1.0.0",
    author: "秋夜",
    tags: ["button", "animation", "interactive"],
    cliName: "animated-button",
    basicUsage: basicUsageExamples[ComponentId.ANIMATED_BUTTON],
  },

  [ComponentId.GRADIENT_CARD]: {
    name: "Gradient Card",
    description: "渐变色卡片组件，支持多种渐变样式和阴影效果",
    category: "卡片",
    dependencies: ["class-variance-authority", "clsx"],
    files: {
      component: "components/qiuye-ui/gradient-card.tsx",
      demo: "components/qiuye-ui/demos/gradient-card-demo.tsx",
    },
    props: [
      {
        name: "gradient",
        type: '"blue" | "purple" | "pink" | "orange" | "green"',
        description: "渐变颜色主题",
        required: false,
        default: "blue",
      },
      {
        name: "intensity",
        type: '"light" | "medium" | "strong"',
        description: "渐变强度",
        required: false,
        default: "medium",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "卡片内容",
        required: true,
      },
      {
        name: "className",
        type: "string",
        description: "额外的CSS类名",
        required: false,
      },
    ],
    version: "1.0.0",
    author: "秋夜",
    tags: ["card", "gradient", "design"],
    cliName: "gradient-card",
    basicUsage: basicUsageExamples[ComponentId.GRADIENT_CARD],
  },

  [ComponentId.TYPING_TEXT]: {
    name: "Typing Text",
    description: "打字机效果文本组件，支持自定义打字速度和光标样式",
    category: "文本",
    dependencies: ["react", "ahooks"],
    files: {
      component: "components/qiuye-ui/typing-text.tsx",
      demo: "components/qiuye-ui/demos/typing-text-demo.tsx",
    },
    props: [
      {
        name: "text",
        type: "string | string[]",
        description: "要显示的文本或文本数组",
        required: true,
      },
      {
        name: "speed",
        type: "number",
        description: "打字速度（毫秒）",
        required: false,
        default: "100",
      },
      {
        name: "loop",
        type: "boolean",
        description: "是否循环播放",
        required: false,
        default: "false",
      },
      {
        name: "showCursor",
        type: "boolean",
        description: "是否显示光标",
        required: false,
        default: "true",
      },
      {
        name: "className",
        type: "string",
        description: "额外的CSS类名",
        required: false,
      },
    ],
    version: "1.0.0",
    author: "秋夜",
    tags: ["text", "animation", "typewriter"],
    cliName: "typing-text",
    basicUsage: basicUsageExamples[ComponentId.TYPING_TEXT],
  },

  [ComponentId.RESPONSIVE_TABS]: {
    name: "Responsive Tabs",
    description:
      "响应式标签页组件：小屏横向滚动、可选左右滚动按钮与渐变遮罩；大屏可切换为网格布局；支持图标、徽标、禁用与自定义样式。",
    category: "导航",
    dependencies: ["react", "lucide-react", "motion/react"],
    files: {
      component: "components/qiuye-ui/responsive-tabs.tsx",
      demo: "components/qiuye-ui/demos/responsive-tabs-demo.tsx",
    },
    props: [
      {
        name: "value",
        type: "string",
        description: "当前激活的标签页值",
        required: true,
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "标签页切换回调函数",
        required: true,
      },
      {
        name: "items",
        type: "TabItem[]",
        description: "标签页配置数组（支持 label、icon、badge、disabled）",
        required: true,
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "与标签页内容区域（Tabs.Content）对应的子节点",
        required: true,
      },
      {
        name: "layout",
        type: '"responsive" | "scroll" | "grid"',
        description:
          "布局模式：responsive（小屏滚动/大屏网格）、scroll（所有断点滚动）、grid（所有断点网格）",
        required: false,
        default: "responsive",
      },
      {
        name: "scrollButtons",
        type: "boolean",
        description:
          "是否显示左右滚动按钮（滚动模式在大屏也显示；responsive 模式下仅小屏显示）",
        required: false,
        default: "true",
      },
      {
        name: "scrollStep",
        type: "number",
        description: "点击滚动按钮时的滚动步长（像素）",
        required: false,
        default: "220",
      },
      {
        name: "fadeMasks",
        type: "boolean",
        description:
          '是否显示左右渐变遮罩（在 layout="scroll" 或 responsive 的小屏下生效）',
        required: false,
        default: "true",
      },
      {
        name: "fadeMaskWidth",
        type: "number",
        description: "渐变遮罩宽度（像素）",
        required: false,
        default: "32",
      },
      {
        name: "gridColsClass",
        type: "string",
        description:
          '≥sm 的网格列定义（应用在 TabsList；layout="grid" 时可传无断点或自定义断点的类）',
        required: false,
        default: "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
      },
      {
        name: "listClassName",
        type: "string",
        description: "TabsList 的额外类名",
        required: false,
      },
      {
        name: "triggerClassName",
        type: "string",
        description: "TabsTrigger 的额外类名",
        required: false,
      },
      {
        name: "edgeGutter",
        type: "boolean",
        description:
          '小屏滚动时两侧“贴边”内边距；在 layout="scroll" 时所有断点生效',
        required: false,
        default: "true",
      },
      {
        name: "className",
        type: "string",
        description: "根容器额外类名",
        required: false,
      },
    ],
    version: "1.1.0",
    author: "秋夜",
    tags: [
      "tabs",
      "navigation",
      "responsive",
      "mobile",
      "scroll",
      "grid",
      "badge",
      "icon",
      "shadcn",
    ],
    cliName: "responsive-tabs",
    basicUsage: basicUsageExamples[ComponentId.RESPONSIVE_TABS],
  },
};

// 获取所有组件分类
export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(componentRegistry).forEach((component) => {
    categories.add(component.category);
  });
  return Array.from(categories);
}

// 根据分类获取组件
export function getComponentsByCategory(category: string): ComponentInfo[] {
  return Object.values(componentRegistry).filter(
    (component) => component.category === category
  );
}

// 获取单个组件信息
export function getComponent(id: string): ComponentInfo | undefined {
  return componentRegistry[id];
}

// 搜索组件
export function searchComponents(query: string): ComponentInfo[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(componentRegistry).filter(
    (component) =>
      component.name.toLowerCase().includes(lowercaseQuery) ||
      component.description.toLowerCase().includes(lowercaseQuery) ||
      component.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// 获取所有组件
export function getAllComponents(): ComponentInfo[] {
  return Object.values(componentRegistry);
}
