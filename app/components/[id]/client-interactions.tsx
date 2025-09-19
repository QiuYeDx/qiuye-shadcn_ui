"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="flex items-center gap-2"
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

  const handleCopyCommand = () => {
    const command = `npx shadcn-ui@latest add qiuye-ui/${cliName}`;
    clipboard.copy(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
    toast.success("复制成功！", {
      description: `已复制命令: ${command}`,
    });
  };

  return (
    <Button 
      onClick={handleCopyCommand}
      className="w-full"
      size="sm"
    >
      {copiedCommand ? (
        <CheckCircle className="h-4 w-4 mr-2" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {copiedCommand ? "已复制" : "复制命令"}
    </Button>
  );
}

// 导入代码复制按钮组件
interface CopyCodeButtonProps {
  componentName: string;
  cliName: string;
}

export function CopyCodeButton({ componentName, cliName }: CopyCodeButtonProps) {
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

export function CopyDependencyButton({ dependency }: CopyDependencyButtonProps) {
  const clipboard = useClipboard();

  const handleCopyDependency = () => {
    clipboard.copy(`npm install ${dependency}`);
    toast.success("复制成功！", {
      description: `已复制安装命令: npm install ${dependency}`,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopyDependency}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

// 批量复制依赖按钮组件
interface CopyAllDependenciesButtonProps {
  dependencies: string[];
}

export function CopyAllDependenciesButton({ dependencies }: CopyAllDependenciesButtonProps) {
  const clipboard = useClipboard();

  const handleCopyAllDependencies = () => {
    const command = `npm install ${dependencies.join(" ")}`;
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: "已复制批量安装命令",
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopyAllDependencies}
    >
      <Copy className="h-4 w-4 mr-2" />
      复制安装命令
    </Button>
  );
}
