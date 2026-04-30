"use client";

import React, { useMemo, useState } from "react";
import {
  ChatMarkdownRenderer,
  MarkdownRenderer,
  type MarkdownWidgetAction,
} from "@/components/qiuye-ui/markdown-renderer";
import {
  CODE_BLOCK_COLOR_THEME_NAMES,
  type CodeBlockColorThemeName,
} from "@/components/qiuye-ui/code-block";
import {
  ResponsiveTabs,
  type TabItem,
} from "@/components/qiuye-ui/responsive-tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const blogMarkdown = [
  "# 文章预设",
  "",
  "这是一段来自 **QiuYe UI** 的 Markdown 内容，支持 `inline code`、GFM 表格、标题锚点、代码块标题与行高亮。",
  "",
  "## 能力清单",
  "",
  "- GFM 表格和列表",
  "- CodeBlock 高亮与复制",
  "- 图片预览与 Mermaid 图表",
  "- 可插拔 Widget 运行时",
  "",
  "## 表格",
  "",
  "| 能力 | 默认策略 | 适用场景 |",
  "| --- | --- | --- |",
  "| Blog | trusted + article density | 长文、文档、知识库 |",
  "| Chat | untrusted + compact density | AI 会话、流式回复 |",
  "",
  "## 代码块",
  "",
  "```tsx title=\"hello.tsx\" {3-5}",
  "export function HelloCard() {",
  "  return (",
  "    <section className=\"rounded-lg border p-4\">",
  "      <h2>Hello Markdown</h2>",
  "      <p>Rendered by QiuYe UI.</p>",
  "    </section>",
  "  );",
  "}",
  "```",
  "",
  "## Mermaid",
  "",
  "```mermaid",
  "flowchart LR",
  "  A[Markdown] --> B[Preset]",
  "  B --> C{Code block?}",
  "  C -->|mermaid| D[MermaidBlock]",
  "  C -->|tsx| E[CodeBlock]",
  "```",
  "",
  "> Blog 预设默认允许原始 HTML，更适合可信内容源。",
].join("\n");

const chatMarkdown = [
  "我会用更紧凑的排版渲染会话内容，并默认关闭原始 HTML。",
  "",
  "```ts title=\"answer.ts\" {2}",
  "const status = \"ready\";",
  "console.log(status);",
  "```",
  "",
  "```qv:tool-call id=\"search-registry\"",
  "{",
  "  \"name\": \"search_registry\",",
  "  \"status\": \"success\",",
  "  \"input\": { \"query\": \"markdown renderer\" },",
  "  \"output\": { \"matches\": 1 }",
  "}",
  "```",
  "",
  "```qv:reference-card id=\"docs-link\"",
  "{",
  "  \"title\": \"QiuYe UI 组件列表\",",
  "  \"href\": \"/components\",",
  "  \"description\": \"查看已注册的自定义组件和安装命令。\"",
  "}",
  "```",
  "",
  "```qv:artifact id=\"draft-file\"",
  "{",
  "  \"title\": \"markdown-renderer-demo.tsx\",",
  "  \"type\": \"code\",",
  "  \"language\": \"tsx\",",
  "  \"content\": \"<MarkdownRenderer content={content} />\"",
  "}",
  "```",
].join("\n");

const tabItems: TabItem[] = [
  { value: "blog", label: "Blog 预设" },
  { value: "chat", label: "Chat 预设" },
];

export function MarkdownRendererDemo() {
  const [tab, setTab] = useState("blog");
  const [theme, setTheme] = useState<CodeBlockColorThemeName>("github");
  const [actions, setActions] = useState<MarkdownWidgetAction[]>([]);

  const widgetContext = useMemo(
    () => ({
      conversationId: "demo-conversation",
      messageId: "assistant-1",
      role: "assistant" as const,
      onWidgetAction: (action: MarkdownWidgetAction) => {
        setActions((current) => [action, ...current].slice(0, 3));
      },
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">主题</p>
        <ResponsiveTabs
          value={theme}
          onValueChange={(value) => setTheme(value as CodeBlockColorThemeName)}
          items={CODE_BLOCK_COLOR_THEME_NAMES.map((name) => ({
            value: name,
            label: name,
          }))}
          layout="scroll"
          size="sm"
          scrollButtons
          fadeMasks
        />
      </div>

      <ResponsiveTabs
        value={tab}
        onValueChange={setTab}
        items={tabItems}
        layout="grid"
        gridColsClass="grid-cols-2"
      >
        <div className="mt-6">
          {tab === "blog" ? (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>BlogMarkdownRenderer</CardTitle>
                  <Badge variant="secondary">trusted</Badge>
                  <Badge variant="outline">article</Badge>
                </div>
                <CardDescription>
                  面向长文内容，启用标题锚点、Mermaid 预览和图片查看器。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer
                  content={blogMarkdown}
                  codeBlockDisplayMode="collapse"
                  codeBlockMaxLines={8}
                  codeBlockColorTheme={theme}
                  className="max-w-none"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>ChatMarkdownRenderer</CardTitle>
                  <Badge variant="secondary">untrusted</Badge>
                  <Badge variant="outline">compact</Badge>
                </div>
                <CardDescription>
                  面向 AI 会话，默认禁用原始 HTML，并启用内置 Widget 注册表。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <ChatMarkdownRenderer
                    content={chatMarkdown}
                    widgetContext={widgetContext}
                    codeBlock={{ colorTheme: theme }}
                  />
                </div>

                {actions.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">最近 Widget Action</p>
                      <div className="space-y-2">
                        {actions.map((action, index) => (
                          <pre
                            key={`${action.widgetId}-${index}`}
                            className="rounded-md bg-muted/50 p-3 text-xs"
                          >
                            {JSON.stringify(action, null, 2)}
                          </pre>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ResponsiveTabs>
    </div>
  );
}
