"use client";

import * as React from "react";

import { HomePreviewCard } from "@/components/home/home-preview-card";
import { homePreviewComponents } from "@/components/home/home-component-previews";
import {
  homePreviewConfigs,
  type HomePreviewConfig,
} from "@/lib/home-component-preview-config";
import { getAllComponents, getComponent, type ComponentInfo } from "@/lib/registry";
import { ComponentId } from "@/lib/component-constants";

type PreviewItem = {
  component: ComponentInfo;
  config: HomePreviewConfig;
  Preview: React.ComponentType;
};

function createPreviewItems(): PreviewItem[] {
  const configuredIds = new Set(homePreviewConfigs.map((config) => config.id));

  const configuredItems = homePreviewConfigs.flatMap((config) => {
    const component = getComponent(config.id);
    const Preview = homePreviewComponents[config.id];

    if (!component || !Preview) {
      return [];
    }

    return [{ component, config, Preview }];
  });

  const fallbackItems = getAllComponents()
    .filter((component) => !configuredIds.has(component.cliName as ComponentId))
    .flatMap((component) => {
      const id = component.cliName as ComponentId;
      const Preview = homePreviewComponents[id];

      if (!Preview) {
        return [];
      }

      return [
        {
          component,
          config: {
            id,
            size: "compact" as const,
          },
          Preview,
        },
      ];
    });

  return [...configuredItems, ...fallbackItems];
}

export function HomeComponentWall() {
  const items = React.useMemo(() => createPreviewItems(), []);

  return (
    <section className="border-y bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Component previews
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              真实组件，轻量展示
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            首页直接读取 registry，展示当前所有可安装组件；点击详情可进入完整
            Demo、API 和 CLI 命令。
          </p>
        </div>

        <div className="grid auto-rows-[minmax(240px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ component, config, Preview }) => (
            <HomePreviewCard
              key={component.cliName}
              component={component}
              size={config.size}
              featured={config.featured}
            >
              <Preview />
            </HomePreviewCard>
          ))}
        </div>
      </div>
    </section>
  );
}
