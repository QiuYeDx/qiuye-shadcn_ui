# 工作包 PRE-1：npm 包名与依赖策略准备

## 基本信息

- 日期：2026-07-06
- 状态：已完成
- 对应执行计划工作包：PRE-1 npm 包名与依赖策略确认

## 本次实现内容

- 确认底层算法包使用 `@qiuyedx/smooth-corners`，不是 `@qiuye/smooth-corners`。
- 发布前查询 npm registry，确认 `@qiuyedx/smooth-corners` 当时返回 404，尚未发布/未占用。
- 在 `smooth-corners-web` 中将 package identity 从 `@lixiaolin94/smooth-corners` 调整为 `@qiuyedx/smooth-corners`。
- 更新 `smooth-corners-web` 的 README、英文 demo 页面、中文 demo 页面和 Agent 指引中的安装/import 示例。
- 更新 package metadata 的 repository、bugs、homepage 到 `QiuYeDx/smooth-corners-web`。
- 保留 `LICENSE` 和 `NOTICE` 中的原始版权信息，未修改算法源码。
- 用户已手动发布 `@qiuyedx/smooth-corners@0.1.0`。
- 发布后在 `qiuye-shadcn_ui` 中使用 pnpm 8.7.0 安装 `@qiuyedx/smooth-corners@0.1.0`，并保持 `pnpm-lock.yaml` 的 lockfileVersion 为 `6.0`。

## 修改文件

- `/Users/qiuyedx/Documents/Github/smooth-corners-web/package.json`
- `/Users/qiuyedx/Documents/Github/smooth-corners-web/README.md`
- `/Users/qiuyedx/Documents/Github/smooth-corners-web/index.html`
- `/Users/qiuyedx/Documents/Github/smooth-corners-web/index.zh-CN.html`
- `/Users/qiuyedx/Documents/Github/smooth-corners-web/CLAUDE.md`
- `/Users/qiuyedx/Documents/Github/qiuye-shadcn_ui/docs/设计并开发SmoothCorners组件/SmoothCorners组件执行计划.md`

## 接口或数据结构变化

- npm 包名已从 `@lixiaolin94/smooth-corners` 切换为 `@qiuyedx/smooth-corners`。
- 现有 exports 保持不变：
  - `.`
  - `./css`
  - `./compute`
  - `./observer`
  - `./declarative`
- 现有 public API 保持不变：
  - `smoothCorners`
  - `applySmooth`
  - `smoothCornersCSS`
  - `computeSmoothCorners`
  - `observe`
  - `unobserve`
  - `startAutoObserve`
  - `stopAutoObserve`

## 验证结果

执行命令：

```text
node --input-type=module -e "import { smoothCorners, computeSmoothCorners } from './src/index.js'; console.log(JSON.stringify(smoothCorners(30, 0.6))); console.log(JSON.stringify(computeSmoothCorners(180, 120, 30, 0.6)));"
npm view @qiuyedx/smooth-corners version name --json
npm pack --dry-run
rg -n "@lixiaolin94/smooth-corners|lixiaolin94.github.io|github.com/lixiaolin94/smooth-corners-web|Published to npm" . -g '!**/.git/**'
npm view @qiuyedx/smooth-corners version name repository.url homepage --json
npx -y pnpm@8.7.0 add @qiuyedx/smooth-corners@0.1.0
```

结果：

- 本地 ESM 导入成功，`smoothCorners(30, 0.6)` 输出 `--sc-r=30px`、`--sc-i=48px`、`--sc-s=superellipse(1.7775)`。
- `computeSmoothCorners(180, 120, 30, 0.6)` 输出半径 30、补偿半径 48、有效 smoothing 0.6。
- 发布前 `npm view @qiuyedx/smooth-corners ...` 返回 E404，说明当时该包名尚未发布/未占用。
- `npm pack --dry-run` 成功生成发布预览：`@qiuyedx/smooth-corners@0.1.0`，14 个文件，约 8.9 kB package size。
- 旧 npm 包名和旧 GitHub Pages / repository URL 已从项目文档与 demo 示例中清理。
- 用户手动发布后，`npm view @qiuyedx/smooth-corners ...` 返回版本 `0.1.0`，包名 `@qiuyedx/smooth-corners`。
- `npx -y pnpm@8.7.0 add @qiuyedx/smooth-corners@0.1.0` 成功，`qiuye-shadcn_ui/package.json` 与 `pnpm-lock.yaml` 已同步依赖。

## 未完成事项

- 无。

## 下一步建议

- PRE-1 已完成。后续底层算法升级时，先发布新的 `@qiuyedx/smooth-corners` 版本，再更新 QiuYe UI 依赖与 registry。
