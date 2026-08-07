---
description: MCP 工具使用规范 — 明确 Figma MCP 和 velajs-mcp 的使用场景
alwaysApply: true
---

# Vela 快应用 MCP 工具使用规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## 核心原则

**Vela 快应用开发涉及两个 MCP 工具，必须严格按照使用阶段区分：**

| MCP 工具 | 用途 | 使用阶段 |
|----------|------|----------|
| `uvx mcp-figma` | 获取设计稿信息、导出图片资源 | 设计稿驱动开发时 |
| `velajs-mcp` | 提供 Vela 知识库、编码规范、代码校验 | 开发全程（作为 MCP Server 配置后自动可用） |

---

## 一、Figma MCP（`uvx mcp-figma`）

### 1.1 使用场景

当用户提供 Figma 设计稿链接时，**必须**使用此工具获取设计稿信息。

### 1.2 工具配置

Figma MCP 服务器配置位于：

| IDE | 配置文件位置 |
|-----|-------------|
| **VS Code** | `~/Library/Application Support/Code/User/mcp.json` |
| **AIoT IDE** | `~/Library/Application Support/AIoT IDE/User/settings.json` |

**VS Code mcp.json 配置示例**：

```json
{
  "servers": {
    "figma": {
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_TOKEN",
        "FASTMCP_LOG_LEVEL": "ERROR",
        "UV_TOOL_DIR": "~/.uv/tools",
        "UV_CACHE_DIR": "~/.uv/cache"
      },
      "disabled": false,
      "autoApprove": ["get_file", "get_file_nodes", "export_image"]
    }
  }
}
```

**AIoT IDE settings.json 配置示例**：

```json
{
  "chat.mcp.servers": {
    "figma": {
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_TOKEN",
        "FASTMCP_LOG_LEVEL": "ERROR",
        "UV_TOOL_DIR": "~/.uv/tools",
        "UV_CACHE_DIR": "~/.uv/cache"
      },
      "disabled": false,
      "autoApprove": ["get_file", "get_file_nodes", "export_image"]
    }
  }
}
```

> ⚠️ **必须包含 `"type": "stdio"` 字段**，否则 IDE 无法识别该 MCP 服务器。

### 1.3 可用工具

| 工具名称 | 用途 | 调用方式 |
|----------|------|----------|
| `get_file` | 获取文件基本信息 | VS Code 内置 MCP |
| `get_file_nodes` | 获取节点结构和样式 | VS Code 内置 MCP |
| `export_image` | 导出设计稿图片 | VS Code 内置 MCP |

### 1.4 调用示例

```
// ✅ 正确：通过 VS Code 内置 MCP 工具调用
get_file(file_key="xxx")
get_file_nodes(file_key="xxx", node_ids=["xxx"])
export_image(file_key="xxx", node_ids=["xxx"], format="png", scale=2)
```

### 1.5 Figma URL 解析

从 Figma 链接中提取关键信息：

```
https://www.figma.com/board/rt8xDAJi7vgWCHtMcBbckb/Untitled?node-id=2-1621&t=zSH8vxrdBaRumNh0-1
│                     │                           │           │
│                     │                           │           └─ node-id
│                     │                           └─ board name
│                     └─ file_key
└─ protocol
```

**提取方法**：
- `file_key`：URL 路径中的 `/board/{file_key}/`
- `node_id`：URL 参数中的 `node-id={node_id}`

---

## 二、Vela 快应用 MCP（`velajs-mcp`）

### 2.1 使用场景

`velajs-mcp` 是一个 MCP Server，提供 Vela 快应用的知识库、编码规范和代码校验能力。在您的 VS Code/Aiot-IDE中安装aiot-core扩展。MCP 服务器将自动注册，无需手动配置。配置后 AI 可自动调用其工具辅助开发。

### 2.2 手动配置方式（如果自动注册不起作用）

在项目根目录创建 `.vscode/mcp.json`：

```json
{
  "mcpServers": {
    "velajs": {
      "command": "npx",
      "args": ["-y", "velajs-mcp"]
    }
  }
}
```

### 2.3 提供的工具

| 工具 | 用途 |
|------|------|
| `create_vela_app` | 一站式入口 — 输入需求，返回规范+模板+知识库 |
| `get_knowledge` | 查询知识库 — 组件、API、开发范式、最佳实践 |
| `get_coding_rules` | 编码规范 — 组件限制、API 限制、CSS 规则 |
| `validate_code` | 代码校验 — 检测禁止的第三方库、manifest 缺失字段 |
| `get_project_template` | 项目模板 — manifest.json、app.ux 等模板参考 |

项目代码生成完成后，可通过 velajs-mcp 提供的 MCP 工具辅助开发。

---

## 三、禁止行为

| 编号 | 禁止行为 | 原因 |
|------|----------|------|
| F1 | 设计稿阶段使用 `velajs-mcp` 获取设计稿信息 | velajs-mcp 不支持获取设计稿 |
| F2 | 调试阶段使用 `uvx mcp-figma` | 工具用途不匹配 |
| F3 | 跳过 Figma MCP 调用，直接生成代码 | 设计还原度无法保证 |
| F4 | MCP 调用失败后静默继续 | 静默失败 |

---

## 四、正确流程示例

### 场景：用户提供了 Figma 设计稿

**阶段一：设计稿获取（使用 Figma MCP）**
```
1. 识别到 Figma 链接
2. 解析 URL，提取 file_key 和 node_id
3. 调用 get_file / get_file_nodes / export_image
4. 解析节点结构、样式、文本内容
5. 导出图片资源到项目目录
6. 基于真实设计数据生成代码
```

**阶段二：项目调试（使用 velajs-mcp）**
```
1. 项目代码生成完成
2. cd {projectPath}
3. 输入：帮我调试
```

### 错误示例 ❌
```
// 错误：在设计稿阶段使用 velajs-mcp
npx velajs-mcp figma get-board-info <url>

// 错误：在调试阶段使用 Figma MCP
get_file(file_key="xxx")  // 调试阶段不需要
```

---

## 五、代码自检清单

### 设计稿阶段
- [ ] 使用的是 VS Code 内置 Figma MCP 工具（`uvx mcp-figma`）
- [ ] 未使用 `velajs-mcp` 获取设计稿信息
- [ ] MCP 调用成功获取了设计稿信息
- [ ] 设计稿中的图片资源已导出到项目目录
- [ ] 代码中引用的是真实图片路径

### 调试阶段
- [ ] 项目代码已生成完成
- [ ] 使用velajs-mcp 开始调试
- [ ] 调试过程中未使用 Figma MCP
