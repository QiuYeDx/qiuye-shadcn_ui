"use client";

import React, { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

/** 单个 Tab 选项的配置 */
export interface TabItem {
  /** Tab 的唯一标识值，对应 `ResponsiveTabs` 的 `value` / `onValueChange` */
  value: string;
  /** Tab 显示的文本标签 */
  label: string;
  /** Tab 标签前方的图标（可选） */
  icon?: React.ReactNode;
  /** Tab 标签后方的徽标，传入 `number` 或 `string`（可选） */
  badge?: number | string;
  /** 是否禁用此 Tab */
  disabled?: boolean;
}

/**
 * 布局模式
 * - `"responsive"` — 小屏横向滚动，大屏（≥sm）切换为 grid 布局
 * - `"scroll"` — 始终横向滚动
 * - `"grid"` — 始终 grid 网格布局
 */
type LayoutMode = "responsive" | "scroll" | "grid";

/**
 * Tab 尺寸
 * - `"default"` — 默认尺寸
 * - `"sm"` — 紧凑小尺寸，适用于工具栏、表单内嵌等场景
 */
type TabSize = "default" | "sm";

/** ResponsiveTabs 组件的属性 */
export interface ResponsiveTabsProps {
  /** 当前激活的 Tab 值 */
  value: string;
  /** Tab 切换时的回调，参数为新激活的 Tab `value` */
  onValueChange: (value: string) => void;
  /** Tab 选项列表 */
  items: TabItem[];
  /** Tab 面板内容（`TabsContent` 区域），不传则不渲染内容区域 */
  children?: React.ReactNode;
  /**
   * 是否显示左右滚动箭头按钮（仅在滚动模式下生效）
   * @default true
   */
  scrollButtons?: boolean;
  /**
   * 点击滚动按钮时每次滚动的步长（像素）
   * @default 220
   */
  scrollStep?: number;
  /**
   * ≥sm 断点下的网格列数 Tailwind 类名（应用在 TabsList 上）
   *
   * 在 `layout="grid"` 时请提供无断点或自定义断点的类
   * @default "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
   */
  gridColsClass?: string;
  /** TabsList 容器的自定义 className */
  listClassName?: string;
  /** 每个 TabsTrigger 的自定义 className */
  triggerClassName?: string;
  /**
   * 布局模式
   * - `"responsive"` — 小屏横向滚动，大屏（≥sm）切换为 grid 布局（默认）
   * - `"scroll"` — 始终横向滚动
   * - `"grid"` — 始终 grid 网格布局
   * @default "responsive"
   */
  layout?: LayoutMode;
  /** 根容器的自定义 className */
  className?: string;
  /**
   * 是否在滚动模式下显示左右渐变遮罩，用于提示可滚动
   * @default true
   */
  fadeMasks?: boolean;
  /**
   * 渐变遮罩宽度（像素）
   * @default 64
   */
  fadeMaskWidth?: number;
  /**
   * 是否启用选中态 layoutId 底色平移过渡动画
   *
   * 开启后，切换 Tab 时选中高亮背景会以弹簧动画从上一个 Tab 滑动到新 Tab，
   * 而非默认的即时切换。
   * @default true
   */
  animatedHighlight?: boolean;
  /**
   * Tab 整体尺寸
   * - `"default"` — 默认尺寸
   * - `"sm"` — 紧凑小尺寸，触发器更小、文字更紧凑，适用于工具栏、表单内嵌等场景
   * @default "default"
   */
  size?: TabSize;
}

/**
 * ResponsiveTabs — 响应式标签页组件
 *
 * 基于 shadcn/ui Tabs 扩展，根据屏幕宽度自动切换布局：
 * - **小屏**：横向滚动模式，支持左右箭头按钮和渐变遮罩提示
 * - **大屏**：网格布局模式，Tab 选项平铺展示
 *
 * 支持三种布局模式：`responsive`（自动切换）、`scroll`（始终滚动）、`grid`（始终网格）。
 * 每个 Tab 选项支持图标、徽标、禁用等配置。
 *
 * @example
 * ```tsx
 * const [tab, setTab] = useState("all");
 *
 * <ResponsiveTabs
 *   value={tab}
 *   onValueChange={setTab}
 *   items={[
 *     { value: "all", label: "全部" },
 *     { value: "ui", label: "UI 组件", icon: <LayoutIcon />, badge: 12 },
 *     { value: "hooks", label: "Hooks", disabled: true },
 *   ]}
 * >
 *   <TabsContent value="all">全部内容</TabsContent>
 *   <TabsContent value="ui">UI 组件内容</TabsContent>
 * </ResponsiveTabs>
 * ```
 */
const ResponsiveTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  ResponsiveTabsProps
>(
  (
    {
      value,
      onValueChange,
      items,
      children,
      scrollButtons = true,
      scrollStep = 220,
      gridColsClass = "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
      listClassName,
      triggerClassName,
      layout = "responsive",
      className,
      fadeMasks = true,
      fadeMaskWidth = 64,
      animatedHighlight = true,
      size = "default",
      ...props
    },
    ref
  ) => {
    // layoutId 动画高亮的唯一前缀（避免多实例冲突）
    const instanceId = React.useId();
    const isSm = size === "sm";

    // 背景容器（不滚）
    const tabsListRef = useRef<HTMLDivElement>(null);
    // 可滚动轨道（只滚内容）
    const scrollerRef = useRef<HTMLDivElement>(null);

    const [showLeftButton, setShowLeftButton] = React.useState(false);
    const [showRightButton, setShowRightButton] = React.useState(false);
    const [showLeftFade, setShowLeftFade] = React.useState(false);
    const [showRightFade, setShowRightFade] = React.useState(false);

    const isScrollAll = layout === "scroll";
    const isGridAll = layout === "grid";
    const isResponsive = layout === "responsive";

    // 更新滚动按钮和遮罩状态 —— 基于 scrollerRef
    const checkScrollAffordance = React.useCallback(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;

      if (scrollButtons) {
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
      }

      if (fadeMasks && (isScrollAll || isResponsive)) {
        const maxScroll = scrollWidth - clientWidth;
        setShowLeftFade(scrollLeft > 1);
        setShowRightFade(maxScroll > 0 && scrollLeft < maxScroll - 1);
      }
    }, [scrollButtons, fadeMasks, isScrollAll, isResponsive]);

    // 左右滚动
    const scrollByDir = (dir: "left" | "right") => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({
        left: dir === "left" ? -scrollStep : scrollStep,
        behavior: "smooth",
      });
    };

    // 滚到激活项（只移动 scroller，不动背景）
    const scrollToActiveTab = React.useCallback(() => {
      const scroller = scrollerRef.current;
      const list = tabsListRef.current;
      if (!scroller || !list) return;

      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!active) return;

      const cRect = scroller.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const fullyVisible =
        aRect.left >= cRect.left && aRect.right <= cRect.right;

      if (!fullyVisible) {
        const targetLeft =
          active.offsetLeft - (scroller.clientWidth - active.clientWidth) / 2;
        scroller.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: "smooth",
        });
      }
    }, []);

    // 监听滚动与尺寸变化
    useEffect(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const onScroll = () => checkScrollAffordance();
      el.addEventListener("scroll", onScroll, { passive: true });
      checkScrollAffordance();

      const ro = new ResizeObserver(() => {
        checkScrollAffordance();
        scrollToActiveTab();
      });
      ro.observe(el);

      const onWinResize = () => {
        checkScrollAffordance();
        scrollToActiveTab();
      };
      window.addEventListener("resize", onWinResize);

      return () => {
        el.removeEventListener("scroll", onScroll);
        ro.disconnect();
        window.removeEventListener("resize", onWinResize);
      };
    }, [checkScrollAffordance, scrollToActiveTab]);

    // 将纵向滚轮转为横向滚（仅 scroll 模式）
    useEffect(() => {
      if (!isScrollAll) return;
      const el = scrollerRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (e.ctrlKey) return;

        const hasOverflowX = el.scrollWidth > el.clientWidth;
        if (!hasOverflowX) return;

        const max = el.scrollWidth - el.clientWidth;
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= max - 1;

        const goingLeft = e.deltaY < 0;
        const goingRight = e.deltaY > 0;

        if ((goingLeft && !atStart) || (goingRight && !atEnd)) {
          e.preventDefault();
          el.scrollBy({ left: e.deltaY, behavior: "auto" });
          checkScrollAffordance();
        }
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [isScrollAll, checkScrollAffordance]);

    // value 改变时，确保激活项可见
    useEffect(() => {
      if (isGridAll) return;
      scrollToActiveTab();
    }, [value, isGridAll, scrollToActiveTab]);

    // 类名计算
    // 外层相对定位容器，仅用于放置按钮/遮罩层（不承担滚动）
    const outerRelativeClass = "relative w-full overflow-x-hidden";

    // TabsList：固定背景层（圆角灰底通常在这里），不滚动，负责 padding（edge gutter）
    const listClass = cn(
      // grid/responsive 的列定义（只在需要 grid 时作用）
      (isGridAll || isResponsive) && gridColsClass,
      "h-auto w-full overflow-hidden", // 关键：overflow-hidden，固定背景
      // 当大屏 grid 时让内部布局切换到 grid（见 rowClass）
      listClassName
    );

    // scroller：真正滚动的层
    const scrollerClass = cn(
      "w-full p-0.5",
      isGridAll
        ? "overflow-visible"
        : isScrollAll
          ? "overflow-x-auto"
          : "overflow-x-auto sm:overflow-visible",
      // 隐藏滚动条
      !isGridAll &&
      "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      // 阻断 inline 方向滚动链
      "overscroll-contain"
    );

    // row：承载触发器的行；滚动场景下 inline-flex + w-max，grid 场景下切为 grid
    const rowClass = cn(
      isGridAll
        ? "grid w-full gap-0"
        : isScrollAll
          ? "inline-flex w-max whitespace-nowrap gap-1"
          : "inline-flex w-max whitespace-nowrap gap-1 sm:grid sm:w-full sm:gap-0",
      (isGridAll || isResponsive) && gridColsClass
    );

    const triggerClass = cn(
      isSm ? "px-2 py-1 text-xs" : "px-3 py-2",
      !isGridAll && "shrink-0 min-w-fit",
      isGridAll && "shrink min-w-0 flex items-center justify-center",
      isResponsive &&
      "sm:shrink sm:min-w-0 sm:flex sm:items-center sm:justify-center",
      "data-[state=active]:font-medium",
      // 当启用 layoutId 动画高亮时，取消 trigger 自带的选中态背景/阴影/边框，改由 motion.span 承载
      animatedHighlight &&
      "relative data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent",
      triggerClassName
    );

    const buttonVisibilityClass = isScrollAll ? "" : "sm:hidden";

    return (
      <Tabs
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn("w-full", className)}
        {...props}
      >
        <div className={outerRelativeClass}>
          {/* 左侧按钮 */}
          <AnimatePresence>
            {scrollButtons && !isGridAll && showLeftButton && (
              <motion.div
                className={cn(
                  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm origin-left",
                  isSm ? "left-0.5 h-6 w-6" : "left-1 h-8 w-8"
                )}
                initial={{ opacity: 0, scale: 0, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full hover:bg-transparent cursor-pointer",
                    isSm ? "h-6 w-6 size-6" : "h-8 w-8 size-8",
                    buttonVisibilityClass
                  )}
                  onClick={() => scrollByDir("left")}
                  aria-label="向左滚动"
                >
                  <ChevronLeft className={isSm ? "h-3 w-3" : "h-4 w-4"} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 右侧按钮 */}
          <AnimatePresence>
            {scrollButtons && !isGridAll && showRightButton && (
              <motion.div
                className={cn(
                  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm origin-right",
                  isSm ? "right-0.5 h-6 w-6" : "right-1 h-8 w-8"
                )}
                initial={{ opacity: 0, scale: 0, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full hover:bg-transparent cursor-pointer",
                    isSm ? "h-6 w-6 size-6" : "h-8 w-8 size-8",
                    buttonVisibilityClass
                  )}
                  onClick={() => scrollByDir("right")}
                  aria-label="向右滚动"
                >
                  <ChevronRight className={isSm ? "h-3 w-3" : "h-4 w-4"} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 固定背景层 TabsList（不滚动） */}
          <TabsList ref={tabsListRef} className={listClass}>
            {/* 仅 scroller 层滚动 */}
            <div ref={scrollerRef} className={scrollerClass}>
              {/* 真正承载触发器的行 */}
              <div className={rowClass}>
                {items.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className={triggerClass}
                  >
                    {/* layoutId 动画高亮底色 */}
                    {animatedHighlight && value === item.value && (
                      <motion.span
                        layoutId={`${instanceId}-tab-highlight`}
                        className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.4,
                        }}
                      />
                    )}
                    <span
                      className={cn(
                        "flex items-center max-w-full",
                        isSm ? "gap-1.5" : "gap-2",
                        animatedHighlight && "relative z-[1]"
                      )}
                    >
                      {item.icon && (
                        <span className="shrink-0">{item.icon}</span>
                      )}
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant="secondary"
                          className={
                            isSm
                              ? "ml-0.5 h-3.5 min-w-[16px] px-0.5 text-[10px]"
                              : "ml-1 h-4 min-w-[20px] px-1 text-xs"
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </span>
                  </TabsTrigger>
                ))}
              </div>
            </div>

            {/* 渐变遮罩 */}
            <AnimatePresence>
              {fadeMasks && (isScrollAll || isResponsive) && showLeftFade && (
                <motion.div
                  aria-hidden="true"
                  className="rounded-lg pointer-events-none absolute left-0 top-0 bottom-0 z-[5] bg-gradient-to-r from-muted to-transparent"
                  style={{ width: `${fadeMaskWidth}px` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {fadeMasks && (isScrollAll || isResponsive) && showRightFade && (
                <motion.div
                  aria-hidden="true"
                  className="rounded-lg pointer-events-none absolute right-0 top-0 bottom-0 z-[5] bg-gradient-to-l from-muted to-transparent"
                  style={{ width: `${fadeMaskWidth}px` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </TabsList>
        </div>

        {children != null && <div className="mt-4">{children}</div>}
      </Tabs>
    );
  }
);

ResponsiveTabs.displayName = "ResponsiveTabs";
export { ResponsiveTabs, TabsContent };
