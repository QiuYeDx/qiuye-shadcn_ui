"use client";

import { useState } from "react";
import { DualStateToggle } from "../dual-state-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewSourceButton } from "@/components/view-source-button";
import {
  Menu,
  X,
  Volume2,
  VolumeOff,
  Sun,
  Moon,
  Heart,
  HeartOff,
  Play,
  Pause,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  BellOff,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              Source Codes                                   */
/* -------------------------------------------------------------------------- */

const sourceCodes = {
  basic: `import { useState } from "react";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { Menu, X } from "lucide-react";

function BasicDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DualStateToggle
      active={isOpen}
      onToggle={setIsOpen}
      activeIcon={<X />}
      inactiveIcon={<Menu />}
      activeLabel="关闭"
      inactiveLabel="打开"
    />
  );
}`,
  effects: `import { useState } from "react";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { Sun, Moon } from "lucide-react";

function EffectsDemo() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex gap-3">
      <DualStateToggle active={active} onToggle={setActive}
        activeIcon={<Sun />} inactiveIcon={<Moon />}
        effect="fade" variant="outline" />
      <DualStateToggle active={active} onToggle={setActive}
        activeIcon={<Sun />} inactiveIcon={<Moon />}
        effect="rotate" variant="outline" />
      <DualStateToggle active={active} onToggle={setActive}
        activeIcon={<Sun />} inactiveIcon={<Moon />}
        effect="slide-up" variant="outline" />
      <DualStateToggle active={active} onToggle={setActive}
        activeIcon={<Sun />} inactiveIcon={<Moon />}
        effect="slide-down" variant="outline" />
      <DualStateToggle active={active} onToggle={setActive}
        activeIcon={<Sun />} inactiveIcon={<Moon />}
        effect="scale" variant="outline" />
    </div>
  );
}`,
  variants: `import { useState } from "react";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { Volume2, VolumeOff } from "lucide-react";

function VariantsDemo() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex gap-3">
      <DualStateToggle active={muted} onToggle={setMuted}
        activeIcon={<VolumeOff />} inactiveIcon={<Volume2 />}
        variant="default" effect="rotate" />
      <DualStateToggle active={muted} onToggle={setMuted}
        activeIcon={<VolumeOff />} inactiveIcon={<Volume2 />}
        variant="secondary" effect="rotate" />
      <DualStateToggle active={muted} onToggle={setMuted}
        activeIcon={<VolumeOff />} inactiveIcon={<Volume2 />}
        variant="outline" effect="rotate" />
      <DualStateToggle active={muted} onToggle={setMuted}
        activeIcon={<VolumeOff />} inactiveIcon={<Volume2 />}
        variant="ghost" effect="rotate" />
    </div>
  );
}`,
  shapes: `import { useState } from "react";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { Heart, HeartOff } from "lucide-react";

function ShapesDemo() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex gap-3">
      {/* 默认方形 */}
      <DualStateToggle active={liked} onToggle={setLiked}
        activeIcon={<Heart />} inactiveIcon={<HeartOff />}
        shape="square" variant="outline" effect="scale" />
      {/* 圆形 */}
      <DualStateToggle active={liked} onToggle={setLiked}
        activeIcon={<Heart />} inactiveIcon={<HeartOff />}
        shape="circle" variant="outline" effect="scale" />
    </div>
  );
}`,
  custom: `import { useState } from "react";
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle";
import { Lock, Unlock } from "lucide-react";

function CustomEffectDemo() {
  const [locked, setLocked] = useState(false);

  return (
    <DualStateToggle
      active={locked}
      onToggle={setLocked}
      activeIcon={<Lock />}
      inactiveIcon={<Unlock />}
      variant="outline"
      effect={{
        initial: { rotate: -180, scale: 0.6 },
        animate: { rotate: 0, scale: 1 },
        exit:    { rotate: 180, scale: 0.6 },
      }}
      blurAmount="4px"
      transitionDuration={0.35}
    />
  );
}`,
};

/* -------------------------------------------------------------------------- */
/*                              Demo Components                               */
/* -------------------------------------------------------------------------- */

export function DualStateToggleDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [effectActive, setEffectActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [locked, setLocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [notif, setNotif] = useState(true);

  return (
    <div className="space-y-8">
      {/* 基础用法 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>基础用法</CardTitle>
              <CardDescription>
                默认 fade 效果，点击在两种状态间切换
              </CardDescription>
            </div>
            <ViewSourceButton code={sourceCodes.basic} title="基础用法 - 源码" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <DualStateToggle
              active={menuOpen}
              onToggle={setMenuOpen}
              activeIcon={<X />}
              inactiveIcon={<Menu />}
              activeLabel="关闭"
              inactiveLabel="打开"
            />
            <span className="text-sm text-muted-foreground">
              当前状态：{menuOpen ? "激活" : "未激活"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 过渡效果预设 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>过渡效果预设</CardTitle>
              <CardDescription>
                5 种内置过渡效果：fade、rotate、slide-up、slide-down、scale
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.effects}
              title="过渡效果预设 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">fade</Badge>
            <Badge variant="secondary">rotate</Badge>
            <Badge variant="secondary">slide-up</Badge>
            <Badge variant="secondary">slide-down</Badge>
            <Badge variant="secondary">scale</Badge>
          </div>
          <div className="flex items-center gap-3">
            {(
              ["fade", "rotate", "slide-up", "slide-down", "scale"] as const
            ).map((preset) => (
              <div key={preset} className="flex flex-col items-center gap-2">
                <DualStateToggle
                  active={effectActive}
                  onToggle={setEffectActive}
                  activeIcon={<Sun />}
                  inactiveIcon={<Moon />}
                  effect={preset}
                  variant="outline"
                />
                <span className="text-xs text-muted-foreground">{preset}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 按钮变体 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>按钮变体</CardTitle>
              <CardDescription>
                支持 shadcn/ui Button 的所有 variant
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.variants}
              title="按钮变体 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="secondary">outline</Badge>
            <Badge variant="secondary">ghost</Badge>
          </div>
          <div className="flex items-center gap-3">
            {(["default", "secondary", "outline", "ghost"] as const).map(
              (v) => (
                <div key={v} className="flex flex-col items-center gap-2">
                  <DualStateToggle
                    active={muted}
                    onToggle={setMuted}
                    activeIcon={<VolumeOff />}
                    inactiveIcon={<Volume2 />}
                    variant={v}
                    effect="rotate"
                  />
                  <span className="text-xs text-muted-foreground">{v}</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* 形状 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>按钮形状</CardTitle>
              <CardDescription>
                方形（square）与圆形（circle）两种形状
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.shapes}
              title="按钮形状 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <DualStateToggle
                active={liked}
                onToggle={setLiked}
                activeIcon={<Heart />}
                inactiveIcon={<HeartOff />}
                shape="square"
                variant="outline"
                effect="scale"
              />
              <span className="text-xs text-muted-foreground">square</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DualStateToggle
                active={liked}
                onToggle={setLiked}
                activeIcon={<Heart />}
                inactiveIcon={<HeartOff />}
                shape="circle"
                variant="outline"
                effect="scale"
              />
              <span className="text-xs text-muted-foreground">circle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自定义效果 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle>自定义过渡效果</CardTitle>
              <CardDescription>
                传入自定义 initial / animate / exit 对象，与基础 opacity + blur 合并
              </CardDescription>
            </div>
            <ViewSourceButton
              code={sourceCodes.custom}
              title="自定义过渡效果 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <DualStateToggle
              active={locked}
              onToggle={setLocked}
              activeIcon={<Lock />}
              inactiveIcon={<Unlock />}
              variant="outline"
              effect={{
                initial: { rotate: -180, scale: 0.6 },
                animate: { rotate: 0, scale: 1 },
                exit: { rotate: 180, scale: 0.6 },
              }}
              blurAmount="4px"
              transitionDuration={0.35}
            />
            <span className="text-sm text-muted-foreground">
              rotate(-180°→0°→180°) + scale(0.6→1→0.6) + blur(4px)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 常见场景 */}
      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>常见场景</CardTitle>
            <CardDescription>
              播放/暂停、显示/隐藏、通知开关等典型图标切换场景
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <DualStateToggle
                active={playing}
                onToggle={setPlaying}
                activeIcon={<Pause />}
                inactiveIcon={<Play />}
                variant="secondary"
                shape="circle"
                effect="scale"
              />
              <span className="text-xs text-muted-foreground">
                {playing ? "暂停" : "播放"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DualStateToggle
                active={!visible}
                onToggle={(v) => setVisible(!v)}
                activeIcon={<EyeOff />}
                inactiveIcon={<Eye />}
                variant="outline"
                effect="fade"
              />
              <span className="text-xs text-muted-foreground">
                {visible ? "可见" : "隐藏"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DualStateToggle
                active={!notif}
                onToggle={(v) => setNotif(!v)}
                activeIcon={<BellOff />}
                inactiveIcon={<Bell />}
                variant="ghost"
                effect="slide-down"
              />
              <span className="text-xs text-muted-foreground">
                {notif ? "通知开" : "通知关"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
