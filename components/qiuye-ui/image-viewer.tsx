"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
} from "motion/react";
import { animate } from "motion";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreventScroll } from "@/hooks/use-prevent-scroll";
import { useHoverSupport } from "@/hooks/use-hover-support";

const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

type RoundedSize = keyof typeof roundedClasses;

type BaseImageProps = Omit<
  React.ComponentPropsWithoutRef<"img">,
  | "src"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStartCapture"
  | "onAnimationEndCapture"
  | "onAnimationIterationCapture"
>;

interface ImageViewerProps extends BaseImageProps {
  src?: string | Blob;
  rounded?: RoundedSize;
  lightboxRounded?: RoundedSize;
  wrapperClassName?: string;
  lightboxClassName?: string;
  overlayClassName?: string;
  overlayBlur?: boolean;
  lightboxPadding?: number;
  enableLightbox?: boolean;
  /** 非灯箱模式下图片的最大高度（支持数字px或CSS字符串） */
  maxHeight?: number | string;
  /** 非灯箱模式下图片的最大宽度（支持数字px或CSS字符串） */
  maxWidth?: number | string;
  /** 缩略图鼠标悬浮时的缩放倍数（例如 1.05 表示放大 5%），不设置则无悬浮效果 */
  hoverScale?: number;
  /** 悬浮动画的弹性系数（0‑1，默认 0.25），仅在设置 hoverScale 时生效 */
  hoverBounce?: number;
  /** 悬浮动画的时长（秒，默认 0.65），仅在设置 hoverScale 时生效 */
  hoverDuration?: number;
  /** 是否允许用户选中/复制/拖拽图片（默认 false，防止浏览器原生选中效果影响长按等交互体验） */
  selectable?: boolean;
}

const DEFAULT_PADDING = 32;
const MIN_LIGHTBOX_SCALE = 1;
const MAX_LIGHTBOX_SCALE = 4;
const TOUCH_MOVE_THRESHOLD = 4;
const RESET_ANIMATION_DURATION = 0.25; // 灯箱关闭前图片的缩放位移复位的过渡时长
const WHEEL_ZOOM_STEP = 0.2;
const TRACKPAD_ZOOM_SENSITIVITY = 0.01;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const formatSize = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const getTouchDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getTouchMidpoint = (touches: React.TouchList) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2,
});

export function ImageViewer({
  src,
  alt,
  title,
  rounded = "lg",
  lightboxRounded,
  wrapperClassName,
  className,
  lightboxClassName,
  overlayClassName,
  overlayBlur = false,
  lightboxPadding = DEFAULT_PADDING,
  enableLightbox = true,
  maxHeight,
  maxWidth,
  hoverScale,
  hoverBounce,
  hoverDuration = 0.65,
  selectable = false,
  loading = "lazy",
  onLoad,
  onError,
  ...props
}: ImageViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lightboxGestureRef = useRef<HTMLDivElement | null>(null);
  // 灯箱图片的变换使用 MotionValue，避免高频触摸导致重渲染
  const lightboxScale = useMotionValue(1);
  const lightboxX = useMotionValue(0);
  const lightboxY = useMotionValue(0);
  const pinchStartDistanceRef = useRef(0);
  const pinchStartScaleRef = useRef(1);
  const lastTouchPointRef = useRef({ x: 0, y: 0 });
  const lastMidpointRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const isMouseDraggingRef = useRef(false);
  const mouseDragStartRef = useRef({ x: 0, y: 0 });
  const mousePositionStartRef = useRef({ x: 0, y: 0 });
  // 关闭流程控制：复位动画期间锁定交互，避免二次触发
  const isClosingRef = useRef(false);
  const resetAnimationRef = useRef<null | (() => void)>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const id = useId();
  const canHover = useHoverSupport();

  const sharedLayoutId = useMemo(() => `image-viewer-${id}`, [id]);
  const groupId = useMemo(() => `image-viewer-group-${id}`, [id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (src instanceof Blob) {
      const url = URL.createObjectURL(src);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setBlobUrl(null);
  }, [src]);

  const resolvedSrc = typeof src === "string" ? src : blobUrl || undefined;
  const hasSource =
    typeof src === "string" ? src.trim().length > 0 : src instanceof Blob;

  useEffect(() => {
    if (resolvedSrc) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [resolvedSrc]);

  useEffect(() => {
    if (!resolvedSrc) return;
    const image = imageRef.current;
    if (!image) return;
    if (image.complete) {
      if (image.naturalWidth === 0) {
        setImageError(true);
      }
      setImageLoading(false);
    }
  }, [resolvedSrc]);

  // 预加载图片，确保点击打开灯箱时图片已在浏览器缓存中
  // 这可以避免首次打开灯箱时因图片加载延迟导致 layoutId 过渡动画异常
  useEffect(() => {
    if (!resolvedSrc || !enableLightbox) return;

    const preloadImage = new Image();
    preloadImage.src = resolvedSrc;

    return () => {
      // 组件卸载时清理预加载
      preloadImage.src = "";
    };
  }, [resolvedSrc, enableLightbox]);

  // 组件卸载时清理复位动画与定时器
  useEffect(() => {
    return () => {
      if (resetAnimationRef.current) {
        resetAnimationRef.current();
        resetAnimationRef.current = null;
      }
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, []);

  // 关闭时先平滑复位，再触发 layoutId 过渡，避免缩放状态影响动画
  const closeLightbox = useCallback(() => {
    if (!isOpen || isClosingRef.current) return;
    const hasTransform =
      Math.abs(lightboxScale.get() - MIN_LIGHTBOX_SCALE) > 0.01 ||
      Math.abs(lightboxX.get()) > 0.5 ||
      Math.abs(lightboxY.get()) > 0.5;

    isPanningRef.current = false;
    pinchStartDistanceRef.current = 0;
    suppressClickRef.current = false;

    if (hasTransform) {
      isClosingRef.current = true;
      suppressClickRef.current = true;

      if (resetAnimationRef.current) {
        resetAnimationRef.current();
        resetAnimationRef.current = null;
      }
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      const controls = [
        animate(lightboxScale, MIN_LIGHTBOX_SCALE, {
          duration: RESET_ANIMATION_DURATION,
          // ease: "easeOut",
          type: "spring",
          bounce: 0,
        }),
        animate(lightboxX, 0, {
          duration: RESET_ANIMATION_DURATION,
          // ease: "easeOut",
          type: "spring",
          bounce: 0,
        }),
        animate(lightboxY, 0, {
          duration: RESET_ANIMATION_DURATION,
          // ease: "easeOut",
          type: "spring",
          bounce: 0,
        }),
      ];

      resetAnimationRef.current = () => {
        controls.forEach((control) => control.stop());
      };

      // 动画结束后再关闭灯箱
      resetTimeoutRef.current = window.setTimeout(() => {
        lightboxScale.set(MIN_LIGHTBOX_SCALE);
        lightboxX.set(0);
        lightboxY.set(0);
        resetTimeoutRef.current = null;
        resetAnimationRef.current = null;
        isClosingRef.current = false;
        suppressClickRef.current = false;
        setIsOpen(false);
      }, RESET_ANIMATION_DURATION * 1000);
      return;
    }

    lightboxScale.set(MIN_LIGHTBOX_SCALE);
    lightboxX.set(0);
    lightboxY.set(0);
    setIsOpen(false);
  }, [isOpen, lightboxScale, lightboxX, lightboxY]);

  usePreventScroll({
    enabled: isOpen,
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    },
  });

  useEffect(() => {
    if (!enableLightbox && isOpen) {
      closeLightbox();
    }
  }, [closeLightbox, enableLightbox, isOpen]);

  // 打开时重置状态，防止复位动画残留
  useEffect(() => {
    if (!isOpen) return;
    if (resetAnimationRef.current) {
      resetAnimationRef.current();
      resetAnimationRef.current = null;
    }
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    lightboxScale.set(1);
    lightboxX.set(0);
    lightboxY.set(0);
    isPanningRef.current = false;
    isMouseDraggingRef.current = false;
    suppressClickRef.current = false;
    isClosingRef.current = false;
  }, [isOpen, lightboxScale, lightboxX, lightboxY]);

  // 避免 Safari 手势缩放影响页面级别缩放
  useEffect(() => {
    if (!isOpen) return;
    const preventGesture = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    document.addEventListener("gestureend", preventGesture);

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
    };
  }, [isOpen]);

  // 触摸手势：单指平移，双指捏合缩放
  const handleLightboxTouchStart = (event: React.TouchEvent) => {
    if (isClosingRef.current) return;
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      lastTouchPointRef.current = { x: touch.clientX, y: touch.clientY };
      isPanningRef.current = lightboxScale.get() > MIN_LIGHTBOX_SCALE;
      suppressClickRef.current = false;
    } else if (event.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(event.touches);
      pinchStartScaleRef.current = lightboxScale.get();
      lastMidpointRef.current = getTouchMidpoint(event.touches);
      isPanningRef.current = false;
      suppressClickRef.current = true;
      event.preventDefault();
    }
  };

  const handleLightboxTouchMove = (event: React.TouchEvent) => {
    if (isClosingRef.current) return;
    if (event.touches.length === 1 && isPanningRef.current) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchPointRef.current.x;
      const deltaY = touch.clientY - lastTouchPointRef.current.y;

      if (
        Math.abs(deltaX) > TOUCH_MOVE_THRESHOLD ||
        Math.abs(deltaY) > TOUCH_MOVE_THRESHOLD
      ) {
        suppressClickRef.current = true;
      }

      lightboxX.set(lightboxX.get() + deltaX);
      lightboxY.set(lightboxY.get() + deltaY);
      lastTouchPointRef.current = { x: touch.clientX, y: touch.clientY };
      event.preventDefault();
      return;
    }

    if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches);
      if (pinchStartDistanceRef.current === 0) return;

      const nextScale = clamp(
        pinchStartScaleRef.current * (distance / pinchStartDistanceRef.current),
        MIN_LIGHTBOX_SCALE,
        MAX_LIGHTBOX_SCALE
      );

      const rect = lightboxGestureRef.current?.getBoundingClientRect();
      const midpoint = getTouchMidpoint(event.touches);
      const currentScale = lightboxScale.get() || MIN_LIGHTBOX_SCALE;
      const scaleFactor = nextScale / currentScale;
      const deltaMidX = midpoint.x - lastMidpointRef.current.x;
      const deltaMidY = midpoint.y - lastMidpointRef.current.y;

      if (rect) {
        const offsetX = midpoint.x - rect.left;
        const offsetY = midpoint.y - rect.top;
        const currentX = lightboxX.get();
        const currentY = lightboxY.get();

        lightboxX.set(currentX + deltaMidX + offsetX * (1 - scaleFactor));
        lightboxY.set(currentY + deltaMidY + offsetY * (1 - scaleFactor));
      }

      lightboxScale.set(nextScale);
      lastMidpointRef.current = midpoint;
      suppressClickRef.current = true;
      event.preventDefault();
    }
  };

  const handleLightboxTouchEnd = (event: React.TouchEvent) => {
    if (isClosingRef.current) return;
    if (event.touches.length === 0) {
      isPanningRef.current = false;
      pinchStartDistanceRef.current = 0;
      if (lightboxScale.get() <= MIN_LIGHTBOX_SCALE + 0.01) {
        lightboxScale.set(MIN_LIGHTBOX_SCALE);
        lightboxX.set(0);
        lightboxY.set(0);
      }
      return;
    }

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      lastTouchPointRef.current = { x: touch.clientX, y: touch.clientY };
      isPanningRef.current = lightboxScale.get() > MIN_LIGHTBOX_SCALE;
    }
  };

  // 鼠标拖拽移动（仅在缩放后允许）
  const handleLightboxMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (isClosingRef.current) return;
      if (event.button !== 0) return;
      if (lightboxScale.get() <= MIN_LIGHTBOX_SCALE + 0.001) return;

      isMouseDraggingRef.current = true;
      mouseDragStartRef.current = { x: event.clientX, y: event.clientY };
      mousePositionStartRef.current = {
        x: lightboxX.get(),
        y: lightboxY.get(),
      };
      suppressClickRef.current = false;
      event.preventDefault();
    },
    [lightboxScale, lightboxX, lightboxY]
  );

  // 桌面端滚轮/触控板缩放
  const handleLightboxWheel = useCallback(
    (event: React.WheelEvent) => {
      if (isClosingRef.current) return;
      event.preventDefault();

      const currentScale = lightboxScale.get();
      let nextScale = currentScale;

      if (event.ctrlKey) {
        // 触控板 pinch-to-zoom（带 ctrlKey）
        const zoomFactor = 1 - event.deltaY * TRACKPAD_ZOOM_SENSITIVITY;
        nextScale = clamp(
          currentScale * zoomFactor,
          MIN_LIGHTBOX_SCALE,
          MAX_LIGHTBOX_SCALE
        );
      } else {
        // 鼠标滚轮缩放
        const delta = event.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
        nextScale = clamp(
          currentScale + delta,
          MIN_LIGHTBOX_SCALE,
          MAX_LIGHTBOX_SCALE
        );
      }

      if (Math.abs(nextScale - currentScale) < 0.0001) return;

      if (nextScale <= MIN_LIGHTBOX_SCALE + 0.001) {
        lightboxScale.set(MIN_LIGHTBOX_SCALE);
        lightboxX.set(0);
        lightboxY.set(0);
        suppressClickRef.current = true;
        return;
      }

      const rect = lightboxGestureRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const scaleFactor = nextScale / currentScale;
        const currentX = lightboxX.get();
        const currentY = lightboxY.get();

        lightboxX.set(currentX + offsetX * (1 - scaleFactor));
        lightboxY.set(currentY + offsetY * (1 - scaleFactor));
      }

      lightboxScale.set(nextScale);
      suppressClickRef.current = true;
    },
    [lightboxScale, lightboxX, lightboxY]
  );

  // 监听全局鼠标移动/释放，保证拖拽不中断
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (isClosingRef.current) return;
      if (!isMouseDraggingRef.current) return;

      const deltaX = event.clientX - mouseDragStartRef.current.x;
      const deltaY = event.clientY - mouseDragStartRef.current.y;

      if (
        Math.abs(deltaX) > TOUCH_MOVE_THRESHOLD ||
        Math.abs(deltaY) > TOUCH_MOVE_THRESHOLD
      ) {
        suppressClickRef.current = true;
      }

      lightboxX.set(mousePositionStartRef.current.x + deltaX);
      lightboxY.set(mousePositionStartRef.current.y + deltaY);
    };

    const handleMouseUp = () => {
      if (!isMouseDraggingRef.current) return;
      isMouseDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, lightboxX, lightboxY]);

  const handleLightboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    closeLightbox();
  };

  if (!hasSource) {
    return (
      <span
        className={cn(
          "inline-block my-4 w-full border border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center text-sm text-muted-foreground",
          roundedClasses[rounded],
          wrapperClassName
        )}
      >
        {alt ? `图片占位: ${alt}` : "图片链接为空"}
      </span>
    );
  }

  if (!resolvedSrc) {
    return (
      <span
        className={cn(
          "inline-block my-6 w-full overflow-hidden",
          roundedClasses[rounded],
          wrapperClassName
        )}
      >
        <span className="flex h-48 w-full items-center justify-center bg-muted/20">
          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
        </span>
      </span>
    );
  }

  if (imageError) {
    return (
      <span
        className={cn(
          "inline-flex w-full flex-col items-center justify-center my-6 p-8 border border-muted-foreground/20 bg-muted/10 text-center",
          roundedClasses[rounded],
          wrapperClassName
        )}
      >
        <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <span className="text-sm font-medium text-muted-foreground/70 mb-1 block">
          图片加载失败
        </span>
        {alt && (
          <span className="text-xs text-muted-foreground/50 block">{alt}</span>
        )}
        <span className="text-xs text-muted-foreground/40 mt-2 font-mono break-all max-w-full block">
          {resolvedSrc}
        </span>
      </span>
    );
  }

  const inlineRoundedClass = roundedClasses[rounded];
  const lightboxRoundedClass =
    roundedClasses[lightboxRounded ?? rounded] ?? roundedClasses.lg;
  const canPreview = enableLightbox && !imageError;
  const paddingValue = Math.max(16, lightboxPadding);
  const maxSizeStyle = {
    width: `calc(100vw - ${paddingValue * 2}px)`,
    height: `calc(100vh - ${paddingValue * 2}px)`,
  };

  return (
    <LayoutGroup id={groupId}>
      <span className={cn("inline-block my-6 w-full", wrapperClassName)}>
        <motion.button
          type="button"
          className={cn(
            "group relative inline-block max-w-full bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            inlineRoundedClass,
            canPreview ? "cursor-zoom-in" : "cursor-default"
          )}
          whileHover={
            canHover && hoverScale != null
              ? {
                scale: hoverScale,
                transition: {
                  type: "spring",
                  bounce: hoverBounce ?? 0.25,
                  duration: hoverDuration,
                },
              }
              : undefined
          }
          whileTap={
            hoverScale != null
              ? {
                scale: 0.97,
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: hoverDuration * 0.5,
                },
              }
              : undefined
          }
          transition={
            hoverScale != null
              ? {
                type: "spring",
                bounce: hoverBounce ?? 0.25,
                duration: hoverDuration,
              }
              : undefined
          }
          onClick={() => {
            if (canPreview) setIsOpen(true);
          }}
        >
          <AnimatePresence>
            {imageLoading && (
              <motion.span
                key="image-skeleton"
                aria-hidden
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "absolute inset-0 z-1",
                  inlineRoundedClass
                )}
              >
                <div className={cn("h-full w-full bg-accent animate-pulse", inlineRoundedClass)}></div>
              </motion.span>
            )}
          </AnimatePresence>
          <motion.img
            layoutId={sharedLayoutId}
            ref={imageRef}
            src={resolvedSrc}
            alt={alt || ""}
            title={title}
            draggable={selectable}
            className={cn(
              "block h-auto max-w-full",
              !selectable && "select-none",
              inlineRoundedClass,
              className
            )}
            style={{
              maxHeight: formatSize(maxHeight),
              maxWidth: formatSize(maxWidth),
              opacity: imageLoading ? 0 : 1,
              filter: imageLoading ? "blur(6px)" : "blur(0px)",
              transition: "opacity 0.5s ease-out, filter 0.5s ease-out",
              ...(!selectable && { WebkitTouchCallout: "none" }),
            }}
            loading={loading}
            onLoad={(event) => {
              setImageLoading(false);
              onLoad?.(event);
            }}
            onError={(event) => {
              setImageError(true);
              setImageLoading(false);
              onError?.(event);
            }}
            {...props}
          />
        </motion.button>
      </span>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center select-none"
                role="dialog"
                aria-modal="true"
                aria-label={alt ? `查看图片：${alt}` : "查看图片"}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-black/60 dark:bg-black/70",
                    overlayBlur && "backdrop-blur-sm",
                    overlayClassName
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeLightbox();
                  }}
                />

                <motion.div
                  className="relative z-10 flex items-center justify-center cursor-zoom-out"
                  style={maxSizeStyle}
                  onClick={handleLightboxClick}
                >
                  <motion.div
                    ref={lightboxGestureRef}
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      x: lightboxX,
                      y: lightboxY,
                      scale: lightboxScale,
                      transformOrigin: "0 0",
                      touchAction: "none",
                    }}
                    onTouchStart={handleLightboxTouchStart}
                    onTouchMove={handleLightboxTouchMove}
                    onTouchEnd={handleLightboxTouchEnd}
                    onTouchCancel={handleLightboxTouchEnd}
                    onMouseDown={handleLightboxMouseDown}
                    onWheel={handleLightboxWheel}
                  >
                    <motion.img
                      layoutId={sharedLayoutId}
                      src={resolvedSrc}
                      alt={alt || ""}
                      title={title}
                      draggable={selectable}
                      className={cn(
                        "h-auto w-auto max-h-full max-w-full object-contain shadow-2xl",
                        !selectable && "select-none",
                        lightboxRoundedClass,
                        lightboxClassName
                      )}
                      style={
                        !selectable
                          ? { WebkitTouchCallout: "none" }
                          : undefined
                      }
                      // 灯箱图片使用 eager 加载，配合预加载确保过渡动画流畅
                      loading="eager"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </LayoutGroup>
  );
}
