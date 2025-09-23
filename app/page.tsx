"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CodeIcon,
  LayersIcon,
  PaletteIcon,
  RocketIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "一键CLI安装",
    description:
      "使用 npx shadcn@latest add @qiuye-ui/[component] 命令一键安装组件",
    icon: CodeIcon,
  },
  {
    title: "精美的UI组件",
    description: "精心设计的自定义组件，提升应用的视觉效果和用户体验",
    icon: PaletteIcon,
  },
  {
    title: "基于Shadcn/ui",
    description: "继承Shadcn/ui的设计理念，保持一致性和可定制性",
    icon: StarIcon,
  },
  {
    title: "即插即用",
    description: "无需复杂配置，安装后立即可用，大幅提升开发效率",
    icon: ZapIcon,
  },
  {
    title: "组件浏览器",
    description: "内置组件浏览页面，可视化查看组件效果和使用方法",
    icon: BookOpenIcon,
  },
  {
    title: "TypeScript支持",
    description: "完整的TypeScript类型定义，提供优秀的开发体验",
    icon: LayersIcon,
  },
];

const stats = [
  { label: "自定义组件", value: "3+", numericValue: 3 },
  { label: "CLI支持", value: "✓", numericValue: null },
  { label: "TypeScript", value: "100%", numericValue: 100 },
  { label: "开源免费", value: "✓", numericValue: null },
];

// 计数器组件
function Counter({
  value,
  numericValue,
}: {
  value: string;
  numericValue: number | null;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && numericValue) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev >= numericValue) {
            clearInterval(timer);
            return numericValue;
          }
          return prev + Math.ceil(numericValue / 30);
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  if (!numericValue) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>{count === numericValue ? value : count.toString()}</span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="px-4 py-2">
              <SparklesIcon className="mr-2 h-4 w-4" />
              全新发布
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            QiuYe UI
          </motion.h1>

          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            精心设计的自定义UI组件库，基于 Shadcn/ui 构建。支持一键CLI安装，
            让您的项目开发更加高效、优雅。
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button size="lg" asChild>
                <Link href="/components">
                  浏览组件
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="/cli">
                  <CodeIcon className="mr-2 h-4 w-4" />
                  CLI 工具
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <div className="text-2xl font-bold text-foreground sm:text-3xl">
                  <Counter
                    value={stat.value}
                    numericValue={stat.numericValue}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              为什么选择QiuYe UI？
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              我们提供了高质量的自定义UI组件和完善的CLI工具支持
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 40,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <motion.div
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
                            whileHover={{
                              scale: 1.1,
                              rotate: 5,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <feature.icon className="h-6 w-6 text-primary-foreground" />
                          </motion.div>
                          <CardTitle className="text-xl">
                            {feature.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              立即开始使用组件库
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              一行命令安装组件，让你的开发效率提升 10 倍
            </motion.p>
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" asChild>
                  <Link href="/cli">
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    CLI 使用指南
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" size="lg" asChild>
                  <Link href="/components">
                    浏览组件
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
