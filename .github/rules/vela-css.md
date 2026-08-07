---
description: CSS 编码规范 — 选择器限制、嵌套规则、样式编写约束
alwaysApply: true
---

# Vela 快应用 CSS 编码规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## 选择器规则

### 只允许使用 class 选择器

**禁止**使用以下选择器类型：

| 禁止类型 | 示例 | 原因 |
|----------|------|------|
| 元素选择器 | `div { }` | 耦合度高，难以维护 |
| ID 选择器 | `#header { }` | 特异性过高 |
| 后代选择器 | `.parent .child { }` | 性能差，作用域不可控 |
| 子选择器 | `.parent > .child { }` | 嵌套耦合 |
| 伪类选择器 | `.item:hover { }` | 穿戴设备无鼠标交互 |
| 伪元素选择器 | `.item::before { }` | 不支持或兼容性差 |
| 属性选择器 | `[type="text"] { }` | 不支持 |
| 通配选择器 | `* { }` | 不支持 |

**正确写法** ✅：

```css
.page-container {
  width: 480px;
  height: 480px;
}

.section-title {
  font-size: 28px;
  color: #ffffff;
}

.app-card {
  background-color: #1a1a1a;
  border-radius: 12px;
}
```

**错误写法** ❌：

```css
/* 后代选择器 */
.page .title { }

/* 伪类 */
.item:active { }

/* 元素选择器 */
div { padding: 10px; }
```

## 禁止嵌套写法

Vela 快应用 **不支持** CSS 嵌套语法，所有样式必须扁平编写。

**正确写法** ✅：

```css
.parent {
  flex-direction: column;
}

.child {
  font-size: 24px;
}

.grandchild {
  color: #ffffff;
}
```

**错误写法** ❌：

```css
/* 禁止嵌套 */
.parent {
  flex-direction: column;

  .child {
    font-size: 24px;

    .grandchild {
      color: #ffffff;
    }
  }
}
```

## 不推荐使用 Less/Sass

- **禁止**使用 Less、Sass、SCSS 等 CSS 预处理器
- 所有样式使用**原生 CSS** 编写
- 变量、混合宏等功能不被 Vela 快应用支持

**正确写法** ✅：

```css
/* 使用原生 CSS */
.primary-button {
  background-color: #4CAF50;
  border-radius: 20px;
}

.secondary-button {
  background-color: #2196F3;
  border-radius: 20px;
}
```

**错误写法** ❌：

```less
/* Less 变量 */
@primary-color: #4CAF50;

.primary-button {
  background-color: @primary-color;
  .border-radius();
}

/* Less 混合 */
.border-radius() {
  border-radius: 20px;
}
```

## class 命名规范

| 规则 | 说明 | 示例 |
|------|------|------|
| kebab-case | 多单词用连字符连接 | `app-card`, `section-title` |
| 语义化 | 名称体现用途 | `user-info` 而非 `info1` |
| 前缀区分 | 组件级样式加前缀 | `app-card__icon` |
| 避免缩写 | 使用完整单词 | `container` 而非 `ctn` |

**推荐命名模式**：

```
{模块}-{元素}
{模块}-{状态}

示例：
app-card          — 应用卡片
app-card__icon    — 卡片中的图标
app-card--active  — 卡片激活状态
section-title     — 区域标题
search-input      — 搜索输入框
```

## 样式编写规范

### 属性顺序

推荐按以下顺序编写 CSS 属性：

```css
.custom-class {
  /* 1. 尺寸 */
  width: 100%;
  height: 80px;

  /* 2. 布局 */
  flex-direction: row;
  justify-content: center;
  align-items: center;

  /* 3. 间距 */
  padding: 12px;
  margin-bottom: 16px;

  /* 4. 外观 */
  background-color: #1a1a1a;
  border-radius: 12px;

  /* 5. 文字 */
  font-size: 28px;
  color: #ffffff;
}
```

### 颜色规范

| 用途 | 推荐值 | 说明 |
|------|--------|------|
| 页面背景 | `#000000` | 深色主题 |
| 卡片背景 | `#1a1a1a` | 次级背景 |
| 主文字 | `#ffffff` | 标题、正文 |
| 辅助文字 | `#888888` | 次要信息 |
| 禁用文字 | `#666666` | 不可操作 |
| 主题色 | `#4CAF50` | 按钮、强调 |
| 警告色 | `#FF9800` | 提示信息 |
| 错误色 | `#FF6B6B` | 错误、删除 |

### 尺寸单位

- 使用 **px** 作为唯一单位
- 不使用 `rem`、`em`、`%`（除 width: 100% 等特殊情况）
- 不使用 `vw`、`vh` 视口单位

## 代码自检清单（CSS 部分）

- [ ] 所有选择器均为 class 选择器
- [ ] 无后代选择器、子选择器
- [ ] 无伪类、伪元素选择器
- [ ] 无嵌套写法
- [ ] 无 Less/Sass/SCSS 语法
- [ ] class 命名符合 kebab-case 规范
- [ ] 样式属性顺序合理
- [ ] 颜色使用推荐色值
- [ ] 尺寸单位使用 px

## 其它
- 忽略所有 Unknown property `selected-font-size` 报错
