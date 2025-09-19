"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const animationVariants = {
  bounce: {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  },
  pulse: {
    hover: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, repeat: Infinity },
    },
    tap: { scale: 0.95 },
  },
  wiggle: {
    hover: {
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    tap: { scale: 0.95 },
  },
  spin: {
    hover: {
      rotate: 360,
      transition: { duration: 0.8, repeat: Infinity, ease: "linear" as const },
    },
    tap: { scale: 0.95 },
  },
};

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "whileHover" | "whileTap">,
    VariantProps<typeof animatedButtonVariants> {
  animation?: "bounce" | "pulse" | "wiggle" | "spin";
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    { className, variant, size, animation = "bounce", children, ...props },
    ref
  ) => {
    const selectedAnimation = animationVariants[animation];

    return (
      <motion.button
        className={cn(animatedButtonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={selectedAnimation.hover}
        whileTap={selectedAnimation.tap}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
