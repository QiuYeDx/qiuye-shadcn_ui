"use client";

import * as React from "react";
import Link from "next/link";
import { HomeIcon, MenuIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const components = [
  {
    title: "首页",
    href: "/",
    description: "欢迎来到QiuYe UI",
  },
  {
    title: "组件列表",
    href: "/components",
    description: "丰富的UI组件库",
  },
  {
    title: "CLI 工具",
    href: "/cli",
    description: "CLI 工具与使用说明",
  },
];

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center">
          <SidebarTrigger className="ml-2 mr-1 size-9 cursor-pointer" />
          <Link
            href="/"
            className="mr-1 flex shrink-0 items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="hidden font-bold sm:inline-block">首页</span>
          </Link>
          <Link
            href="/components"
            className="mr-1 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
          >
            组件列表
          </Link>
          <Link
            href="/cli"
            className="mr-1 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
          >
            CLI 工具
          </Link>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            toggleSidebar();
          }}
          className="mx-1 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">切换菜单</span>
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* TODO: 后续支持搜索功能后再放开 */}
          {/* <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索..."
                className="pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div> */}
          <nav className="flex items-center ml-auto mr-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
