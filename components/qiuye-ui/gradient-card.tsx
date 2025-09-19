"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientCardVariants = cva(
  "relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      gradient: {
        blue: "bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-blue-200/50 dark:from-blue-950/50 dark:via-slate-900/50 dark:to-cyan-950/50 dark:border-blue-800/50",
        purple:
          "bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200/50 dark:from-purple-950/50 dark:via-slate-900/50 dark:to-pink-950/50 dark:border-purple-800/50",
        pink: "bg-gradient-to-br from-pink-50 via-white to-rose-50 border-pink-200/50 dark:from-pink-950/50 dark:via-slate-900/50 dark:to-rose-950/50 dark:border-pink-800/50",
        orange:
          "bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200/50 dark:from-orange-950/50 dark:via-slate-900/50 dark:to-yellow-950/50 dark:border-orange-800/50",
        green:
          "bg-gradient-to-br from-green-50 via-white to-emerald-50 border-green-200/50 dark:from-green-950/50 dark:via-slate-900/50 dark:to-emerald-950/50 dark:border-green-800/50",
      },
      intensity: {
        light: "bg-opacity-30",
        medium: "bg-opacity-50",
        strong: "bg-opacity-70",
      },
    },
    defaultVariants: {
      gradient: "blue",
      intensity: "medium",
    },
  }
);

const gradientOverlayVariants = {
  blue: "bg-gradient-to-br from-blue-400/10 via-transparent to-cyan-400/10",
  purple: "bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10",
  pink: "bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10",
  orange:
    "bg-gradient-to-br from-orange-400/10 via-transparent to-yellow-400/10",
  green:
    "bg-gradient-to-br from-green-400/10 via-transparent to-emerald-400/10",
};

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientCardVariants> {}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient = "blue", intensity, children, ...props }, ref) => {
    const validGradient = gradient || "blue";

    return (
      <div
        className={cn(
          gradientCardVariants({
            gradient: validGradient,
            intensity,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {/* 渐变叠加层 */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300 hover:opacity-60",
            gradientOverlayVariants[
              validGradient as keyof typeof gradientOverlayVariants
            ]
          )}
        />

        {/* 内容区域 */}
        <div className="relative z-10 p-6">{children}</div>

        {/* 装饰性光晕效果 */}
        <div className="absolute -top-2 -right-2 h-20 w-20 rounded-full bg-white/20 blur-xl opacity-50" />
        <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-white/10 blur-lg opacity-30" />
      </div>
    );
  }
);

GradientCard.displayName = "GradientCard";

export { GradientCard, gradientCardVariants };
