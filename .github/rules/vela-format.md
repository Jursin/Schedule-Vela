---
description: 文件格式规范 — .ux 文件结构、manifest.json、package.json、项目目录结构
alwaysApply: true
---

# Vela 快应用文件格式规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## .ux 文件格式

每个页面是一个 `.ux` 文件，**template 只能有一个根节点**，包含三部分：

```html
<template>
  <div class="container">
    <!-- 页面内容 -->
  </div>
</template>

<style>
.container { flex-direction: column; }
</style>

<script>
export default {
  private: {},
  onInit() {},
  onDestroy() {
    // 清理资源
  }
}
</script>
```

### 外部样式引入

```html
<style src="./style.css"></style>
```

❌ **禁止** `@import` 语句

## manifest.json 必需字段

```json
{
  "package": "com.example.appname",
  "name": "应用名称",
  "icon": "/common/logo.png",
  "versionCode": 1,
  "minPlatformVersion": 1200,
  "deviceTypeList": ["watch"],
  "config": {
    "logLevel": "log",
    "designWidth": 480
  },
  "features": [
    { "name": "@system.router" }
  ],
  "router": {
    "entry": "pages/index",
    "pages": {
      "pages/index": {
        "component": "index"
      }
    }
  }
}
```

**注意**：`designWidth` 在 `config` 内部，不是根级字段。

## package.json 标准格式

```json
{
  "name": "项目名",
  "version": "1.0.0",
  "scripts": {
    "start": "aiot start --watch",
    "build": "aiot build",
    "release": "aiot release"
  },
  "devDependencies": {
    "aiot-toolkit": "^2.0.5"
  }
}
```

**禁止**使用 `hap-toolkit`，必须使用 `aiot-toolkit`。

## 项目目录结构

```
{project}/
├── package.json
├── README.md
├── .gitignore
└── src/
    ├── manifest.json
    ├── app.ux
    ├── config-watch.json    （内容为 {}）
    ├── pages/{PageName}/
    │   └── index.ux
    ├── i18n/
    │   ├── defaults.json
    │   └── zh-CN.json
    └── common/
        └── logo.png
```

## .gitignore 标准内容

```
node_modules/
build/
dist/
```
