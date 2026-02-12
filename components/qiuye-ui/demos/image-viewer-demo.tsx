"use client";

import { useState } from "react";
import { ImageViewer } from "../image-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewSourceButton } from "@/components/view-source-button";

const demoImages = {
  landscape:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  portrait:
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=80",
};

const sourceCodes = {
  basic: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";

<ImageViewer
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  alt="荒漠公路"
  className="w-full"
/>`,
  lightbox: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";

<ImageViewer
  src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=80"
  alt="山峰与云海"
  rounded="2xl"
  lightboxRounded="lg"
  overlayBlur
  lightboxPadding={24}
  className="w-full"
/>`,
  sizeLimit: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";

// 限制最大高度（数字会自动转为像素）
<ImageViewer
  src="..."
  alt="限制最大高度"
  maxHeight={300}
/>

// 使用 CSS 字符串
<ImageViewer
  src="..."
  alt="使用视口单位"
  maxHeight="50vh"
/>

// 同时限制宽高
<ImageViewer
  src="..."
  alt="固定尺寸范围"
  maxWidth={400}
  maxHeight={300}
/>`,
  loading: `import { useState } from "react";
import { ImageViewer } from "@/components/qiuye-ui/image-viewer";
import { Button } from "@/components/ui/button";

function LoadingDemo() {
  const [token, setToken] = useState(() => Date.now());

  return (
    <div className="space-y-4">
      <ImageViewer
        key={token}
        src={\`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80&_t=\${token}\`}
        alt="山脉日出"
        className="w-full"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setToken(Date.now())}
      >
        重新加载（观察骨架屏与过渡效果）
      </Button>
    </div>
  );
}`,
  hover: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";

// 默认弹性（bounce 默认 0.25）
<ImageViewer
  src="..."
  alt="悬浮放大"
  hoverScale={1.05}
/>

// 无弹性：平滑缩放
<ImageViewer
  src="..."
  alt="无弹性"
  hoverScale={1.05}
  hoverBounce={0}
/>

// 较强弹性，回弹更明显
<ImageViewer
  src="..."
  alt="强弹性悬浮"
  hoverScale={1.05}
  hoverBounce={0.5}
/>`,
  states: `import { ImageViewer } from "@/components/qiuye-ui/image-viewer";

// 禁用灯箱
<ImageViewer
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  alt="不启用灯箱"
  enableLightbox={false}
  className="w-full"
/>

// 空链接占位
<ImageViewer alt="空链接占位" src="" />`,
};

function LoadingTransitionDemo() {
  const [reloadToken, setReloadToken] = useState(() => Date.now());

  return (
    <div className="space-y-4">
      <div className="max-w-3xl mx-auto">
        <ImageViewer
          key={reloadToken}
          src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80&_t=${reloadToken}`}
          alt="山脉日出"
          className="w-full"
        />
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReloadToken(Date.now())}
        >
          重新加载（观察骨架屏与过渡效果）
        </Button>
      </div>
    </div>
  );
}

export function ImageViewerDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>基础用法</CardTitle>
              <CardDescription>点击图片进入灯箱查看</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基础用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-3xl mx-auto">
            <ImageViewer
              src={demoImages.landscape}
              alt="荒漠公路"
              maxHeight={400}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>加载过渡效果</CardTitle>
              <CardDescription>
                图片加载时显示骨架屏动画，加载完成后平滑过渡入场
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.loading}
              title="加载过渡效果 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">骨架屏</Badge>
            <Badge variant="secondary">模糊入场</Badge>
          </div>
          <LoadingTransitionDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>灯箱增强</CardTitle>
              <CardDescription>圆角、遮罩模糊与边距控制</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.lightbox} title="灯箱增强 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">overlayBlur</Badge>
            <Badge variant="secondary">lightboxPadding</Badge>
            <Badge variant="secondary">lightboxRounded</Badge>
          </div>
          <div className="max-w-2xl mx-auto">
            <ImageViewer
              src={demoImages.portrait}
              alt="山峰与云海"
              rounded="2xl"
              lightboxRounded="lg"
              overlayBlur
              lightboxPadding={24}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>尺寸限制</CardTitle>
              <CardDescription>
                限制图片最大高度/宽度，防止竖向比例长的图片占据过多页面空间
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.sizeLimit}
              title="尺寸限制 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">maxHeight</Badge>
            <Badge variant="secondary">maxWidth</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Badge variant="outline">maxHeight=300</Badge>
              <ImageViewer
                src={demoImages.landscape}
                alt="限制最大高度"
                maxHeight={300}
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">maxHeight=&quot;50vh&quot;</Badge>
              <ImageViewer
                src={demoImages.landscape}
                alt="使用视口单位"
                maxHeight="50vh"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">maxWidth=200 maxHeight=300</Badge>
              <ImageViewer
                src={demoImages.portrait}
                alt="同时限制宽高"
                maxWidth={200}
                maxHeight={300}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>悬浮放大效果</CardTitle>
              <CardDescription>
                鼠标悬浮时整体放大（含圆角容器），不影响页面布局，支持自定义弹性系数
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.hover}
              title="悬浮放大效果 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">hoverScale</Badge>
            <Badge variant="secondary">hoverBounce</Badge>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Badge variant="outline">scale=1.05 bounce=0</Badge>
              <p className="text-xs text-muted-foreground">无弹性，平滑缩放</p>
              <ImageViewer
                src={demoImages.landscape}
                alt="无弹性"
                hoverScale={1.05}
                hoverBounce={0}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">scale=1.05（默认 bounce）</Badge>
              <p className="text-xs text-muted-foreground">
                默认弹性 0.25，轻微回弹
              </p>
              <ImageViewer
                src={demoImages.landscape}
                alt="默认弹性"
                hoverScale={1.05}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">scale=1.05 bounce=0.5</Badge>
              <p className="text-xs text-muted-foreground">
                较强弹性 0.5，回弹更明显
              </p>
              <ImageViewer
                src={demoImages.landscape}
                alt="强弹性"
                hoverScale={1.05}
                hoverBounce={0.5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>状态展示</CardTitle>
              <CardDescription>禁用灯箱与空链接占位</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.states} title="状态展示 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Badge variant="outline">灯箱禁用</Badge>
              <ImageViewer
                src={demoImages.landscape}
                alt="不启用灯箱"
                enableLightbox={false}
                maxHeight={300}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">空链接占位</Badge>
              <ImageViewer alt="空链接占位" src="" maxHeight={300} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
