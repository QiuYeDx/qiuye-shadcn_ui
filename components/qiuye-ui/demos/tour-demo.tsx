"use client";

import React from "react";
import {
  BarChart3,
  CheckCircle2,
  FolderKanban,
  MoveHorizontal,
  PanelLeft,
  Rocket,
  Search,
} from "lucide-react";
import { Tour, type TourStep } from "@/components/qiuye-ui/tour";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tour 组件完整演示 */
export function TourDemo() {
  const [open, setOpen] = React.useState(false);
  const [scrollTourOpen, setScrollTourOpen] = React.useState(false);
  const [wideProjects, setWideProjects] = React.useState(false);
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);

  const steps = React.useMemo<TourStep[]>(
    () => [
      {
        target: "#tour-demo-sidebar",
        title: "Navigation",
        content: "Browse projects, reports, and team workspaces from here.",
        placement: "right",
      },
      {
        target: "#tour-demo-search",
        title: "Search",
        content: "Jump to files, dashboards, and recently updated records.",
        placement: "bottom",
      },
      {
        target: "#tour-demo-projects",
        title: "Projects",
        content:
          "This panel can resize while the tour is open, and the spotlight follows it with a layout transition.",
        placement: "top",
      },
      {
        target: "#tour-demo-insights",
        title: "Insights",
        content: "Review weekly progress and quickly spot important changes.",
        placement: "left",
      },
    ],
    [],
  );

  const scrollSteps = React.useMemo<TourStep[]>(
    () => [
      {
        target: "#tour-scroll-planning",
        title: "Planning complete",
        content: "The release scope is approved and ready for execution.",
        placement: "right",
      },
      {
        target: "#tour-scroll-launch",
        title: "Launch readiness",
        content:
          "The final checkpoint lives farther down the timeline, so moving here triggers a real scrollIntoView transition.",
        placement: "left",
      },
    ],
    [],
  );

  const startScrollTour = () => {
    scrollViewportRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setScrollTourOpen(true);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Product workspace</h3>
            <p className="text-xs text-muted-foreground">
              A compact dashboard mock for Tour interactions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWideProjects((value) => !value)}
            >
              <MoveHorizontal className="size-4" />
              Resize target
            </Button>
            <Button type="button" size="sm" onClick={() => setOpen(true)}>
              Start tour
            </Button>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-[180px_minmax(0,1fr)]">
          <aside
            id="tour-demo-sidebar"
            className="rounded-md border bg-background p-3 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <PanelLeft className="size-4 text-primary" />
              Studio
            </div>
            <nav className="space-y-2 text-sm">
              {["Projects", "Reports", "Members"].map((item, index) => (
                <div
                  key={item}
                  className={cn(
                    "rounded-md px-3 py-2",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item}
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 space-y-3">
            <div
              id="tour-demo-search"
              className="flex min-h-11 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground shadow-sm"
            >
              <Search className="size-4" />
              Search projects or reports
              <Badge
                variant="secondary"
                className="ml-auto hidden sm:inline-flex"
              >
                Cmd K
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <section
                id="tour-demo-projects"
                className={cn(
                  "rounded-md border bg-background p-4 shadow-sm transition-[grid-column] duration-300",
                  wideProjects && "md:col-span-2",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FolderKanban className="size-4 text-primary" />
                    Active projects
                  </div>
                  <Badge variant="outline">8 live</Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Design system", "Billing flow", "Mobile QA", "Docs"].map(
                    (project) => (
                      <div
                        key={project}
                        className="rounded-md bg-muted/60 px-3 py-2 text-xs"
                      >
                        <div className="font-medium">{project}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-background">
                          <div className="h-full w-2/3 rounded-full bg-primary" />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section
                id="tour-demo-insights"
                className="rounded-md border bg-background p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="size-4 text-primary" />
                  Insights
                </div>
                <div className="space-y-3">
                  {[
                    ["Velocity", "+18%"],
                    ["Open issues", "24"],
                    ["Review time", "2.1d"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Release timeline</h3>
            <p className="text-xs text-muted-foreground">
              A long workspace view with checkpoints across the release cycle.
            </p>
          </div>
          <Button type="button" size="sm" onClick={startScrollTour}>
            Start timeline tour
          </Button>
        </div>

        <div
          ref={scrollViewportRef}
          className="h-[360px] overflow-y-auto rounded-lg border bg-muted/20 p-3"
        >
          <section
            id="tour-scroll-planning"
            className="rounded-md border bg-background p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Planning
              </div>
              <Badge variant="outline">Approved</Badge>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Scope, owners, and milestones are aligned for the next release.
            </p>
          </section>

          <div className="flex min-h-[560px] items-center justify-center">
            <div className="w-full max-w-sm space-y-3">
              {["Development", "Quality review", "Go-to-market"].map(
                (milestone, index) => (
                  <div
                    key={milestone}
                    className="flex items-center gap-3 text-xs text-muted-foreground"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background font-mono">
                      {index + 2}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                    <span>{milestone}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <section
            id="tour-scroll-launch"
            className="rounded-md border bg-background p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Rocket className="size-4 text-primary" />
                Launch readiness
              </div>
              <Badge>Final gate</Badge>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Confirm production health, support coverage, and launch
              communications before release.
            </p>
          </section>
        </div>
      </section>

      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        maskClosable
        popoverWidth={340}
      />

      <Tour
        open={scrollTourOpen}
        onOpenChange={setScrollTourOpen}
        steps={scrollSteps}
        maskClosable
        popoverWidth={340}
      />
    </div>
  );
}
