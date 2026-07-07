"use client";

import Link from "next/link";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";

const CTA_EASE = [0.22, 1, 0.36, 1] as const;

const ctaContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} satisfies Variants;

const ctaItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.42,
      ease: CTA_EASE,
    },
  },
} satisfies Variants;

const ctaActionVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      bounce: 0.14,
    },
  },
} satisfies Variants;

export function HomeCta() {
  const prefersReducedMotion = useReducedMotion();
  const initialState = prefersReducedMotion ? "visible" : "hidden";

  return (
    <motion.section
      className="px-4 py-16 sm:px-6 lg:px-8"
      variants={ctaContainerVariants}
      initial={initialState}
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className="mx-auto grid max-w-screen-lg gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <motion.div variants={ctaItemVariants}>
          <h2 className="text-3xl font-semibold">从一个组件开始。</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            QiuYe UI 组件可以通过 shadcn/ui registry 方式按需安装。
            先浏览组件，再复制安装命令，把需要的代码带进你的项目。
          </p>
        </motion.div>
        <motion.div
          className="flex flex-col gap-3 flex-row"
          variants={ctaContainerVariants}
        >
          <motion.div variants={ctaActionVariants}>
            <Button asChild>
              <Link href="/components">
                浏览全部组件
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div variants={ctaActionVariants}>
            <Button asChild variant="outline">
              <Link href="/cli">
                <RocketIcon className="size-4" />
                快速开始
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
