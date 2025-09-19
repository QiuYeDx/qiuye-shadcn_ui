"use client";

import { GradientCard } from "../gradient-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GradientCardDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>渐变主题</CardTitle>
          <CardDescription>
            不同颜色的渐变卡片
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GradientCard gradient="blue">
            <h3 className="text-lg font-semibold mb-2">蓝色主题</h3>
            <p className="text-sm text-muted-foreground mb-4">
              清新的蓝色渐变，适合商务和科技类应用。
            </p>
            <Badge variant="secondary">科技感</Badge>
          </GradientCard>
          
          <GradientCard gradient="purple">
            <h3 className="text-lg font-semibold mb-2">紫色主题</h3>
            <p className="text-sm text-muted-foreground mb-4">
              神秘的紫色渐变，适合创意和设计类应用。
            </p>
            <Badge variant="secondary">创意</Badge>
          </GradientCard>
          
          <GradientCard gradient="pink">
            <h3 className="text-lg font-semibold mb-2">粉色主题</h3>
            <p className="text-sm text-muted-foreground mb-4">
              温暖的粉色渐变，适合时尚和生活类应用。
            </p>
            <Badge variant="secondary">时尚</Badge>
          </GradientCard>
          
          <GradientCard gradient="orange">
            <h3 className="text-lg font-semibold mb-2">橙色主题</h3>
            <p className="text-sm text-muted-foreground mb-4">
              活力的橙色渐变，适合运动和娱乐类应用。
            </p>
            <Badge variant="secondary">活力</Badge>
          </GradientCard>
          
          <GradientCard gradient="green">
            <h3 className="text-lg font-semibold mb-2">绿色主题</h3>
            <p className="text-sm text-muted-foreground mb-4">
              自然的绿色渐变，适合健康和环保类应用。
            </p>
            <Badge variant="secondary">自然</Badge>
          </GradientCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>渐变强度</CardTitle>
          <CardDescription>
            同一主题下不同强度的渐变效果
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GradientCard gradient="blue" intensity="light">
            <h3 className="text-lg font-semibold mb-2">轻度渐变</h3>
            <p className="text-sm text-muted-foreground mb-4">
              subtle 和柔和的渐变效果，适合简约设计。
            </p>
            <Button variant="outline" size="sm">查看详情</Button>
          </GradientCard>
          
          <GradientCard gradient="blue" intensity="medium">
            <h3 className="text-lg font-semibold mb-2">中度渐变</h3>
            <p className="text-sm text-muted-foreground mb-4">
              平衡的渐变效果，大多数场景的最佳选择。
            </p>
            <Button variant="outline" size="sm">查看详情</Button>
          </GradientCard>
          
          <GradientCard gradient="blue" intensity="strong">
            <h3 className="text-lg font-semibold mb-2">强烈渐变</h3>
            <p className="text-sm text-muted-foreground mb-4">
              鲜明的渐变效果，适合需要突出显示的内容。
            </p>
            <Button variant="outline" size="sm">查看详情</Button>
          </GradientCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>实际应用场景</CardTitle>
          <CardDescription>
            在真实项目中的使用示例
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradientCard gradient="purple" className="p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-2">产品发布</h3>
              <p className="text-sm text-muted-foreground mb-6">
                展示新产品特性和优势，吸引用户关注。
              </p>
              <Button className="w-full">立即体验</Button>
            </div>
          </GradientCard>
          
          <GradientCard gradient="green" className="p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">数据统计</h3>
              <p className="text-sm text-muted-foreground mb-6">
                美观地展示关键数据和统计信息。
              </p>
              <Button className="w-full">查看报告</Button>
            </div>
          </GradientCard>
        </CardContent>
      </Card>
    </div>
  );
}
