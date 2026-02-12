"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence } from "motion/react";

import {
  resolveCodeBlockTheme,
  themeVarsToCSSProperties,
  type CodeBlockColorThemeName,
  type CodeBlockThemeConfig,
} from "./code-block-themes";

// ============================================
// 公开导出（类型 + 工具）—— 从 code-block-themes 转导
// ============================================

export type {
  CodeBlockColorThemeName,
  CodeBlockThemeConfig,
  CodeBlockThemeVars,
  SyntaxPalette,
} from "./code-block-themes";

export {
  codeBlockThemes,
  CODE_BLOCK_COLOR_THEME_NAMES,
  createCodeBlockThemeVars,
  createSyntaxTheme,
  deriveThemeFromPrism,
  resolveCodeBlockTheme,
  themeVarsToCSSProperties,
} from "./code-block-themes";

// ============================================
// CodeBlock 组件
// ============================================

/**
 * 代码块显示模式
 * - "collapse": 展开/折叠模式，超出行数后显示渐变遮罩和展开按钮
 * - "scroll": 滚动模式，设置最大高度，超出部分纵向滚动
 * - "auto-height": 自适应高度模式，高度自动适配父容器，超出部分纵向滚动
 */
export type CodeBlockDisplayMode = "collapse" | "scroll" | "auto-height";

export interface CodeBlockProps {
  /** 代码内容 */
  children: string;
  /** 编程语言（用于语法高亮） */
  language?: string;
  /** 是否为深色模式（控制内置主题的浅色/深色变体选择，默认 true） */
  isDark?: boolean;
  /**
   * 内置配色主题名称（默认 "qiuvision"）
   *
   * 与 isDark 配合使用，自动选择对应的浅色/深色变体。
   * 可选值: "qiuvision" | "github" | "one" | "dracula" | "nord" | "vitesse" | "monokai"
   */
  colorTheme?: CodeBlockColorThemeName;
  /**
   * 自定义主题配置（优先级高于 colorTheme 和 isDark）
   *
   * - 传入 CodeBlockThemeConfig：完整配置（语法高亮 + UI 配色）
   * - 传入 PrismTheme：仅语法高亮，UI 配色自动从背景色推导
   */
  customTheme?: CodeBlockThemeConfig | PrismTheme;
  /**
   * 显示模式（溢出处理策略）
   * - "collapse": 展开/折叠模式，超出行数后显示渐变遮罩和展开按钮
   * - "scroll": 滚动模式，设置最大高度，超出部分纵向滚动
   * - "auto-height": 自适应高度模式，高度自动适配父容器，超出部分纵向滚动
   * 
   * 不设置时代码块无高度限制，完整显示所有代码
   */
  displayMode?: CodeBlockDisplayMode;
  /** 折叠的行数阈值（displayMode="collapse" 时生效，默认 15 行） */
  maxLines?: number;
  /**
   * 最大高度（displayMode="scroll" 时生效）
   * 
   * 支持 CSS 单位字符串（如 "400px"、"50vh"、"20rem"）或数字（单位为 px）
   * 
   * 默认 "400px"
   */
  maxHeight?: string | number;
  /** 是否在横向滚动时固定左侧行号列（sticky 效果），默认 true */
  stickyLineNumbers?: boolean;
  /** 是否在折叠后跳转时显示聚光灯阴影效果（displayMode="collapse" 时生效），默认 true */
  spotlightOnCollapse?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 通用代码块显示组件
 *
 * 特性:
 * - 基于 prism-react-renderer 的语法高亮
 * - **可定制配色主题**：7 套内置主题（各有浅/深色变体）+ 自定义主题支持
 * - 行号显示 + 横向滚动时行号 sticky 固定
 * - 三种显示模式（通过 displayMode 切换）：
 *   - "collapse"：超出行数自动折叠，渐变遮罩 + 展开/收起按钮 + 聚光灯动画
 *   - "scroll"：设置最大高度，超出部分纵向滚动，带滚动阴影指示器
 *   - "auto-height"：自适应父容器高度，超出部分纵向滚动（适用于 flex/grid 布局）
 * - 自带完整样式，可独立于 MarkdownRenderer 使用
 *
 * @example
 * ```tsx
 * // 使用内置主题
 * <CodeBlock language="typescript" colorTheme="github" isDark={isDark}>
 *   {code}
 * </CodeBlock>
 *
 * // 使用自定义主题
 * <CodeBlock language="python" customTheme={myThemeConfig}>
 *   {code}
 * </CodeBlock>
 * ```
 */
export function CodeBlock({
  children,
  language = "plaintext",
  isDark = true,
  colorTheme,
  customTheme,
  displayMode,
  maxLines = 15,
  maxHeight = "400px",
  stickyLineNumbers = true,
  spotlightOnCollapse = true,
  className = "",
}: CodeBlockProps) {
  const code = children.trim();

  // ---- 主题解析 + CSS 变量 ----
  const resolvedTheme = useMemo(
    () => resolveCodeBlockTheme(colorTheme, customTheme, isDark),
    [colorTheme, customTheme, isDark],
  );

  const cssVars = useMemo(
    () => themeVarsToCSSProperties(resolvedTheme.vars),
    [resolvedTheme.vars],
  );

  // ---- 模式判定 ----
  const effectiveMode: CodeBlockDisplayMode | null = displayMode ?? null;

  const lineCount = code.split("\n").length;

  // ---- Collapse 模式状态 ----
  const [isExpanded, setIsExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const COLLAPSE_BUFFER = 3;
  const shouldCollapse =
    effectiveMode === "collapse" && lineCount > maxLines + COLLAPSE_BUFFER;

  // ---- Scroll / Auto-height 模式状态 ----
  const isScrollable =
    effectiveMode === "scroll" || effectiveMode === "auto-height";
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [scrollShadow, setScrollShadow] = useState({
    top: false,
    bottom: false,
  });

  // 解析 maxHeight（支持 number 和 string）
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  // 组件卸载时确保清理 spotlight 状态，防止导航离开后 bottomFade 遮罩未恢复
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  // Scroll shadow 检测（scroll / auto-height 模式）
  useEffect(() => {
    if (!isScrollable) return;
    const el = scrollContentRef.current;
    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrollShadow({
        top: scrollTop > 2,
        bottom: scrollTop + clientHeight < scrollHeight - 2,
      });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [isScrollable]);

  // 收起代码块时的处理：滚动到代码块位置 + 聚光灯强调动画（可配置）
  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    requestAnimationFrame(() => {
      if (wrapperRef.current) {
        // 导航栏高度补偿 + 灵动岛高度 + 额外空间
        const offset = 142;
        const elementPosition =
          wrapperRef.current.getBoundingClientRect().top;
        const currentScroll = window.scrollY || window.pageYOffset;
        const targetPosition = elementPosition + currentScroll - offset;

        window.scrollTo({
          top: targetPosition,
        });

        // 聚光灯效果：暗化代码块之外的页面内容，强调当前代码块位置
        if (spotlightOnCollapse) {
          const el = wrapperRef.current;
          // 暂时隐藏视口底部的渐变遮罩，避免其覆盖在聚光灯阴影上方
          const bottomFade = document.querySelector(
            "[data-bottom-fade]",
          ) as HTMLElement | null;
          requestAnimationFrame(() => {
            el.classList.add("spotlight-highlight");
            if (bottomFade) {
              bottomFade.style.transition = "opacity 0.25s ease-out";
              bottomFade.style.opacity = "0";
            }
            const onEnd = () => {
              el.classList.remove("spotlight-highlight");
              el.removeEventListener("animationend", onEnd);
              cleanupRef.current = null;
              // 恢复底部渐变遮罩
              if (bottomFade) {
                bottomFade.style.transition = "opacity 0.8s ease-out";
                bottomFade.style.opacity = "";
              }
            };
            el.addEventListener("animationend", onEnd);
            // 注册 cleanup 供组件卸载时调用，确保即使动画未结束也能恢复状态
            cleanupRef.current = () => {
              el.classList.remove("spotlight-highlight");
              el.removeEventListener("animationend", onEnd);
              if (bottomFade) {
                bottomFade.style.transition = "";
                bottomFade.style.opacity = "";
              }
            };
          });
        }
      }
    });
  }, [spotlightOnCollapse]);

  // 语法高亮渲染
  const highlightedCode = (
    <Highlight theme={resolvedTheme.syntax} code={code} language={language}>
      {({
        className: hlClassName,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <pre className={hlClassName} style={style}>
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="line-number">{i + 1}</span>
                <span className="line-content">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );

  const modeClass =
    effectiveMode === "auto-height"
      ? " auto-height-mode"
      : effectiveMode === "scroll"
        ? " scroll-mode"
        : "";
  const wrapperClass = `qiuye-code-block${stickyLineNumbers ? " sticky-line-numbers" : ""}${modeClass}${className ? ` ${className}` : ""}`;

  // ---- 普通模式（无显示模式，或 collapse 模式但行数不够触发折叠） ----
  if (!effectiveMode || (effectiveMode === "collapse" && !shouldCollapse)) {
    return (
      <div
        className={wrapperClass}
        style={cssVars as React.CSSProperties}
      >
        {highlightedCode}
        <CodeBlockStyles />
      </div>
    );
  }

  // ---- Collapse 展开/折叠模式 ----
  if (effectiveMode === "collapse" && shouldCollapse) {
    // 折叠高度计算：pre padding-top(0.5rem) + maxLines × 行高(0.875rem × 1.6 = 1.4rem)
    const collapsedMaxHeight = `${0.5 + maxLines * 1.4}rem`;

    return (
      <div
        className={wrapperClass}
        style={cssVars as React.CSSProperties}
      >
        <div
          ref={wrapperRef}
          className={`collapsible-code-block ${isExpanded ? "is-expanded" : "is-collapsed"}`}
        >
          <div
            className="collapsible-code-content"
            style={
              !isExpanded
                ? { maxHeight: collapsedMaxHeight, overflow: "hidden" }
                : undefined
            }
          >
            {highlightedCode}
          </div>

          {/* 折叠状态：渐变遮罩 + 展开按钮 */}
          <AnimatePresence>
            {!isExpanded && (
              <div key="collapsed" className="collapsible-code-overlay">
                <button
                  className="collapsible-code-btn"
                  onClick={() => setIsExpanded(true)}
                >
                  <ChevronDown className="h-3.5 w-3.5 -ml-1" />
                  展开全部 {lineCount} 行
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* 展开状态：悬浮在底部的圆形收起按钮 */}
          <AnimatePresence>
            {isExpanded && (
              <button
                key="collapse-btn"
                className="collapsible-code-collapse-btn"
                onClick={handleCollapse}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            )}
          </AnimatePresence>
        </div>
        <CodeBlockStyles />
      </div>
    );
  }

  // ---- Scroll / Auto-height 滚动模式 ----
  if (isScrollable) {
    return (
      <div
        className={wrapperClass}
        style={cssVars as React.CSSProperties}
      >
        <div className="scrollable-code-block">
          <div
            ref={scrollContentRef}
            className="scrollable-code-content"
            style={
              effectiveMode === "scroll"
                ? { maxHeight: resolvedMaxHeight }
                : undefined
            }
          >
            {highlightedCode}
          </div>
          {/* 滚动阴影指示器 - 提示上方/下方还有更多内容 */}
          <div
            className={`scroll-shadow scroll-shadow-top${scrollShadow.top ? " visible" : ""}`}
          />
          <div
            className={`scroll-shadow scroll-shadow-bottom${scrollShadow.bottom ? " visible" : ""}`}
          />
        </div>
        <CodeBlockStyles />
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={wrapperClass}
      style={cssVars as React.CSSProperties}
    >
      {highlightedCode}
      <CodeBlockStyles />
    </div>
  );
}

// ============================================
// 样式组件（styled-jsx global，自动去重）
// 所有配色通过 CSS 自定义属性（--cb-xxx）驱动，
// 无需 .dark 前缀重复，同一份 CSS 适配任意主题。
// ============================================

function CodeBlockStyles() {
  return (
    <style jsx global>{`
      /* ============================================
         代码块基础样式
         ============================================ */

      .qiuye-code-block pre {
        margin: 2rem 0;
        padding: 0.5rem 0.5rem 0.5rem 0;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 0.875rem;
        line-height: 1.6;
        box-shadow: 0 4px 12px var(--cb-shadow-lg);
        border: 1px solid var(--cb-border);
        scrollbar-width: thin;
        scrollbar-color: var(--cb-sb-thumb) var(--cb-sb-track);
        overscroll-behavior-x: none;
      }

      .qiuye-code-block pre code {
        font-family:
          "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", "Consolas",
          "source-code-pro", monospace;
        font-size: 0.875rem;
        line-height: 1.6;
        display: block;
        width: fit-content;
        min-width: 100%;
      }

      /* 代码行容器 */
      .qiuye-code-block pre code > div {
        display: flex;
        align-items: flex-start;
        min-height: 1.6em;
        padding: 0 0.5rem;
        margin: 0 -0.5rem;
        border-radius: 4px;
      }

      /* 代码行悬停效果 */
      .qiuye-code-block pre code > div:hover {
        background-color: var(--cb-hover);
      }

      /* ============================================
         行号样式
         ============================================ */

      .qiuye-code-block .line-number {
        display: inline-block;
        width: 3rem;
        min-width: 3rem;
        padding-right: 1rem;
        margin-right: 1rem;
        text-align: right;
        color: var(--cb-ln-color);
        user-select: none;
        border-right: 1px solid var(--cb-ln-border);
        flex-shrink: 0;
      }

      /* 行内容 */
      .qiuye-code-block .line-content {
        flex: 1;
        white-space: pre;
      }

      /* ============================================
         响应式优化
         ============================================ */

      @media (max-width: 640px) {
        .qiuye-code-block pre {
          margin: 1.5rem 0;
          border-radius: 6px;
          font-size: 0.8rem;
          padding: 0.5rem 0.5rem 0.5rem 0;
        }

        .qiuye-code-block .line-number {
          width: 2.5rem;
          min-width: 2.5rem;
          padding-right: 0.75rem;
          margin-right: 0.75rem;
          font-size: 0.8rem;
        }

        .qiuye-code-block pre code {
          font-size: 0.8rem;
        }
      }

      /* ============================================
         滚动条美化 - Webkit
         ============================================ */

      .qiuye-code-block pre::-webkit-scrollbar {
        height: 10px;
      }

      .qiuye-code-block pre::-webkit-scrollbar-track {
        background: var(--cb-sb-track);
        border-radius: 5px;
      }

      .qiuye-code-block pre::-webkit-scrollbar-thumb {
        background: var(--cb-sb-thumb);
        border-radius: 5px;
        transition: background 0.2s ease;
      }

      .qiuye-code-block pre::-webkit-scrollbar-thumb:hover {
        background: var(--cb-sb-thumb-hover);
      }

      /* ============================================
         可折叠代码块样式
         ============================================ */

      /* 容器 - 接管 pre 的外层样式 */
      .qiuye-code-block .collapsible-code-block {
        position: relative;
        margin: 2rem 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--cb-shadow-lg);
        overflow: hidden;
        border: 1px solid var(--cb-border);
      }

      /* 展开时允许收起按钮突出边框 */
      .qiuye-code-block .collapsible-code-block.is-expanded {
        overflow: visible;
      }

      /* 内容区域接管圆角裁剪（展开时 block overflow: visible，由 content 裁剪背景） */
      .qiuye-code-block .collapsible-code-block .collapsible-code-content {
        overflow: hidden;
        border-radius: inherit;
      }

      /* 内部 pre 取消自身外层样式（由 wrapper 统一处理） */
      .qiuye-code-block .collapsible-code-block .collapsible-code-content pre {
        margin: 0;
        border: none;
        border-radius: 0;
        box-shadow: none;
      }

      /* 渐变遮罩层 */
      .qiuye-code-block .collapsible-code-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 12px;
        pointer-events: none;
        z-index: 1;
        background: linear-gradient(
          to bottom,
          rgba(var(--cb-bg-rgb), 0) 0%,
          rgba(var(--cb-bg-rgb), 0.7) 40%,
          rgba(var(--cb-bg-rgb), 0.95) 80%,
          rgba(var(--cb-bg-rgb), 1) 100%
        );
      }

      /* 展开按钮 */
      .qiuye-code-block .collapsible-code-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 16px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        pointer-events: all;
        transition: all 0.2s ease;
        font-family:
          "Inter",
          -apple-system,
          sans-serif;
        background: rgba(var(--cb-bg-rgb), 0.9);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--cb-btn-border);
        color: var(--cb-btn-text);
        box-shadow: 0 2px 8px var(--cb-shadow);
      }

      .qiuye-code-block .collapsible-code-btn:hover {
        color: var(--cb-btn-hover-text);
        border-color: var(--cb-btn-hover-border);
        box-shadow: 0 2px 12px var(--cb-shadow-lg);
      }

      /* 悬浮收起按钮 - 圆形，位于右下角 */
      .qiuye-code-block .collapsible-code-collapse-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translate(-12px, -12px);
        z-index: 2;
        width: 32px;
        height: 32px;
        opacity: 0.85;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        background: rgba(var(--cb-bg-rgb), 0.95);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--cb-btn-border);
        color: var(--cb-btn-text);
        box-shadow: 0 2px 8px var(--cb-shadow);
      }

      .qiuye-code-block .collapsible-code-collapse-btn:hover {
        color: var(--cb-btn-hover-text);
        border-color: var(--cb-btn-hover-border);
        box-shadow: 0 2px 12px var(--cb-shadow-lg);
        opacity: 1;
      }

      /* 收起后聚光灯强调动画 —— 通过超大 box-shadow 暗化代码块之外的区域 */
      @keyframes code-block-spotlight {
        0% {
          box-shadow: 0 4px 12px var(--cb-shadow-lg), 0 0 0 9999px transparent;
        }
        15%, 50% {
          box-shadow: 0 4px 12px var(--cb-shadow-lg), 0 0 0 9999px var(--cb-spotlight);
        }
        100% {
          box-shadow: 0 4px 12px var(--cb-shadow-lg), 0 0 0 9999px transparent;
        }
      }
      .qiuye-code-block .collapsible-code-block.spotlight-highlight {
        z-index: 30;
        animation: code-block-spotlight 1.4s ease-in-out;
      }

      /* 可折叠代码块 - 移动端响应式 */
      @media (max-width: 640px) {
        .qiuye-code-block .collapsible-code-block {
          margin: 1.5rem 0;
          border-radius: 6px;
        }
      }

      /* ============================================
         滚动模式 (scroll + auto-height) 代码块样式
         ============================================ */

      /* 容器 - 接管 pre 的外层样式（与 collapsible-code-block 类似） */
      .qiuye-code-block .scrollable-code-block {
        position: relative;
        margin: 2rem 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--cb-shadow-lg);
        overflow: hidden;
        border: 1px solid var(--cb-border);
        background: var(--cb-bg);
      }

      /* 内部可滚动区域 - 纵向 + 横向均可滚动 */
      .qiuye-code-block .scrollable-code-block .scrollable-code-content {
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--cb-sb-thumb) var(--cb-sb-track);
        overscroll-behavior-x: none;
      }

      /* 内部 pre 取消自身外层样式（由 wrapper 统一处理），并取消 overflow 交给父容器 */
      .qiuye-code-block .scrollable-code-block pre {
        margin: 0;
        border: none;
        border-radius: 0;
        box-shadow: none;
        overflow: visible;
      }

      /* Webkit 滚动条美化 - 可滚动代码内容区 */
      .qiuye-code-block .scrollable-code-content::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .qiuye-code-block .scrollable-code-content::-webkit-scrollbar-track {
        background: var(--cb-sb-track);
      }

      .qiuye-code-block .scrollable-code-content::-webkit-scrollbar-thumb {
        background: var(--cb-sb-thumb);
        border-radius: 5px;
        transition: background 0.2s ease;
      }

      .qiuye-code-block .scrollable-code-content::-webkit-scrollbar-thumb:hover {
        background: var(--cb-sb-thumb-hover);
      }

      .qiuye-code-block .scrollable-code-content::-webkit-scrollbar-corner {
        background: var(--cb-sb-track);
      }

      /* ---- 滚动阴影指示器 ---- */
      .qiuye-code-block .scroll-shadow {
        position: absolute;
        left: 0;
        right: 0;
        height: 24px;
        pointer-events: none;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.25s ease;
      }

      .qiuye-code-block .scroll-shadow.visible {
        opacity: 1;
      }

      .qiuye-code-block .scroll-shadow-top {
        top: 0;
        background: linear-gradient(
          to bottom,
          rgba(var(--cb-bg-rgb), 0.75) 0%,
          transparent 100%
        );
        border-radius: 8px 8px 0 0;
      }

      .qiuye-code-block .scroll-shadow-bottom {
        bottom: 0;
        background: linear-gradient(
          to top,
          rgba(var(--cb-bg-rgb), 0.75) 0%,
          transparent 100%
        );
        border-radius: 0 0 8px 8px;
      }

      /* ---- Auto-height 模式 - 自适应父容器高度 ---- */
      .qiuye-code-block.auto-height-mode {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .qiuye-code-block.auto-height-mode .scrollable-code-block {
        flex: 1;
        min-height: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }

      .qiuye-code-block.auto-height-mode .scrollable-code-content {
        flex: 1;
        min-height: 0;
      }

      /* 滚动模式 - 移动端响应式 */
      @media (max-width: 640px) {
        .qiuye-code-block .scrollable-code-block {
          margin: 1.5rem 0;
          border-radius: 6px;
        }

        .qiuye-code-block .scroll-shadow-top {
          border-radius: 6px 6px 0 0;
        }

        .qiuye-code-block .scroll-shadow-bottom {
          border-radius: 0 0 6px 6px;
        }
      }

      /* ============================================
         Sticky 行号 - 横向滚动时固定左侧行号列
         ============================================ */

      .qiuye-code-block.sticky-line-numbers .line-number {
        position: sticky;
        left: 0;
        z-index: 1;
        background-color: var(--cb-bg);
      }

      .qiuye-code-block.sticky-line-numbers pre code > div:hover .line-number {
        background-color: var(--cb-hover-solid);
      }
    `}</style>
  );
}
