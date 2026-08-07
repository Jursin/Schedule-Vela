---
description: 布局规范 — Flexbox 布局、圆屏安全区域、滚动容器、自适应策略
alwaysApply: true
---

# Vela 快应用布局规范

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## Flexbox 布局

- `div` 默认 `flex-direction: column`
- 所有布局使用 Flexbox，不支持 Grid
- 使用 `justify-content` 和 `align-items` 对齐

## 圆形屏幕安全区域

目标屏幕：**466×466 圆屏**

| 方向 | 安全边距 | 计算方式 |
|------|----------|----------|
| 上下 | 屏幕高度 10% | 48px |
| 左右 | 屏幕宽度 7-8% | 34-38px |

### 安全区域容器

```css
.safe-area {
  padding-top: 48px;
  padding-bottom: 48px;
  padding-left: 36px;
  padding-right: 36px;
}
```

## 内容超出一屏

内容超出一屏时，**必须**用 `<scroll scroll-y="true">` 包裹：

```html
<template>
  <scroll scroll-y="true" class="scroll-container">
    <div class="content">
      <!-- 长内容 -->
    </div>
  </scroll>
</template>
```

## 字体规范

| 类型 | 字号 | 字重 |
|------|------|------|
| 大标题 | 32-36px | bold |
| 标题 | 24-28px | bold |
| 正文 | 24px | normal |
| 辅助文字 | 20px | normal |

## 颜色建议

| 用途 | 推荐色值 |
|------|----------|
| 背景 | #000000（深色主题） |
| 主文字 | #FFFFFF |
| 辅助文字 | #999999 |
| 主题色 | 根据品牌自定义 |
| 强调色 | 根据品牌自定义 |
