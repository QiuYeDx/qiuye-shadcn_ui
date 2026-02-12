"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ScrollableDialog,
  ScrollableDialogHeader,
  ScrollableDialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/qiuye-ui/scrollable-dialog";
import { toast } from "sonner";
import { CodeBlock } from "@/components/qiuye-ui/code-block";

interface ViewSourceButtonProps {
  code: string;
  title?: string;
  description?: string;
}

export function ViewSourceButton({
  code,
  title = "查看源码",
  description = "这是该演示的完整源代码",
}: ViewSourceButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("复制成功！", {
        description: "源码已复制到剪贴板",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败", {
        description: "请手动复制代码",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Code className="h-4 w-4" />
        <span className="hidden sm:inline">查看源码</span>
      </Button>

      <ScrollableDialog 
        open={open} 
        onOpenChange={setOpen}
        maxWidth="sm:max-w-[600px] md:max-w-[728px] lg:max-w-4xl xl:max-w-5xl"
        // maxWidth="sm:max-w-[calc(100%-2rem)]"
      >
        <ScrollableDialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </ScrollableDialogHeader>

        <div className="overflow-hidden min-h-0 px-4 py-4">
          <CodeBlock
            language="tsx"
            isDark={isDark}
            displayMode="auto-height"
          >
            {code}
          </CodeBlock>
        </div>

        <ScrollableDialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制代码
                </>
              )}
            </Button>
          </div>
        </ScrollableDialogFooter>
      </ScrollableDialog>
    </>
  );
}
