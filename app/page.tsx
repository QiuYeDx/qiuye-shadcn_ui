import Link from "next/link";
import { ArrowRightIcon, TerminalIcon } from "lucide-react";

import { HomeComponentWall } from "@/components/home/home-component-wall";
import { HomeHero } from "@/components/home/home-hero";
import { Button } from "@/components/ui/button";
import { getAllComponents } from "@/lib/registry";

export default function Home() {
  const componentCount = getAllComponents().length;

  return (
    <div className="bg-background">
      <HomeHero componentCount={componentCount} />
      <HomeComponentWall />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-screen-lg gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">从一个组件开始。</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              QiuYe UI 组件可以通过 shadcn/ui registry 方式按需安装。
              先浏览组件，再复制 CLI 命令，把需要的代码带进你的项目。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Button asChild>
              <Link href="/components">
                浏览全部组件
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cli">
                <TerminalIcon className="size-4" />
                CLI 指南
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
