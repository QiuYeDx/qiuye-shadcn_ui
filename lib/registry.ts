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
}

export interface ComponentRegistry {
  [key: string]: ComponentInfo;
}

// 组件注册表
export const componentRegistry: ComponentRegistry = {
  "animated-button": {
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
  },
  
  "gradient-card": {
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
  },

  "typing-text": {
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
  },
};

// 获取所有组件分类
export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(componentRegistry).forEach(component => {
    categories.add(component.category);
  });
  return Array.from(categories);
}

// 根据分类获取组件
export function getComponentsByCategory(category: string): ComponentInfo[] {
  return Object.values(componentRegistry).filter(
    component => component.category === category
  );
}

// 获取单个组件信息
export function getComponent(id: string): ComponentInfo | undefined {
  return componentRegistry[id];
}

// 搜索组件
export function searchComponents(query: string): ComponentInfo[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(componentRegistry).filter(component => 
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery) ||
    component.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// 获取所有组件
export function getAllComponents(): ComponentInfo[] {
  return Object.values(componentRegistry);
}
