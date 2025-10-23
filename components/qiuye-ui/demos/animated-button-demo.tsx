"use client";

import { AnimatedButton } from "../animated-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewSourceButton } from "@/components/view-source-button";

// 源码数据
const sourceCodes = {
  animation: `<AnimatedButton animation="bounce">弹跳动画</AnimatedButton>
<AnimatedButton animation="pulse" variant="secondary">
  脉冲动画
</AnimatedButton>
<AnimatedButton animation="wiggle" variant="outline">
  摆动动画
</AnimatedButton>
<AnimatedButton animation="spin" variant="ghost">
  旋转动画
</AnimatedButton>`,

  size: `<AnimatedButton size="sm">小尺寸</AnimatedButton>
<AnimatedButton size="md">中等尺寸</AnimatedButton>
<AnimatedButton size="lg">大尺寸</AnimatedButton>`,

  variant: `<AnimatedButton variant="primary">主要按钮</AnimatedButton>
<AnimatedButton variant="secondary">次要按钮</AnimatedButton>
<AnimatedButton variant="outline">轮廓按钮</AnimatedButton>
<AnimatedButton variant="ghost">幽灵按钮</AnimatedButton>`,

  state: `<AnimatedButton>正常状态</AnimatedButton>
<AnimatedButton disabled>禁用状态</AnimatedButton>`,
};

export function AnimatedButtonDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>动画变体</CardTitle>
              <CardDescription>不同的动画效果展示</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.animation} title="动画变体 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton animation="bounce">弹跳动画</AnimatedButton>
          <AnimatedButton animation="pulse" variant="secondary">
            脉冲动画
          </AnimatedButton>
          <AnimatedButton animation="wiggle" variant="outline">
            摆动动画
          </AnimatedButton>
          <AnimatedButton animation="spin" variant="ghost">
            旋转动画
          </AnimatedButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>尺寸变体</CardTitle>
              <CardDescription>不同尺寸的按钮</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.size} title="尺寸变体 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <AnimatedButton size="sm">小尺寸</AnimatedButton>
          <AnimatedButton size="md">中等尺寸</AnimatedButton>
          <AnimatedButton size="lg">大尺寸</AnimatedButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>样式变体</CardTitle>
              <CardDescription>不同样式的按钮</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.variant} title="样式变体 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton variant="primary">主要按钮</AnimatedButton>
          <AnimatedButton variant="secondary">次要按钮</AnimatedButton>
          <AnimatedButton variant="outline">轮廓按钮</AnimatedButton>
          <AnimatedButton variant="ghost">幽灵按钮</AnimatedButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>状态</CardTitle>
              <CardDescription>按钮的不同状态</CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.state} title="按钮状态 - 源码" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton>正常状态</AnimatedButton>
          <AnimatedButton disabled>禁用状态</AnimatedButton>
        </CardContent>
      </Card>
    </div>
  );
}
