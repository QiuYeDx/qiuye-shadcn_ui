"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";

interface ThemeToggleProps {
  duration?: number;
}

export function ThemeToggle({ duration = 400 }: ThemeToggleProps = {}) {
  const { theme, setTheme } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const toggleTheme = React.useCallback(async () => {
    // 确定新主题：如果当前是 dark 则切换到 light，否则切换到 dark
    // 如果 theme 未定义（首次加载），默认切换到 dark
    const newTheme = theme === "dark" ? "light" : "dark";

    if (!buttonRef.current) {
      setTheme(newTheme);
      return;
    }

    // 检查是否支持 View Transition API
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // 获取按钮位置用于计算动画起点
    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    // 启动 View Transition
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    // 等待过渡准备就绪
    await transition.ready;

    // 应用圆形展开动画
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [theme, setTheme, duration]);

  return (
    <DualStateToggle
      ref={buttonRef}
      active={theme === "dark"}
      onToggle={() => toggleTheme()}
      activeIcon={<MoonIcon />}
      inactiveIcon={<SunIcon />}
      activeLabel="切换到浅色主题"
      inactiveLabel="切换到深色主题"
      variant="ghost"
      effect="rotate"
      transitionDuration={0.35}
    />
  );
}
