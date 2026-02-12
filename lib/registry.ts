import {
  ComponentId,
  basicUsageExamples,
  type BasicUsageExample,
} from "./component-constants";

export interface PropDefinition {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface ComponentPropsInfo {
  componentName: string;
  props: PropDefinition[];
}

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
  // 支持单组件和多组件两种格式
  // 单组件：props 为 PropDefinition 数组
  // 多组件：propsInfo 为 ComponentPropsInfo 数组
  props?: PropDefinition[];
  propsInfo?: ComponentPropsInfo[];
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
  [ComponentId.RESPONSIVE_TABS]: {
    name: "Responsive Tabs",
    description:
      "响应式标签页组件：小屏横向滚动、可选左右滚动按钮与渐变遮罩；大屏可切换为网格布局；支持图标、徽标、禁用与自定义样式。",
    category: "导航",
    dependencies: ["lucide-react", "motion"],
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
        name: "className",
        type: "string",
        description: "根容器额外类名",
        required: false,
      },
      {
        name: "animatedHighlight",
        type: "boolean",
        description:
          "是否启用选中态 layoutId 底色平移过渡动画（切换 Tab 时高亮背景以弹簧动画从旧 Tab 滑动到新 Tab）",
        required: false,
        default: "true",
      },
      {
        name: "size",
        type: '"default" | "sm"',
        description:
          "Tab 整体尺寸：default 为默认尺寸，sm 为紧凑小尺寸（更小的内边距和文字），适用于工具栏、表单内嵌等场景",
        required: false,
        default: "default",
      },
    ],
    version: "1.3.0",
    author: "QiuYeDx",
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
      "animation",
    ],
    cliName: "responsive-tabs",
    basicUsage: basicUsageExamples[ComponentId.RESPONSIVE_TABS],
  },

  [ComponentId.SCROLLABLE_DIALOG]: {
    name: "Scrollable Dialog",
    description:
      "可滚动对话框组件：头部和底部固定，内容区域可滚动，支持自定义高度，适用于需要展示大量内容的场景。",
    category: "弹窗",
    dependencies: ["motion"],
    files: {
      component: "components/qiuye-ui/scrollable-dialog.tsx",
      demo: "components/qiuye-ui/demos/scrollable-dialog-demo.tsx",
    },
    propsInfo: [
      {
        componentName: "ScrollableDialog",
        props: [
          {
            name: "open",
            type: "boolean",
            description: "对话框是否打开",
            required: true,
          },
          {
            name: "onOpenChange",
            type: "(open: boolean) => void",
            description: "对话框打开状态改变的回调函数",
            required: true,
          },
          {
            name: "children",
            type: "React.ReactNode",
            description: "对话框内容（通常包含 Header、Content、Footer）",
            required: false,
          },
          {
            name: "className",
            type: "string",
            description: "内部容器的额外类名",
            required: false,
          },
          {
            name: "contentClassName",
            type: "string",
            description: "DialogContent 的额外类名",
            required: false,
          },
          {
            name: "onOpenAutoFocus",
            type: "(e: Event) => void",
            description: "对话框打开时自动聚焦的回调",
            required: false,
            default: "(e) => e.preventDefault()",
          },
          {
            name: "maxWidth",
            type: "string",
            description: "对话框最大宽度",
            required: false,
            default: "sm:max-w-md",
          },
        ],
      },
      {
        componentName: "ScrollableDialogHeader",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "头部内容",
            required: true,
          },
          {
            name: "className",
            type: "string",
            description: "额外的 CSS 类名",
            required: false,
          },
        ],
      },
      {
        componentName: "ScrollableDialogContent",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "可滚动的内容",
            required: true,
          },
          {
            name: "className",
            type: "string",
            description: "额外的 CSS 类名",
            required: false,
          },
          {
            name: "fadeMasks",
            type: "boolean",
            description: "是否显示上下渐变遮罩",
            required: false,
            default: "true",
          },
          {
            name: "fadeMaskHeight",
            type: "number",
            description: "渐变遮罩高度（像素）",
            required: false,
            default: "40",
          },
          {
            name: "horizontalScroll",
            type: "boolean",
            description: "是否启用横向滚动",
            required: false,
            default: "false",
          },
        ],
      },
      {
        componentName: "ScrollableDialogFooter",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "底部内容",
            required: true,
          },
          {
            name: "className",
            type: "string",
            description: "额外的 CSS 类名",
            required: false,
          },
        ],
      },
    ],
    version: "1.0.0",
    author: "QiuYeDx",
    tags: ["dialog", "modal", "scrollable", "popup", "overlay", "shadcn"],
    cliName: "scrollable-dialog",
    basicUsage: basicUsageExamples[ComponentId.SCROLLABLE_DIALOG],
  },

  [ComponentId.DOT_GLASS]: {
    name: "Dot Glass",
    description:
      "点阵开孔毛玻璃组件：一种「反直觉」的玻璃效果，只在点阵孔洞里露出背后内容的模糊（blur），其余区域是纯色盖板遮挡，适用于 Header、Navbar 等需要特殊视觉效果的场景。",
    category: "特效",
    dependencies: [],
    files: {
      component: "components/qiuye-ui/dot-glass.tsx",
      demo: "components/qiuye-ui/demos/dot-glass-demo.tsx",
    },
    props: [
      {
        name: "dotSize",
        type: "number",
        description: "圆点直径（像素）",
        required: false,
        default: "3",
      },
      {
        name: "dotGap",
        type: "number",
        description: "点阵间距（像素）",
        required: false,
        default: "6",
      },
      {
        name: "dotFade",
        type: "number",
        description: "边缘柔化（像素），值越大圆点边缘越模糊",
        required: false,
        default: "0",
      },
      {
        name: "blur",
        type: "number",
        description: "模糊强度（像素）",
        required: false,
        default: "4",
      },
      {
        name: "saturation",
        type: "number",
        description: "饱和度（百分比，100 为原色）",
        required: false,
        default: "130",
      },
      {
        name: "glassAlpha",
        type: "number",
        description: "玻璃层透明度（0-1）",
        required: false,
        default: "0.45",
      },
      {
        name: "coverColor",
        type: "string",
        description: "盖板颜色（非孔洞区域的背景色）",
        required: false,
        default: '"#ffffff"',
      },
      {
        name: "fixed",
        type: "boolean",
        description: "是否使用固定定位（适用于 header 等场景）",
        required: false,
        default: "false",
      },
      {
        name: "absolute",
        type: "boolean",
        description: "是否使用绝对定位",
        required: false,
        default: "false",
      },
      {
        name: "sticky",
        type: "boolean",
        description: "是否使用粘性定位",
        required: false,
        default: "false",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "子元素（内容）",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "额外的 CSS 类名",
        required: false,
      },
    ],
    version: "1.0.0",
    author: "QiuYeDx",
    tags: [
      "glass",
      "blur",
      "backdrop",
      "header",
      "navbar",
      "effect",
      "dot",
      "mask",
    ],
    cliName: "dot-glass",
    basicUsage: basicUsageExamples[ComponentId.DOT_GLASS],
  },

  [ComponentId.IMAGE_VIEWER]: {
    name: "Image Viewer",
    description:
      "带灯箱预览的图片查看器，支持点击放大、滚轮/触控缩放与拖拽平移，内置骨架屏加载过渡与悬浮放大动效。",
    category: "媒体",
    dependencies: ["motion", "lucide-react"],
    files: {
      component: "components/qiuye-ui/image-viewer.tsx",
      demo: "components/qiuye-ui/demos/image-viewer-demo.tsx",
    },
    props: [
      {
        name: "src",
        type: "string | Blob",
        description: "图片地址或 Blob 对象",
        required: false,
      },
      {
        name: "alt",
        type: "string",
        description: "图片替代文本",
        required: false,
      },
      {
        name: "title",
        type: "string",
        description: "图片标题（鼠标悬停时显示的原生 title 提示）",
        required: false,
      },
      {
        name: "rounded",
        type: '"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"',
        description: "主图圆角大小",
        required: false,
        default: "lg",
      },
      {
        name: "lightboxRounded",
        type: '"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"',
        description: "灯箱图片圆角大小（默认跟随 rounded）",
        required: false,
      },
      {
        name: "wrapperClassName",
        type: "string",
        description: "外层包裹容器类名",
        required: false,
      },
      {
        name: "className",
        type: "string",
        description: "图片元素类名",
        required: false,
      },
      {
        name: "lightboxClassName",
        type: "string",
        description: "灯箱图片类名",
        required: false,
      },
      {
        name: "overlayClassName",
        type: "string",
        description: "灯箱遮罩类名",
        required: false,
      },
      {
        name: "overlayBlur",
        type: "boolean",
        description: "遮罩是否启用模糊效果",
        required: false,
        default: "false",
      },
      {
        name: "lightboxPadding",
        type: "number",
        description: "灯箱边距（像素）",
        required: false,
        default: "32",
      },
      {
        name: "enableLightbox",
        type: "boolean",
        description: "是否启用灯箱预览",
        required: false,
        default: "true",
      },
      {
        name: "maxHeight",
        type: "number | string",
        description:
          "非灯箱模式下图片的最大高度（数字为像素，字符串支持CSS值如'50vh'）",
        required: false,
      },
      {
        name: "maxWidth",
        type: "number | string",
        description:
          "非灯箱模式下图片的最大宽度（数字为像素，字符串支持CSS值）",
        required: false,
      },
      {
        name: "hoverScale",
        type: "number",
        description:
          "缩略图鼠标悬浮时的缩放倍数（例如 1.05 表示放大 5%），不设置则无悬浮效果",
        required: false,
      },
      {
        name: "hoverBounce",
        type: "number",
        description: "悬浮动画的弹性系数（0‑1），仅在设置 hoverScale 时生效",
        required: false,
        default: "0.25",
      },
      {
        name: "hoverDuration",
        type: "number",
        description: "悬浮动画的时长（秒），仅在设置 hoverScale 时生效",
        required: false,
        default: "0.65",
      },
      {
        name: "selectable",
        type: "boolean",
        description:
          "是否允许用户选中/复制/拖拽图片（设为 false 可防止浏览器原生选中效果影响长按等交互体验）",
        required: false,
        default: "false",
      },
      {
        name: "loading",
        type: '"lazy" | "eager"',
        description: "图片加载策略（HTML img 原生属性）",
        required: false,
        default: '"lazy"',
      },
      {
        name: "onLoad",
        type: "(event: React.SyntheticEvent<HTMLImageElement>) => void",
        description: "图片加载成功的回调",
        required: false,
      },
      {
        name: "onError",
        type: "(event: React.SyntheticEvent<HTMLImageElement>) => void",
        description: "图片加载失败的回调",
        required: false,
      },
    ],
    version: "1.1.0",
    author: "QiuYeDx",
    tags: [
      "image",
      "viewer",
      "lightbox",
      "zoom",
      "gesture",
      "preview",
      "hover",
      "animation",
    ],
    cliName: "image-viewer",
    basicUsage: basicUsageExamples[ComponentId.IMAGE_VIEWER],
  },

  [ComponentId.DUAL_STATE_TOGGLE]: {
    name: "Dual State Toggle",
    description:
      "双状态切换按钮：基于 shadcn/ui Button，内置点击缩放 + 图标切换动画（opacity + blur），支持 5 种过渡效果预设与自定义过渡配置。",
    category: "交互",
    dependencies: ["motion", "lucide-react"],
    files: {
      component: "components/qiuye-ui/dual-state-toggle.tsx",
      demo: "components/qiuye-ui/demos/dual-state-toggle-demo.tsx",
    },
    props: [
      {
        name: "active",
        type: "boolean",
        description: "是否处于激活状态",
        required: true,
      },
      {
        name: "onToggle",
        type: "(active: boolean) => void",
        description: "状态切换回调",
        required: true,
      },
      {
        name: "activeIcon",
        type: "React.ReactNode",
        description: "激活状态下显示的图标",
        required: true,
      },
      {
        name: "inactiveIcon",
        type: "React.ReactNode",
        description: "非激活状态下显示的图标",
        required: true,
      },
      {
        name: "activeLabel",
        type: "string",
        description: "激活状态的无障碍标签",
        required: false,
      },
      {
        name: "inactiveLabel",
        type: "string",
        description: "非激活状态的无障碍标签",
        required: false,
      },
      {
        name: "blurAmount",
        type: "string",
        description: "图标切换时的模糊程度",
        required: false,
        default: '"2px"',
      },
      {
        name: "shape",
        type: '"square" | "circle"',
        description: "按钮形状：square（圆角矩形）或 circle（纯圆形）",
        required: false,
        default: '"square"',
      },
      {
        name: "effect",
        type: '"fade" | "rotate" | "slide-up" | "slide-down" | "scale" | ToggleEffectConfig',
        description:
          "图标切换过渡效果，支持预设名或自定义 { initial, animate, exit } 配置",
        required: false,
        default: '"fade"',
      },
      {
        name: "transitionDuration",
        type: "number",
        description: "图标切换动画时长（秒）",
        required: false,
        default: "0.25",
      },
      {
        name: "variant",
        type: "ButtonProps['variant']",
        description: "按钮变体，继承 shadcn/ui Button 的 variant",
        required: false,
        default: '"default"',
      },
      {
        name: "size",
        type: "ButtonProps['size']",
        description: "按钮尺寸，继承 shadcn/ui Button 的 size",
        required: false,
        default: '"icon"',
      },
      {
        name: "className",
        type: "string",
        description: "额外的 CSS 类名",
        required: false,
      },
    ],
    version: "1.0.0",
    author: "QiuYeDx",
    tags: [
      "toggle",
      "button",
      "icon",
      "animation",
      "switch",
      "dual-state",
      "motion",
      "shadcn",
    ],
    cliName: "dual-state-toggle",
    basicUsage: basicUsageExamples[ComponentId.DUAL_STATE_TOGGLE],
  },

  [ComponentId.CODE_BLOCK]: {
    name: "Code Block",
    description:
      "通用代码块显示组件：基于 prism-react-renderer 的语法高亮，7 套内置配色主题（浅/深色变体）+ 自定义主题支持，支持折叠、滚动、自适应高度三种显示模式，行号 sticky 固定，自带完整样式。含 CodeBlockPanel 外层容器面板（仿 Tailwind CSS 官网风格），支持文件名标签与复制按钮。",
    category: "展示",
    dependencies: ["prism-react-renderer", "motion", "lucide-react"],
    files: {
      component: "components/qiuye-ui/code-block/code-block.tsx",
      demo: "components/qiuye-ui/demos/code-block-demo.tsx",
    },
    propsInfo: [
      {
        componentName: "CodeBlock",
        props: [
          {
            name: "children",
            type: "string",
            description: "代码内容",
            required: true,
          },
          {
            name: "language",
            type: "string",
            description: "编程语言（用于语法高亮）",
            required: false,
            default: '"plaintext"',
          },
          {
            name: "isDark",
            type: "boolean",
            description: "是否为深色模式（控制内置主题的浅色/深色变体选择）",
            required: false,
            default: "true",
          },
          {
            name: "colorTheme",
            type: '"qiuvision" | "github" | "one" | "dracula" | "nord" | "vitesse" | "monokai"',
            description: "内置配色主题名称，与 isDark 配合使用",
            required: false,
            default: '"qiuvision"',
          },
          {
            name: "customTheme",
            type: "CodeBlockThemeConfig | PrismTheme",
            description: "自定义主题配置（优先级高于 colorTheme 和 isDark）",
            required: false,
          },
          {
            name: "displayMode",
            type: '"collapse" | "scroll" | "auto-height"',
            description:
              "显示模式：collapse（折叠）、scroll（滚动）、auto-height（自适应高度），不设置则无高度限制",
            required: false,
          },
          {
            name: "maxLines",
            type: "number",
            description: '折叠的行数阈值（displayMode="collapse" 时生效）',
            required: false,
            default: "15",
          },
          {
            name: "maxHeight",
            type: "string | number",
            description:
              '最大高度（displayMode="scroll" 时生效），支持 CSS 单位字符串或数字（px）',
            required: false,
            default: '"400px"',
          },
          {
            name: "showLineNumbers",
            type: "boolean | number",
            description:
              "控制行号显示策略：true 始终显示、false 始终隐藏、数字 n 表示行数 >= n 时才显示",
            required: false,
            default: "true",
          },
          {
            name: "stickyLineNumbers",
            type: "boolean",
            description: "是否在横向滚动时固定左侧行号列（sticky 效果）",
            required: false,
            default: "true",
          },
          {
            name: "spotlightOnCollapse",
            type: "boolean",
            description:
              '是否在折叠后跳转时显示聚光灯阴影效果（displayMode="collapse" 时生效）',
            required: false,
            default: "true",
          },
          {
            name: "noShadow",
            type: "boolean",
            description: "是否隐藏容器周围的 box-shadow 阴影",
            required: false,
            default: "false",
          },
          {
            name: "className",
            type: "string",
            description: "额外的 CSS 类名",
            required: false,
          },
        ],
      },
      {
        componentName: "CodeBlockPanel",
        props: [
          {
            name: "filename",
            type: "string",
            description: "文件名标签（显示在面板顶部左侧）",
            required: false,
          },
          {
            name: "language",
            type: "string",
            description:
              "编程语言标识（当未设置 filename 时，作为 fallback 标签显示语言类型，如 \"TypeScript\"）",
            required: false,
          },
          {
            name: "showLanguageLabel",
            type: "boolean",
            description:
              "是否在未设置 filename 时自动显示语言类型标签",
            required: false,
            default: "true",
          },
          {
            name: "code",
            type: "string",
            description: "代码文本内容（用于复制按钮功能，不传则不显示复制按钮）",
            required: false,
          },
          {
            name: "showCopyButton",
            type: "boolean",
            description: "是否显示复制按钮（需要同时传入 code）",
            required: false,
            default: "true",
          },
          {
            name: "children",
            type: "React.ReactNode",
            description: "子元素（通常为 CodeBlock 组件）",
            required: true,
          },
          {
            name: "className",
            type: "string",
            description: "额外的 CSS 类名",
            required: false,
          },
        ],
      },
    ],
    version: "1.0.0",
    author: "QiuYeDx",
    tags: [
      "code",
      "syntax-highlighting",
      "prism",
      "theme",
      "collapse",
      "scroll",
      "code-block",
      "panel",
      "copy",
    ],
    cliName: "code-block",
    basicUsage: basicUsageExamples[ComponentId.CODE_BLOCK],
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
    (component) => component.category === category,
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
      component.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
}

// 获取所有组件
export function getAllComponents(): ComponentInfo[] {
  return Object.values(componentRegistry);
}
