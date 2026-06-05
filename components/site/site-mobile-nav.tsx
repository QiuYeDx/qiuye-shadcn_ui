"use client";

import Link from "next/link";
import { MenuIcon, PackageIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/site/site-search";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteNavItems } from "@/components/site/site-nav";
import { cn } from "@/lib/utils";

export function SiteMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="size-5" />
          <span className="sr-only">打开导航菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <PackageIcon className="size-4" />
            </div>
            <div className="text-left">
              <SheetTitle>QiuYe UI</SheetTitle>
              <SheetDescription>Based on shadcn/ui</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav className="grid gap-1 px-4">
          {siteNavItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  active && "bg-accent text-accent-foreground"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 border-t px-4 pt-4">
          <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
            Tools
          </p>
          <div className="flex items-center gap-2">
            <SiteSearch compact />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
