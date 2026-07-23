import {
  createSoftBlobSource,
  type MatrixImageSource,
  type MatrixProceduralSource,
  type MatrixSource,
} from "@/components/qiuye-ui/matrix-effect";

export type MatrixDemoPresetSourceId =
  | "swirl"
  | "blobs"
  | "rings"
  | "waves"
  | "image";
export type MatrixDemoSourceId = MatrixDemoPresetSourceId | "upload";

export interface MatrixDemoSourcePreset {
  id: MatrixDemoPresetSourceId;
  label: string;
  animated: boolean;
}

const TAU = Math.PI * 2;
const SOURCE_BACKGROUND = "#030712";

export const MATRIX_DEMO_SOURCE_PRESETS = [
  { id: "swirl", label: "旋转星旋", animated: true },
  { id: "blobs", label: "流动光团", animated: true },
  { id: "rings", label: "呼吸圆环", animated: true },
  { id: "waves", label: "流动波浪", animated: true },
  { id: "image", label: "静态星旋", animated: false },
] as const satisfies readonly MatrixDemoSourcePreset[];

export const MATRIX_DEMO_IMAGE_SOURCE = {
  type: "image",
  src: "/examples/matrix-effect/source.webp",
  fit: "contain",
  background: null,
} satisfies MatrixImageSource;

const MATRIX_DEMO_BLOB_SOURCE = createSoftBlobSource({
  count: 4,
  minRadius: 0.16,
  maxRadius: 0.42,
  speed: 0.4,
  baseValue: 0.02,
  seed: 41,
});

function fillSourceBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = SOURCE_BACKGROUND;
  ctx.fillRect(0, 0, width, height);
}

function appendSpiralArm(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  shortSide: number,
  rotation: number,
  armIndex: number,
  armCount: number,
) {
  const steps = Math.max(52, Math.min(128, Math.round(shortSide * 1.7)));
  const armOffset = (armIndex / armCount) * TAU;

  ctx.beginPath();

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const radius = shortSide * (0.025 + progress * 0.5);
    const angle =
      rotation +
      armOffset +
      progress * TAU * 1.24 +
      Math.sin(progress * Math.PI) * 0.12;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

const MATRIX_DEMO_SWIRL_SOURCE = {
  type: "procedural",
  animated: true,
  draw({ ctx, width, height, time }) {
    fillSourceBackground(ctx, width, height);

    const shortSide = Math.min(width, height);
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const rotation = time * 0.46;
    const armColors = [
      "rgb(94, 234, 212)",
      "rgb(125, 211, 252)",
      "rgb(251, 113, 133)",
      "rgb(253, 186, 116)",
      "rgb(244, 244, 245)",
    ] as const;

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    armColors.forEach((color, armIndex) => {
      appendSpiralArm(
        ctx,
        centerX,
        centerY,
        shortSide,
        rotation,
        armIndex,
        armColors.length,
      );
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, shortSide * 0.065);
      ctx.stroke();

      appendSpiralArm(
        ctx,
        centerX,
        centerY,
        shortSide,
        rotation,
        armIndex,
        armColors.length,
      );
      ctx.globalAlpha = 0.82;
      ctx.lineWidth = Math.max(1, shortSide * 0.018);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    const coreRadius = shortSide * 0.18;
    const core = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreRadius,
    );
    core.addColorStop(0, "rgba(255, 255, 255, 1)");
    core.addColorStop(0.2, "rgba(240, 253, 250, 0.92)");
    core.addColorStop(0.5, "rgba(94, 234, 212, 0.42)");
    core.addColorStop(1, "rgba(94, 234, 212, 0)");
    ctx.fillStyle = core;
    ctx.fillRect(
      centerX - coreRadius,
      centerY - coreRadius,
      coreRadius * 2,
      coreRadius * 2,
    );
  },
} satisfies MatrixProceduralSource;

const MATRIX_DEMO_RING_SOURCE = {
  type: "procedural",
  animated: true,
  draw({ ctx, width, height, time }) {
    fillSourceBackground(ctx, width, height);

    const shortSide = Math.min(width, height);
    const centerX = width * (0.5 + Math.sin(time * 0.37) * 0.06);
    const centerY = height * (0.5 + Math.cos(time * 0.29) * 0.05);

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (let index = 0; index < 7; index += 1) {
      const progress = (index / 7 + time * 0.09) % 1;
      const opacity = Math.pow(1 - progress, 1.35) * 0.86;
      const radius = shortSide * (0.06 + progress * 0.7);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, TAU);
      ctx.lineWidth = Math.max(1, shortSide * (0.038 - progress * 0.018));
      ctx.strokeStyle =
        index % 2 === 0
          ? `rgba(45, 212, 191, ${opacity})`
          : `rgba(251, 113, 133, ${opacity * 0.82})`;
      ctx.stroke();
    }

    const coreRadius = shortSide * 0.2;
    const core = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      coreRadius,
    );
    core.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    core.addColorStop(0.24, "rgba(94, 234, 212, 0.58)");
    core.addColorStop(1, "rgba(94, 234, 212, 0)");
    ctx.fillStyle = core;
    ctx.fillRect(
      centerX - coreRadius,
      centerY - coreRadius,
      coreRadius * 2,
      coreRadius * 2,
    );
  },
} satisfies MatrixProceduralSource;

const MATRIX_DEMO_WAVE_SOURCE = {
  type: "procedural",
  animated: true,
  draw({ ctx, width, height, time }) {
    fillSourceBackground(ctx, width, height);

    const shortSide = Math.min(width, height);
    const colors = [
      "rgba(45, 212, 191, 0.92)",
      "rgba(96, 165, 250, 0.78)",
      "rgba(251, 113, 133, 0.72)",
      "rgba(250, 204, 21, 0.56)",
    ] as const;

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    colors.forEach((color, index) => {
      const verticalOffset =
        (index - (colors.length - 1) / 2) * shortSide * 0.12;
      const amplitude = shortSide * (0.11 + index * 0.018);
      const frequency = 1.08 + index * 0.17;
      const phase = time * (1.05 + index * 0.12) + index * 0.9;

      ctx.beginPath();

      for (let x = -1; x <= width + 1; x += 1) {
        const normalizedX = x / Math.max(1, width);
        const y =
          height * 0.5 +
          verticalOffset +
          Math.sin(normalizedX * TAU * frequency + phase) * amplitude +
          Math.cos(normalizedX * Math.PI * 3 - phase * 0.62) *
            shortSide *
            0.035;

        if (x === -1) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.25, shortSide * (0.025 - index * 0.002));
      ctx.stroke();
    });
  },
} satisfies MatrixProceduralSource;

const MATRIX_DEMO_PRESET_SOURCES: Record<
  MatrixDemoPresetSourceId,
  MatrixSource
> = {
  swirl: MATRIX_DEMO_SWIRL_SOURCE,
  blobs: MATRIX_DEMO_BLOB_SOURCE,
  rings: MATRIX_DEMO_RING_SOURCE,
  waves: MATRIX_DEMO_WAVE_SOURCE,
  image: MATRIX_DEMO_IMAGE_SOURCE,
};

export function getMatrixDemoPresetSource(
  sourceId: MatrixDemoPresetSourceId,
): MatrixSource {
  return MATRIX_DEMO_PRESET_SOURCES[sourceId];
}

export function createMatrixDemoUploadSource(file: File): MatrixImageSource {
  return {
    type: "image",
    src: file,
    fit: "contain",
    background: null,
  };
}

export function getMatrixDemoSourcePreset(
  sourceId: MatrixDemoPresetSourceId,
): MatrixDemoSourcePreset {
  return (
    MATRIX_DEMO_SOURCE_PRESETS.find((preset) => preset.id === sourceId) ??
    MATRIX_DEMO_SOURCE_PRESETS[0]
  );
}
