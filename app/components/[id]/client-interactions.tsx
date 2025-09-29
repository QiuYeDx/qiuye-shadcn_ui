"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";
import { ComponentInfo } from "@/lib/registry";

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
  const [packageManager, setPackageManager] = useState<"npm" | "pnpm">("pnpm");

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
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">包管理器:</span>
        <Tabs
          value={packageManager}
          onValueChange={(value) => setPackageManager(value as "npm" | "pnpm")}
        >
          <TabsList className="grid w-[140px] grid-cols-2 h-8">
            <TabsTrigger value="npm" className="text-xs">
              npm
            </TabsTrigger>
            <TabsTrigger value="pnpm" className="text-xs">
              pnpm
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
        <CheckCircle className="h-4 w-4 mr-2" />
      ) : (
        <Code className="h-4 w-4 mr-2" />
      )}
      {copiedCode ? "已复制" : "复制导入"}
    </Button>
  );
}

// 依赖复制按钮组件
interface CopyDependencyButtonProps {
  dependency: string;
}

export function CopyDependencyButton({
  dependency,
}: CopyDependencyButtonProps) {
  const clipboard = useClipboard();

  const handleCopyDependency = () => {
    clipboard.copy(`npm install ${dependency}`);
    toast.success("复制成功！", {
      description: `已复制安装命令: npm install ${dependency}`,
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopyDependency}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}

// 批量复制依赖按钮组件
interface CopyAllDependenciesButtonProps {
  dependencies: string[];
}

export function CopyAllDependenciesButton({
  dependencies,
}: CopyAllDependenciesButtonProps) {
  const clipboard = useClipboard();

  const handleCopyAllDependencies = () => {
    const command = `npm install ${dependencies.join(" ")}`;
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: "已复制批量安装命令",
    });
  };

  return (
    <Button variant="outline" onClick={handleCopyAllDependencies}>
      <Copy className="h-4 w-4 mr-2" />
      复制安装命令
    </Button>
  );
}
