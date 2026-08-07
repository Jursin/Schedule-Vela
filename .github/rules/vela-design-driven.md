---
description: 设计稿驱动开发规范 — 强制使用 MCP 获取设计稿节点，禁止跳过设计稿直接生成代码
alwaysApply: true
---

# Vela 快应用设计稿驱动开发规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## 核心原则

**当用户提供设计稿地址（Figma 链接或设计图片）时，必须通过 MCP 工具获取设计稿节点信息，基于真实设计数据生成代码。禁止跳过设计稿、仅凭 PRD 文档直接生成代码。**

## 强制流程

### 1. 检测设计稿输入

用户消息中包含以下内容时，视为提供了设计稿：

| 类型 | 触发条件 |
|------|----------|
| Figma 链接 | 包含 `figma.com` 的 URL |
| 设计图片 | 附件或引用的 `.png`、`.jpg`、`.svg` 文件 |

### 2. 必须执行的 MCP 调用

#### Figma 设计稿

**⚠️ 前置条件：MCP 环境检查**

在调用 MCP 获取设计稿之前，**必须先检查环境配置**：

```bash
# 检查 uvx
which uvx || echo "❌ uvx 未安装"

# 检查 VS Code MCP 配置
grep -q '"figma"' "$HOME/Library/Application Support/AIoT IDE/User/settings.json" && echo "✅ Figma MCP 已配置" || echo "❌ 未配置"
```

如果环境检查未通过，**必须先引导用户完成配置**，禁止跳过配置直接生成代码。

**配置模板**（添加到 `settings.json`）：
```json
"chat.mcp.servers": {
  "figma": {
    "command": "uvx",
    "args": ["mcp-figma"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN_HERE",
      "FASTMCP_LOG_LEVEL": "ERROR"
    },
    "disabled": false,
    "autoApprove": ["get_file", "get_file_nodes", "export_image"]
  }
}
```

**获取流程**：
```
步骤 1：检查 MCP 环境（uvx + VS Code 配置 + Token）
步骤 2：解析 Figma URL，提取 board/file ID 和 node-id
步骤 3：调用 get_file 获取文件信息
步骤 4：调用 get_file_nodes 提取具体节点的结构、样式、文本
步骤 5：调用 export_image 导出图片资源
步骤 6：基于节点数据生成组件结构和样式代码
```

#### 设计图片

```
步骤 1：识别设计图片中的页面结构、组件布局
步骤 2：提取颜色、字体、间距、圆角等视觉参数
步骤 3：基于图片内容生成对应的组件结构和样式代码
```

### 3. 禁止行为

| 编号 | 禁止行为 | 原因 |
|------|----------|------|
| D1 | 用户提供了设计稿地址但未调用 MCP 获取 | 忽略用户输入 |
| D2 | 仅凭 PRD 文字描述生成 UI 代码 | 设计还原度无法保证 |
| D3 | 使用占位符图片替代设计稿中的真实图片 | 与设计不一致 |
| D4 | 忽略设计稿中的颜色、间距、字号等细节 | 样式偏差 |
| D5 | MCP 调用失败后直接跳过，不告知用户 | 静默失败 |

### 4. 正确流程示例

**用户输入**：
> 创建一个手表应用商店，设计稿地址：https://www.figma.com/board/xxx

**正确执行** ✅：
```
1. 识别到 Figma 链接
2. 调用 MCP 获取设计稿节点信息
3. 解析节点结构：页面列表、组件层级、样式属性
4. 导出设计稿中的图片资源到项目目录
5. 基于真实设计数据生成 .ux 文件的 template 和 style
6. 在代码中引用导出的真实图片路径
```

**错误执行** ❌：
```
1. 识别到 Figma 链接
2. 跳过 MCP 调用
3. 仅根据 PRD 文档中的功能描述生成代码
4. 使用 placeholder 图片
```

### 5. 设计稿数据提取清单

通过 MCP 获取设计稿后，**必须**提取以下信息：

| 信息类型 | 用途 |
|----------|------|
| 页面结构 | 确定页面数量和导航关系 |
| 组件层级 | 确定组件拆分和嵌套关系 |
| 颜色值 | 填充 CSS 颜色属性 |
| 字号/字重 | 填充字体样式 |
| 间距/边距 | 填充布局间距 |
| 圆角/阴影 | 填充装饰样式 |
| 图片资源 | 导出到 `src/common/images/` 并引用 |
| 文本内容 | 作为页面初始数据 |
| 背景图/插画 | 导出到 `src/common/images/` 并引用 |
| 图标资源 | 导出到 `src/common/images/icons/` 并引用 |

> 📌 **不需要导出**：应用截图、预览图等动态内容图片，可使用 Mock 占位。

### 6. 静态资源导出规范

设计稿中的**所有静态资源**必须导出到项目中，确保生成效果与 UI 稿一致。

#### 6.1 资源分类与目录结构

```
src/common/images/
├── banners/           # 轮播图、Banner 图
├── icons/             # 功能图标、Tab 图标
├── backgrounds/       # 背景图、插画
├── avatars/           # 用户头像
└── misc/              # 其他图片资源
```

#### 6.2 导出规则

| 资源类型 | 导出格式 | scale | 命名规范 | 示例 |
|----------|----------|-------|----------|------|
| 功能图标 | PNG | 2x | `{功能}-icon.png` | `search-icon.png` |
| Tab 图标 | PNG | 2x | `tab-{名称}.png` | `tab-home.png` |
| Banner 图 | PNG | 2x | `banner-{序号}.png` | `banner-01.png` |
| 应用图标 | PNG | 2x | `app-{名称}.png` | `app-health.png` |
| 背景插画 | PNG | 2x | `bg-{场景}.png` | `bg-empty.png` |
| 用户头像 | PNG | 2x | `avatar-{类型}.png` | `avatar-default.png` |

#### 6.3 资源导出流程

```
步骤 1：遍历设计稿节点树，识别所有图片资源节点
步骤 2：按资源类型分类，确定导出目录
步骤 3：调用 MCP 导出图片（scale=2，PNG 格式）
步骤 4：按命名规范重命名文件
步骤 5：保存到对应的子目录
步骤 6：在代码中引用真实路径
```

#### 6.4 代码引用规范

```css
/* 正确 ✅ — 引用导出的真实图片 */
.banner-image {
  src: "/common/images/banners/banner-01.png";
}

.app-icon {
  src: "/common/images/icons/search-icon.png";
}

.empty-state-image {
  src: "/common/images/backgrounds/bg-empty.png";
}

/* 错误 ❌ — 使用占位符或外部 URL */
.banner-image {
  src: "https://via.placeholder.com/440x180";
}

.app-icon {
  src: "data:image/png;base64,...";
}
```

### 7. Mock 数据生成规范

当设计稿中的图片无法直接导出（如动态内容、用户生成内容）时，**必须**生成本地 Mock 图片资源。

#### 7.1 需要 Mock 的场景

| 场景 | Mock 方式 | 说明 |
|------|-----------|------|
| 应用图标 | 生成纯色 + 文字的 PNG | 保留设计稿中的颜色和首字母 |
| 用户头像 | 生成默认头像 PNG | 使用设计稿中的默认头像样式 |
| 轮播图 | 生成带文案的 Banner PNG | 还原设计稿中的排版和配色 |
| 应用截图 | 生成模拟截图 PNG | 按设计稿中的布局生成 |
| 空状态插画 | 生成空状态提示图 | 使用设计稿中的插画风格 |

#### 7.2 Mock 图片生成规则

```
1. 从设计稿节点提取：尺寸、背景色、文字内容、文字颜色、字体大小
2. 生成对应尺寸的 PNG 图片（scale=2）
3. 保存到对应的资源目录
4. 命名格式：mock-{用途}-{标识}.png
```

#### 7.3 Mock 数据示例

```javascript
// 应用列表 Mock 数据 — 使用本地导出的图片路径
const mockApps = [
  {
    id: '101',
    name: '运动健康Pro',
    icon: '/common/images/mock-app-health.png',  // 本地 Mock 图片
    developer: '小米健康',
    rating: 4.8,
    downloadCount: 12580
  },
  {
    id: '102',
    name: '音乐播放器',
    icon: '/common/images/mock-app-music.png',   // 本地 Mock 图片
    developer: '小米音乐',
    rating: 4.6,
    downloadCount: 8920
  }
]

// 轮播图 Mock 数据 — 使用本地导出的图片路径
const mockBanners = [
  {
    id: 1,
    imageUrl: '/common/images/banners/banner-01.png',  // 本地导出
    appId: '101',
    title: '精选应用推荐'
  },
  {
    id: 2,
    imageUrl: '/common/images/banners/banner-02.png',  // 本地导出
    appId: '102',
    title: '热门游戏'
  }
]
```

### 8. 视觉还原度保障

为确保生成效果与 UI 稿一致，**必须**遵守以下规则：

#### 8.1 样式还原

| 属性 | 要求 |
|------|------|
| 颜色 | 必须使用设计稿中的精确色值（含透明度） |
| 字号 | 必须与设计稿一致，禁止自行调整 |
| 间距 | 必须与设计稿中的 padding/margin 一致 |
| 圆角 | 必须与设计稿中的 border-radius 一致 |
| 阴影 | 必须与设计稿中的 box-shadow 一致 |

#### 8.2 布局还原

| 要求 | 说明 |
|------|------|
| 组件尺寸 | 与设计稿一致（宽高、最小尺寸） |
| 组件间距 | 与设计稿中的间距一致 |
| 对齐方式 | 与设计稿中的对齐方式一致 |
| 列表数量 | 与设计稿中展示的数量一致 |
| 安全区域 | 圆屏安全边距必须应用

### 9. MCP 调用失败处理

| 失败场景 | 处理方式 |
|----------|----------|
| 网络超时 | 提示用户检查网络后重试 |
| Token 无效 | 提示用户检查 Figma Token 配置 |
| 节点不存在 | 提示用户确认 node-id 是否正确 |
| 权限不足 | 提示用户授权 Figma 访问权限 |
| 其他错误 | 输出完整错误信息，暂停流程等待用户指示 |

**禁止在 MCP 调用失败后静默继续生成代码。**

## 代码自检清单（设计稿部分）

代码生成完成后，**必须**逐项检查：

- [ ] 用户提供设计稿地址时，已调用 MCP 获取设计稿节点
- [ ] 组件结构与设计稿层级一致
- [ ] 颜色值与设计稿一致（非占位色值）
- [ ] 字号、间距与设计稿一致
- [ ] 所有图片资源已从设计稿导出到 `src/common/images/` 目录
- [ ] 图片资源按类型分类存放（banners/icons/backgrounds/screenshots）
- [ ] 图片资源命名符合规范（`{类型}-{名称}.png`）
- [ ] 代码中引用的是真实图片路径，无 placeholder
- [ ] Mock 数据使用本地图片路径，非外部 URL
- [ ] 页面布局与设计稿视觉一致
- [ ] 组件尺寸与设计稿一致
- [ ] 间距、圆角、阴影与设计稿一致
