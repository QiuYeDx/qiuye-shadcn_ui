"use client";

import Link from "next/link";
import { GithubIcon, PackageIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { SiteMobileNav } from "@/components/site/site-mobile-nav";
import { SiteSearch } from "@/components/site/site-search";
import { siteNavItems } from "@/components/site/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const glassSurfaceStyle: React.CSSProperties = {
    backgroundColor: "color-mix(in oklab, var(--background) 76%, transparent)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
  };
  const mobileMenuGlassInitial = {
    backgroundColor: "color-mix(in oklab, var(--background) 0%, transparent)",
    backdropFilter: "blur(0px) saturate(100%)",
    WebkitBackdropFilter: "blur(0px) saturate(100%)",
  };
  const mobileMenuGlassVisible = {
    backgroundColor: "color-mix(in oklab, var(--background) 76%, transparent)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
  };

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-14 bg-background/80",
          mobileNavOpen ? "md:border-b" : "border-b"
        )}
        style={glassSurfaceStyle}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PackageIcon className="size-4" />
          </div>
          <span className="font-semibold">QiuYe UI</span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5 md:hidden">
          <ThemeToggle className="rounded-md" />
          <SiteMobileNav
            open={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
          />
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
          <ThemeToggle className="rounded-md" />
          <Button asChild size="sm">
            <Link href="/cli">Install</Link>
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileNavOpen && (
          <motion.div
            key="site-mobile-menu"
            id="site-mobile-menu"
            initial={mobileMenuGlassInitial}
            animate={mobileMenuGlassVisible}
            exit={mobileMenuGlassInitial}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 top-full z-20 overflow-hidden md:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-background/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-px bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto grid w-full max-w-screen-2xl gap-3 px-4 pb-4 sm:px-6"
            >
              <SiteSearch fullWidth />

              <nav className="grid gap-1">
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
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
