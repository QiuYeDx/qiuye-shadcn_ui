"use client";

import * as React from "react";

import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ViewSourceButton } from "@/components/view-source-button";
import { cn } from "@/lib/utils";

const sourceCodes = {
  basic: `import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";

export function BasicDemo() {
  return (
    <SmoothCorners
      radius={28}
      smoothing={0.7}
      className="bg-primary p-6 text-primary-foreground"
    >
      Smooth corner card
    </SmoothCorners>
  );
}`,
  asChild: `import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { Button } from "@/components/ui/button";

export function AsChildDemo() {
  return (
    <SmoothCorners asChild radius={18} smoothing={0.75}>
      <Button>Continuous button</Button>
    </SmoothCorners>
  );
}`,
  observeSize: `import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";

export function SizeAwareDemo() {
  return (
    <SmoothCorners
      observeSize
      radius={72}
      smoothing={0.8}
      className="h-24 w-40 bg-primary"
    />
  );
}`,
};

function useCornerShapeSupport() {
  const [supported, setSupported] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setSupported(
      typeof CSS !== "undefined" &&
        CSS.supports("corner-shape", "superellipse(2)")
    );
  }, []);

  return supported;
}

function formatNumber(value: number) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

export function SmoothCornersDemo() {
  const [radius, setRadius] = React.useState(32);
  const [smoothing, setSmoothing] = React.useState(0.6);
  const [wide, setWide] = React.useState(false);
  const supportsCornerShape = useCornerShapeSupport();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>基础用法</CardTitle>
              <CardDescription>
                使用 radius 与 smoothing 参数生成 Figma/iOS 风格的连续圆角。
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基础用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "圆弧", smoothing: 0 },
              { label: "默认", smoothing: 0.6 },
              { label: "更平滑", smoothing: 0.95 },
            ].map((item) => (
              <SmoothCorners
                key={item.label}
                radius={30}
                smoothing={item.smoothing}
                className="min-h-32 bg-primary p-5 text-primary-foreground"
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="mt-10 text-xs opacity-80">
                  smoothing {item.smoothing}
                </div>
              </SmoothCorners>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>asChild</CardTitle>
              <CardDescription>
                将平滑圆角直接应用到已有元素，避免额外包裹层。
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.asChild} title="asChild - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <SmoothCorners asChild radius={18} smoothing={0.75}>
              <Button size="lg">Continuous button</Button>
            </SmoothCorners>
            <SmoothCorners asChild radius={22} smoothing={0.85}>
              <button
                type="button"
                className="border bg-background px-5 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              >
                Custom element
              </button>
            </SmoothCorners>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>参数 Playground</CardTitle>
            <CardDescription>
              拖动滑块实时调整圆角半径和平滑强度。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-h-72 items-center justify-center rounded-lg border bg-muted/30 p-6">
              <SmoothCorners
                radius={radius}
                smoothing={smoothing}
                className="flex h-44 w-full max-w-sm items-center justify-center bg-foreground p-6 text-background shadow-sm"
              >
                <div className="text-center">
                  <div className="text-sm font-medium">Preview</div>
                  <div className="mt-2 text-xs opacity-70">
                    r={radius}px / s={formatNumber(smoothing)}
                  </div>
                </div>
              </SmoothCorners>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">Radius</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {radius}px
                  </code>
                </div>
                <Slider
                  value={[radius]}
                  min={0}
                  max={96}
                  step={1}
                  onValueChange={(value) => setRadius(value[0] ?? 32)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">Smoothing</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {formatNumber(smoothing)}
                  </code>
                </div>
                <Slider
                  value={[smoothing]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setSmoothing(value[0] ?? 0.6)}
                />
              </div>

              <pre className="overflow-x-auto rounded-md bg-muted/60 p-3 text-xs">
                <code>{`<SmoothCorners
  radius={${radius}}
  smoothing={${formatNumber(smoothing)}}
/>`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>尺寸感知</CardTitle>
              <CardDescription>
                开启 observeSize 后，大圆角会根据元素尺寸自动压缩 smoothing。
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.observeSize}
              title="尺寸感知 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWide((value) => !value)}
            >
              {wide ? "收窄" : "加宽"}
            </Button>
          </div>
          <div className="flex min-h-40 items-center justify-center rounded-lg border bg-muted/30 p-6">
            <SmoothCorners
              observeSize
              radius={72}
              smoothing={0.8}
              className={cn(
                "h-24 bg-primary transition-[width] duration-300",
                wide ? "w-72" : "w-40"
              )}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              corner-shape:{" "}
              {supportsCornerShape === null
                ? "检测中"
                : supportsCornerShape
                  ? "supported"
                  : "fallback"}
            </Badge>
            <span>不支持时会自动回退到原始 border-radius。</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
