# backdrop-filter 背景模糊避坑指南

## 背景

在实现移动端 Header 下拉菜单、玻璃态浮层、透明导航栏、HUD 工具条等 UI 时，经常会使用：

```css
background: rgb(... / 0.6);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
```

这类效果看起来简单，但在真实项目中很容易出现：

- 开发时 class 都写对了，但实际没有模糊效果。
- 入场动画结束后才突然出现强模糊。
- 离场动画结束后边框或玻璃层突然消失。
- 父层、子层都用了 `backdrop-filter`，结果子层模糊失效或效果不稳定。
- 同一个效果在 Chrome、Safari、移动端浏览器里表现不一致。

这份文档总结这类问题的通用经验，避免后续在任何项目中重复踩坑。

## 核心原理

`backdrop-filter` 模糊的是元素背后的已绘制像素，不是元素自己的背景。

因此它有几个隐含前提：

- 元素必须有透明或半透明背景，否则看不到背后内容。
- 元素后方必须真的存在可被取样的内容。
- 元素所在的 stacking context、Backdrop Root、overflow 裁切、opacity 合成方式都会影响模糊取样。
- 仅仅看到“透明覆盖层”不代表 `backdrop-filter` 生效了。

## 常见坑

### 1. 在父元素和子元素上嵌套 backdrop-filter

错误模式：

```tsx
<header className="backdrop-blur-md bg-background/60">
  <div className="absolute top-full backdrop-blur-md bg-background/60">
    menu
  </div>
</header>
```

问题：

- 带 `backdrop-filter` 的父元素会形成独立的合成/Backdrop Root。
- 子元素再做 `backdrop-filter` 时，可能无法继续取样真实页面内容。
- 结果就是菜单区域看起来只是半透明，没有真正模糊底下文字。

推荐：

- 不要把 `backdrop-filter` 直接放在包含内容和子浮层的父容器上。
- 把玻璃背景拆成独立的绝对定位背景层。
- Header 背景层和菜单背景层最好是 sibling 关系，而不是父子嵌套滤镜关系。

### 2. 对承载 backdrop-filter 的元素做 height 动画

错误模式：

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  className="overflow-hidden backdrop-blur-md bg-background/60"
>
  menu
</motion.div>
```

问题：

- `height: 0 -> auto` 会触发布局重算。
- `overflow-hidden` 会裁切背景取样区域。
- 浏览器可能等布局稳定后才重新合成 backdrop。
- 视觉上表现为：入场过程没有模糊，动画结束后突然变模糊。

推荐：

- 不要对承载 `backdrop-filter` 的玻璃层做高度动画。
- 浮层容器可以固定布局或由内容撑开。
- 只动画内容层的 `opacity` / `transform`。
- 如果需要模糊渐变，动画 `backdrop-filter` 本身，而不是动画高度。

### 3. 只用 opacity 淡入整个玻璃层

问题模式：

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="backdrop-blur-md bg-background/60"
>
  menu
</motion.div>
```

问题：

- `opacity` 作用在整个合成层上。
- 某些浏览器会延后 backdrop 合成。
- 视觉上可能仍然是“透明层先出现，模糊随后突然出现”。

推荐：

- 将 `backdropFilter` 从 `blur(0px)` 动画到目标值。
- 同步动画背景 tint 的透明度。
- 内容层单独动画，不和玻璃层混在一起。

### 4. 静态 border 在离场结束时硬消失

错误模式：

```tsx
<motion.div exit={{ opacity: 0 }} className="border-b">
  menu
</motion.div>
```

问题：

- `border-b` 是静态样式。
- 组件卸载时边框会在最后一帧突然消失。
- 玻璃层淡出了，但线条还硬停在那里，观感不连贯。

推荐：

- 把边框线拆成独立的 1px `motion.div`。
- 让边框线跟玻璃层一起淡入淡出。

## 推荐结构

推荐把浮层拆成三层：

1. 外层容器：只负责定位、生命周期、z-index。
2. 玻璃背景层：只负责背景色和 `backdrop-filter` 动画。
3. 内容层：只负责搜索框、菜单、按钮等真实交互内容。

示例：

```tsx
const glassInitial = {
  backgroundColor: "color-mix(in oklab, var(--background) 0%, transparent)",
  backdropFilter: "blur(0px) saturate(100%)",
  WebkitBackdropFilter: "blur(0px) saturate(100%)",
};

const glassVisible = {
  backgroundColor: "color-mix(in oklab, var(--background) 76%, transparent)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
};

<AnimatePresence initial={false}>
  {open && (
    <motion.div
      className="absolute inset-x-0 top-full z-20 overflow-hidden"
      initial={glassInitial}
      animate={glassVisible}
      exit={glassInitial}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-background/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* content */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## Header 场景建议

如果 Header 本身也需要玻璃效果，不建议这样写：

```tsx
<header className="sticky top-0 backdrop-blur-md bg-background/60">
  <MobileMenu className="backdrop-blur-md bg-background/60" />
</header>
```

更稳的写法：

```tsx
<header className="sticky top-0 z-50">
  <div
    className="absolute inset-x-0 top-0 h-14 bg-background/80"
    style={glassStyle}
    aria-hidden="true"
  />

  <div className="relative z-10 h-14">
    {/* header content */}
  </div>

  {/* mobile menu overlay */}
</header>
```

也就是说：

- `header` 只负责定位和层级。
- Header 的玻璃背景是一个独立背景层。
- 下拉菜单的玻璃背景也是独立层。
- 不让“带 blur 的父元素”包住“带 blur 的子浮层”。

## 调试清单

遇到背景模糊失效时，按这个顺序排查：

1. 元素是否有半透明背景。
2. 是否同时设置了 `backdrop-filter` 和 `-webkit-backdrop-filter`。
3. 父级是否也有 `backdrop-filter`、`filter`、`transform`、`opacity`、`contain`、`isolation` 等会改变合成上下文的属性。
4. 是否在对承载 blur 的元素做 `height`、`clip-path`、`overflow` 相关动画。
5. 是否把静态 `border`、阴影、背景放在了离场动画容器上。
6. 是否只用 `opacity` 淡入一个已经满强度的 blur 层。
7. 是否在移动端浏览器或 Safari 中缺少 `-webkit-backdrop-filter`。
8. DevTools 中检查最终元素是否真的生成了 `backdrop-filter` 样式。
9. 暂时把背景透明度调低、blur 调高，观察是否真的在模糊底层内容。

## 实践准则

- 玻璃层和内容层分离。
- 父级不要直接带 `backdrop-filter` 后再嵌套子级 blur。
- 不动画玻璃层高度。
- 不把 `overflow-hidden` 和动态高度绑在 blur 层上。
- 入场需要自然过渡时，优先动画 `backdropFilter` 从 `blur(0px)` 到目标值。
- 离场需要自然过渡时，边框、阴影、背景 tint 都拆成可动画层。
- 对真实交互内容只做 `opacity`、`transform` 动画。
- 保留透明背景兜底，避免 `color-mix()` 或 backdrop 支持异常时出现完全透明。

## 一句话结论

`backdrop-filter` 不是普通背景样式，而是依赖浏览器合成和背后像素取样的视觉效果。实现玻璃态 UI 时，把玻璃背景当成一个独立渲染层来设计，而不是随手把 `backdrop-blur` class 挂在业务容器上。
