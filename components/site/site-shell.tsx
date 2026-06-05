import * as React from "react";

import { SiteHeader } from "@/components/site/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </div>
  );
}
