"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllComponents, searchComponents } from "@/lib/registry";
import { cn } from "@/lib/utils";

interface SiteSearchProps {
  compact?: boolean;
  className?: string;
}

export function SiteSearch({ compact = false, className }: SiteSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const allComponents = React.useMemo(() => getAllComponents(), []);
  const results = React.useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return allComponents.slice(0, 8);
    }
    return searchComponents(trimmed).slice(0, 8);
  }, [allComponents, query]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="icon" className={className}>
            <SearchIcon className="size-5" />
            <span className="sr-only">搜索组件</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className={cn(
              "hidden h-9 w-[240px] justify-start gap-2 rounded-md bg-muted/45 px-3 text-muted-foreground shadow-none lg:flex xl:w-[300px]",
              className
            )}
          >
            <SearchIcon className="size-4" />
            <span className="min-w-0 flex-1 truncate text-left">
              Search components...
            </span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground xl:inline-flex">
              ⌘K
            </kbd>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>搜索组件</DialogTitle>
          <DialogDescription>
            输入组件名称、分类或标签，快速打开对应文档。
          </DialogDescription>
        </DialogHeader>
        <div className="border-b p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components..."
              className="pl-9"
            />
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((component) => (
                <DialogClose key={component.cliName} asChild>
                  <Link
                    href={`/components/${component.cliName}`}
                    className="rounded-md p-3 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {component.name}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {component.description}
                        </p>
                      </div>
                      <Badge variant="secondary">{component.category}</Badge>
                    </div>
                  </Link>
                </DialogClose>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-medium">没有找到组件</p>
              <p className="mt-1 text-sm text-muted-foreground">
                换一个关键词试试。
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
