"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Columns3Icon,
  DiamondIcon,
  HexagonIcon,
  LaptopIcon,
  MoveDiagonal2Icon,
  MoonIcon,
  MousePointer2Icon,
  ScanLineIcon,
  ShapesIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
} from "lucide-react";

import {
  ThemeTransitionToggle,
  type ThemeTransitionEffect,
  type ThemeTransitionShape,
  useThemeTransition,
} from "@/components/qiuye-ui/theme-transition-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewSourceButton } from "@/components/view-source-button";
import { cn } from "@/lib/utils";

const sourceCodes = {
  basic: `import { useTheme } from "next-themes";
import { ThemeTransitionToggle } from "@/components/qiuye-ui/theme-transition-toggle";

function BasicDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ThemeTransitionToggle
      isDark={isDark}
      timing="spring"
      onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
    />
  );
}`,
  hook: `import { useTheme } from "next-themes";
import {
  ThemeTransitionToggle,
  useThemeTransition,
} from "@/components/qiuye-ui/theme-transition-toggle";

function GeometryDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { run, isTransitioning } = useThemeTransition({
    isDark,
    transitionEffect: "split",
    timing: "spring",
    updateTheme: () => setTheme(isDark ? "light" : "dark"),
  });

  return (
    <button
      disabled={isTransitioning}
      className="cursor-pointer"
      onClick={(event) => run(event)}
    >
      Toggle with custom trigger
    </button>

    <ThemeTransitionToggle
      isDark={isDark}
      shape="star"
      onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
    />
  );
}`,
  customOrigin: `import { useRef } from "react";
import { useTheme } from "next-themes";
import { runThemeViewTransition } from "@/components/qiuye-ui/theme-transition-toggle";

function CustomOriginDemo() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      ref={buttonRef}
      onClick={() =>
        runThemeViewTransition({
          isDark,
          targetDark: !isDark,
          origin: buttonRef,
          direction: "enter",
          updateTheme: () => setTheme(isDark ? "light" : "dark"),
        })
      }
    >
      Run transition
    </button>
  );
}`,
};

const geometryExamples: Array<{
  shape: ThemeTransitionShape;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  {
    shape: "star",
    label: "五角星",
    icon: StarIcon,
  },
  {
    shape: "diamond",
    label: "菱形",
    icon: DiamondIcon,
  },
  {
    shape: "hexagon",
    label: "六边形",
    icon: HexagonIcon,
  },
];

const transitionEffectExamples: Array<{
  transitionEffect: Exclude<ThemeTransitionEffect, "reveal">;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  {
    transitionEffect: "wipe",
    label: "边缘扫入",
    icon: ScanLineIcon,
  },
  {
    transitionEffect: "split",
    label: "轴线展开",
    icon: Columns3Icon,
  },
  {
    transitionEffect: "diagonal",
    label: "对角揭幕",
    icon: MoveDiagonal2Icon,
  },
];

function useResolvedDark() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    isDark: mounted ? resolvedTheme === "dark" : false,
    setTheme,
  };
}

function ThemeStatePanel({ isDark }: { isDark: boolean }) {
  return (
    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-3">
      {[
        {
          label: "View Transition",
          value: "root clip-path",
          icon: SparklesIcon,
        },
        {
          label: "Theme",
          value: isDark ? "dark" : "light",
          icon: isDark ? MoonIcon : SunIcon,
        },
        {
          label: "Fallback",
          value: "reduced motion",
          icon: LaptopIcon,
        },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-md border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="size-3.5" />
            {label}
          </div>
          <div className="text-sm font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}

export function ThemeTransitionToggleDemo() {
  const { mounted, isDark, setTheme } = useResolvedDark();
  const [originLog, setOriginLog] = React.useState("button center");
  const hookButtonRef = React.useRef<HTMLButtonElement>(null);
  const { run, isTransitioning } = useThemeTransition({
    isDark,
    origin: hookButtonRef,
    transitionEffect: "split",
    timing: "spring",
    updateTheme: () => setTheme(isDark ? "light" : "dark"),
    onFinish: () => setOriginLog("custom trigger"),
  });

  if (!mounted) {
    return (
      <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
        正在读取当前主题...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>基础主题按钮</CardTitle>
              <CardDescription>
                从按钮中心触发全屏圆形揭幕，自动降级到普通主题切换
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基础用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <ThemeTransitionToggle
              isDark={isDark}
              onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
              timing="spring"
              onFinish={() => setOriginLog("button center")}
            />
            <ThemeTransitionToggle
              isDark={isDark}
              onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
              variant="secondary"
              timing="smooth"
              easing="cubic-bezier(0.17,0.84,0.44,1)"
              lightIcon={<SunIcon className="size-4" />}
              darkIcon={<MoonIcon className="size-4" />}
              lightLabel="开启深色"
              darkLabel="开启浅色"
            />
            <Badge variant="secondary">
              当前：{isDark ? "深色模式" : "浅色模式"}
            </Badge>
          </div>
          <ThemeStatePanel isDark={isDark} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>可选几何转场</CardTitle>
              <CardDescription>
                分别控制揭幕形状与快照的运动路径，触发点会决定最近的边、轴线或视口角
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.hook}
              title="几何形状 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 rounded-lg border bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="mb-1 text-sm font-medium">
                自定义轴线展开触发器
              </div>
              <p className="text-sm text-muted-foreground">
                最近一次动画原点：{originLog}
              </p>
            </div>
            <Button
              ref={hookButtonRef}
              type="button"
              disabled={isTransitioning}
              onClick={(event) => run(event)}
              className="cursor-pointer gap-2"
            >
              <MousePointer2Icon className="size-4" />
              {isTransitioning ? "切换中..." : "从点击处切换"}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {geometryExamples.map(({ shape, label, icon: Icon }) => (
              <div
                key={shape}
                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{label}</div>
                    <code className="block truncate text-xs text-muted-foreground">
                      {`shape="${shape}"`}
                    </code>
                  </div>
                </div>
                <ThemeTransitionToggle
                  isDark={isDark}
                  onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
                  shape={shape}
                  variant="secondary"
                  lightIcon={<ShapesIcon className="size-4" />}
                  darkIcon={<ShapesIcon className="size-4" />}
                  lightLabel={`${label}揭幕切换到深色主题`}
                  darkLabel={`${label}揭幕切换到浅色主题`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t pt-4">
            <div>
              <div className="text-sm font-medium">快照运动路径</div>
              <p className="text-sm text-muted-foreground">
                保持新旧主题快照的层级语义，只替换裁剪路径
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {transitionEffectExamples.map(
                ({ transitionEffect, label, icon: Icon }) => (
                  <div
                    key={transitionEffect}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {label}
                        </div>
                        <code className="block truncate text-xs text-muted-foreground">
                          {`transitionEffect="${transitionEffect}"`}
                        </code>
                      </div>
                    </div>
                    <ThemeTransitionToggle
                      isDark={isDark}
                      onToggle={(nextDark) =>
                        setTheme(nextDark ? "dark" : "light")
                      }
                      transitionEffect={transitionEffect}
                      variant="secondary"
                      lightIcon={<Icon className="size-4" />}
                      darkIcon={<Icon className="size-4" />}
                      lightLabel={`${label}切换到深色主题`}
                      darkLabel={`${label}切换到浅色主题`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>适合真实页面的状态展示</CardTitle>
              <CardDescription>
                组件只负责过渡编排，主题状态仍由 next-themes 或你的 store 管理
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.customOrigin}
              title="自定义原点 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "grid gap-4 rounded-lg border p-4 transition-colors sm:grid-cols-2",
              isDark
                ? "bg-zinc-950 text-zinc-50"
                : "bg-white text-zinc-950",
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md",
                    isDark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white",
                  )}
                >
                  {isDark ? (
                    <MoonIcon className="size-4" />
                  ) : (
                    <SunIcon className="size-4" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">Theme surface</div>
                  <div
                    className={cn(
                      "text-xs",
                      isDark ? "text-zinc-400" : "text-zinc-500",
                    )}
                  >
                    真实 DOM 主题切换，不是截图遮罩
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={cn(
                    "h-2 w-5/6 rounded-full",
                    isDark ? "bg-white/20" : "bg-zinc-950/15",
                  )}
                />
                <div
                  className={cn(
                    "h-2 w-3/5 rounded-full",
                    isDark ? "bg-white/12" : "bg-zinc-950/10",
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["API", "Hook", "Button"].map((item) => (
                <div
                  key={item}
                  className={cn(
                    "rounded-md border px-3 py-4 text-center text-xs font-medium",
                    isDark
                      ? "border-white/10 bg-white/5"
                      : "border-zinc-950/10 bg-zinc-950/[0.03]",
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
