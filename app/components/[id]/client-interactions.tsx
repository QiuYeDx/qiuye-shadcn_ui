"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveTabs,
  type TabItem,
} from "@/components/qiuye-ui/responsive-tabs";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

// ============ 包管理器 localStorage Hook ============
type PackageManager = "npm" | "pnpm";

const STORAGE_KEY = "qiuye-ui-package-manager";
const DEFAULT_PM: PackageManager = "pnpm";

// 用于跨组件同步的订阅机制
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): PackageManager {
  if (typeof window === "undefined") return DEFAULT_PM;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "npm" || stored === "pnpm" ? stored : DEFAULT_PM;
}

function getServerSnapshot(): PackageManager {
  return DEFAULT_PM;
}

function usePackageManager() {
  const packageManager = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setPackageManager = useCallback((pm: PackageManager) => {
    localStorage.setItem(STORAGE_KEY, pm);
    notifyListeners();
  }, []);

  return { packageManager, setPackageManager };
}

const pmItems: TabItem[] = [
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm" },
];

// 包管理器选择器组件
function PackageManagerSelector() {
  const { packageManager, setPackageManager } = usePackageManager();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground shrink-0">包管理器:</span>
      <ResponsiveTabs
        value={packageManager}
        onValueChange={(value) => setPackageManager(value as PackageManager)}
        items={pmItems}
        layout="grid"
        gridColsClass="grid-cols-2"
        listClassName="w-[140px] h-8"
        triggerClassName="text-xs"
        scrollButtons={false}
        fadeMasks={false}
      />
    </div>
  );
}

// ============ 通用组件 ============

// 返回按钮组件
export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="flex items-center gap-2 cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      返回
    </Button>
  );
}

// CLI 命令复制按钮组件
interface CopyCommandButtonProps {
  cliName: string;
}

export function CopyCommandButton({ cliName }: CopyCommandButtonProps) {
  const clipboard = useClipboard();
  const [copiedCommand, setCopiedCommand] = useState(false);
  const { packageManager } = usePackageManager();

  const generateCommand = () => {
    const prefix = packageManager === "npm" ? "npx" : "pnpm dlx";
    return `${prefix} shadcn@latest add @qiuye-ui/${cliName}`;
  };

  const handleCopyCommand = () => {
    const command = generateCommand();
    clipboard.copy(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
    toast.success("复制成功！", {
      description: `已复制命令: ${command}`,
    });
  };

  return (
    <div className="space-y-3">
      <PackageManagerSelector />

      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <code className="text-sm font-mono">{generateCommand()}</code>
          <Button
            onClick={handleCopyCommand}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            {copiedCommand ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// 导入代码复制按钮组件
interface CopyCodeButtonProps {
  componentName: string;
  cliName: string;
}

export function CopyCodeButton({
  componentName,
  cliName,
}: CopyCodeButtonProps) {
  const clipboard = useClipboard();
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    const importCode = `import { ${componentName.replace(/\s+/g, "")} } from "@/components/qiuye-ui/${cliName}";`;
    clipboard.copy(importCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success("复制成功！", {
      description: "已复制导入代码",
    });
  };

  return (
    <Button
      onClick={handleCopyCode}
      variant="outline"
      className="w-full"
      size="sm"
    >
      {copiedCode ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Code className="h-4 w-4" />
      )}
      {copiedCode ? "已复制" : "复制导入"}
    </Button>
  );
}

// 依赖复制按钮组件（使用全局 packageManager）
interface CopyDependencyButtonProps {
  dependency: string;
}

function CopyDependencyButton({ dependency }: CopyDependencyButtonProps) {
  const clipboard = useClipboard();
  const { packageManager } = usePackageManager();

  const handleCopyDependency = () => {
    const command = `${packageManager} ${packageManager === "npm" ? "install" : "add"} ${dependency}`;
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: `已复制安装命令: ${command}`,
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopyDependency}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}

// 批量复制依赖按钮组件（使用全局 packageManager）
interface CopyAllDependenciesButtonProps {
  dependencies: string[];
}

function CopyAllDependenciesButton({
  dependencies,
}: CopyAllDependenciesButtonProps) {
  const clipboard = useClipboard();
  const { packageManager } = usePackageManager();

  const handleCopyAllDependencies = () => {
    const installCmd = packageManager === "npm" ? "install" : "add";
    const command = `${packageManager} ${installCmd} ${dependencies.join(" ")}`;
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: "已复制批量安装命令",
    });
  };

  return (
    <Button variant="outline" onClick={handleCopyAllDependencies}>
      <Copy className="h-4 w-4" />
      复制安装命令
    </Button>
  );
}

// 依赖项区块组件（使用全局 packageManager，不再显示选择器）
interface DependenciesSectionProps {
  dependencies: string[];
}

// 组件详情页标签区域（受控 ResponsiveTabs 包装器，供 server component 使用）
interface ComponentDetailTabsProps {
  items: TabItem[];
  children: React.ReactNode;
  defaultValue?: string;
  layout?: "responsive" | "scroll" | "grid";
  gridColsClass?: string;
  listClassName?: string;
  className?: string;
}

export function ComponentDetailTabs({
  items,
  children,
  defaultValue,
  layout = "grid",
  gridColsClass,
  listClassName,
  className,
}: ComponentDetailTabsProps) {
  const [tab, setTab] = useState(defaultValue ?? items[0]?.value ?? "");

  return (
    <ResponsiveTabs
      value={tab}
      onValueChange={setTab}
      items={items}
      layout={layout}
      gridColsClass={gridColsClass}
      listClassName={listClassName}
      className={className}
    >
      {children}
    </ResponsiveTabs>
  );
}

export function DependenciesSection({
  dependencies,
}: DependenciesSectionProps) {
  const { packageManager } = usePackageManager();

  const generateInstallCommand = () => {
    const installCmd = packageManager === "npm" ? "install" : "add";
    return `${packageManager} ${installCmd} ${dependencies.join(" ")}`;
  };

  if (dependencies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        该组件无额外依赖
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 依赖列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dependencies.map((dep) => (
          <div
            key={dep}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <code className="font-mono text-sm">{dep}</code>
            <CopyDependencyButton dependency={dep} />
          </div>
        ))}
      </div>

      <div className="h-px bg-border" />

      {/* 一键安装所有依赖 */}
      <div>
        <h4 className="font-semibold mb-2">一键安装所有依赖</h4>
        <div className="bg-muted/50 rounded-md p-3 mb-3">
          <code className="text-sm font-mono">{generateInstallCommand()}</code>
        </div>
        <CopyAllDependenciesButton dependencies={dependencies} />
      </div>
    </div>
  );
}
