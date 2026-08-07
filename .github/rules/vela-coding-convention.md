---
description: Vela 快应用编码规范 — 基于官方文档（https://iot.mi.com/vela/quickapp/zh/guide/）的强制编码约束
alwaysApply: true
---

# Vela 快应用编码规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。所有生成的 Vela 快应用代码必须严格符合官方文档规范。

---

## 一、组件导入规范（最重要）

### 1.1 `<import>` 标签导入（模板层）

**必须**在 `<template>` 标签之前使用 `<import>` 标签声明组件：

```html
<import name="header" src="../../components/Header"></import>
<import name="searchbar" src="../../components/SearchBar"></import>

<template>
  <div>
    <header title="标题" />
  </div>
</template>
```

### 1.2 组件命名规则

| 规则 | 说明 | 示例 |
|------|------|------|
| `name` 属性 | 小写字母，无分隔符 | `name="appcard"` |
| 模板使用 | 与 `name` 一致的小写标签 | `<appcard />` |
| `src` 路径 | 不带 `.ux` 后缀 | `src="../../components/Header"` |

### 1.3 禁止行为

| ❌ 错误 | ✅ 正确 |
|---------|---------|
| `import Header from './Header.ux'` | `<import name="header" src="./Header"></import>` |
| `<Header title="x" />` | `<header title="x" />` |
| `src="../../components/Header.ux"` | `src="../../components/Header"` |

---

## 二、.ux 文件结构规范

### 2.1 三段式结构

每个 `.ux` 文件必须包含三部分，顺序固定：

```html
<import name="comp" src="./Comp"></import>

<template>
  <!-- 只能有一个根节点 -->
  <div class="container">
    <comp />
  </div>
</template>

<style>
.container { flex-direction: column; }
</style>

<script>
export default {
  props: [],
  data: {},
  onInit() {},
  onDestroy() {}
}
</script>
```

### 2.2 模板规则

- **根节点唯一**：`<template>` 内只能有一个根节点
- **组件标签小写**：所有自定义组件标签必须小写
- **事件绑定**：使用 `on` 前缀（`onclick`、`ontap`、`onchange`）
- **数据绑定**：使用 `{{}}` 双花括号语法

### 2.3 样式规则

- **Flexbox 布局**：所有布局使用 Flexbox
- **单位省略**：数字默认为 px，无需写单位
- **类名规范**：使用 kebab-case（`app-card`）
- **禁止 `@import`**：使用 `<style src="./style.css"></style>` 外部引入

---

## 三、数据绑定规范

### 3.1 组件 Props

```html
<!-- 父组件传递 -->
<appcard app="{{item}}" ontap="onTap" />

<!-- 子组件接收 -->
<script>
export default {
  props: ['app'],
  // props 自动绑定到 this
}
</script>
```

### 3.2 事件处理

```html
<!-- 事件绑定：on + 事件名 -->
<button onclick="handleClick">点击</button>
<list onscroll="handleScroll">...</list>

<!-- 子组件触发事件 -->
this.$emit('tap', { app: this.app });
```

### 3.3 条件渲染

```html
<div if="{{show}}">显示内容</div>
<div elif="{{other}}">其他内容</div>
<div else>默认内容</div>
```

### 3.4 列表渲染

```html
<list>
  <list-item for="{{items}}">
    <text>{{$idx}} - {{$item.name}}</text>
  </list-item>
</list>
```

---

## 四、生命周期规范

### 4.1 页面生命周期

```javascript
export default {
  data: {},           // 页面数据（非 private）

  onInit() {},        // 页面初始化（最早触发）
  onReady() {},       // 页面渲染完成
  onShow() {},        // 页面显示
  onHide() {},        // 页面隐藏
  onDestroy() {}      // 页面销毁（必须清理资源）
}
```

### 4.2 组件生命周期

```javascript
export default {
  props: [],
  data: {},

  onInit() {},        // 组件初始化
  onReady() {},       // 组件渲染完成
  onDestroy() {}      // 组件销毁
}
```

### 4.3 资源清理（必须）

```javascript
onDestroy() {
  // 清理定时器
  if (this.timer) clearInterval(this.timer);
  // 清理事件监听
  // 清理网络请求
}
```

---

## 五、系统 API 调用规范

### 5.1 导入方式

```javascript
import router from '@system.router';
import fetch from '@system.fetch';
import storage from '@system.storage';
import file from '@system.file';
```

### 5.2 常用 API 示例

```javascript
// 路由跳转
router.push({ uri: '/pages/detail', params: { id: '1' } });
router.back();

// 网络请求
fetch.fetch({
  url: 'https://api.example.com/data',
  method: 'GET',
  responseType: 'json',
  success: (response) => { /* 处理响应 */ },
  fail: (data, code) => { /* 处理错误 */ }
});

// 本地存储
storage.set({ key: 'user', value: JSON.stringify(data) });
storage.get({ key: 'user', success: (data) => { /* ... */ } });
```

### 5.3 错误处理（必须）

所有 API 调用必须包含错误处理：

```javascript
fetch.fetch({
  url: apiUrl,
  success: (response) => {
    // 成功处理
  },
  fail: (data, code) => {
    console.error('请求失败:', code);
    // 错误提示
  }
});
```

---

## 六、manifest.json 规范

### 6.1 必需字段

```json
{
  "package": "com.company.appname",
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
    { "name": "system.router" }
  ],
  "router": {
    "entry": "pages/index",
    "pages": {
      "pages/index": { "component": "index" }
    }
  }
}
```

### 6.2 features 声明

使用哪个 API 就必须声明对应的 feature：

| API | feature 声明 |
|-----|-------------|
| `@system.router` | `{ "name": "system.router" }` |
| `@system.fetch` | `{ "name": "system.fetch" }` |
| `@system.storage` | `{ "name": "system.storage" }` |
| `@system.file` | `{ "name": "system.file" }` |

---

## 七、项目目录规范

```
project/
├── package.json          # aiot-toolkit（禁止 hap-toolkit）
├── src/
│   ├── manifest.json
│   ├── app.ux
│   ├── pages/
│   │   └── PageName/
│   │       └── index.ux
│   ├── components/
│   │   └── CompName.ux
│   ├── common/
│   │   └── logo.png
│   └── i18n/
│       ├── defaults.json
│       └── zh-CN.json
```

---

## 八、自检清单

每次生成代码前必须逐项检查：

### 组件导入
- [ ] 使用 `<import>` 标签而非 ES6 `import`
- [ ] `src` 路径不带 `.ux` 后缀
- [ ] 模板中组件标签全部小写
- [ ] `name` 属性为小写字母

### 文件结构
- [ ] `<template>` 只有一个根节点
- [ ] 三段式顺序：`<import>` → `<template>` → `<style>` → `<script>`
- [ ] 样式使用 Flexbox

### 数据与事件
- [ ] 事件绑定使用 `on` 前缀
- [ ] 列表渲染使用 `$idx` 和 `$item`
- [ ] 条件渲染使用 `if/elif/else`

### API 调用
- [ ] 已导入所需系统 API
- [ ] 已在 manifest.json 声明 features
- [ ] 所有 API 调用包含错误处理

### 资源清理
- [ ] `onDestroy()` 中清理定时器
- [ ] `onDestroy()` 中清理事件监听
