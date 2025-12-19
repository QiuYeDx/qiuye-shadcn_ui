# @qiuye-ui/mcp

QiuYe UI 组件库的 MCP Server，让 Cursor/Claude 能够直接读取组件库的 registry 信息。

## 功能

- 列出所有可用组件
- 搜索组件（按名称、分类、依赖等）
- 读取组件的 registry JSON（包含源码）
- 生成 shadcn CLI 安装命令

## 在 Cursor 中使用

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

## MCP 能力

### Tools

| 名称 | 描述 |
|------|------|
| `qiuye_ui_list_registry_items` | 列出所有可用组件 |
| `qiuye_ui_search_registry_items` | 按关键词搜索组件 |
| `qiuye_ui_get_registry_item` | 读取指定组件的 registry JSON |
| `qiuye_ui_get_registry_file_content` | 读取组件源码 |
| `qiuye_ui_get_shadcn_add_command` | 生成 shadcn 安装命令 |

### Resources

| URI | 描述 |
|-----|------|
| `qiuye-ui://registry/index` | 组件索引 |
| `qiuye-ui://registry/{name}` | 指定组件的 registry JSON |

## 示例提问

- "列出 QiuYe UI 目前有哪些可用组件，并给出各自的安装命令"
- "responsive-tabs 的 dependencies 和 registryDependencies 分别是什么？"
- "读取 typing-text 的源码，帮我总结 props 并写一个最小用法示例"

## 自检

```bash
npx -y --package @qiuye-ui/mcp@latest qiuye-ui-mcp --check
```

## 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `QIUIYE_UI_REGISTRY_BASE` | `https://ui.qiuyedx.com/registry` | Registry 基础 URL |

## 发布说明

```bash
pnpm publish --access public
```

## 相关链接

- 组件浏览：[ui.qiuyedx.com/components](https://ui.qiuyedx.com/components)
- CLI 文档：[ui.qiuyedx.com/cli](https://ui.qiuyedx.com/cli)
- GitHub：[github.com/qiuyedx/qiuye-shadcn_ui](https://github.com/qiuyedx/qiuye-shadcn_ui)

## License

MIT
