"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  createMatrixSourceAdapter,
  createMatrixSourceSampleError,
  type MatrixSourceAdapter,
} from "./sources";
import { createLuminanceMapper } from "./transforms";
import type {
  MatrixEffectError,
  MatrixEffectHandle,
  MatrixEffectProps,
  MatrixEffectStatus,
  MatrixFrame,
  MatrixFrameContext,
  MatrixGridConfig,
  MatrixRenderer,
  MatrixSignalMapper,
  MatrixSignalTransform,
  MatrixSource,
} from "./types";

const DEFAULT_CELL_SIZE = 10;
const DEFAULT_CELL_ASPECT_RATIO = 1;
const DEFAULT_MAX_CELLS = 10_000;
const DEFAULT_MAX_DPR = 2;
const MAX_BACKING_STORE_PIXELS = 4_194_304;
const MAX_BACKING_STORE_DIMENSION = 16_384;
const LARGE_GRID_WARNING_THRESHOLD = 100_000;
const TRANSPARENT_FILL = "rgba(0, 0, 0, 0)";
const EMPTY_RGBA = new Uint8ClampedArray(0);
const EMPTY_TRANSFORMS: readonly MatrixSignalTransform[] = [];
const DEFAULT_MAPPER = createLuminanceMapper();
const UNSET_SOURCE = Symbol("matrix-effect-unset-source");
const NOOP = () => {};
const warnedIssues = new Set<string>();

interface NormalizedGridConfig {
  readonly mode: "auto" | "fixed";
  readonly cellSize: number;
  readonly columns: number | null;
  readonly rows: number | null;
  readonly cellAspectRatio: number;
  readonly maxCells: number;
  readonly signature: string;
}

/** MatrixEffect 内部计算后的网格几何；不会从公共入口导出 */
export interface MatrixResolvedGrid {
  /** 当前列数 */
  readonly columns: number;
  /** 当前行数 */
  readonly rows: number;
  /** 实际单元格 CSS 宽度 */
  readonly cellWidth: number;
  /** 实际单元格 CSS 高度 */
  readonly cellHeight: number;
  /** 本次网格使用的目标单元格宽高比 */
  readonly cellAspectRatio: number;
}

/** MatrixEffect 内部计算后的可见 Canvas backing store；不会从公共入口导出 */
export interface MatrixCanvasMetrics {
  /** 受 maxDpr、像素预算和单轴预算限制后的名义 DPR */
  readonly dpr: number;
  /** backing store 整数宽度 */
  readonly backingWidth: number;
  /** backing store 整数高度 */
  readonly backingHeight: number;
  /** CSS x 坐标到 backing store 的实际缩放 */
  readonly scaleX: number;
  /** CSS y 坐标到 backing store 的实际缩放 */
  readonly scaleY: number;
}

interface MatrixSize {
  cssWidth: number;
  cssHeight: number;
  devicePixelRatio: number;
}

interface CanvasSurface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

interface MutableMatrixFrame {
  columns: number;
  rows: number;
  rgba: Uint8ClampedArray;
  values: Float32Array;
  previousValues: Float32Array | null;
}

interface MutableMatrixFrameContext {
  time: number;
  deltaTime: number;
  frame: number;
  cssWidth: number;
  cssHeight: number;
  cellWidth: number;
  cellHeight: number;
  dpr: number;
}

interface MutableProceduralContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  columns: number;
  rows: number;
  time: number;
  deltaTime: number;
  frame: number;
}

function createMutableProceduralContext(): MutableProceduralContext {
  return {
    ctx: null as unknown as CanvasRenderingContext2D,
    width: 0,
    height: 0,
    columns: 0,
    rows: 0,
    time: 0,
    deltaTime: 0,
    frame: 0,
  };
}

interface MatrixFrameBuffers {
  columns: number;
  rows: number;
  values: Float32Array;
  previousValues: Float32Array;
  hasPreviousValues: boolean;
  frame: MutableMatrixFrame;
}

interface MatrixLifecycleCallbacks {
  onStatusChange?: (status: MatrixEffectStatus) => void;
  onReady?: () => void;
  onError?: (error: MatrixEffectError) => void;
}

interface RendererLease {
  renderer: MatrixRenderer;
  token: object;
}

function isDevelopment() {
  return (
    typeof process !== "undefined" && process.env.NODE_ENV === "development"
  );
}

function warnOnce(issue: string, message: string) {
  if (!isDevelopment() || warnedIssues.has(issue)) {
    return;
  }

  warnedIssues.add(issue);
  console.warn(`[MatrixEffect] ${message}`);
}

function reportLifecycleFailure(name: string, cause: unknown) {
  if (!isDevelopment()) {
    return;
  }

  console.error(`[MatrixEffect] ${name} 回调执行失败。`, cause);
}

function reportRendererDisposeFailure(cause: unknown) {
  if (!isDevelopment()) {
    return;
  }

  console.error("[MatrixEffect] Renderer dispose() 执行失败。", cause);
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}

function consumeThenableRejection(value: PromiseLike<unknown>) {
  try {
    void Promise.resolve(value).catch(NOOP);
  } catch {
    // then getter 异常会由同步管线错误处理；这里只负责避免 rejection 外泄。
  }
}

function createAsyncContractError(
  value: unknown,
  message: string,
): TypeError | null {
  if (!isThenable(value)) {
    return null;
  }

  consumeThenableRejection(value);
  return new TypeError(message);
}

function observeLifecycleResult(name: string, value: unknown) {
  if (!isThenable(value)) {
    return;
  }

  try {
    void Promise.resolve(value).catch((cause) => {
      reportLifecycleFailure(name, cause);
    });
  } catch (cause) {
    reportLifecycleFailure(name, cause);
  }
}

function enqueueMicrotask(callback: () => void) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback);
    return;
  }

  void Promise.resolve().then(callback);
}

function normalizePositiveNumber(
  value: number | undefined,
  fallback: number,
  issue: string,
  message: string,
) {
  if (value === undefined) {
    return fallback;
  }

  if (Number.isFinite(value) && value > 0) {
    return value;
  }

  warnOnce(issue, message);
  return fallback;
}

function normalizeOptionalGridDimension(
  value: number | undefined,
  issue: string,
  message: string,
): number | null {
  if (value === undefined) {
    return null;
  }

  if (!Number.isFinite(value) || value <= 0) {
    warnOnce(issue, message);
    return null;
  }

  return Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, Math.round(value)));
}

function normalizeGridConfigValues(
  mode: MatrixGridConfig["mode"] | undefined,
  cellSize: number | undefined,
  columns: number | undefined,
  rows: number | undefined,
  gridCellAspectRatio: number | undefined,
  maxCells: number | undefined,
  rendererCellAspectRatio: number | undefined,
): NormalizedGridConfig {
  const resolvedMode = mode === "fixed" ? "fixed" : "auto";
  const rendererAspectRatio = normalizePositiveNumber(
    rendererCellAspectRatio,
    DEFAULT_CELL_ASPECT_RATIO,
    "renderer-cell-aspect-ratio",
    "Renderer cellAspectRatio 必须是有限正数；已回退到 1。",
  );
  const cellAspectRatio = normalizePositiveNumber(
    gridCellAspectRatio,
    rendererAspectRatio,
    "grid-cell-aspect-ratio",
    "grid.cellAspectRatio 必须是有限正数；已回退到 Renderer 建议值。",
  );
  const resolvedCellSize = normalizePositiveNumber(
    cellSize,
    DEFAULT_CELL_SIZE,
    "grid-cell-size",
    "grid.cellSize 必须是有限正数；已回退到 10。",
  );
  const resolvedColumns =
    resolvedMode === "fixed"
      ? normalizeOptionalGridDimension(
          columns,
          "grid-columns",
          "fixed grid.columns 必须是有限正数；已回退到 auto 的 10px 推导。",
        )
      : null;
  const resolvedRows =
    resolvedMode === "fixed"
      ? normalizeOptionalGridDimension(
          rows,
          "grid-rows",
          "fixed grid.rows 必须是有限正数；已按未传处理。",
        )
      : null;
  const resolvedMaxCells = Math.max(
    1,
    Math.min(
      Number.MAX_SAFE_INTEGER,
      Math.floor(
        normalizePositiveNumber(
          maxCells,
          DEFAULT_MAX_CELLS,
          "grid-max-cells",
          "grid.maxCells 必须是有限正数；已回退到 10000。",
        ),
      ),
    ),
  );

  if (resolvedMaxCells > LARGE_GRID_WARNING_THRESHOLD) {
    warnOnce(
      "grid-large-max-cells",
      `grid.maxCells=${resolvedMaxCells} 可能造成明显主线程压力。`,
    );
  }

  return {
    mode: resolvedMode,
    cellSize: resolvedCellSize,
    columns: resolvedColumns,
    rows: resolvedRows,
    cellAspectRatio,
    maxCells: resolvedMaxCells,
    signature: [
      resolvedMode,
      resolvedCellSize,
      resolvedColumns ?? "auto",
      resolvedRows ?? "auto",
      cellAspectRatio,
      resolvedMaxCells,
    ].join(":"),
  };
}

function fitsWithinCellLimit(columns: number, rows: number, maxCells: number) {
  return columns <= Math.floor(maxCells / rows);
}

function constrainGridToCellLimit(
  columns: number,
  rows: number,
  maxCells: number,
) {
  if (fitsWithinCellLimit(columns, rows, maxCells)) {
    return { columns, rows };
  }

  const scale = Math.sqrt(maxCells / (columns * rows));
  const scaledColumns = columns * scale;
  const scaledRows = rows * scale;

  if (scaledColumns < 1) {
    return {
      columns: 1,
      rows: Math.max(1, Math.min(rows, maxCells)),
    };
  }

  if (scaledRows < 1) {
    return {
      columns: Math.max(1, Math.min(columns, maxCells)),
      rows: 1,
    };
  }

  let nextColumns = Math.max(1, Math.floor(scaledColumns));
  let nextRows = Math.max(1, Math.floor(scaledRows));

  if (!fitsWithinCellLimit(nextColumns, nextRows, maxCells)) {
    if (nextColumns >= nextRows) {
      nextColumns = Math.max(1, Math.floor(maxCells / nextRows));
    } else {
      nextRows = Math.max(1, Math.floor(maxCells / nextColumns));
    }
  }

  return { columns: nextColumns, rows: nextRows };
}

function resolveNormalizedMatrixGrid(
  cssWidth: number,
  cssHeight: number,
  config: NormalizedGridConfig,
): MatrixResolvedGrid | null {
  if (
    !Number.isFinite(cssWidth) ||
    !Number.isFinite(cssHeight) ||
    cssWidth <= 0 ||
    cssHeight <= 0
  ) {
    return null;
  }

  let columns =
    config.mode === "fixed" && config.columns !== null
      ? config.columns
      : Math.max(1, Math.round(cssWidth / config.cellSize));
  let rows =
    config.mode === "fixed" && config.rows !== null
      ? config.rows
      : Math.max(
          1,
          Math.round((columns * config.cellAspectRatio * cssHeight) / cssWidth),
        );

  ({ columns, rows } = constrainGridToCellLimit(
    columns,
    rows,
    config.maxCells,
  ));

  if (
    columns > MAX_BACKING_STORE_DIMENSION ||
    rows > MAX_BACKING_STORE_DIMENSION
  ) {
    warnOnce(
      "grid-canvas-dimension",
      `网格单轴不能超过 ${MAX_BACKING_STORE_DIMENSION}；已按 Canvas 安全上限收缩。`,
    );
    columns = Math.min(columns, MAX_BACKING_STORE_DIMENSION);
    rows = Math.min(rows, MAX_BACKING_STORE_DIMENSION);
  }

  return {
    columns,
    rows,
    cellWidth: cssWidth / columns,
    cellHeight: cssHeight / rows,
    cellAspectRatio: config.cellAspectRatio,
  };
}

/**
 * 解析 MatrixEffect 的响应式或固定网格
 *
 * 该函数是内部确定性几何入口，不从组件公共 index 导出。
 */
export function resolveMatrixGrid(
  cssWidth: number,
  cssHeight: number,
  grid?: MatrixGridConfig,
  rendererCellAspectRatio?: number,
): MatrixResolvedGrid | null {
  const config = normalizeGridConfigValues(
    grid?.mode,
    grid?.cellSize,
    grid?.columns,
    grid?.rows,
    grid?.cellAspectRatio,
    grid?.maxCells,
    rendererCellAspectRatio,
  );

  return resolveNormalizedMatrixGrid(cssWidth, cssHeight, config);
}

function normalizeMaxDpr(maxDpr: number | undefined) {
  return normalizePositiveNumber(
    maxDpr,
    DEFAULT_MAX_DPR,
    "max-dpr",
    "maxDpr 必须是有限正数；已回退到 2。",
  );
}

/**
 * 解析受 DPR、总像素和单轴尺寸预算保护的 Canvas backing store
 *
 * 该函数不读取 window，可用于 SSR 安全的确定性验证。
 */
export function resolveMatrixCanvasMetrics(
  cssWidth: number,
  cssHeight: number,
  maxDpr: number = DEFAULT_MAX_DPR,
  devicePixelRatio: number = 1,
): MatrixCanvasMetrics | null {
  if (
    !Number.isFinite(cssWidth) ||
    !Number.isFinite(cssHeight) ||
    cssWidth <= 0 ||
    cssHeight <= 0
  ) {
    return null;
  }

  const resolvedMaxDpr = normalizeMaxDpr(maxDpr);
  const resolvedDeviceDpr =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1;
  const cssPixels = cssWidth * cssHeight;
  const pixelBudgetDpr = Math.sqrt(MAX_BACKING_STORE_PIXELS / cssPixels);
  const widthBudgetDpr = MAX_BACKING_STORE_DIMENSION / cssWidth;
  const heightBudgetDpr = MAX_BACKING_STORE_DIMENSION / cssHeight;
  const dpr = Math.min(
    resolvedDeviceDpr,
    resolvedMaxDpr,
    pixelBudgetDpr,
    widthBudgetDpr,
    heightBudgetDpr,
  );
  let backingWidth = Math.max(1, Math.round(cssWidth * dpr));
  let backingHeight = Math.max(1, Math.round(cssHeight * dpr));

  backingWidth = Math.min(backingWidth, MAX_BACKING_STORE_DIMENSION);
  backingHeight = Math.min(backingHeight, MAX_BACKING_STORE_DIMENSION);

  if (backingWidth > Math.floor(MAX_BACKING_STORE_PIXELS / backingHeight)) {
    const correction = Math.sqrt(
      MAX_BACKING_STORE_PIXELS / (backingWidth * backingHeight),
    );
    backingWidth = Math.max(1, Math.floor(backingWidth * correction));
    backingHeight = Math.max(1, Math.floor(backingHeight * correction));

    if (backingWidth > Math.floor(MAX_BACKING_STORE_PIXELS / backingHeight)) {
      if (backingWidth >= backingHeight) {
        backingWidth = Math.max(
          1,
          Math.floor(MAX_BACKING_STORE_PIXELS / backingHeight),
        );
      } else {
        backingHeight = Math.max(
          1,
          Math.floor(MAX_BACKING_STORE_PIXELS / backingWidth),
        );
      }
    }
  }

  return {
    dpr,
    backingWidth,
    backingHeight,
    scaleX: backingWidth / cssWidth,
    scaleY: backingHeight / cssHeight,
  };
}

/** 把完整 Transform 链的输出原地规范到有限的 0..1 区间 */
export function normalizeMatrixSignalValues(values: Float32Array) {
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (!Number.isFinite(value) || value <= 0) {
      values[index] = 0;
    } else if (value >= 1) {
      values[index] = 1;
    }
  }
}

function createMatrixEffectError(
  code: MatrixEffectError["code"],
  message: string,
  recoverable: boolean,
  cause?: unknown,
): MatrixEffectError {
  return {
    code,
    message,
    recoverable,
    ...(cause === undefined ? {} : { cause }),
  };
}

function createInternalCanvasSurface(
  contextOptions?: CanvasRenderingContext2DSettings,
): CanvasSurface | null {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", contextOptions);

  return ctx === null ? null : { canvas, ctx };
}

function resetFrameHistory(buffers: MatrixFrameBuffers | null) {
  if (buffers !== null) {
    buffers.hasPreviousValues = false;
    buffers.frame.previousValues = null;
  }
}

function safelyRestoreContext(ctx: CanvasRenderingContext2D) {
  try {
    ctx.restore();
    return null;
  } catch (cause) {
    return cause;
  }
}

function clearCanvasPixels(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  clearColor: string | null,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  if (clearColor !== null) {
    ctx.fillStyle = TRANSPARENT_FILL;
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * MatrixEffect — 通用视觉矩阵渲染核心
 *
 * 提供可组合的低分辨率采样场管线：
 * - 响应式计算 columns x rows，并限制单元格数与 Canvas backing store
 * - 统一图片、Canvas 和程序化 Source，经 Mapper / Transform 输出信号场
 * - 使用 staging Canvas 事务性提交 Renderer 结果，错误时保留上一成功画面
 * - 暴露稳定 handle 读取 Canvas，并合并静态 invalidate 请求
 * - 提供结构化状态、错误、fallback 和 Canvas 无障碍语义
 *
 * @example
 * ```tsx
 * const renderer = {
 *   render(ctx, frame, context) {
 *     ctx.fillStyle = "#18181b";
 *     ctx.fillRect(0, 0, context.cssWidth, context.cssHeight);
 *   },
 * };
 *
 * <MatrixEffect
 *   className="aspect-video w-full"
 *   source={{ type: "image", src: "/example.webp" }}
 *   renderer={renderer}
 * />;
 * ```
 */
export const MatrixEffect = React.forwardRef<
  MatrixEffectHandle,
  MatrixEffectProps
>(function MatrixEffect(
  {
    source,
    renderer,
    mapper = DEFAULT_MAPPER,
    transforms = EMPTY_TRANSFORMS,
    grid,
    playing: unusedPlaying,
    frameRate: unusedFrameRate,
    maxDpr = DEFAULT_MAX_DPR,
    pauseWhenOffscreen: unusedPauseWhenOffscreen,
    reducedMotion: unusedReducedMotion,
    clearColor = null,
    canvasClassName,
    decorative = true,
    ariaLabel,
    fallback,
    onStatusChange,
    onReady,
    onError,
    className,
    style,
    ...rootProps
  },
  ref,
) {
  // FE-2 将消费这些调度配置；FE-1 先阻止它们透传到根 DOM。
  void unusedPlaying;
  void unusedFrameRate;
  void unusedPauseWhenOffscreen;
  void unusedReducedMotion;

  const requestedGridMode = grid?.mode === "fixed" ? "fixed" : "auto";
  const requestedCellSize =
    requestedGridMode === "auto" ? grid?.cellSize : undefined;
  const requestedColumns =
    requestedGridMode === "fixed" ? grid?.columns : undefined;
  const requestedRows = requestedGridMode === "fixed" ? grid?.rows : undefined;
  const requestedGridAspectRatio = grid?.cellAspectRatio;
  const requestedMaxCells = grid?.maxCells;
  const rendererCellAspectRatio = renderer.cellAspectRatio;
  const normalizedGrid = React.useMemo(
    () =>
      normalizeGridConfigValues(
        requestedGridMode,
        requestedCellSize,
        requestedColumns,
        requestedRows,
        requestedGridAspectRatio,
        requestedMaxCells,
        rendererCellAspectRatio,
      ),
    [
      rendererCellAspectRatio,
      requestedCellSize,
      requestedColumns,
      requestedGridAspectRatio,
      requestedGridMode,
      requestedMaxCells,
      requestedRows,
    ],
  );
  const normalizedMaxDpr = normalizeMaxDpr(maxDpr);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const visibleSurfaceRef = React.useRef<CanvasSurface | null>(null);
  const stagingSurfaceRef = React.useRef<CanvasSurface | null>(null);
  const samplingSurfaceRef = React.useRef<CanvasSurface | null>(null);
  const sourceAdapterRef = React.useRef<MatrixSourceAdapter | null>(null);
  const buffersRef = React.useRef<MatrixFrameBuffers | null>(null);
  const sizeRef = React.useRef<MatrixSize>({
    cssWidth: 0,
    cssHeight: 0,
    devicePixelRatio: 1,
  });
  const frameContextRef = React.useRef<MutableMatrixFrameContext>({
    time: 0,
    deltaTime: 0,
    frame: 0,
    cssWidth: 0,
    cssHeight: 0,
    cellWidth: 0,
    cellHeight: 0,
    dpr: 1,
  });
  const proceduralContextRef = React.useRef<MutableProceduralContext>(
    createMutableProceduralContext(),
  );
  const mapperRef = React.useRef<MatrixSignalMapper>(mapper);
  const transformsRef =
    React.useRef<readonly MatrixSignalTransform[]>(transforms);
  const rendererRef = React.useRef<MatrixRenderer>(renderer);
  const gridConfigRef = React.useRef(normalizedGrid);
  const maxDprRef = React.useRef(normalizedMaxDpr);
  const clearColorRef = React.useRef<string | null>(clearColor);
  const rendererVersionRef = React.useRef(0);
  const stagingVersionRef = React.useRef(0);
  const pipelineGenerationRef = React.useRef(0);
  const preparedRendererKeyRef = React.useRef<string | null>(null);
  const activeRendererLeaseRef = React.useRef<RendererLease | null>(null);
  const sourceIdentityRef = React.useRef<MatrixSource | typeof UNSET_SOURCE>(
    UNSET_SOURCE,
  );
  const sourceEpochRef = React.useRef(0);
  const readyEpochRef = React.useRef(-1);
  const successfulFrameRef = React.useRef(0);
  const errorLockRef = React.useRef<MatrixEffectError | null>(null);
  const dirtyRef = React.useRef(true);
  const dirtyGenerationRef = React.useRef(0);
  const mountedRef = React.useRef(false);
  const frameRequestRef = React.useRef<number | null>(null);
  const drawFrameRef = React.useRef<() => void>(() => {});
  const invalidateRef = React.useRef<() => void>(() => {});
  const callbacksRef = React.useRef<MatrixLifecycleCallbacks>({
    onStatusChange,
    onReady,
    onError,
  });
  const statusRef = React.useRef<MatrixEffectStatus>("idle");
  const hasEverSuccessfulFrameRef = React.useRef(false);
  const [status, setStatus] = React.useState<MatrixEffectStatus>("idle");
  const [hasEverSuccessfulFrame, setHasEverSuccessfulFrame] =
    React.useState(false);

  const discardSamplingResources = React.useCallback(() => {
    samplingSurfaceRef.current = null;
    // 旧异步 Source 只能继续持有旧对象，不能在恢复后取得新的采样 ctx。
    proceduralContextRef.current = createMutableProceduralContext();
  }, []);

  const cancelScheduledFrame = React.useCallback(() => {
    if (
      frameRequestRef.current !== null &&
      typeof window !== "undefined" &&
      typeof window.cancelAnimationFrame === "function"
    ) {
      window.cancelAnimationFrame(frameRequestRef.current);
    }

    frameRequestRef.current = null;
  }, []);

  const updateStatus = React.useCallback((nextStatus: MatrixEffectStatus) => {
    if (statusRef.current === nextStatus) {
      return;
    }

    statusRef.current = nextStatus;
    setStatus(nextStatus);

    try {
      const returnedValue: unknown =
        callbacksRef.current.onStatusChange?.(nextStatus);
      observeLifecycleResult("onStatusChange", returnedValue);
    } catch (cause) {
      reportLifecycleFailure("onStatusChange", cause);
    }
  }, []);

  const getVisibleSurface = React.useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return null;
    }

    const current = visibleSurfaceRef.current;

    if (current?.canvas === canvas) {
      return current;
    }

    const ctx = canvas.getContext("2d");

    if (ctx === null) {
      return null;
    }

    const surface = { canvas, ctx };
    visibleSurfaceRef.current = surface;
    return surface;
  }, []);

  const commitBlankVisibleFrame = React.useCallback(() => {
    if (hasEverSuccessfulFrameRef.current) {
      return;
    }

    const { cssWidth, cssHeight } = sizeRef.current;
    const metrics = resolveMatrixCanvasMetrics(
      cssWidth,
      cssHeight,
      maxDprRef.current,
      typeof window === "undefined" ? 1 : window.devicePixelRatio,
    );

    if (metrics === null) {
      return;
    }

    try {
      const surface = getVisibleSurface();

      if (surface === null) {
        return;
      }

      if (surface.canvas.width !== metrics.backingWidth) {
        surface.canvas.width = metrics.backingWidth;
      }

      if (surface.canvas.height !== metrics.backingHeight) {
        surface.canvas.height = metrics.backingHeight;
      }

      surface.ctx.save();
      clearCanvasPixels(surface.ctx, surface.canvas, clearColorRef.current);
      surface.ctx.restore();
    } catch {
      // 错误兜底绘制属于 best effort，不能递归进入错误上报。
    }
  }, [getVisibleSurface]);

  const handlePipelineError = React.useCallback(
    (error: MatrixEffectError) => {
      if (errorLockRef.current !== null) {
        return;
      }

      errorLockRef.current = error;
      dirtyRef.current = true;
      cancelScheduledFrame();
      commitBlankVisibleFrame();
      updateStatus("error");

      try {
        const returnedValue: unknown = callbacksRef.current.onError?.(error);
        observeLifecycleResult("onError", returnedValue);
      } catch (cause) {
        reportLifecycleFailure("onError", cause);
      }
    },
    [cancelScheduledFrame, commitBlankVisibleFrame, updateStatus],
  );

  const ensureFrameScheduled = React.useCallback(() => {
    const { cssWidth, cssHeight } = sizeRef.current;

    if (
      !mountedRef.current ||
      !dirtyRef.current ||
      errorLockRef.current !== null ||
      sourceAdapterRef.current === null ||
      cssWidth <= 0 ||
      cssHeight <= 0 ||
      frameRequestRef.current !== null ||
      typeof window === "undefined" ||
      typeof window.requestAnimationFrame !== "function"
    ) {
      return;
    }

    frameRequestRef.current = window.requestAnimationFrame(() => {
      frameRequestRef.current = null;
      drawFrameRef.current();
    });
  }, []);

  const markDirty = React.useCallback(() => {
    dirtyRef.current = true;
    dirtyGenerationRef.current += 1;
    ensureFrameScheduled();
  }, [ensureFrameScheduled]);

  const clearRecoverableError = React.useCallback(() => {
    const error = errorLockRef.current;

    if (error !== null && !error.recoverable) {
      return false;
    }

    errorLockRef.current = null;

    if (statusRef.current === "error") {
      updateStatus("idle");
    }

    return true;
  }, [updateStatus]);

  const retryPipeline = React.useCallback(
    (options?: { resetHistory?: boolean; resetRenderer?: boolean }) => {
      pipelineGenerationRef.current += 1;

      if (options?.resetHistory) {
        resetFrameHistory(buffersRef.current);
      }

      if (options?.resetRenderer) {
        preparedRendererKeyRef.current = null;
      }

      clearRecoverableError();
      markDirty();
    },
    [clearRecoverableError, markDirty],
  );

  const performFrame = React.useCallback(() => {
    if (
      !mountedRef.current ||
      !dirtyRef.current ||
      errorLockRef.current !== null
    ) {
      return;
    }

    const frameDirtyGeneration = dirtyGenerationRef.current;
    const framePipelineGeneration = pipelineGenerationRef.current;

    const { cssWidth, cssHeight } = sizeRef.current;

    if (cssWidth <= 0 || cssHeight <= 0) {
      updateStatus("idle");
      return;
    }

    const sourceAdapter = sourceAdapterRef.current;

    if (sourceAdapter === null) {
      updateStatus("idle");
      return;
    }

    const resolvedGrid = resolveNormalizedMatrixGrid(
      cssWidth,
      cssHeight,
      gridConfigRef.current,
    );
    const canvasMetrics = resolveMatrixCanvasMetrics(
      cssWidth,
      cssHeight,
      maxDprRef.current,
      typeof window === "undefined" ? 1 : window.devicePixelRatio,
    );

    if (resolvedGrid === null || canvasMetrics === null) {
      updateStatus("idle");
      return;
    }

    let samplingSurface = samplingSurfaceRef.current;

    try {
      if (samplingSurface === null) {
        samplingSurface = createInternalCanvasSurface({
          willReadFrequently: true,
        });

        if (samplingSurface === null) {
          handlePipelineError(
            createMatrixEffectError(
              "CANVAS_CONTEXT_UNAVAILABLE",
              "MatrixEffect 无法创建采样 Canvas 2D context。",
              false,
            ),
          );
          return;
        }

        samplingSurfaceRef.current = samplingSurface;
      }

      if (samplingSurface.canvas.width !== resolvedGrid.columns) {
        samplingSurface.canvas.width = resolvedGrid.columns;
      }

      if (samplingSurface.canvas.height !== resolvedGrid.rows) {
        samplingSurface.canvas.height = resolvedGrid.rows;
      }
    } catch (cause) {
      discardSamplingResources();
      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 初始化采样 Canvas 失败。",
          true,
          cause,
        ),
      );
      return;
    }

    let buffers = buffersRef.current;

    if (
      buffers === null ||
      buffers.columns !== resolvedGrid.columns ||
      buffers.rows !== resolvedGrid.rows
    ) {
      try {
        const cellCount = resolvedGrid.columns * resolvedGrid.rows;
        const values = new Float32Array(cellCount);
        const previousValues = new Float32Array(cellCount);
        const frame: MutableMatrixFrame = {
          columns: resolvedGrid.columns,
          rows: resolvedGrid.rows,
          rgba: EMPTY_RGBA,
          values,
          previousValues: null,
        };
        buffers = {
          columns: resolvedGrid.columns,
          rows: resolvedGrid.rows,
          values,
          previousValues,
          hasPreviousValues: false,
          frame,
        };
        buffersRef.current = buffers;
        preparedRendererKeyRef.current = null;
      } catch (cause) {
        handlePipelineError(
          createMatrixEffectError(
            "CANVAS_CONTEXT_UNAVAILABLE",
            "MatrixEffect 无法为当前网格分配信号缓冲。",
            true,
            cause,
          ),
        );
        return;
      }
    }

    const proceduralContext = proceduralContextRef.current;
    proceduralContext.ctx = samplingSurface.ctx;
    proceduralContext.width = resolvedGrid.columns;
    proceduralContext.height = resolvedGrid.rows;
    proceduralContext.columns = resolvedGrid.columns;
    proceduralContext.rows = resolvedGrid.rows;
    proceduralContext.time = 0;
    proceduralContext.deltaTime = 0;
    proceduralContext.frame = successfulFrameRef.current;

    let sourceResult: ReturnType<MatrixSourceAdapter["draw"]>;

    try {
      sourceResult = sourceAdapter.draw(proceduralContext);
    } catch (cause) {
      discardSamplingResources();
      handlePipelineError(
        createMatrixEffectError(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect Source adapter 绘制失败。",
          true,
          cause,
        ),
      );
      return;
    }

    if (sourceResult.status === "loading") {
      updateStatus("loading");
      return;
    }

    if (sourceResult.status === "idle") {
      updateStatus("idle");
      return;
    }

    if (sourceResult.status === "error") {
      if (sourceResult.error.code === "SOURCE_RUNTIME_ERROR") {
        discardSamplingResources();
      }

      handlePipelineError(sourceResult.error);
      return;
    }

    let rgba: Uint8ClampedArray;

    try {
      rgba = samplingSurface.ctx.getImageData(
        0,
        0,
        resolvedGrid.columns,
        resolvedGrid.rows,
      ).data;
    } catch (cause) {
      const error = createMatrixSourceSampleError(cause);

      if (error.code === "SOURCE_SECURITY_ERROR") {
        discardSamplingResources();
      }

      handlePipelineError(error);
      return;
    }

    const frame = buffers.frame;
    const frameContext = frameContextRef.current;
    frame.rgba = rgba;
    frame.previousValues = buffers.hasPreviousValues
      ? buffers.previousValues
      : null;
    buffers.values.fill(0);
    frameContext.time = 0;
    frameContext.deltaTime = 0;
    frameContext.frame = successfulFrameRef.current;
    frameContext.cssWidth = cssWidth;
    frameContext.cssHeight = cssHeight;
    frameContext.cellWidth = resolvedGrid.cellWidth;
    frameContext.cellHeight = resolvedGrid.cellHeight;
    frameContext.dpr = canvasMetrics.dpr;

    try {
      const returnedValue: unknown = mapperRef.current(
        frame as MatrixFrame,
        frameContext as MatrixFrameContext,
      );
      const asyncError = createAsyncContractError(
        returnedValue,
        "MatrixEffect Signal Mapper 必须同步完成，不能返回 Promise。",
      );

      if (asyncError !== null) {
        // 异步回调仍可能持有旧 frame；丢弃缓冲以隔离迟到写入。
        buffersRef.current = null;
        throw asyncError;
      }
    } catch (cause) {
      handlePipelineError(
        createMatrixEffectError(
          "MAPPER_RUNTIME_ERROR",
          "MatrixEffect Signal Mapper 执行失败。",
          true,
          cause,
        ),
      );
      return;
    }

    const currentTransforms = transformsRef.current;

    for (let index = 0; index < currentTransforms.length; index += 1) {
      try {
        const returnedValue: unknown = currentTransforms[index](
          frame as MatrixFrame,
          frameContext as MatrixFrameContext,
        );
        const asyncError = createAsyncContractError(
          returnedValue,
          `MatrixEffect Transform[${index}] 必须同步完成，不能返回 Promise。`,
        );

        if (asyncError !== null) {
          buffersRef.current = null;
          throw asyncError;
        }
      } catch (cause) {
        handlePipelineError(
          createMatrixEffectError(
            "TRANSFORM_RUNTIME_ERROR",
            `MatrixEffect Transform[${index}] 执行失败。`,
            true,
            cause,
          ),
        );
        return;
      }
    }

    normalizeMatrixSignalValues(buffers.values);

    let visibleSurface: CanvasSurface | null;

    try {
      visibleSurface = getVisibleSurface();
    } catch (cause) {
      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 获取可见 Canvas 2D context 失败。",
          false,
          cause,
        ),
      );
      return;
    }

    if (visibleSurface === null) {
      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 无法获取可见 Canvas 2D context。",
          false,
        ),
      );
      return;
    }

    let stagingSurface = stagingSurfaceRef.current;

    try {
      if (stagingSurface === null) {
        stagingSurface = createInternalCanvasSurface();

        if (stagingSurface === null) {
          handlePipelineError(
            createMatrixEffectError(
              "CANVAS_CONTEXT_UNAVAILABLE",
              "MatrixEffect 无法创建 staging Canvas 2D context。",
              false,
            ),
          );
          return;
        }

        stagingSurfaceRef.current = stagingSurface;
        stagingVersionRef.current += 1;
        preparedRendererKeyRef.current = null;
      }

      if (stagingSurface.canvas.width !== canvasMetrics.backingWidth) {
        stagingSurface.canvas.width = canvasMetrics.backingWidth;
      }

      if (stagingSurface.canvas.height !== canvasMetrics.backingHeight) {
        stagingSurface.canvas.height = canvasMetrics.backingHeight;
      }
    } catch (cause) {
      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 初始化 staging Canvas 失败。",
          true,
          cause,
        ),
      );
      return;
    }

    const rendererPrepareKey = [
      rendererVersionRef.current,
      stagingVersionRef.current,
      canvasMetrics.backingWidth,
      canvasMetrics.backingHeight,
      cssWidth,
      cssHeight,
      resolvedGrid.columns,
      resolvedGrid.rows,
      resolvedGrid.cellWidth,
      resolvedGrid.cellHeight,
      canvasMetrics.dpr,
    ].join(":");
    const currentRenderer = rendererRef.current;
    const needsPrepare = preparedRendererKeyRef.current !== rendererPrepareKey;
    let rendererPhase = needsPrepare ? "prepare" : "render";
    let stagingContextSaved = false;

    try {
      stagingSurface.ctx.save();
      stagingContextSaved = true;
      clearCanvasPixels(
        stagingSurface.ctx,
        stagingSurface.canvas,
        clearColorRef.current,
      );
      stagingSurface.ctx.setTransform(
        canvasMetrics.scaleX,
        0,
        0,
        canvasMetrics.scaleY,
        0,
        0,
      );
      stagingSurface.ctx.beginPath();

      if (needsPrepare) {
        const returnedValue: unknown = currentRenderer.prepare?.(
          stagingSurface.ctx,
          frame as MatrixFrame,
          frameContext as MatrixFrameContext,
        );
        const asyncError = createAsyncContractError(
          returnedValue,
          "MatrixEffect Renderer prepare() 必须同步完成，不能返回 Promise。",
        );

        if (asyncError !== null) {
          buffersRef.current = null;
          throw asyncError;
        }

        preparedRendererKeyRef.current = rendererPrepareKey;
      }

      rendererPhase = "render";
      const returnedValue: unknown = currentRenderer.render(
        stagingSurface.ctx,
        frame as MatrixFrame,
        frameContext as MatrixFrameContext,
      );
      const asyncError = createAsyncContractError(
        returnedValue,
        "MatrixEffect Renderer render() 必须同步完成，不能返回 Promise。",
      );

      if (asyncError !== null) {
        buffersRef.current = null;
        throw asyncError;
      }

      stagingSurface.ctx.beginPath();
    } catch (cause) {
      if (stagingContextSaved) {
        try {
          stagingSurface.ctx.beginPath();
        } catch {
          // 后续 restore 仍需执行。
        }

        safelyRestoreContext(stagingSurface.ctx);
      }

      // Renderer 可能留下未配平状态或异步持有 ctx，错误后不再复用该 surface。
      stagingSurfaceRef.current = null;
      preparedRendererKeyRef.current = null;

      handlePipelineError(
        createMatrixEffectError(
          "RENDERER_RUNTIME_ERROR",
          `MatrixEffect Renderer ${rendererPhase}() 执行失败。`,
          true,
          cause,
        ),
      );
      return;
    }

    const stagingRestoreError = safelyRestoreContext(stagingSurface.ctx);

    if (stagingRestoreError !== null) {
      stagingSurfaceRef.current = null;
      preparedRendererKeyRef.current = null;
      handlePipelineError(
        createMatrixEffectError(
          "RENDERER_RUNTIME_ERROR",
          "MatrixEffect Renderer 未能恢复 staging Canvas 状态。",
          true,
          stagingRestoreError,
        ),
      );
      return;
    }

    if (
      pipelineGenerationRef.current !== framePipelineGeneration ||
      sourceAdapterRef.current !== sourceAdapter
    ) {
      return;
    }

    let visibleContextSaved = false;

    try {
      if (visibleSurface.canvas.width !== canvasMetrics.backingWidth) {
        visibleSurface.canvas.width = canvasMetrics.backingWidth;
      }

      if (visibleSurface.canvas.height !== canvasMetrics.backingHeight) {
        visibleSurface.canvas.height = canvasMetrics.backingHeight;
      }

      visibleSurface.ctx.save();
      visibleContextSaved = true;
      visibleSurface.ctx.setTransform(1, 0, 0, 1, 0, 0);
      visibleSurface.ctx.globalAlpha = 1;
      visibleSurface.ctx.globalCompositeOperation = "copy";
      visibleSurface.ctx.imageSmoothingEnabled = false;
      visibleSurface.ctx.drawImage(stagingSurface.canvas, 0, 0);
      visibleSurface.ctx.beginPath();
    } catch (cause) {
      if (visibleContextSaved) {
        safelyRestoreContext(visibleSurface.ctx);
      }

      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 提交 staging Canvas 到可见 Canvas 失败。",
          false,
          cause,
        ),
      );
      return;
    }

    const visibleRestoreError = safelyRestoreContext(visibleSurface.ctx);

    if (visibleRestoreError !== null) {
      handlePipelineError(
        createMatrixEffectError(
          "CANVAS_CONTEXT_UNAVAILABLE",
          "MatrixEffect 未能恢复可见 Canvas 状态。",
          false,
          visibleRestoreError,
        ),
      );
      return;
    }

    if (
      pipelineGenerationRef.current !== framePipelineGeneration ||
      sourceAdapterRef.current !== sourceAdapter
    ) {
      return;
    }

    buffers.previousValues.set(buffers.values);
    buffers.hasPreviousValues = true;
    successfulFrameRef.current += 1;
    dirtyRef.current = dirtyGenerationRef.current !== frameDirtyGeneration;

    if (!hasEverSuccessfulFrameRef.current) {
      hasEverSuccessfulFrameRef.current = true;
      setHasEverSuccessfulFrame(true);
    }

    updateStatus("ready");

    if (
      pipelineGenerationRef.current !== framePipelineGeneration ||
      sourceAdapterRef.current !== sourceAdapter
    ) {
      return;
    }

    if (readyEpochRef.current !== sourceEpochRef.current) {
      readyEpochRef.current = sourceEpochRef.current;

      try {
        const returnedValue: unknown = callbacksRef.current.onReady?.();
        observeLifecycleResult("onReady", returnedValue);
      } catch (cause) {
        reportLifecycleFailure("onReady", cause);
      }
    }

    if (dirtyRef.current) {
      ensureFrameScheduled();
    }
  }, [
    discardSamplingResources,
    ensureFrameScheduled,
    getVisibleSurface,
    handlePipelineError,
    updateStatus,
  ]);

  React.useLayoutEffect(() => {
    callbacksRef.current = { onStatusChange, onReady, onError };
  }, [onError, onReady, onStatusChange]);

  React.useLayoutEffect(() => {
    drawFrameRef.current = performFrame;
    invalidateRef.current = markDirty;
  }, [markDirty, performFrame]);

  React.useLayoutEffect(() => {
    mountedRef.current = true;
    ensureFrameScheduled();

    return () => {
      mountedRef.current = false;
      cancelScheduledFrame();
      visibleSurfaceRef.current = null;
      stagingSurfaceRef.current = null;
      discardSamplingResources();
      buffersRef.current = null;
    };
  }, [cancelScheduledFrame, discardSamplingResources, ensureFrameScheduled]);

  const handleRef = React.useRef<MatrixEffectHandle | null>(null);

  if (handleRef.current === null) {
    handleRef.current = {
      get canvas() {
        return canvasRef.current;
      },
      invalidate() {
        invalidateRef.current();
      },
    };
  }

  React.useImperativeHandle(
    ref,
    () => handleRef.current as MatrixEffectHandle,
    [],
  );

  React.useLayoutEffect(() => {
    const previousRenderer = rendererRef.current;
    const didChange = previousRenderer !== renderer;
    rendererRef.current = renderer;
    const token = {};
    activeRendererLeaseRef.current = { renderer, token };

    if (didChange) {
      rendererVersionRef.current += 1;
      retryPipeline({ resetRenderer: true });
    }

    return () => {
      if (activeRendererLeaseRef.current?.token === token) {
        activeRendererLeaseRef.current = null;
      }

      enqueueMicrotask(() => {
        if (activeRendererLeaseRef.current?.renderer === renderer) {
          return;
        }

        try {
          const returnedValue: unknown = renderer.dispose?.();
          const asyncError = createAsyncContractError(
            returnedValue,
            "MatrixEffect Renderer dispose() 必须同步完成，不能返回 Promise。",
          );

          if (asyncError !== null) {
            reportRendererDisposeFailure(asyncError);
          }
        } catch (cause) {
          reportRendererDisposeFailure(cause);
        }
      });
    };
  }, [renderer, retryPipeline]);

  React.useLayoutEffect(() => {
    if (mapperRef.current === mapper) {
      return;
    }

    mapperRef.current = mapper;
    retryPipeline({ resetHistory: true });
  }, [mapper, retryPipeline]);

  React.useLayoutEffect(() => {
    if (transformsRef.current === transforms) {
      return;
    }

    transformsRef.current = transforms;
    retryPipeline({ resetHistory: true });
  }, [retryPipeline, transforms]);

  React.useLayoutEffect(() => {
    if (gridConfigRef.current.signature === normalizedGrid.signature) {
      gridConfigRef.current = normalizedGrid;
      return;
    }

    gridConfigRef.current = normalizedGrid;
    retryPipeline({ resetHistory: true, resetRenderer: true });
  }, [normalizedGrid, retryPipeline]);

  React.useLayoutEffect(() => {
    if (maxDprRef.current === normalizedMaxDpr) {
      return;
    }

    maxDprRef.current = normalizedMaxDpr;
    retryPipeline({ resetRenderer: true });
  }, [normalizedMaxDpr, retryPipeline]);

  React.useLayoutEffect(() => {
    if (clearColorRef.current === clearColor) {
      return;
    }

    clearColorRef.current = clearColor;
    retryPipeline();
  }, [clearColor, retryPipeline]);

  React.useLayoutEffect(() => {
    const isSourceTransition = sourceIdentityRef.current !== source;

    if (isSourceTransition) {
      sourceIdentityRef.current = source;
      sourceEpochRef.current += 1;
      pipelineGenerationRef.current += 1;
      readyEpochRef.current = -1;
      successfulFrameRef.current = 0;
      discardSamplingResources();
      resetFrameHistory(buffersRef.current);

      if (clearRecoverableError()) {
        updateStatus("idle");
      }
    }

    let adapter: MatrixSourceAdapter;

    try {
      adapter = createMatrixSourceAdapter(source, {
        onStateChange: () => {
          if (sourceAdapterRef.current !== adapter) {
            return;
          }

          markDirty();
        },
      });
    } catch (cause) {
      handlePipelineError(
        createMatrixEffectError(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect 初始化 Source adapter 失败。",
          true,
          cause,
        ),
      );
      return;
    }

    sourceAdapterRef.current = adapter;
    markDirty();

    return () => {
      if (sourceAdapterRef.current === adapter) {
        sourceAdapterRef.current = null;
      }

      try {
        adapter.dispose();
      } catch (cause) {
        if (isDevelopment()) {
          console.error(
            "[MatrixEffect] Source adapter dispose() 失败。",
            cause,
          );
        }
      }
    };
  }, [
    clearRecoverableError,
    discardSamplingResources,
    handlePipelineError,
    markDirty,
    source,
    updateStatus,
  ]);

  React.useEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return;
    }

    const measure = () => {
      const cssWidth = Math.max(0, root.clientWidth);
      const cssHeight = Math.max(0, root.clientHeight);
      const devicePixelRatio =
        typeof window !== "undefined" &&
        Number.isFinite(window.devicePixelRatio) &&
        window.devicePixelRatio > 0
          ? window.devicePixelRatio
          : 1;
      const previous = sizeRef.current;
      const didCssSizeChange =
        previous.cssWidth !== cssWidth || previous.cssHeight !== cssHeight;
      const didDprChange = previous.devicePixelRatio !== devicePixelRatio;

      if (!didCssSizeChange && !didDprChange) {
        return;
      }

      sizeRef.current = { cssWidth, cssHeight, devicePixelRatio };

      if (didCssSizeChange) {
        resetFrameHistory(buffersRef.current);
      }

      preparedRendererKeyRef.current = null;
      pipelineGenerationRef.current += 1;
      clearRecoverableError();
      markDirty();

      if (cssWidth === 0 || cssHeight === 0) {
        cancelScheduledFrame();

        if (errorLockRef.current === null) {
          updateStatus("idle");
        }

        return;
      }
    };

    measure();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;

    observer?.observe(root);

    if (typeof window !== "undefined") {
      window.addEventListener("resize", measure);
    }

    return () => {
      observer?.disconnect();

      if (typeof window !== "undefined") {
        window.removeEventListener("resize", measure);
      }
    };
  }, [cancelScheduledFrame, clearRecoverableError, markDirty, updateStatus]);

  React.useEffect(() => {
    if (!decorative && !ariaLabel?.trim()) {
      warnOnce(
        "missing-aria-label",
        "decorative=false 时应提供 ariaLabel 描述 Canvas 内容。",
      );
    }
  }, [ariaLabel, decorative]);

  const showFallback = status === "error" && !hasEverSuccessfulFrame;
  const hasFallbackContent = showFallback && fallback != null;
  const hideCanvasFromAccessibility = decorative || hasFallbackContent;

  return (
    <div
      {...rootProps}
      ref={rootRef}
      data-slot="matrix-effect"
      className={cn("relative", className)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        data-slot="matrix-effect-canvas"
        className={cn("absolute inset-0 block h-full w-full", canvasClassName)}
        aria-hidden={hideCanvasFromAccessibility ? true : undefined}
        role={!hideCanvasFromAccessibility ? "img" : undefined}
        aria-label={!hideCanvasFromAccessibility ? ariaLabel : undefined}
      />
      {hasFallbackContent ? (
        <div data-slot="matrix-effect-fallback" className="absolute inset-0">
          {fallback}
        </div>
      ) : null}
    </div>
  );
});

MatrixEffect.displayName = "MatrixEffect";
