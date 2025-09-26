"use client";

import React, { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

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
  /** ≥sm 的网格列定义（会应用在 TabsList 上；在 layout="grid" 时请提供无断点或自定义断点的类） */
  gridColsClass?: string;
  listClassName?: string;
  triggerClassName?: string;
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
      layout = "responsive",
      className,
      fadeMasks = true,
      fadeMaskWidth = 64,
      ...props
    },
    ref
  ) => {
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
      !isGridAll && "shrink-0 min-w-fit px-3 py-2",
      (isGridAll || isResponsive) &&
        "sm:shrink sm:min-w-0 sm:flex sm:items-center sm:justify-center",
      "data-[state=active]:font-medium",
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
                className="absolute left-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm origin-left"
                initial={{ opacity: 0, scale: 0, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 size-8 rounded-full hover:bg-transparent cursor-pointer",
                    buttonVisibilityClass
                  )}
                  onClick={() => scrollByDir("left")}
                  aria-label="向左滚动"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 右侧按钮 */}
          <AnimatePresence>
            {scrollButtons && !isGridAll && showRightButton && (
              <motion.div
                className="absolute right-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 p-0 shadow-md backdrop-blur-sm origin-right"
                initial={{ opacity: 0, scale: 0, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 size-8 rounded-full hover:bg-transparent cursor-pointer",
                    buttonVisibilityClass
                  )}
                  onClick={() => scrollByDir("right")}
                  aria-label="向右滚动"
                >
                  <ChevronRight className="h-4 w-4" />
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
                    <span className="flex items-center gap-2 max-w-full">
                      {item.icon && (
                        <span className="shrink-0">{item.icon}</span>
                      )}
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-4 min-w-[20px] px-1 text-xs"
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

        <div className="mt-4">{children}</div>
      </Tabs>
    );
  }
);

ResponsiveTabs.displayName = "ResponsiveTabs";
export { ResponsiveTabs };
