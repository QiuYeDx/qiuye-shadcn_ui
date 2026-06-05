"use client";

import Link from "next/link";
import { GithubIcon, PackageIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { SiteMobileNav } from "@/components/site/site-mobile-nav";
import { SiteSearch } from "@/components/site/site-search";
import { siteNavItems } from "@/components/site/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-screen max-w-full overflow-hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PackageIcon className="size-4" />
          </div>
          <span className="font-semibold">QiuYe UI</span>
        </Link>

        <div className="md:hidden">
          <SiteMobileNav />
        </div>

        <nav className="ml-5 hidden items-center gap-1 md:flex">
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
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  active && "text-foreground"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden min-w-max shrink-0 items-center gap-1.5 md:flex">
          <div className="hidden lg:block">
            <SiteSearch />
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="https://github.com/qiuyedx/qiuye-shadcn_ui"
              target="_blank"
              rel="noreferrer"
              aria-label="打开 GitHub 仓库"
            >
              <GithubIcon className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/cli">Install</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}
