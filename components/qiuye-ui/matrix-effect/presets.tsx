"use client";

import * as React from "react";

import { MatrixEffect } from "./matrix-effect";
import { createDotRenderer } from "./renderers";
import { createSoftBlobSource } from "./sources";
import {
  createInvertTransform,
  createLevelsTransform,
  createLuminanceMapper,
} from "./transforms";
import type {
  DotMatrixEffectProps,
  MatrixEffectHandle,
  MatrixGridConfig,
  MatrixSignalTransform,
} from "./types";

const DEFAULT_DOT_COLOR = "#71717a";
const DEFAULT_DOT_CELL_SIZE = 10;
const DEFAULT_DOT_CELL_ASPECT_RATIO = 1;
const DEFAULT_DOT_MAX_CELLS = 10_000;
const DEFAULT_DOT_RADIUS_RANGE = [0.35, 4] as const;
const DEFAULT_DOT_OPACITY_RANGE = [1, 1] as const;
const EMPTY_TRANSFORMS: readonly MatrixSignalTransform[] = [];
const DOT_LUMINANCE_MAPPER = createLuminanceMapper();

function resolveDotMatrixGridFields(
  mode: "auto" | "fixed",
  cellSize: number | undefined,
  columns: number | undefined,
  rows: number | undefined,
  cellAspectRatio: number | undefined,
  maxCells: number | undefined,
): MatrixGridConfig {
  if (mode === "fixed") {
    return {
      mode: "fixed",
      columns: columns as number,
      ...(rows === undefined ? {} : { rows }),
      cellAspectRatio: cellAspectRatio ?? DEFAULT_DOT_CELL_ASPECT_RATIO,
      maxCells: maxCells ?? DEFAULT_DOT_MAX_CELLS,
    };
  }

  return {
    mode: "auto",
    cellSize: cellSize ?? DEFAULT_DOT_CELL_SIZE,
    cellAspectRatio: cellAspectRatio ?? DEFAULT_DOT_CELL_ASPECT_RATIO,
    maxCells: maxCells ?? DEFAULT_DOT_MAX_CELLS,
  };
}

/**
 * 按 Dot 预设默认值合并局部 Grid 配置
 *
 * 该辅助函数仅用于预设实现和确定性验证，不从公共 index 导出。
 */
export function resolveDotMatrixGrid(
  grid?: MatrixGridConfig,
): MatrixGridConfig {
  const mode = grid?.mode === "fixed" ? "fixed" : "auto";

  return resolveDotMatrixGridFields(
    mode,
    mode === "auto" ? grid?.cellSize : undefined,
    mode === "fixed" ? grid?.columns : undefined,
    mode === "fixed" ? grid?.rows : undefined,
    grid?.cellAspectRatio,
    grid?.maxCells,
  );
}

/**
 * DotMatrixEffect — 可直接使用的动态圆点矩阵预设
 *
 * - 未传 Source 时使用确定性柔和光团驱动连续动效
 * - 支持固定色或 Source RGB，并独立控制圆点半径与透明度
 * - 按 auto/fixed mode 字段级合并响应式网格默认值
 * - 固定执行 Luminance -> Invert -> Levels -> 额外 Transform 顺序
 * - 原样转发 MatrixEffectHandle，可获取 Canvas 或合并请求重绘
 *
 * @example
 * ```tsx
 * <DotMatrixEffect
 *   className="aspect-video w-full"
 *   color="#71717a"
 *   radiusRange={[0.25, 4]}
 * />
 * ```
 */
export const DotMatrixEffect = React.forwardRef<
  MatrixEffectHandle,
  DotMatrixEffectProps
>(function DotMatrixEffect(
  {
    source,
    blobOptions,
    color = DEFAULT_DOT_COLOR,
    backgroundColor = null,
    radiusRange = DEFAULT_DOT_RADIUS_RANGE,
    opacityRange = DEFAULT_DOT_OPACITY_RANGE,
    invert = false,
    levels,
    additionalTransforms = EMPTY_TRANSFORMS,
    grid,
    ...matrixEffectProps
  },
  ref,
) {
  const blobCount = blobOptions?.count;
  const blobMinimumRadius = blobOptions?.minRadius;
  const blobMaximumRadius = blobOptions?.maxRadius;
  const blobSpeed = blobOptions?.speed;
  const blobBaseValue = blobOptions?.baseValue;
  const blobSeed = blobOptions?.seed;
  const effectiveSource = React.useMemo(
    () =>
      source ??
      createSoftBlobSource({
        count: blobCount,
        minRadius: blobMinimumRadius,
        maxRadius: blobMaximumRadius,
        speed: blobSpeed,
        baseValue: blobBaseValue,
        seed: blobSeed,
      }),
    [
      blobBaseValue,
      blobCount,
      blobMaximumRadius,
      blobMinimumRadius,
      blobSeed,
      blobSpeed,
      source,
    ],
  );

  const minimumDotRadius = radiusRange[0];
  const maximumDotRadius = radiusRange[1];
  const minimumDotOpacity = opacityRange[0];
  const maximumDotOpacity = opacityRange[1];
  const renderer = React.useMemo(
    () =>
      createDotRenderer({
        color,
        radiusRange: [minimumDotRadius, maximumDotRadius],
        opacityRange: [minimumDotOpacity, maximumDotOpacity],
      }),
    [
      color,
      maximumDotOpacity,
      maximumDotRadius,
      minimumDotOpacity,
      minimumDotRadius,
    ],
  );

  const hasLevels = levels !== undefined;
  const levelsInputMinimum = levels?.inputMin;
  const levelsInputMaximum = levels?.inputMax;
  const levelsBrightness = levels?.brightness;
  const levelsContrast = levels?.contrast;
  const levelsGamma = levels?.gamma;
  const transforms = React.useMemo(() => {
    const nextTransforms: MatrixSignalTransform[] = [];

    if (invert) {
      nextTransforms.push(createInvertTransform());
    }

    if (hasLevels) {
      nextTransforms.push(
        createLevelsTransform({
          inputMin: levelsInputMinimum,
          inputMax: levelsInputMaximum,
          brightness: levelsBrightness,
          contrast: levelsContrast,
          gamma: levelsGamma,
        }),
      );
    }

    nextTransforms.push(...additionalTransforms);
    return nextTransforms;
  }, [
    additionalTransforms,
    hasLevels,
    invert,
    levelsBrightness,
    levelsContrast,
    levelsGamma,
    levelsInputMaximum,
    levelsInputMinimum,
  ]);

  const requestedGridMode = grid?.mode === "fixed" ? "fixed" : "auto";
  const requestedCellSize =
    requestedGridMode === "auto" ? grid?.cellSize : undefined;
  const requestedColumns =
    requestedGridMode === "fixed" ? grid?.columns : undefined;
  const requestedRows = requestedGridMode === "fixed" ? grid?.rows : undefined;
  const requestedCellAspectRatio = grid?.cellAspectRatio;
  const requestedMaxCells = grid?.maxCells;
  const resolvedGrid = React.useMemo(
    () =>
      resolveDotMatrixGridFields(
        requestedGridMode,
        requestedCellSize,
        requestedColumns,
        requestedRows,
        requestedCellAspectRatio,
        requestedMaxCells,
      ),
    [
      requestedCellAspectRatio,
      requestedCellSize,
      requestedColumns,
      requestedGridMode,
      requestedMaxCells,
      requestedRows,
    ],
  );

  return (
    <MatrixEffect
      {...matrixEffectProps}
      ref={ref}
      source={effectiveSource}
      renderer={renderer}
      mapper={DOT_LUMINANCE_MAPPER}
      transforms={transforms}
      grid={resolvedGrid}
      clearColor={backgroundColor}
    />
  );
});

DotMatrixEffect.displayName = "DotMatrixEffect";
