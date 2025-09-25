"use client";

import React, { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

type LayoutMode = "responsive" | "scroll" | "grid";

export interface ResponsiveTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: TabItem[];
  children: React.ReactNode;
  /** 是否显示左右滚动按钮（在滚动模式下生效） */
  scrollButtons?: boolean;
  /** 每次滚动步长 */
  scrollStep?: number;
  /** ≥sm 的网格列定义（会应用在 TabsList 上；在 layout=\"grid\" 时请提供无断点或自定义断点的类） */
  gridColsClass?: string;
  listClassName?: string;
  triggerClassName?: string;
  /** 小屏滚动时两侧“贴边”内边距；layout=\"scroll\" 时在所有断点生效 */
  edgeGutter?: boolean;
  /** 布局模式：responsive | scroll | grid */
  layout?: LayoutMode;
  className?: string;
  /** 是否显示左右渐变遮罩（在滚动模式下生效） */
  fadeMasks?: boolean;
  /** 渐变遮罩宽度，单位为像素 */
  fadeMaskWidth?: number;
}

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
      edgeGutter = true,
      layout = "responsive",
      className,
      fadeMasks = true,
      fadeMaskWidth = 32,
      ...props
    },
    ref
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabsListRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = React.useState(false);
    const [showRightButton, setShowRightButton] = React.useState(false);
    const [showLeftFade, setShowLeftFade] = React.useState(false);
    const [showRightFade, setShowRightFade] = React.useState(false);

    const isScrollAll = layout === "scroll";
    const isGridAll = layout === "grid";
    const isResponsive = layout === "responsive";

    // 检查滚动按钮和渐变遮罩是否需要显示
    const checkScrollButtons = React.useCallback(() => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = el;

      // 更新滚动按钮状态
      if (scrollButtons) {
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
      }

      // 更新渐变遮罩状态 (在滚动模式或响应式模式的小屏下)
      if (fadeMasks && (isScrollAll || isResponsive)) {
        const maxScroll = scrollWidth - clientWidth;
        setShowLeftFade(scrollLeft > 1);
        setShowRightFade(maxScroll > 0 && scrollLeft < maxScroll - 1);
      }
    }, [scrollButtons, fadeMasks, isScrollAll, isResponsive]);

    // 左右滚动
    const scrollByDir = (dir: "left" | "right") => {
      const el = scrollContainerRef.current;
      if (!el) return;
      el.scrollBy({
        left: dir === "left" ? -scrollStep : scrollStep,
        behavior: "smooth",
      });
    };

    // 滚动到激活项
    const scrollToActiveTab = React.useCallback(() => {
      const container = scrollContainerRef.current;
      const list = tabsListRef.current;
      if (!container || !list) return;

      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!active) return;

      const cRect = container.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const fullyVisible =
        aRect.left >= cRect.left && aRect.right <= cRect.right;

      if (!fullyVisible) {
        const targetLeft =
          active.offsetLeft - (container.clientWidth - active.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: "smooth",
        });
      }
    }, []);

    // 监听滚动/尺寸变化
    useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const onScroll = () => checkScrollButtons();
      el.addEventListener("scroll", onScroll, { passive: true });
      checkScrollButtons();

      const ro = new ResizeObserver(() => {
        checkScrollButtons();
        scrollToActiveTab();
      });
      ro.observe(el);

      const onWinResize = () => {
        checkScrollButtons();
        scrollToActiveTab();
      };
      window.addEventListener("resize", onWinResize);

      return () => {
        el.removeEventListener("scroll", onScroll);
        ro.disconnect();
        window.removeEventListener("resize", onWinResize);
      };
    }, [checkScrollButtons, scrollToActiveTab]);

    // 让滚轮纵向 -> 横向（仅在 layout="scroll" 时）
    // TODO: 滚动体验不好, 待优化
    useEffect(() => {
      if (!isScrollAll) return;

      const el = scrollContainerRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        // 触控板本来就在横向滚/缩放时，不劫持
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (e.ctrlKey) return;

        const hasOverflowX = el.scrollWidth > el.clientWidth;
        if (!hasOverflowX) return;

        const max = el.scrollWidth - el.clientWidth;
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= max - 1;

        // 只有确实还能滚动时才阻止默认垂直滚动
        const goingLeft = e.deltaY < 0;
        const goingRight = e.deltaY > 0;

        if ((goingLeft && !atStart) || (goingRight && !atEnd)) {
          e.preventDefault();
          // 用 deltaY 作为横向步进，保持触控板/滚轮的自然加速度感
          el.scrollBy({ left: e.deltaY, behavior: "auto" });
          // 更新左右按钮可见性
          checkScrollButtons();
        }
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [isScrollAll, checkScrollButtons]);

    // value 改变时，确保激活项可见
    useEffect(() => {
      // 仅在滚动模式下需要定位
      if (isGridAll) return;
      scrollToActiveTab();
    }, [value, isGridAll, scrollToActiveTab]);

    // 按模式计算样式
    const containerClass = cn(
      "w-full max-w-full",
      // 滚动可见性
      isGridAll
        ? "overflow-visible"
        : isScrollAll
          ? "overflow-x-auto"
          : "overflow-x-auto sm:overflow-visible",
      // 隐藏滚动条
      !isGridAll &&
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      // 边缘贴边
      edgeGutter && (isScrollAll ? "px-6" : "px-6 sm:px-0"),
      // 阻断 inline 方向的滚动链，防止页面跟着滚
      "overscroll-contain"
    );

    const listClass = cn(
      // 行为：小屏/全屏滚动 or 网格
      isGridAll
        ? "grid w-full gap-0"
        : isScrollAll
          ? "inline-flex w-max whitespace-nowrap gap-1"
          : "inline-flex w-max whitespace-nowrap gap-1 sm:grid sm:w-full sm:gap-0",
      // 列定义：仅在有 grid 的模式下生效
      (isGridAll || isResponsive) && gridColsClass,
      "h-auto p-1",
      listClassName
    );

    const triggerClass = cn(
      // 滚动模式下防压缩
      !isGridAll && "shrink-0 min-w-fit px-3 py-2",
      // 网格/响应式大屏：格子里居中
      (isGridAll || isResponsive) &&
        "sm:shrink sm:min-w-0 sm:flex sm:items-center sm:justify-center",
      "data-[state=active]:font-medium",
      triggerClassName
    );

    // 按模式控制滚动按钮在大屏是否显示
    const buttonVisibilityClass = isScrollAll ? "" : "sm:hidden";

    return (
      <Tabs
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn("w-full", className)}
        {...props}
      >
        {/* 不确定要不要改 */}
        {/* <div className="relative"> */}
        <div className="relative w-full overflow-x-hidden">
          {scrollButtons && !isGridAll && showLeftButton && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute left-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm",
                buttonVisibilityClass
              )}
              onClick={() => scrollByDir("left")}
              aria-label="向左滚动"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {scrollButtons && !isGridAll && showRightButton && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute right-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm",
                buttonVisibilityClass
              )}
              onClick={() => scrollByDir("right")}
              aria-label="向右滚动"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* 左右渐变遮罩 */}
          {fadeMasks && (isScrollAll || isResponsive) && showLeftFade && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-[5] bg-gradient-to-r from-background to-transparent"
              style={{ width: `${fadeMaskWidth}px` }}
            />
          )}
          {fadeMasks && (isScrollAll || isResponsive) && showRightFade && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-[5] bg-gradient-to-l from-background to-transparent"
              style={{ width: `${fadeMaskWidth}px` }}
            />
          )}

          {/* 滚动/网格容器 */}
          <div ref={scrollContainerRef} className={containerClass}>
            <TabsList ref={tabsListRef} className={listClass}>
              {items.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={triggerClass}
                >
                  <span className="flex items-center gap-2 max-w-full">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 min-w-[20px] px-1 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </Tabs>
    );
  }
);

ResponsiveTabs.displayName = "ResponsiveTabs";
export { ResponsiveTabs };
