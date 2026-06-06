"use client";

import Link from "next/link";
import { ArrowRightIcon, Code2Icon, SparklesIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HomeHeroProps {
  componentCount: number;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.07,
    },
  },
} satisfies Variants;

const heroItemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.48,
      ease: EASE_OUT,
    },
  },
} satisfies Variants;

const heroTitleVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      duration: 0.62,
      bounce: 0.12,
    },
  },
} satisfies Variants;

const heroActionsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
} satisfies Variants;

const heroActionVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.42,
      bounce: 0.16,
    },
  },
} satisfies Variants;

export function HomeHero({ componentCount }: HomeHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const initialState = prefersReducedMotion ? "visible" : "hidden";

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <motion.div
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
        variants={heroContainerVariants}
        initial={initialState}
        animate="visible"
      >
        <motion.div variants={heroItemVariants}>
          <Badge variant="secondary" className="mb-6 rounded-full px-3 py-1">
            <SparklesIcon className="size-3.5" />
            {componentCount} components ready to install
          </Badge>
        </motion.div>

        <motion.h1
          className="max-w-4xl text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl"
          variants={heroTitleVariants}
        >
          QiuYe UI
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-xl"
          variants={heroItemVariants}
        >
          一组基于 shadcn/ui 构建的高质量自定义组件。复制、安装、组合，
          然后把它变成你自己的设计系统。
        </motion.p>

        <motion.div
          className="mt-8 flex flex-row items-center gap-3"
          variants={heroActionsVariants}
        >
          <motion.div variants={heroActionVariants}>
            <Button asChild size="lg">
              <Link href="/components">
                浏览组件
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div variants={heroActionVariants}>
            <Button asChild variant="outline" size="lg">
              <Link href="/cli">
                <Code2Icon className="size-4" />
                CLI 安装
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
