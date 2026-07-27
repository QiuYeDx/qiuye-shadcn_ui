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
const DEGREE = Math.PI / 180;
const EARTH_AXIAL_TILT = 23.4 * DEGREE;
const SOURCE_BACKGROUND = "#030712";
const SPIRAL_HALO_STOPS = [
  [0, 0.3],
  [0.34, 0.22],
  [0.64, 0.09],
  [0.84, 0.025],
  [1, 0],
] as const;
const SPIRAL_CORE_STOPS = [
  [0, 0.98],
  [0.24, 0.9],
  [0.5, 0.64],
  [0.72, 0.34],
  [0.88, 0.12],
  [1, 0],
] as const;

type EarthGeoPoint = readonly [longitude: number, latitude: number];

const EARTH_CONTINENT_POLYGONS_DEGREES = [
  // 北美洲
  [
    [-168, 71],
    [-150, 70],
    [-140, 60],
    [-127, 55],
    [-124, 48],
    [-117, 32],
    [-107, 24],
    [-97, 19],
    [-89, 20],
    [-83, 27],
    [-81, 32],
    [-74, 41],
    [-64, 47],
    [-57, 53],
    [-62, 61],
    [-79, 69],
    [-96, 73],
    [-116, 72],
    [-132, 66],
    [-151, 59],
    [-168, 64],
  ],
  // 南美洲
  [
    [-81, 12],
    [-71, 11],
    [-62, 6],
    [-50, 4],
    [-36, -6],
    [-38, -18],
    [-46, -27],
    [-52, -39],
    [-65, -55],
    [-72, -51],
    [-76, -36],
    [-70, -19],
    [-78, -5],
  ],
  // 格陵兰
  [
    [-73, 60],
    [-48, 59],
    [-25, 68],
    [-22, 78],
    [-38, 84],
    [-58, 83],
    [-70, 75],
  ],
  // 欧洲与亚洲
  [
    [-11, 36],
    [-4, 44],
    [-10, 54],
    [7, 62],
    [25, 69],
    [48, 72],
    [72, 77],
    [102, 76],
    [132, 70],
    [158, 64],
    [179, 54],
    [166, 46],
    [145, 40],
    [132, 33],
    [122, 23],
    [110, 19],
    [104, 8],
    [94, 8],
    [81, 21],
    [69, 24],
    [56, 18],
    [48, 13],
    [42, 29],
    [32, 35],
    [24, 39],
    [15, 37],
    [9, 43],
    [1, 43],
  ],
  // 非洲
  [
    [-17, 36],
    [4, 37],
    [20, 33],
    [33, 30],
    [43, 12],
    [51, 3],
    [42, -14],
    [34, -28],
    [24, -35],
    [15, -34],
    [9, -22],
    [1, -6],
    [-11, 5],
    [-17, 21],
  ],
  // 澳大利亚
  [
    [112, -11],
    [130, -10],
    [146, -18],
    [154, -28],
    [146, -40],
    [131, -44],
    [116, -36],
    [111, -23],
  ],
] as const satisfies readonly (readonly EarthGeoPoint[])[];

const EARTH_CONTINENT_POLYGONS = EARTH_CONTINENT_POLYGONS_DEGREES.map(
  (polygon) =>
    polygon.map(
      ([longitude, latitude]) =>
        [longitude * DEGREE, latitude * DEGREE] as const,
    ),
);

const EARTH_ISLANDS = [
  [138, 37, 7, 10],
  [48, -20, 5, 11],
  [121, 13, 6, 10],
  [173, -41, 5, 9],
  [-4, 55, 5, 7],
] as const;

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

function seededUnit(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, TAU);
  ctx.fill();
}

function drawGalaxyStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const shortSide = Math.min(width, height);
  const starCount = Math.max(70, Math.min(160, Math.round(width * 1.15)));

  for (let index = 0; index < starCount; index += 1) {
    const x = seededUnit(index, 1) * width;
    const y = seededUnit(index, 2) * height;
    const phase = seededUnit(index, 3) * TAU;
    const twinkle = 0.42 + (Math.sin(time * 1.8 + phase) + 1) * 0.22;
    const radius = shortSide * (0.004 + seededUnit(index, 4) * 0.008);
    const colorIndex = index % 5;

    ctx.globalAlpha = twinkle;
    ctx.fillStyle =
      colorIndex === 0 ? "#67e8f9" : colorIndex === 1 ? "#c4b5fd" : "#f8fafc";
    fillCircle(ctx, x, y, Math.max(0.42, radius));
  }
}

function drawSpiralGalaxy(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const shortSide = Math.min(width, height);
  const centerX = width * 0.3;
  const centerY = height * 0.43;
  const outerRadius = shortSide * 0.53;
  const rotation = time * 0.08 - 0.18;
  const haze = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    outerRadius,
  );

  haze.addColorStop(0, "rgba(224, 231, 255, 0.5)");
  haze.addColorStop(0.22, "rgba(103, 232, 249, 0.18)");
  haze.addColorStop(0.58, "rgba(129, 140, 248, 0.08)");
  haze.addColorStop(1, "rgba(2, 4, 10, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = haze;
  ctx.fillRect(
    centerX - outerRadius,
    centerY - outerRadius,
    outerRadius * 2,
    outerRadius * 2,
  );

  ctx.globalCompositeOperation = "lighter";

  for (let index = 0; index < 280; index += 1) {
    const armIndex = index % 4;
    const radialProgress = Math.pow(seededUnit(index, 11), 0.72);
    const radius = outerRadius * (0.04 + radialProgress * 0.96);
    const jitter = (seededUnit(index, 12) - 0.5) * (0.35 + radialProgress);
    const angle =
      rotation + (armIndex / 4) * TAU + radialProgress * TAU * 1.35 + jitter;
    const localX = Math.cos(angle) * radius;
    const localY = Math.sin(angle) * radius * 0.42;
    const tilt = -0.2;
    const x = centerX + localX * Math.cos(tilt) - localY * Math.sin(tilt);
    const y = centerY + localX * Math.sin(tilt) + localY * Math.cos(tilt);
    const radiusScale = 1 - radialProgress * 0.58;

    ctx.globalAlpha = 0.24 + radiusScale * 0.62;
    ctx.fillStyle =
      armIndex === 0
        ? "#67e8f9"
        : armIndex === 1
          ? "#a5b4fc"
          : armIndex === 2
            ? "#f0abfc"
            : "#f8fafc";
    fillCircle(
      ctx,
      x,
      y,
      Math.max(0.4, shortSide * (0.004 + radiusScale * 0.009)),
    );
  }

  const coreRadius = outerRadius * 0.28;
  const core = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    coreRadius,
  );
  core.addColorStop(0, "rgba(255, 255, 255, 1)");
  core.addColorStop(0.24, "rgba(207, 250, 254, 0.92)");
  core.addColorStop(0.58, "rgba(165, 180, 252, 0.44)");
  core.addColorStop(1, "rgba(129, 140, 248, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = core;
  ctx.fillRect(
    centerX - coreRadius,
    centerY - coreRadius,
    coreRadius * 2,
    coreRadius * 2,
  );
}

function clampUnit(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalizeLongitude(longitude: number) {
  return ((((longitude + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
}

function pointInEarthPolygon(
  longitude: number,
  latitude: number,
  polygon: readonly EarthGeoPoint[],
) {
  let inside = false;

  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index, index += 1
  ) {
    const [currentLongitude, currentLatitude] = polygon[index];
    const [previousLongitude, previousLatitude] = polygon[previousIndex];
    const intersects =
      currentLatitude > latitude !== previousLatitude > latitude &&
      longitude <
        ((previousLongitude - currentLongitude) *
          (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) +
          currentLongitude;

    if (intersects) inside = !inside;
  }

  return inside;
}

function earthSurfaceNoise(longitude: number, latitude: number, phase = 0) {
  const value =
    Math.sin(longitude * 7.7 + Math.sin(latitude * 4.3) + phase) * 0.34 +
    Math.sin(latitude * 13.1 - longitude * 3.4 + phase * 1.7) * 0.27 +
    Math.sin((longitude + latitude) * 24.8 - phase * 0.6) * 0.19 +
    Math.sin(longitude * 51.3 - latitude * 37.1 + phase * 0.2) * 0.1;

  return clampUnit(value * 0.56 + 0.5);
}

function isEarthLand(longitude: number, latitude: number) {
  if (latitude < -68 * DEGREE) return true;

  if (
    EARTH_CONTINENT_POLYGONS.some((polygon) =>
      pointInEarthPolygon(longitude, latitude, polygon),
    )
  ) {
    return true;
  }

  return EARTH_ISLANDS.some(
    ([centerLongitude, centerLatitude, longitudeRadius, latitudeRadius]) => {
      const longitudeDistance =
        normalizeLongitude(longitude - centerLongitude * DEGREE) /
        (longitudeRadius * DEGREE);
      const latitudeDistance =
        (latitude - centerLatitude * DEGREE) / (latitudeRadius * DEGREE);

      return (
        longitudeDistance * longitudeDistance +
          latitudeDistance * latitudeDistance <=
        1
      );
    },
  );
}

function mixEarthColor(
  start: readonly [number, number, number],
  end: readonly [number, number, number],
  amount: number,
) {
  const progress = clampUnit(amount);

  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress,
    start[2] + (end[2] - start[2]) * progress,
  ] as const;
}

function drawEarthSurface(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  time: number,
) {
  const rotation = time * 0.2;
  const tiltCosine = Math.cos(EARTH_AXIAL_TILT);
  const tiltSine = Math.sin(EARTH_AXIAL_TILT);
  const minimumX = Math.floor(centerX - radius);
  const maximumX = Math.ceil(centerX + radius);
  const minimumY = Math.floor(centerY - radius);
  const maximumY = Math.ceil(centerY + radius);

  for (let y = minimumY; y <= maximumY; y += 1) {
    for (let x = minimumX; x <= maximumX; x += 1) {
      const normalizedX = (x + 0.5 - centerX) / radius;
      const normalizedY = (y + 0.5 - centerY) / radius;
      const distanceSquared =
        normalizedX * normalizedX + normalizedY * normalizedY;

      if (distanceSquared > 1) continue;

      const sphereZ = Math.sqrt(1 - distanceSquared);
      const screenUp = -normalizedY;
      const tiltedX = normalizedX * tiltCosine - screenUp * tiltSine;
      const tiltedY = normalizedX * tiltSine + screenUp * tiltCosine;
      const latitude = Math.asin(Math.max(-1, Math.min(1, tiltedY)));
      const longitude = normalizeLongitude(
        Math.atan2(tiltedX, sphereZ) + rotation,
      );
      const boundaryNoise = earthSurfaceNoise(longitude, latitude);
      const warpedLongitude = normalizeLongitude(
        longitude + (boundaryNoise - 0.5) * 0.055 * Math.cos(latitude),
      );
      const warpedLatitude = Math.max(
        -Math.PI / 2,
        Math.min(
          Math.PI / 2,
          latitude +
            (earthSurfaceNoise(longitude + 1.7, latitude - 0.8) - 0.5) * 0.04,
        ),
      );
      const land = isEarthLand(warpedLongitude, warpedLatitude);
      const detail = earthSurfaceNoise(longitude * 1.08, latitude * 1.12);
      const secondaryDetail = earthSurfaceNoise(
        longitude * 1.9 - 0.7,
        latitude * 1.7 + 0.3,
      );
      let color: readonly [number, number, number];

      if (land) {
        const absoluteLatitude = Math.abs(latitude);
        const coastline =
          !isEarthLand(
            normalizeLongitude(warpedLongitude + 0.055),
            warpedLatitude,
          ) ||
          !isEarthLand(
            normalizeLongitude(warpedLongitude - 0.055),
            warpedLatitude,
          ) ||
          !isEarthLand(
            warpedLongitude,
            Math.min(Math.PI / 2, warpedLatitude + 0.045),
          ) ||
          !isEarthLand(
            warpedLongitude,
            Math.max(-Math.PI / 2, warpedLatitude - 0.045),
          );

        if (absoluteLatitude > 1.08) {
          color = mixEarthColor([190, 221, 213], [241, 245, 249], detail);
        } else if (
          absoluteLatitude > 0.18 &&
          absoluteLatitude < 0.62 &&
          secondaryDetail < 0.48
        ) {
          color = mixEarthColor([169, 130, 58], [235, 203, 111], detail);
        } else {
          color = mixEarthColor([25, 105, 62], [111, 194, 91], detail);
        }

        if (secondaryDetail > 0.74) {
          color = mixEarthColor(color, [167, 147, 111], 0.48);
        }

        if (coastline) {
          color = mixEarthColor(color, [164, 226, 172], 0.38);
        }
      } else {
        const current =
          Math.sin(longitude * 17 + Math.sin(latitude * 9) * 2.2) * 0.5 + 0.5;
        color = mixEarthColor(
          [7, 48, 101],
          [27, 142, 191],
          detail * 0.68 + current * 0.18,
        );
      }

      const lightDot = normalizedX * -0.54 + screenUp * 0.26 + sphereZ * 0.8;
      const light = 0.28 + Math.max(0, lightDot) * 0.72;
      color = [color[0] * light, color[1] * light, color[2] * light];

      const cloudSignal =
        earthSurfaceNoise(
          longitude + time * 0.035,
          latitude * 1.35,
          time * 0.07,
        ) +
        Math.sin(latitude * 18 + longitude * 5 - time * 0.1) * 0.08;
      const cloudOpacity = clampUnit((cloudSignal - 0.68) * 3.2) * 0.72;

      if (cloudOpacity > 0) {
        color = mixEarthColor(color, [226, 242, 244], cloudOpacity * light);
      }

      if (land && lightDot < 0.02 && secondaryDetail > 0.83) {
        color = mixEarthColor(color, [251, 191, 36], 0.42);
      }

      const rim = Math.pow(1 - sphereZ, 2.2) * 0.38;
      color = mixEarthColor(color, [56, 189, 248], rim);
      ctx.fillStyle = `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawMoon(
  ctx: CanvasRenderingContext2D,
  moonX: number,
  moonY: number,
  moonRadius: number,
) {
  const moon = ctx.createRadialGradient(
    moonX - moonRadius * 0.3,
    moonY - moonRadius * 0.32,
    0,
    moonX,
    moonY,
    moonRadius,
  );
  moon.addColorStop(0, "#f8fafc");
  moon.addColorStop(0.52, "#cbd5e1");
  moon.addColorStop(1, "#475569");
  ctx.globalAlpha = 1;
  ctx.fillStyle = moon;
  fillCircle(ctx, moonX, moonY, moonRadius);

  ctx.globalAlpha = 0.32;
  ctx.fillStyle = "#334155";
  fillCircle(
    ctx,
    moonX - moonRadius * 0.28,
    moonY + moonRadius * 0.1,
    moonRadius * 0.22,
  );
  fillCircle(
    ctx,
    moonX + moonRadius * 0.25,
    moonY - moonRadius * 0.28,
    moonRadius * 0.15,
  );
}

function drawMoonOrbitHalf(
  ctx: CanvasRenderingContext2D,
  earthX: number,
  earthY: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  front: boolean,
  lineWidth: number,
) {
  ctx.globalAlpha = front ? 0.4 : 0.18;
  ctx.strokeStyle = "#bae6fd";
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.ellipse(
    earthX,
    earthY,
    radiusX,
    radiusY,
    rotation,
    front ? 0 : Math.PI,
    front ? Math.PI : TAU,
  );
  ctx.stroke();
}

function drawEarth(
  ctx: CanvasRenderingContext2D,
  earthX: number,
  earthY: number,
  earthRadius: number,
  shortSide: number,
  time: number,
) {
  const atmosphereRadius = earthRadius * 1.36;
  const atmosphere = ctx.createRadialGradient(
    earthX,
    earthY,
    earthRadius * 0.76,
    earthX,
    earthY,
    atmosphereRadius,
  );
  atmosphere.addColorStop(0, "rgba(56, 189, 248, 0)");
  atmosphere.addColorStop(0.7, "rgba(56, 189, 248, 0.3)");
  atmosphere.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = atmosphere;
  fillCircle(ctx, earthX, earthY, atmosphereRadius);

  ctx.fillStyle = "#071b3a";
  fillCircle(ctx, earthX, earthY, earthRadius);
  drawEarthSurface(ctx, earthX, earthY, earthRadius, time);

  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = "#7dd3fc";
  ctx.lineWidth = Math.max(0.5, shortSide * 0.008);
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthRadius, 0, TAU);
  ctx.stroke();
}

function drawEarthAndMoon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const shortSide = Math.min(width, height);
  const earthX = width * 0.76;
  const earthY = height * 0.57;
  const earthRadius = shortSide * 0.2;
  const moonAngle = time * 0.32 + 0.6;
  const orbitRadiusX = earthRadius * 1.85;
  const orbitRadiusY = earthRadius * 0.52;
  const orbitRotation = -0.18;
  const localMoonX = Math.cos(moonAngle) * orbitRadiusX;
  const localMoonY = Math.sin(moonAngle) * orbitRadiusY;
  const moonX =
    earthX +
    localMoonX * Math.cos(orbitRotation) -
    localMoonY * Math.sin(orbitRotation);
  const moonY =
    earthY +
    localMoonX * Math.sin(orbitRotation) +
    localMoonY * Math.cos(orbitRotation);
  const moonRadius = earthRadius * 0.19;
  const moonIsInFront = Math.sin(moonAngle) >= 0;
  const orbitLineWidth = Math.max(0.5, shortSide * 0.006);

  ctx.globalCompositeOperation = "source-over";
  drawMoonOrbitHalf(
    ctx,
    earthX,
    earthY,
    orbitRadiusX,
    orbitRadiusY,
    orbitRotation,
    false,
    orbitLineWidth,
  );

  if (!moonIsInFront) {
    drawMoon(ctx, moonX, moonY, moonRadius);
  }

  drawEarth(ctx, earthX, earthY, earthRadius, shortSide, time);
  drawMoonOrbitHalf(
    ctx,
    earthX,
    earthY,
    orbitRadiusX,
    orbitRadiusY,
    orbitRotation,
    true,
    orbitLineWidth,
  );

  if (moonIsInFront) {
    drawMoon(ctx, moonX, moonY, moonRadius);
  }
}

export const MATRIX_DEMO_GALAXY_SOURCE = {
  type: "procedural",
  animated: true,
  draw({ ctx, width, height, time }) {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#02040a";
    ctx.fillRect(0, 0, width, height);

    drawGalaxyStars(ctx, width, height, time);
    drawSpiralGalaxy(ctx, width, height, time);
    drawEarthAndMoon(ctx, width, height, time);
  },
} satisfies MatrixProceduralSource;

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

function createSpiralStrokeGradient(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  outerRadius: number,
  color: readonly [red: number, green: number, blue: number],
  stops: readonly (readonly [offset: number, opacity: number])[],
) {
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    outerRadius,
  );
  const [red, green, blue] = color;

  stops.forEach(([offset, opacity]) => {
    gradient.addColorStop(
      offset,
      `rgba(${red}, ${green}, ${blue}, ${opacity})`,
    );
  });

  return gradient;
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
      [94, 234, 212],
      [125, 211, 252],
      [251, 113, 133],
      [253, 186, 116],
      [244, 244, 245],
    ] as const;
    const armOuterRadius = shortSide * 0.54;

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
      ctx.globalAlpha = 1;
      ctx.strokeStyle = createSpiralStrokeGradient(
        ctx,
        centerX,
        centerY,
        armOuterRadius,
        color,
        SPIRAL_HALO_STOPS,
      );
      ctx.lineWidth = Math.max(2, shortSide * 0.065);
      ctx.stroke();

      ctx.strokeStyle = createSpiralStrokeGradient(
        ctx,
        centerX,
        centerY,
        armOuterRadius,
        color,
        SPIRAL_CORE_STOPS,
      );
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
