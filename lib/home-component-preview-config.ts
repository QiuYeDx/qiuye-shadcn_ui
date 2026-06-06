import { ComponentId } from "@/lib/component-constants";

export type HomePreviewSize = "wide" | "tall" | "square" | "compact";

export interface HomePreviewConfig {
  id: ComponentId;
  size: HomePreviewSize;
  featured?: boolean;
}

export const homePreviewConfigs: HomePreviewConfig[] = [
  {
    id: ComponentId.DOT_GLASS,
    size: "wide",
    featured: true,
  },
  {
    id: ComponentId.CODE_BLOCK,
    size: "wide",
    featured: true,
  },
  {
    id: ComponentId.MARKDOWN_RENDERER,
    size: "tall",
    featured: true,
  },
  {
    id: ComponentId.TOUR,
    size: "square",
    featured: true,
  },
  {
    id: ComponentId.RESPONSIVE_TABS,
    size: "square",
  },
  {
    id: ComponentId.COLOR_PICKER,
    size: "compact",
  },
  {
    id: ComponentId.DUAL_STATE_TOGGLE,
    size: "compact",
  },
  {
    id: ComponentId.SCROLLABLE_DIALOG,
    size: "square",
  },
  {
    id: ComponentId.IMAGE_VIEWER,
    size: "tall",
  },
  {
    id: ComponentId.TYPEWRITER,
    size: "compact",
  },
];
