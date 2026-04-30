"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { useTheme } from "next-themes";
import { extractHeadingMeta, slugifyHeading } from "@/lib/heading-ids";
import { remarkCodeMeta } from "@/lib/markdown/remark-code-meta";
import {
  resolveCodeBlockTheme,
  type CodeBlockThemeConfig,
} from "@/components/qiuye-ui/code-block";
import type {
  MarkdownRendererCoreProps,
  MarkdownPresetConfig,
  MarkdownPresetComponentContext,
} from "./markdown-types";
import styles from "./markdown-renderer.module.css";

function getSyntaxColor(
  theme: CodeBlockThemeConfig,
  tokenType: string,
  fallback: string,
) {
  return (
    theme.syntax.styles.find((style) => style.types.includes(tokenType))?.style
      .color ?? fallback
  );
}

function alphaFromMode(isDark: boolean, darkAlpha: number, lightAlpha: number) {
  return isDark ? darkAlpha : lightAlpha;
}

/** MarkdownRendererCore 内部属性 */
export interface MarkdownRendererCoreInternalProps
  extends MarkdownRendererCoreProps {
  /** preset 配置，由 BlogMarkdownRenderer / ChatMarkdownRenderer 传入 */
  preset: MarkdownPresetConfig;
}

/**
 * MarkdownRendererCore — Markdown 渲染底座
 *
 * 负责组合解析插件、预设组件映射和运行时上下文：
 * - 统一接入 remark-gfm、remarkCodeMeta 与可选 rehypeRaw
 * - 根据 preset 合并代码块配置、密度、安全策略和组件映射
 * - 生成稳定标题 id，并支持关闭标题 id
 * - 将 Widget 注册表和上下文传递给 preset 组件
 *
 * @example
 * ```tsx
 * <MarkdownRendererCore content={content} preset={blogPreset} />
 * ```
 */
export function MarkdownRendererCore({
  content,
  className = "",
  components: componentOverrides,
  widgetRegistry,
  widgetContext,
  codeBlock: codeBlockOverride,
  enableHeadingIds: enableHeadingIdsOverride,
  enableRawHtml: enableRawHtmlOverride,
  preset,
}: MarkdownRendererCoreInternalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  const enableHeadingIds = enableHeadingIdsOverride ?? preset.enableHeadingIds;
  const enableRawHtml = enableRawHtmlOverride ?? preset.enableRawHtml;
  const codeBlock = useMemo(() => {
    const overrideEntries = Object.entries(codeBlockOverride ?? {}).filter(
      ([, value]) => value !== undefined,
    );
    return {
      ...preset.codeBlock,
      ...Object.fromEntries(overrideEntries),
    };
  }, [preset.codeBlock, codeBlockOverride]);

  const markdownThemeStyle = useMemo(() => {
    const resolved = resolveCodeBlockTheme(
      codeBlock.colorTheme,
      codeBlock.customTheme,
      isDark,
    );
    const vars = resolved.vars;
    const syntax = resolved.syntax;
    const fg = syntax.plain.color ?? (isDark ? "#e6edf3" : "#24292f");
    const bg = syntax.plain.backgroundColor ?? vars.bg;
    const accent = getSyntaxColor(
      resolved,
      "keyword",
      isDark ? "#ff7b72" : "#cf222e",
    );
    const secondary = getSyntaxColor(
      resolved,
      "function",
      isDark ? "#d2a8ff" : "#8250df",
    );
    const inlineColor = getSyntaxColor(resolved, "string", accent);
    const muted = getSyntaxColor(resolved, "comment", vars.lnColor);
    const shadowAlpha = alphaFromMode(isDark, 0.3, 0.12);
    const fullscreenShadowAlpha = alphaFromMode(isDark, 0.45, 0.16);

    return {
      "--qv-md-bg": bg,
      "--qv-md-bg-rgb": vars.bgRgb,
      "--qv-md-fg": fg,
      "--qv-md-muted": muted,
      "--qv-md-accent": accent,
      "--qv-md-secondary": secondary,
      "--qv-md-inline-bg": vars.hover,
      "--qv-md-inline-color": inlineColor,
      "--qv-md-inline-border": vars.border,
      "--qv-md-mermaid-bg": bg,
      "--qv-md-mermaid-border": vars.border,
      "--qv-md-mermaid-shadow": `rgba(0, 0, 0, ${shadowAlpha})`,
      "--qv-md-scrollbar-track": vars.sbTrack,
      "--qv-md-scrollbar-thumb": vars.sbThumb,
      "--qv-md-scrollbar-thumb-hover": vars.sbThumbHover,
      "--qv-md-fullscreen-shadow": `rgba(0, 0, 0, ${fullscreenShadowAlpha})`,
      "--qv-md-focus-ring": vars.btnHoverBorder,
    } as React.CSSProperties;
  }, [codeBlock.colorTheme, codeBlock.customTheme, isDark]);

  const headingMeta = useMemo(
    () => (enableHeadingIds ? extractHeadingMeta(content, { maxLevel: 4 }) : []),
    [content, enableHeadingIds],
  );

  const headingIdByOffset = useMemo(() => {
    const map = new Map<number, string>();
    headingMeta.forEach((meta) => {
      if (typeof meta.offset === "number") {
        map.set(meta.offset, meta.id);
      }
    });
    return map;
  }, [headingMeta]);

  const getHeadingId = useCallback(
    (
      rawText: string,
      node?: { position?: { start?: { offset?: number } } },
    ) => {
      if (!enableHeadingIds) return undefined;

      const offset = node?.position?.start?.offset;
      if (typeof offset === "number") {
        const mappedId = headingIdByOffset.get(offset);
        if (mappedId) return mappedId;
      }

      const baseSlug = slugifyHeading(rawText);
      if (!baseSlug) {
        if (typeof offset === "number") {
          return `section-${offset}`;
        }
        return "section";
      }

      if (typeof offset === "number") {
        return `${baseSlug}-${offset}`;
      }

      return baseSlug;
    },
    [enableHeadingIds, headingIdByOffset],
  );

  const presetComponentCtx: MarkdownPresetComponentContext = useMemo(
    () => ({
      isDarkRef,
      getHeadingId,
      codeBlock,
      widgetRegistry,
      widgetContext,
      securityProfile: preset.securityProfile,
    }),
    [getHeadingId, codeBlock, widgetRegistry, widgetContext, preset.securityProfile],
  );

  const presetComponents = useMemo(
    () => preset.createComponents?.(presetComponentCtx) ?? {},
    [preset, presetComponentCtx],
  );

  const components: Components = useMemo(
    () => ({
      ...presetComponents,
      ...componentOverrides,
    }),
    [presetComponents, componentOverrides],
  );

  const rehypePlugins = useMemo(
    () => (enableRawHtml ? [rehypeRaw] : []),
    [enableRawHtml],
  );

  const modeClass = `qv-markdown qv-markdown--${preset.mode} qv-markdown--density-${preset.density}`;

  return (
    <div
      className={`${styles.root} ${modeClass} ${className}`}
      style={markdownThemeStyle}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCodeMeta]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
