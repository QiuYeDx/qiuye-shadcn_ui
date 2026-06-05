import Link from "next/link";
import { ArrowRightIcon, Code2Icon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HomeHeroProps {
  componentCount: number;
}

export function HomeHero({ componentCount }: HomeHeroProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Badge variant="secondary" className="mb-6 rounded-full px-3 py-1">
          <SparklesIcon className="size-3.5" />
          {componentCount} components ready to install
        </Badge>

        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
          QiuYe UI
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-xl">
          一组基于 shadcn/ui 构建的高质量自定义组件。复制、安装、组合，
          然后把它变成你自己的设计系统。
        </p>

        <div className="mt-8 flex flex-row items-center gap-3">
          <Button asChild size="lg">
            <Link href="/components">
              浏览组件
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cli">
              <Code2Icon className="size-4" />
              CLI 安装
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
