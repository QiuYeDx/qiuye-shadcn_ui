"use client";

import React, { useMemo, useRef, useState } from "react";
import { DotGlass } from "@/components/qiuye-ui/dot-glass";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function DotGlassDemo() {
  // ====== DotGlass 参数（完整覆盖组件 props）======
  const [dotSize, setDotSize] = useState(3);
  const [dotGap, setDotGap] = useState(6);
  const [dotFade, setDotFade] = useState(0);
  const [blur, setBlur] = useState(4);
  const [saturation, setSaturation] = useState(130);
  const [glassAlpha, setGlassAlpha] = useState(0.45);

  // 两个场景各自的盖板颜色（更贴近真实使用：浅色页/深色页）
  const [coverColorLight, setCoverColorLight] = useState("#ffffff");
  const [coverColorDark, setCoverColorDark] = useState("#000000");

  // ====== 对比滑块（左右拖拽，控制 DotGlass 覆盖宽度）======
  const lightContainerRef = useRef<HTMLDivElement | null>(null);
  const darkContainerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ active: boolean; container: HTMLDivElement | null }>(
    {
      active: false,
      container: null,
    }
  );
  const [split, setSplit] = useState(50); // 0~100

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

  const updateSplitFromClientX = (
    clientX: number,
    container: HTMLDivElement | null
  ) => {
    const el = container;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = rect.width > 0 ? x / rect.width : 0.5;
    const next = Math.round(clamp(ratio, 0, 1) * 100);
    setSplit(next);
  };

  const onHandlePointerDown =
    (containerRef: React.RefObject<HTMLDivElement | null>) =>
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current.active = true;
      dragRef.current.container = containerRef.current;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // 某些环境下可能不支持 pointer capture，忽略即可
      }
      updateSplitFromClientX(e.clientX, dragRef.current.container);
      e.preventDefault();
    };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    updateSplitFromClientX(e.clientX, dragRef.current.container);
    e.preventDefault();
  };

  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    dragRef.current.container = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    e.preventDefault();
  };

  const dotGlassBaseProps = useMemo(
    () => ({
      dotSize,
      dotGap,
      dotFade,
      blur,
      saturation,
      glassAlpha,
    }),
    [dotSize, dotGap, dotFade, blur, saturation, glassAlpha]
  );

  const resetAll = () => {
    setDotSize(3);
    setDotGap(6);
    setDotFade(0);
    setBlur(4);
    setSaturation(130);
    setGlassAlpha(0.45);
    setCoverColorLight("#ffffff");
    setCoverColorDark("#000000");
    setSplit(50);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft") {
      setSplit((v) => clamp(v - step, 0, 100));
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      setSplit((v) => clamp(v + step, 0, 100));
      e.preventDefault();
    }
    if (e.key === "Home") {
      setSplit(0);
      e.preventDefault();
    }
    if (e.key === "End") {
      setSplit(100);
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Playground：拖拽对比 + 参数调节</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSplit(50)}
                className="cursor-pointer"
              >
                居中
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetAll}
                className="cursor-pointer"
              >
                重置
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            预览区固定展示两种场景：白底黑字 & 黑底白字。拖拽手柄（或用滑块）
            调整 DotGlass 覆盖宽度，对比“有/无 DotGlass”的差异。
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* 预览区 */}
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-4">
                <SceneCanvas
                  variant="light"
                  containerRef={lightContainerRef}
                  coverColor={coverColorLight}
                  split={split}
                  dotGlassBaseProps={dotGlassBaseProps}
                  onPointerDownHandler={onHandlePointerDown(lightContainerRef)}
                  onPointerMoveHandler={onHandlePointerMove}
                  onPointerUpHandler={onHandlePointerUp}
                  onKeyDownHandler={onHandleKeyDown}
                />
                <SceneCanvas
                  variant="dark"
                  containerRef={darkContainerRef}
                  coverColor={coverColorDark}
                  split={split}
                  dotGlassBaseProps={dotGlassBaseProps}
                  onPointerDownHandler={onHandlePointerDown(darkContainerRef)}
                  onPointerMoveHandler={onHandlePointerMove}
                  onPointerUpHandler={onHandlePointerUp}
                  onKeyDownHandler={onHandleKeyDown}
                />
              </div>

              {/* 覆盖宽度：滑块 + 数字输入 */}
              <div className="grid gap-3 sm:grid-cols-[1fr_120px] sm:items-end">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>覆盖宽度（%）</Label>
                    <span className="text-sm text-muted-foreground">
                      {split}%（左侧 DotGlass）
                    </span>
                  </div>
                  <Slider
                    value={[split]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(v) => setSplit(clamp(v[0] ?? 50, 0, 100))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="sr-only">覆盖宽度输入</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={split}
                    onChange={(e) =>
                      setSplit(clamp(Number(e.target.value || 0), 0, 100))
                    }
                  />
                </div>
              </div>
            </div>

            {/* 控制面板 */}
            <div className="lg:col-span-2 space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Label>盖板颜色（coverColor）</Label>
                    <p className="text-xs text-muted-foreground">
                      为了获得“点阵开孔”的干净对比，建议让 coverColor 与场景背景
                      接近：白底用白色，黑底用接近黑色的颜色。
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCoverColorLight("#ffffff");
                      setCoverColorDark("#000000");
                    }}
                    className="cursor-pointer"
                  >
                    匹配白/黑
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      白底场景
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={
                          /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(coverColorLight)
                            ? coverColorLight
                            : "#ffffff"
                        }
                        onChange={(e) => setCoverColorLight(e.target.value)}
                        className="h-9 w-14 px-1"
                        aria-label="白底场景盖板颜色"
                      />
                      <Input
                        value={coverColorLight}
                        onChange={(e) => setCoverColorLight(e.target.value)}
                        className="h-9"
                        placeholder="#ffffff / rgba(...)"
                        aria-label="白底场景盖板颜色文本输入"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      黑底场景
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={
                          /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(coverColorDark)
                            ? coverColorDark
                            : "#000000"
                        }
                        onChange={(e) => setCoverColorDark(e.target.value)}
                        className="h-9 w-14 px-1"
                        aria-label="黑底场景盖板颜色"
                      />
                      <Input
                        value={coverColorDark}
                        onChange={(e) => setCoverColorDark(e.target.value)}
                        className="h-9"
                        placeholder="#000000 / rgba(...)"
                        aria-label="黑底场景盖板颜色文本输入"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverColorLight("#ffffff")}
                      className="cursor-pointer"
                    >
                      白色
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverColorLight("#f5f5f5")}
                      className="cursor-pointer"
                    >
                      浅灰
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverColorDark("#101010")}
                      className="cursor-pointer"
                    >
                      深灰黑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverColorDark("#000000")}
                      className="cursor-pointer"
                    >
                      纯黑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverColorDark("rgba(16,16,16,0.85)")}
                      className="cursor-pointer"
                    >
                      半透明黑
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 参数滑块 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>dotSize（px）</Label>
                    <span className="text-sm text-muted-foreground">
                      {dotSize}
                    </span>
                  </div>
                  <Slider
                    value={[dotSize]}
                    min={1}
                    max={12}
                    step={1}
                    onValueChange={(v) => setDotSize(clamp(v[0] ?? 3, 1, 12))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>dotGap（px）</Label>
                    <span className="text-sm text-muted-foreground">
                      {dotGap}
                    </span>
                  </div>
                  <Slider
                    value={[dotGap]}
                    min={2}
                    max={24}
                    step={1}
                    onValueChange={(v) => setDotGap(clamp(v[0] ?? 6, 2, 24))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>dotFade（px）</Label>
                    <span className="text-sm text-muted-foreground">
                      {dotFade}
                    </span>
                  </div>
                  <Slider
                    value={[dotFade]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(v) => setDotFade(clamp(v[0] ?? 0, 0, 10))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>blur（px）</Label>
                    <span className="text-sm text-muted-foreground">
                      {blur}
                    </span>
                  </div>
                  <Slider
                    value={[blur]}
                    min={0}
                    max={24}
                    step={1}
                    onValueChange={(v) => setBlur(clamp(v[0] ?? 4, 0, 24))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>saturation（%）</Label>
                    <span className="text-sm text-muted-foreground">
                      {saturation}
                    </span>
                  </div>
                  <Slider
                    value={[saturation]}
                    min={60}
                    max={220}
                    step={1}
                    onValueChange={(v) =>
                      setSaturation(clamp(v[0] ?? 130, 60, 220))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>glassAlpha（0-1）</Label>
                    <span className="text-sm text-muted-foreground">
                      {glassAlpha.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[glassAlpha]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(v) =>
                      setGlassAlpha(clamp(v[0] ?? 0.45, 0, 1))
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* 快速预设 */}
              <div className="space-y-2">
                <Label>快速预设</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDotSize(2);
                      setDotGap(4);
                      setDotFade(0);
                      setBlur(4);
                      setSaturation(140);
                      setGlassAlpha(0.45);
                      setCoverColorLight("#ffffff");
                      setCoverColorDark("#000000");
                    }}
                    className="cursor-pointer"
                  >
                    密集点阵
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDotSize(3);
                      setDotGap(6);
                      setDotFade(2);
                      setBlur(10);
                      setSaturation(150);
                      setGlassAlpha(0.5);
                    }}
                    className="cursor-pointer"
                  >
                    磨砂增强
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCoverColorLight("#ffffff");
                      setCoverColorDark("#000000");
                    }}
                    className="cursor-pointer"
                  >
                    匹配白/黑
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const SceneCanvas = ({
  variant,
  containerRef,
  coverColor,
  split,
  dotGlassBaseProps,
  onPointerDownHandler,
  onPointerMoveHandler,
  onPointerUpHandler,
  onKeyDownHandler,
}: {
  variant: "light" | "dark";
  containerRef: React.RefObject<HTMLDivElement | null>;
  coverColor: string;
  split: number;
  dotGlassBaseProps: {
    dotSize: number;
    dotGap: number;
    dotFade: number;
    blur: number;
    saturation: number;
    glassAlpha: number;
  };
  onPointerDownHandler: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMoveHandler: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUpHandler: (e: React.PointerEvent<HTMLDivElement>) => void;
  onKeyDownHandler: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) => {
  const isDark = variant === "dark";

  const baseClass = isDark
    ? "bg-black text-white border-white/10"
    : "bg-white text-zinc-900 border-black/10";

  const surfaceClass = isDark
    ? "border-white/10 bg-white/5"
    : "border-black/10 bg-black/[0.03]";

  const mutedTextClass = isDark ? "text-white/70" : "text-zinc-600";

  const dotClass = isDark ? "bg-white/70" : "bg-black/70";

  const labelLeftClass = isDark
    ? "bg-white/15 text-white border-white/20"
    : "bg-white/90 text-zinc-900 border-black/10";

  const labelRightClass = isDark
    ? "bg-white/10 text-white/80 border-white/15"
    : "bg-white/80 text-zinc-900 border-black/10";

  const handleLineClass = isDark ? "bg-white/70" : "bg-black/60";
  const handleKnobClass = isDark
    ? "bg-white/70 border-white/80"
    : "bg-black/70 border-black/70";
  const handleGripClass = isDark ? "bg-black/60" : "bg-white/70";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[260px] w-full overflow-hidden rounded-xl border",
        baseClass
      )}
    >
      {/* 场景内容（白底黑字 / 黑底白字） */}
      <div className="absolute inset-0 p-5">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border px-4 py-3",
            surfaceClass
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn("size-2 rounded-full", dotClass)} />
            <div
              className={cn("size-2 rounded-full", dotClass, "opacity-70")}
            />
            <div
              className={cn("size-2 rounded-full", dotClass, "opacity-45")}
            />
          </div>
          <div className={cn("text-xs font-medium", mutedTextClass)}>
            {isDark ? "黑色背景 · 白色文字" : "白色背景 · 黑色文字"}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className={cn("rounded-xl border p-4", surfaceClass)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">文本内容</div>
              <div className={cn("text-[10px]", mutedTextClass)}>
                看 dot 内的模糊
              </div>
            </div>
            <div className={cn("mt-2 text-xs leading-relaxed", mutedTextClass)}>
              这里模拟常见的标题/段落/按钮布局，方便观察 blur、saturation
              的变化效果。
            </div>
            <div className="mt-3 space-y-2">
              <div
                className={cn(
                  "h-2 w-5/6 rounded",
                  isDark ? "bg-white/15" : "bg-black/10"
                )}
              />
              <div
                className={cn(
                  "h-2 w-4/6 rounded",
                  isDark ? "bg-white/10" : "bg-black/5"
                )}
              />
              <div
                className={cn(
                  "h-2 w-3/6 rounded",
                  isDark ? "bg-white/5" : "bg-black/5"
                )}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
                className={cn(
                  "h-8 flex-1 rounded-md",
                  isDark ? "bg-white/10" : "bg-black/5"
                )}
              />
              <div
                className={cn(
                  "h-8 w-16 rounded-md",
                  isDark ? "bg-white/15" : "bg-black/10"
                )}
              />
            </div>
          </div>

          <div className={cn("rounded-xl border p-4", surfaceClass)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">色块/图表</div>
              <div className={cn("text-[10px]", mutedTextClass)}>
                便于看饱和度
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex h-10 overflow-hidden rounded-lg">
                <div
                  className={cn(
                    "flex-1",
                    isDark ? "bg-cyan-400/35" : "bg-cyan-500/45"
                  )}
                />
                <div
                  className={cn(
                    "flex-1",
                    isDark ? "bg-fuchsia-400/30" : "bg-fuchsia-500/40"
                  )}
                />
                <div
                  className={cn(
                    "flex-1",
                    isDark ? "bg-amber-400/30" : "bg-amber-500/40"
                  )}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-12 rounded-lg",
                      isDark ? "bg-white/10" : "bg-black/5"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cn("mt-4 rounded-xl border p-4", surfaceClass)}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">提示</div>
              <div className={cn("mt-1 text-xs", mutedTextClass)}>
                推荐先把 coverColor 设为与背景一致（白/黑），再调 blur、dotFade
                观察差异。
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-9 rounded-lg",
                  isDark ? "bg-white/10" : "bg-black/5"
                )}
              />
              <div
                className={cn(
                  "size-9 rounded-lg",
                  isDark ? "bg-white/5" : "bg-black/5"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 标签：左侧 DotGlass / 右侧原始 */}
      <div
        className={cn(
          "absolute left-3 top-3 z-30 rounded-full border px-2 py-1 text-[11px] backdrop-blur",
          labelLeftClass
        )}
      >
        DotGlass
      </div>
      <div
        className={cn(
          "absolute right-3 top-3 z-30 rounded-full border px-2 py-1 text-[11px] backdrop-blur",
          labelRightClass
        )}
      >
        原始
      </div>

      {/* DotGlass 覆盖层：左侧覆盖 split% 宽度 */}
      <DotGlass
        absolute
        className="left-0 inset-y-0 pointer-events-none"
        style={{ width: `${split}%` }}
        coverColor={coverColor}
        {...dotGlassBaseProps}
      />

      {/* 分割线 + 拖拽手柄 */}
      <div
        className="absolute inset-y-0 z-40 w-10 -translate-x-1/2 cursor-col-resize touch-none select-none"
        style={{ left: `${split}%` }}
        role="slider"
        tabIndex={0}
        aria-label={isDark ? "对比滑块（黑底场景）" : "对比滑块（白底场景）"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={split}
        onPointerDown={onPointerDownHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerUp={onPointerUpHandler}
        onPointerCancel={onPointerUpHandler}
        onKeyDown={onKeyDownHandler}
      >
        <div
          className={cn(
            "absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 shadow-sm",
            handleLineClass
          )}
        />
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-2 shadow-sm backdrop-blur",
            handleKnobClass
          )}
        >
          <div className="flex items-center gap-1">
            <div className={cn("h-4 w-px", handleGripClass)} />
            <div className={cn("h-4 w-px", handleGripClass)} />
          </div>
        </div>
      </div>
    </div>
  );
};
