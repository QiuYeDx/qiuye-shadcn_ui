"use client";

import { MenuIcon, XIcon } from "lucide-react";

import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";

interface SiteMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SiteMobileNav({ open, onOpenChange }: SiteMobileNavProps) {
  return (
    <DualStateToggle
      active={open}
      onToggle={onOpenChange}
      activeIcon={<XIcon />}
      inactiveIcon={<MenuIcon />}
      activeLabel="关闭导航菜单"
      inactiveLabel="打开导航菜单"
      variant="ghost"
      effect="rotate"
      transitionDuration={0.22}
      className="md:hidden"
      aria-expanded={open}
      aria-controls="site-mobile-menu"
    />
  );
}
