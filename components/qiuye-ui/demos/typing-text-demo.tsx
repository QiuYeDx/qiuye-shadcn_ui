"use client";

import { TypingText } from "../typing-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TypingTextDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>基础用法</CardTitle>
          <CardDescription>简单的打字机效果演示</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">单行文本</h3>
            <TypingText
              text="欢迎来到秋夜组件库！这里有丰富的UI组件等待你的探索。"
              speed={100}
              className="text-lg"
            />
          </div>

          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">多行文本循环</h3>
            <TypingText
              text={[
                "这是第一条消息...",
                "接下来是第二条消息...",
                "最后是第三条消息！",
                "然后循环播放...",
              ]}
              speed={80}
              loop={true}
              className="text-lg text-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>速度控制</CardTitle>
          <CardDescription>不同的打字速度效果</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <Badge variant="secondary" className="mb-4">
                慢速 - 200ms
              </Badge>
              <TypingText
                text="慢速打字效果..."
                speed={200}
                loop={true}
                className="text-sm"
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <Badge variant="secondary" className="mb-4">
                正常 - 100ms
              </Badge>
              <TypingText
                text="正常速度打字效果..."
                speed={100}
                loop={true}
                className="text-sm"
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <Badge variant="secondary" className="mb-4">
                快速 - 50ms
              </Badge>
              <TypingText
                text="快速打字效果..."
                speed={50}
                loop={true}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>光标样式</CardTitle>
          <CardDescription>控制光标的显示和隐藏</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-3">显示光标</h4>
              <TypingText
                text="这段文字会显示光标"
                showCursor={true}
                speed={100}
                loop={true}
              />
            </div>

            <div className="p-6 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-3">隐藏光标</h4>
              <TypingText
                text="这段文字不显示光标"
                showCursor={false}
                speed={100}
                loop={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>实际应用场景</CardTitle>
          <CardDescription>在真实项目中的使用示例</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:via-slate-900/20 dark:to-cyan-950/20 rounded-lg border">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">AI 智能助手</h3>
              <p className="text-muted-foreground">正在为您生成回答...</p>
            </div>
            <div className="min-h-[60px] flex items-center justify-center">
              <TypingText
                text={[
                  "正在分析您的问题...",
                  "搜索相关信息中...",
                  "生成智能回答...",
                  "回答已准备完成！",
                ]}
                speed={120}
                loop={true}
                className="text-lg text-center"
              />
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-slate-900/20 dark:to-pink-950/20 rounded-lg border">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">产品介绍</h3>
              <p className="text-muted-foreground">让文字更有吸引力</p>
            </div>
            <div className="min-h-[60px] flex items-center justify-center">
              <TypingText
                text="🚀 高效开发 • 🎨 精美设计 • ⚡ 极速体验"
                speed={150}
                loop={true}
                className="text-xl text-center font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
