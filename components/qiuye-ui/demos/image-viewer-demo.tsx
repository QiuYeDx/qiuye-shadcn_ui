"use client";

import { ImageViewer } from "../image-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  alt="森林清晨"
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
              alt="森林清晨"
              className="w-full"
            />
          </div>
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
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Badge variant="outline">空链接占位</Badge>
              <ImageViewer alt="空链接占位" src="" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
