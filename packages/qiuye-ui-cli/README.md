# @qiuye-ui/mcp

QiuYe UI 组件库的 MCP Server，让 Cursor/Claude 能够直接读取组件库的 registry 信息。

## 功能

- 列出所有可用组件（从远端 `/registry/registry.json` 拉取，若不存在则用内置列表兜底）
- 搜索组件（按名称、分类、作者、依赖等）
- 读取组件的 registry JSON（包含源码）
- 生成 shadcn CLI 安装命令（支持 npx / pnpm）

## 快速开始

### 在 Cursor 中使用（推荐）

在项目根目录创建 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "@qiuye-ui/mcp": {
      "command": "npx",
      "args": ["-y", "--package", "@qiuye-ui/mcp@latest", "qiuye-ui-mcp"]
    }
  }
}
```

重启 Cursor 后，在 MCP Servers 列表中应能看到 `@qiuye-ui/mcp`。

### 命令行用法

```bash
# 启动 MCP Server（默认）
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp

# 或显式指定 mcp 子命令
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp mcp

# 自检（验证 registry 连通性）
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --check

# 查看帮助
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --help
```

### 自定义 Registry Base

```bash
# 通过命令行参数
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --registry-base http://localhost:3000/registry

# 或使用短参数
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --base http://localhost:3000/registry

# 或通过环境变量
QIUIYE_UI_REGISTRY_BASE=http://localhost:3000/registry npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp
```

## MCP 能力

### Tools

| 名称 | 描述 | 参数 |
|------|------|------|
| `qiuye_ui_list_registry_items` | 列出所有可用组件 | `includeFiles?`: 是否包含 files 的 path/target（target 可选） |
| `qiuye_ui_search_registry_items` | 按关键词搜索组件 | `query`: 搜索关键词, `includeFiles?`: 同上 |
| `qiuye_ui_get_registry_item` | 读取指定组件的 registry JSON | `name`: 组件名, `includeContent?`: 是否包含源码 |
| `qiuye_ui_get_registry_file_content` | 读取组件源码 | `name`: 组件名, `index?`: files[] 下标（默认 0） |
| `qiuye_ui_get_shadcn_add_command` | 生成 shadcn 安装命令 | `name`: 组件名, `pm?`: npx/pnpm, `alias?`: registry alias |

### Resources

| URI | 描述 |
|-----|------|
| `qiuye-ui://registry/index` | 组件索引（JSON） |
| `qiuye-ui://registry/{name}` | 指定组件的 registry JSON（包含 files[].content） |

### 组件名支持格式

以下格式均可被识别：

- `typing-text` - 组件名
- `typing-text.json` - 带 `.json` 后缀
- `@qiuye-ui/typing-text` - 带 registry alias 前缀
- `https://ui.qiuyedx.com/registry/typing-text.json` - 完整 URL

## 示例提问

在 Cursor 中可以这样问 AI：

- "列出 QiuYe UI 目前有哪些可用组件，并给出各自的安装命令"
- "responsive-tabs 的 dependencies 和 registryDependencies 分别是什么？"
- "读取 typing-text 的源码，帮我总结 props 并写一个最小用法示例"
- "搜索 QiuYe UI 中与动画相关的组件"

## 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `QIUIYE_UI_REGISTRY_BASE` | `https://ui.qiuyedx.com/registry` | Registry 基础 URL |

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/qiuyedx/qiuye-shadcn_ui.git
cd qiuye-shadcn_ui

# 安装依赖
pnpm install

# 直接运行 MCP Server（本地调试）
node packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs

# 自检（指向本地 registry）
node packages/qiuye-ui-cli/bin/qiuye-ui-mcp.mjs --check --base http://localhost:3000/registry
```

## 发布说明

```bash
# 在仓库根目录执行
pnpm -C packages/qiuye-ui-cli publish --access public

# 或在 packages/qiuye-ui-cli 目录执行
cd packages/qiuye-ui-cli && npm publish --access public
```

## 相关链接

- 组件浏览：[ui.qiuyedx.com/components](https://ui.qiuyedx.com/components)
- CLI 文档：[ui.qiuyedx.com/cli](https://ui.qiuyedx.com/cli)
- GitHub：[github.com/qiuyedx/qiuye-shadcn_ui](https://github.com/qiuyedx/qiuye-shadcn_ui)

## License

MIT
