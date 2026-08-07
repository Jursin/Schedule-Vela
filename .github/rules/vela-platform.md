---
description: VelaOS 平台硬约束 — 组件白名单、API 白名单、禁止的第三方依赖、生命周期、数据对象
alwaysApply: true
---

# VelaOS 平台硬约束

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守，不可协商或降级。

## 组件白名单

仅允许使用以下 Vela 内置组件，**禁止使用任何其他组件或第三方 UI 库**：

div, list, list-item, text, image, input, scroll, swiper, switch, slider, progress, picker, stack, span, marquee, barcode, qrcode, chart, image-animator, a

## API 白名单

仅允许使用以下 @system.xxx API，**使用前必须在 manifest.json features 中声明**：

router, app, fetch, storage, device, audio, prompt, sensor, vibrator, network, brightness, volume, battery, geolocation, record, file, crypto, configuration, interconnect, messagecenter

## 禁止的第三方依赖

| 类别 | 禁止项 | 替代方案 |
|------|--------|----------|
| UI 库 | antd, element-ui, vant, Material-UI | 使用内置组件 |
| JS 库 | axios, lodash, moment, echarts, jQuery | 使用 @system.fetch 等系统 API |
| 框架 | Vue, React, Angular, Svelte | VelaOS 原生 .ux 开发范式 |
| 构建工具 | hap-toolkit | 使用 aiot-toolkit |

## 页面生命周期

```
onInit → onReady → onShow → onHide → onDestroy
```

- `onDestroy` 中**必须**清理所有定时器、事件监听等资源

## 页面数据对象

| 对象 | 作用域 | 说明 |
|------|--------|------|
| `public` | 外部 | 允许被外部传入数据覆盖 |
| `protected` | 应用内部 | 允许被应用内部页面传参覆盖 |
| `private` | 页面内 | 不允许被覆盖 |
| `data` | 组件 | 组件级数据 |
