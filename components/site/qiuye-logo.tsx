import * as React from "react";

import { cn } from "@/lib/utils";

interface QiuYeLogoProps extends React.ComponentProps<"svg"> {
  title?: string;
}

/**
 * QiuYe UI 品牌图标。
 *
 * 两片斜向平面通过一道负空间接缝组成完整手势，表达可组合与展开。
 * 图形使用镂空结构，可随 `currentColor` 自动适配主题。
 */
export function QiuYeLogo({ className, title, ...props }: QiuYeLogoProps) {
  const maskId = React.useId();

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="white" />

          <path
            fill="black"
            d="m9.25 16.75 3.85-7.6a4.2 4.2 0 0 1 2.7-2.18l8.7-2.02-3.88 7.7a4.2 4.2 0 0 1-2.7 2.16l-8.67 1.94Z"
          />
          <path
            fill="black"
            d="m11.4 17.4 9.35-2.15-3.85 7.6a4.2 4.2 0 0 1-2.7 2.18l-8.7 2.02 3.88-7.7a4.2 4.2 0 0 1 2.02-1.95Z"
          />
        </mask>
      </defs>

      <path
        d="M9 0h14c5.65 0 9 3.35 9 9v14c0 5.65-3.35 9-9 9H9c-5.65 0-9-3.35-9-9V9C0 3.35 3.35 0 9 0Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
