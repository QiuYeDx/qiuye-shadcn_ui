"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import {
  ThemeTransitionToggle,
  type ThemeTransitionToggleProps,
} from "@/components/qiuye-ui/theme-transition-toggle";

type ThemeToggleProps = Omit<
  ThemeTransitionToggleProps,
  "isDark" | "onToggle"
>;

export function ThemeToggle({
  duration,
  disabled,
  variant = "ghost",
  ...toggleProps
}: ThemeToggleProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ThemeTransitionToggle
      isDark={isDark}
      onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
      duration={duration}
      {...toggleProps}
      disabled={disabled || !mounted}
      variant={variant}
    />
  );
}
