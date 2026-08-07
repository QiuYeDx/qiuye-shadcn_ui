"use client";

import { LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SmoothCornersSupportNoticeProps {
  supported: boolean | null;
  compact?: boolean;
  className?: string;
}

const supportContent = {
  checking: {
    title: "正在检查浏览器支持",
    description: "检测 CSS corner-shape 能力。",
    icon: LoaderCircleIcon,
  },
  fallback: {
    title: "当前浏览器已使用普通圆角降级",
    description: "CSS corner-shape 不可用，smoothing 不会产生视觉差异。",
    icon: TriangleAlertIcon,
  },
} as const;

export function SmoothCornersSupportNotice({
  supported,
  compact = false,
  className,
}: SmoothCornersSupportNoticeProps) {
  if (supported) return null;

  const state = supported === null ? "checking" : "fallback";
  const content = supportContent[state];
  const Icon = content.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      data-support-state={state}
      className={cn(
        "flex items-start gap-2 rounded-md border",
        compact ? "px-2.5 py-2 text-[11px] leading-4" : "p-3 text-sm",
        state === "checking" && "bg-muted/40 text-muted-foreground",
        state === "fallback" &&
          "border-amber-600/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-3.5 shrink-0",
          state === "checking" && "animate-spin",
        )}
        aria-hidden="true"
      />
      <span className={cn(!compact && "space-y-0.5")}>
        <span className="block font-medium">{content.title}</span>
        <span className={cn("block opacity-80", compact && "mt-0.5")}>
          {content.description}
        </span>
      </span>
    </div>
  );
}
