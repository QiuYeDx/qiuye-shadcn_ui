"use client";

import React, { useState } from "react";
import { Typewriter } from "@/components/qiuye-ui/typewriter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function TypewriterDemo() {
  const [loop, setLoop] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [speed, setSpeed] = useState<"normal" | "fast" | "slow">("normal");

  const speedMap = {
    fast: { typingSpeed: 40, deletingSpeed: 20 },
    normal: { typingSpeed: 90, deletingSpeed: 45 },
    slow: { typingSpeed: 160, deletingSpeed: 80 },
  };

  return (
    <div className="space-y-10">
      {/* 基础多文案轮播 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">多文案轮播</h3>
        <p className="text-sm text-muted-foreground">
          传入字符串数组，自动循环打字 → 删除 → 下一段。
        </p>
        <div className="flex items-center gap-2 rounded-lg border p-6 text-2xl font-semibold">
          <span>I&apos;m a</span>
          <Typewriter
            phrases={["Developer", "Designer", "Creator", "Problem Solver"]}
            className="text-primary"
          />
        </div>
      </section>

      <Separator />

      {/* 单文案 + 不循环 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">单次打字（不循环）</h3>
        <p className="text-sm text-muted-foreground">
          传入单个字符串并设置{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            loop=false
          </code>
          ，打完后光标保持闪烁。
        </p>
        <div className="rounded-lg border p-6 text-xl">
          <Typewriter
            phrases="Hello, welcome to QiuYe UI!"
            loop={false}
            typingSpeed={60}
          />
        </div>
      </section>

      <Separator />

      {/* 自定义光标 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">自定义光标</h3>
        <p className="text-sm text-muted-foreground">
          通过{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">cursor</code>{" "}
          传入自定义 ReactNode 或{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            cursorClassName
          </code>{" "}
          覆盖样式。
        </p>
        <div className="space-y-4">
          <div className="rounded-lg border p-6 text-lg">
            <span className="text-muted-foreground">自定义光标颜色：</span>
            <Typewriter
              phrases={["红色光标", "蓝色光标", "绿色光标"]}
              cursorClassName="bg-red-500 w-[2px]"
              className="font-medium"
            />
          </div>
          <div className="rounded-lg border p-6 text-lg">
            <span className="text-muted-foreground">自定义光标元素：</span>
            <Typewriter
              phrases={["Block cursor", "Fancy cursor"]}
              cursor={
                <span className="ml-0.5 inline-block h-[1.2em] w-[0.6em] animate-pulse bg-primary/30 align-text-bottom" />
              }
              className="font-mono"
            />
          </div>
          <div className="rounded-lg border p-6 text-lg">
            <span className="text-muted-foreground">隐藏光标：</span>
            <Typewriter
              phrases={["No cursor here"]}
              cursor={false}
              loop={false}
              className="font-medium"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* 交互式配置 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">交互式配置</h3>
        <p className="text-sm text-muted-foreground">
          实时调整打字速度、光标显隐、是否循环。
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">速度:</span>
            {(["slow", "normal", "fast"] as const).map((s) => (
              <Button
                key={s}
                variant={speed === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSpeed(s)}
              >
                {s === "fast" ? "快" : s === "slow" ? "慢" : "正常"}
              </Button>
            ))}
          </div>
          <Button
            variant={loop ? "default" : "outline"}
            size="sm"
            onClick={() => setLoop(!loop)}
          >
            循环: {loop ? "开" : "关"}
          </Button>
          <Button
            variant={showCursor ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCursor(!showCursor)}
          >
            光标: {showCursor ? "显示" : "隐藏"}
          </Button>
        </div>
        <div className="rounded-lg border p-6 text-xl font-medium">
          <Typewriter
            key={`${speed}-${loop}-${showCursor}`}
            phrases={["React", "Vue", "Svelte", "Angular", "Solid"]}
            {...speedMap[speed]}
            loop={loop}
            cursor={showCursor}
            className="text-primary"
          />
        </div>
      </section>

      <Separator />

      {/* 切换停顿 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">切换停顿（switchInterval）</h3>
        <p className="text-sm text-muted-foreground">
          {`控制删完一段后、打下一段之前的等待时间，值越大"清空后等一下"的节奏感越明显。`}
        </p>
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              无停顿（0ms）
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["Hello", "World", "React"]}
                switchInterval={0}
                className="text-primary"
              />
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              默认停顿（500ms）
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["Hello", "World", "React"]}
                className="text-primary"
              />
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              长停顿（1200ms）
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["Hello", "World", "React"]}
                switchInterval={1200}
                className="text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 弹簧配置 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">弹簧参数对比</h3>
        <p className="text-sm text-muted-foreground">
          通过{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            springConfig
          </code>{" "}
          调整容器宽度跟随的弹簧物理参数。
        </p>
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              默认弹簧
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["stiffness: 300", "damping: 30"]}
                className="text-primary"
              />
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              柔和弹簧
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["stiffness: 120", "damping: 15"]}
                springConfig={{ stiffness: 120, damping: 15 }}
                className="text-primary"
              />
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <Badge variant="secondary" className="mb-3">
              强力弹簧
            </Badge>
            <div className="text-lg font-medium">
              <Typewriter
                phrases={["stiffness: 500", "damping: 40"]}
                springConfig={{ stiffness: 500, damping: 40 }}
                className="text-primary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
