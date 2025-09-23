"use client"

import * as React from "react"
import {
  BookOpenIcon,
  HomeIcon,
  PaletteIcon,
  PackageIcon,
  CodeIcon,
  TerminalIcon,
  GitBranchIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// 菜单数据
const data = {
  navMain: [
    {
      title: "首页",
      url: "/",
      icon: HomeIcon,
      description: "项目概览和介绍",
    },
    {
      title: "组件列表",
      url: "/components",
      icon: PaletteIcon,
      description: "浏览所有自定义组件",
    },
  ],
  navDevelopment: [
    {
      title: "CLI 工具",
      url: "/cli",
      icon: TerminalIcon,
      description: "命令行工具使用指南",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PackageIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">QiuYe UI</span>
            <span className="truncate text-xs">Based on Shadcn/ui</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>主要功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>使用说明</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navDevelopment.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground truncate">
          © 2025 QiuYe UI
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}

