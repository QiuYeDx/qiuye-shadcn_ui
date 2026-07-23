"use client";

import * as React from "react";
import {
  CaseUpperIcon,
  CircleDotIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import {
  AsciiEffect,
  createCellRenderer,
  createLevelsTransform,
  createLuminanceMapper,
  createThresholdTransform,
  DotMatrixEffect,
  MatrixEffect,
  type MatrixGridConfig,
  type MatrixImageSource,
  type MatrixRenderCell,
  type MatrixSignalTransform,
} from "@/components/qiuye-ui/matrix-effect";
import {
  SegmentedControl,
  type SegmentedControlItem,
} from "@/components/qiuye-ui/segmented-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DemoScene = "dot" | "ascii" | "custom";
type AsciiColorMode = "fixed" | "source";
type CustomTransformMode = "continuous" | "threshold";
type CustomRendererMode = "tiles" | "bars";

const ASCII_IMAGE_SOURCE = {
  type: "image",
  src: "/examples/matrix-effect/source.webp",
  fit: "contain",
  background: null,
} satisfies MatrixImageSource;

const CUSTOM_LUMINANCE_MAPPER = createLuminanceMapper();
const CUSTOM_LEVELS_TRANSFORM = createLevelsTransform({
  contrast: 1.15,
  gamma: 0.9,
});

const ASCII_COLOR_MODE_ITEMS: SegmentedControlItem[] = [
  { value: "fixed", label: "固定色" },
  { value: "source", label: "源图色" },
];

const CUSTOM_TRANSFORM_ITEMS: SegmentedControlItem[] = [
  { value: "continuous", label: "连续" },
  { value: "threshold", label: "阈值" },
];

const CUSTOM_RENDERER_ITEMS: SegmentedControlItem[] = [
  { value: "tiles", label: "方块" },
  { value: "bars", label: "柱形" },
];

function PreviewFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-[#09090b] px-6 text-center text-sm text-zinc-400">
      示例图像加载失败
    </div>
  );
}

function ControlValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground text-xs tabular-nums">
      {children}
    </span>
  );
}

function DotScene() {
  const [cellSize, setCellSize] = React.useState(10);
  const [maximumRadius, setMaximumRadius] = React.useState(4.5);
  const [speed, setSpeed] = React.useState(0.24);
  const [contrast, setContrast] = React.useState(1.25);
  const [invert, setInvert] = React.useState(false);

  const blobOptions = React.useMemo(
    () => ({
      count: 4,
      minRadius: 0.18,
      maxRadius: 0.48,
      speed,
      baseValue: 0.025,
      seed: 17,
    }),
    [speed],
  );
  const radiusRange = React.useMemo(
    () => [0.25, maximumRadius] as const,
    [maximumRadius],
  );
  const levels = React.useMemo(() => ({ contrast }), [contrast]);
  const grid = React.useMemo<MatrixGridConfig>(
    () => ({ mode: "auto", cellSize, maxCells: 7_000 }),
    [cellSize],
  );

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <div className="aspect-[4/3] min-w-0 overflow-hidden rounded-md border bg-[#09090b] sm:aspect-video">
        <DotMatrixEffect
          className="h-full w-full"
          blobOptions={blobOptions}
          radiusRange={radiusRange}
          levels={levels}
          grid={grid}
          invert={invert}
          color="#f4f4f5"
          backgroundColor="#09090b"
          decorative={false}
          ariaLabel="缓慢流动的柔和光团圆点矩阵"
        />
      </div>

      <div className="min-w-0 space-y-5 lg:border-l lg:pl-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>单元格尺寸</Label>
            <ControlValue>{cellSize}px</ControlValue>
          </div>
          <Slider
            aria-label="圆点矩阵单元格尺寸"
            value={[cellSize]}
            min={6}
            max={18}
            step={1}
            onValueChange={(value) => setCellSize(value[0] ?? 10)}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>最大半径</Label>
            <ControlValue>{maximumRadius.toFixed(1)}px</ControlValue>
          </div>
          <Slider
            aria-label="圆点最大半径"
            value={[maximumRadius]}
            min={1}
            max={8}
            step={0.5}
            onValueChange={(value) => setMaximumRadius(value[0] ?? 4.5)}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>速度</Label>
            <ControlValue>{speed.toFixed(2)}</ControlValue>
          </div>
          <Slider
            aria-label="柔和光团移动速度"
            value={[speed]}
            min={0}
            max={0.8}
            step={0.02}
            onValueChange={(value) => setSpeed(value[0] ?? 0.24)}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>对比度</Label>
            <ControlValue>{contrast.toFixed(2)}</ControlValue>
          </div>
          <Slider
            aria-label="圆点矩阵对比度"
            value={[contrast]}
            min={0.5}
            max={2}
            step={0.05}
            onValueChange={(value) => setContrast(value[0] ?? 1.25)}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="matrix-dot-invert">反相</Label>
          <Switch
            id="matrix-dot-invert"
            checked={invert}
            onCheckedChange={setInvert}
          />
        </div>
      </div>
    </div>
  );
}

function AsciiScene() {
  const [cellSize, setCellSize] = React.useState(10);
  const [characters, setCharacters] = React.useState(" .,:;i1tfLCG08@");
  const [invert, setInvert] = React.useState(false);
  const [colorMode, setColorMode] = React.useState<AsciiColorMode>("source");

  const grid = React.useMemo<MatrixGridConfig>(
    () => ({ mode: "auto", cellSize, maxCells: 6_000 }),
    [cellSize],
  );

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <div className="aspect-[4/3] min-w-0 overflow-hidden rounded-md border bg-[#09090b] sm:aspect-video">
        <AsciiEffect
          className="h-full w-full"
          source={ASCII_IMAGE_SOURCE}
          characters={characters}
          colorMode={colorMode}
          color="#fb7185"
          backgroundColor="#09090b"
          grid={grid}
          invert={invert}
          decorative={false}
          ariaLabel="由彩色示例图像转换得到的 ASCII 字符图形"
          fallback={<PreviewFallback />}
        />
      </div>

      <div className="min-w-0 space-y-5 lg:border-l lg:pl-5">
        <div className="space-y-2.5">
          <Label htmlFor="matrix-ascii-characters">字符集</Label>
          <Input
            id="matrix-ascii-characters"
            className="font-mono"
            value={characters}
            onChange={(event) => setCharacters(event.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>单元格尺寸</Label>
            <ControlValue>{cellSize}px</ControlValue>
          </div>
          <Slider
            aria-label="ASCII 单元格尺寸"
            value={[cellSize]}
            min={7}
            max={18}
            step={1}
            onValueChange={(value) => setCellSize(value[0] ?? 10)}
          />
        </div>

        <div className="space-y-2.5">
          <Label>颜色模式</Label>
          <SegmentedControl
            aria-label="ASCII 颜色模式"
            size="sm"
            variant="contained"
            fullWidth
            value={colorMode}
            items={ASCII_COLOR_MODE_ITEMS}
            onValueChange={(value) => setColorMode(value as AsciiColorMode)}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="matrix-ascii-invert">反相</Label>
          <Switch
            id="matrix-ascii-invert"
            checked={invert}
            onCheckedChange={setInvert}
          />
        </div>
      </div>
    </div>
  );
}

function CustomScene() {
  const [cellSize, setCellSize] = React.useState(12);
  const [threshold, setThreshold] = React.useState(0.48);
  const [transformMode, setTransformMode] =
    React.useState<CustomTransformMode>("continuous");
  const [rendererMode, setRendererMode] =
    React.useState<CustomRendererMode>("tiles");

  const thresholdTransform = React.useMemo(
    () => createThresholdTransform({ threshold, softness: 0.06 }),
    [threshold],
  );
  const transforms = React.useMemo<readonly MatrixSignalTransform[]>(
    () =>
      transformMode === "threshold"
        ? [CUSTOM_LEVELS_TRANSFORM, thresholdTransform]
        : [CUSTOM_LEVELS_TRANSFORM],
    [thresholdTransform, transformMode],
  );
  const drawCell = React.useCallback(
    (ctx: CanvasRenderingContext2D, cell: Readonly<MatrixRenderCell>) => {
      if (cell.index === 0) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#2dd4bf";
      }

      if (cell.a === 0 || cell.value <= 0.02) return;

      ctx.globalAlpha = cell.a / 255;

      if (rendererMode === "tiles") {
        const shortSide = Math.min(cell.width, cell.height);
        const size = shortSide * (0.16 + cell.value * 0.78);
        ctx.fillRect(
          cell.centerX - size / 2,
          cell.centerY - size / 2,
          size,
          size,
        );
        return;
      }

      const width = cell.width * 0.48;
      const height = cell.height * cell.value;
      ctx.fillRect(
        cell.centerX - width / 2,
        cell.y + cell.height - height,
        width,
        height,
      );
    },
    [rendererMode],
  );
  const renderer = React.useMemo(
    () =>
      createCellRenderer(drawCell, {
        cellAspectRatio: 1,
        preferredFrameRate: 30,
      }),
    [drawCell],
  );
  const grid = React.useMemo<MatrixGridConfig>(
    () => ({ mode: "auto", cellSize, maxCells: 5_000 }),
    [cellSize],
  );

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <div className="aspect-[4/3] min-w-0 overflow-hidden rounded-md border bg-[#09090b] sm:aspect-video">
        <MatrixEffect
          className="h-full w-full"
          source={ASCII_IMAGE_SOURCE}
          mapper={CUSTOM_LUMINANCE_MAPPER}
          transforms={transforms}
          renderer={renderer}
          grid={grid}
          clearColor="#09090b"
          decorative={false}
          ariaLabel="使用自定义信号转换与逐格绘制器生成的矩阵图形"
          fallback={<PreviewFallback />}
        />
      </div>

      <div className="min-w-0 space-y-5 lg:border-l lg:pl-5">
        <div className="space-y-2.5">
          <Label>转换模式</Label>
          <SegmentedControl
            aria-label="自定义信号转换模式"
            size="sm"
            variant="contained"
            fullWidth
            value={transformMode}
            items={CUSTOM_TRANSFORM_ITEMS}
            onValueChange={(value) =>
              setTransformMode(value as CustomTransformMode)
            }
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>阈值</Label>
            <ControlValue>{threshold.toFixed(2)}</ControlValue>
          </div>
          <Slider
            aria-label="自定义转换阈值"
            value={[threshold]}
            min={0.1}
            max={0.9}
            step={0.02}
            disabled={transformMode !== "threshold"}
            onValueChange={(value) => setThreshold(value[0] ?? 0.48)}
          />
        </div>

        <div className="space-y-2.5">
          <Label>绘制模式</Label>
          <SegmentedControl
            aria-label="自定义单元格绘制模式"
            size="sm"
            variant="contained"
            fullWidth
            value={rendererMode}
            items={CUSTOM_RENDERER_ITEMS}
            onValueChange={(value) =>
              setRendererMode(value as CustomRendererMode)
            }
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label>单元格尺寸</Label>
            <ControlValue>{cellSize}px</ControlValue>
          </div>
          <Slider
            aria-label="自定义管线单元格尺寸"
            value={[cellSize]}
            min={7}
            max={20}
            step={1}
            onValueChange={(value) => setCellSize(value[0] ?? 12)}
          />
        </div>
      </div>
    </div>
  );
}

export function MatrixEffectDemo() {
  const [scene, setScene] = React.useState<DemoScene>("dot");

  return (
    <Card className="overflow-hidden">
      <Tabs
        className="gap-0"
        value={scene}
        onValueChange={(value) => setScene(value as DemoScene)}
      >
        <CardHeader className="gap-4 p-4 sm:p-6">
          <CardTitle className="text-lg tracking-normal">
            Matrix Effect
          </CardTitle>
          <TabsList className="grid h-auto w-full grid-cols-3">
            <TabsTrigger value="dot">
              <CircleDotIcon />
              圆点
            </TabsTrigger>
            <TabsTrigger value="ascii">
              <CaseUpperIcon />
              ASCII
            </TabsTrigger>
            <TabsTrigger value="custom">
              <SlidersHorizontalIcon />
              自定义
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <TabsContent value="dot">
            <DotScene />
          </TabsContent>
          <TabsContent value="ascii">
            <AsciiScene />
          </TabsContent>
          <TabsContent value="custom">
            <CustomScene />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
