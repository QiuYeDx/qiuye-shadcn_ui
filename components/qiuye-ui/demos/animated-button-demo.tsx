"use client";

import { AnimatedButton } from "../animated-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnimatedButtonDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>动画变体</CardTitle>
          <CardDescription>
            不同的动画效果展示
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton animation="bounce">
            弹跳动画
          </AnimatedButton>
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
          <CardTitle>尺寸变体</CardTitle>
          <CardDescription>
            不同尺寸的按钮
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <AnimatedButton size="sm">
            小尺寸
          </AnimatedButton>
          <AnimatedButton size="md">
            中等尺寸
          </AnimatedButton>
          <AnimatedButton size="lg">
            大尺寸
          </AnimatedButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>样式变体</CardTitle>
          <CardDescription>
            不同样式的按钮
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton variant="primary">
            主要按钮
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            次要按钮
          </AnimatedButton>
          <AnimatedButton variant="outline">
            轮廓按钮
          </AnimatedButton>
          <AnimatedButton variant="ghost">
            幽灵按钮
          </AnimatedButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>状态</CardTitle>
          <CardDescription>
            按钮的不同状态
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <AnimatedButton>
            正常状态
          </AnimatedButton>
          <AnimatedButton disabled>
            禁用状态
          </AnimatedButton>
        </CardContent>
      </Card>
    </div>
  );
}
