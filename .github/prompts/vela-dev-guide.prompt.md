# Vela 快应用完整开发指南

本文件是 Vela JS 应用开发的完整知识参考，涵盖框架概述、项目结构、配置、模板语法、样式系统、脚本、组件、接口和最佳实践。

官方文档站点：https://iot.mi.com/vela/quickapp/

---

## 框架概述

Xiaomi Vela JS 是小米基于 Vela OS 的轻量级 JS 应用框架，面向智能穿戴设备（手表）。采用前端 MVVM 开发范式，使用 `.ux` 文件编写页面，`manifest.json` 配置应用，Flexbox 布局，支持数据绑定和组件化开发。

## 创建项目

### 方式一：使用脚手架（推荐）

```bash
npm create aiot ux -- --name my-app --template vela-demo
cd my-app
npm install
```

### 方式二：手动创建

参考下方项目结构手动创建。

## 项目结构

```
├── README.md
├── .gitignore
├── package.json
└── src/
    ├── manifest.json
    ├── app.ux
    ├── config-watch.json  # 内容为 {}
    ├── pages/
    │   ├── index/
    │   │   └── index.ux
    │   └── detail/
    │       └── detail.ux
    ├── i18n/
    │   ├── defaults.json
    │   ├── zh-CN.json
    │   └── en.json
    └── common/
        └── logo.png
```

注意：`manifest.json` 中 `router.pages` 的 key 需带 `pages/` 前缀（如 `"pages/index"` 对应 `src/pages/index/`）。

### package.json 示例

```json
{
  "name": "my-app",
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

### .gitignore

```
/node_modules
/dist
/build
```

## manifest.json 配置

```json
{
  "package": "com.company.demo",
  "name": "应用名称",
  "icon": "/common/logo.png",
  "versionName": "1.0",
  "versionCode": 1,
  "minPlatformVersion": 1200,
  "deviceTypeList": ["watch"],
  "features": [
    { "name": "system.router" },
    { "name": "system.configuration" }
  ],
  "config": {
    "logLevel": "log",
    "designWidth": 480
  },
  "router": {
    "entry": "pages/index",
    "pages": {
      "pages/index": {
        "component": "index"
      },
      "pages/detail": {
        "component": "detail"
      }
    }
  }
}
```

关键字段：
- `package`：应用包名，格式 com.company.module
- `name`：应用名称，6个汉字以内
- `versionCode`：整数版本号，每次发布+1
- `features`：接口声明数组，使用接口前必须声明
- `config.designWidth`：设计基准宽度，默认480px
- `router.entry`：首页路径
- `router.pages`：页面路由配置
- `router.pages[].launchMode`：支持 "standard"（默认）和 "singleTask"

## UX 文件格式

```html
<template>
  <!-- 只能有一个根节点 -->
  <div class="page">
    <text class="title">{{title}}</text>
    <input type="button" value="点击" onclick="handleClick" />
  </div>
</template>

<style>
  .page {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 30px;
    color: #333333;
  }
</style>

<script>
  import router from '@system.router'

  export default {
    private: {
      title: '示例页面'
    },
    onInit() {
      console.log('页面初始化')
    },
    handleClick() {
      router.push({ uri: '/pages/detail' })
    }
  }
</script>
```

## Template 模板语法

### 数据绑定
```html
<text>{{message}}</text>
```

### 条件渲染
```html
<text if="{{show}}">显示</text>
<text elif="{{other}}">其他</text>
<text else>默认</text>

<!-- show 指令：不从DOM移除，仅隐藏 -->
<text show="{{visible}}">内容</text>
```

### 列表渲染
```html
<div for="{{list}}" tid="id">
  <text>{{$idx}}: {{$item.name}}</text>
</div>

<!-- 自定义变量名 -->
<div for="(index, item) in list" tid="id">
  <text>{{index}}: {{item.name}}</text>
</div>
```

- `tid` 指定数组元素唯一ID，用于优化渲染
- for 只能循环数组，不能循环对象
- `<block>` 标签可用于逻辑控制，不产生额外DOM节点

### 事件绑定
```html
<text onclick="handleClick">点击</text>
<text onclick="handleClick($idx, $item)">传参</text>
```

## Style 样式系统

### 布局
- CSS Flexbox 布局，默认 `flex-direction: row`
- 盒模型为 `border-box`
- div 为 Flex 容器，text/span 为文本容器

### 长度单位
- `px`：相对于 designWidth 的适配单位，自动按屏幕宽度缩放
- `%`：百分比
- `dp`：设备独立像素（API Level 3+）

### 选择器
- `.class` / `#id` / `tag` / 并列 `.a, .b`
- 优先级：inline > #id > .class > tag
- 暂不支持后代选择器

### 样式预编译
```html
<style lang="less">
  @import './style.less';
</style>
```

### 通用样式属性
width, height, min-width, min-height, max-width, max-height, padding, margin, border, border-radius, background-color, background-image, background-size, background-position, color, opacity, display(flex|none), visibility, position(relative|absolute), flex, flex-grow, flex-shrink, flex-direction, align-items, justify-content, box-shadow, left/top/right/bottom

## Script 脚本

### 页面数据对象
```javascript
export default {
  public: {},     // 允许被外部传入数据覆盖
  protected: {},  // 允许被应用内部页面传参覆盖
  private: {},    // 不允许被覆盖

  // 组件级数据
  data: {},

  // 计算属性
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}
```

### 页面生命周期
- `onInit()`：数据准备好，可使用页面数据
- `onReady()`：模板编译完成，可获取DOM节点
- `onShow()`：页面显示
- `onHide()`：页面隐藏
- `onDestroy()`：页面销毁，应释放资源
- `onBackPress()`：返回按键，return true 阻止返回
- `onRefresh(query)`：singleTask模式页面重新打开
- `onConfigurationChanged(event)`：系统配置变化

### APP 生命周期（app.ux）
- `onCreate()` / `onShow()` / `onHide()` / `onDestroy()` / `onError(e)`

### 全局对象和方法
```javascript
this.$app.$def.data1          // 访问 app.ux 数据
this.$app.$def.method1()      // 调用 app.ux 方法
this.$app.exit()              // 退出应用
this.$page.name               // 页面名
this.$valid                   // 页面有效性
this.$element('id')           // DOM操作
this.$watch('prop', 'handler') // 数据监听
this.$nextTick(() => {})      // 下次DOM更新后回调

// 事件通信
this.$on('event', handler)
this.$off('event', handler)
this.$emit('event', data)       // 触发当前组件事件
this.$dispatch('event', data)   // 向上传递
this.$broadcast('event', data)  // 向下传递
```

## 自定义组件

### 定义组件（comp.ux）
```html
<template>
  <div><text>{{say}}</text></div>
</template>
<script>
  export default {
    props: ['say'],
    data: { localVal: '' },
    onInit() {},
    onReady() {},
    onDestroy() {}
  }
</script>
```

### 引入组件
```html
<import name="my-comp" src="./comp"></import>
<template>
  <div>
    <my-comp say="{{message}}" prop-object="{{obj}}"></my-comp>
  </div>
</template>
```

### 父子通信
- 父→子：通过 props 传递数据
- 子→父：`this.$emit('eventName', data)` + 父组件 `onemit-evt="handler"`
- 向上传递：`this.$dispatch()` + 父组件 `this.$on()`
- 向下传递：`this.$broadcast()` + 子组件 `this.$on()`

## 页面切换

```javascript
import router from '@system.router'

router.push({ uri: '/pages/detail', params: { id: '1' } })
router.replace({ uri: '/pages/detail', params: { id: '1' } })
router.back()
router.clear()
router.getLength()
router.getState()   // { index, name, path }
router.getPages()   // [{ name, path }, ...]
```

接收参数：在目标页面的 `protected`（应用内）或 `public`（应用外）中声明同名属性。

## 组件速查

官方组件文档：https://iot.mi.com/vela/quickapp/zh/components/

### 容器组件
| 组件 | 说明 | 文档 |
|------|------|------|
| div | 基础 Flex 容器 | [链接](https://iot.mi.com/vela/quickapp/zh/components/container/div.html) |
| list + list-item | 高性能列表 | [链接](https://iot.mi.com/vela/quickapp/zh/components/container/list.html) |
| scroll | 滚动容器 | [链接](https://iot.mi.com/vela/quickapp/zh/components/container/scroll.html) |
| swiper | 滑块视图 | [链接](https://iot.mi.com/vela/quickapp/zh/components/container/swiper.html) |
| stack | 层叠容器 | [链接](https://iot.mi.com/vela/quickapp/zh/components/container/stack.html) |

### 基础组件
| 组件 | 说明 | 文档 |
|------|------|------|
| text | 文本 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/text.html) |
| image | 图片 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/image.html) |
| span | 行内文本（仅作 text 子组件） | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/span.html) |
| a | 链接 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/a.html) |
| progress | 进度条 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/progress.html) |
| marquee | 跑马灯 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/marquee.html) |
| chart | 图表 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/chart.html) |
| qrcode | 二维码 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/qrcode.html) |
| barcode | 条形码 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/barcode.html) |
| image-animator | 帧动画 | [链接](https://iot.mi.com/vela/quickapp/zh/components/basic/image-animator.html) |

### 表单组件
| 组件 | 说明 | 文档 |
|------|------|------|
| input | 输入/按钮/选择（type: button/checkbox/radio） | [链接](https://iot.mi.com/vela/quickapp/zh/components/form/input.html) |
| picker | 选择器（type: text/date/time/multi-text） | [链接](https://iot.mi.com/vela/quickapp/zh/components/form/picker.html) |
| slider | 滑块 | [链接](https://iot.mi.com/vela/quickapp/zh/components/form/slider.html) |
| switch | 开关 | [链接](https://iot.mi.com/vela/quickapp/zh/components/form/switch.html) |

### 通用事件
所有组件支持：touchstart, touchmove, touchend, click, longpress, swipe

### 通用方法
```javascript
this.$element('id').getBoundingClientRect({
  success(data) { /* left, right, top, bottom, width, height */ }
})
this.$element('input1').focus({ focus: true })
```

## 接口速查

官方接口文档：https://iot.mi.com/vela/quickapp/zh/features/

### 高频接口

**fetch — 网络请求**
声明：`{ "name": "system.fetch" }`
```javascript
import fetch from '@system.fetch'
fetch.fetch({
  url: 'https://api.example.com/data',
  method: 'GET',
  header: { 'Content-Type': 'application/json' },
  data: JSON.stringify({ key: 'value' }),
  responseType: 'json',
  success(res) { /* res.data, res.code, res.headers */ },
  fail(data, code) { console.log(code) }
})
```

**storage — 键值存储**
声明：`{ "name": "system.storage" }`
```javascript
import storage from '@system.storage'
storage.set({ key: 'token', value: 'xxx' })
storage.get({ key: 'token', success(data) { console.log(data) } })
storage.delete({ key: 'token' })
storage.clear()
```

**audio — 音频播放**
声明：`{ "name": "system.audio" }`
```javascript
import audio from '@system.audio'
audio.src = '/common/music.mp3'
audio.volume = 0.8
audio.play() / audio.pause() / audio.stop()
audio.getPlayState({ success(data) { /* state, currentTime, duration */ } })
```

**prompt — 弹窗提示**
声明：`{ "name": "system.prompt" }`
```javascript
import prompt from '@system.prompt'
prompt.showToast({ message: '操作成功', duration: 2000 })
```

### 全部接口列表

| 接口 | 声明 | 用途 | 文档 |
|------|------|------|------|
| router | 无需声明 | 页面路由 | [链接](https://iot.mi.com/vela/quickapp/zh/features/basic/router.html) |
| app | system.app | 应用管理 | [链接](https://iot.mi.com/vela/quickapp/zh/features/basic/app.html) |
| configuration | system.configuration | 应用配置 | [链接](https://iot.mi.com/vela/quickapp/zh/features/basic/configuration.html) |
| device | system.device | 设备信息 | [链接](https://iot.mi.com/vela/quickapp/zh/features/basic/device.html) |
| fetch | system.fetch | 网络请求 | [链接](https://iot.mi.com/vela/quickapp/zh/features/network/fetch.html) |
| request | system.request | 下载管理 | [链接](https://iot.mi.com/vela/quickapp/zh/features/network/request.html) |
| interconnect | system.interconnect | 设备互联 | [链接](https://iot.mi.com/vela/quickapp/zh/features/network/interconnect.html) |
| storage | system.storage | 键值存储 | [链接](https://iot.mi.com/vela/quickapp/zh/features/data/storage.html) |
| file | system.file | 文件操作 | [链接](https://iot.mi.com/vela/quickapp/zh/features/data/file.html) |
| network | system.network | 网络状态 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/network.html) |
| vibrator | system.vibrator | 振动 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/vibrator.html) |
| brightness | system.brightness | 屏幕亮度 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/brightness.html) |
| volume | system.volume | 音量控制 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/volume.html) |
| battery | system.battery | 电池信息 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/battery.html) |
| geolocation | system.geolocation | 地理位置 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/geolocation.html) |
| sensor | system.sensor | 传感器 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/sensor.html) |
| record | system.record | 录音 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/record.html) |
| alarm | system.alarm | 闹钟 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/alarm.html) |
| event | system.event | 系统事件 | [链接](https://iot.mi.com/vela/quickapp/zh/features/system/event.html) |
| audio | system.audio | 音频播放 | [链接](https://iot.mi.com/vela/quickapp/zh/features/other/audio.html) |
| prompt | system.prompt | 弹窗提示 | [链接](https://iot.mi.com/vela/quickapp/zh/features/other/prompt.html) |
| crypto | system.crypto | 加密 | [链接](https://iot.mi.com/vela/quickapp/zh/features/security/crypto.html) |

### 通用错误码
- 200：系统通用错误
- 201：用户拒绝
- 202：参数错误
- 203：功能不支持
- 204：请求超时
- 300：I/O 错误

## 文件存储分区

| 分区 | URI | 读写 | 说明 |
|------|-----|------|------|
| 应用资源 | /path | 只读 | 应用内置资源 |
| Cache | internal://cache/path | 读写 | 缓存，可能被系统清理 |
| Files | internal://files/path | 读写 | 永久小文件 |
| Mass | internal://mass/path | 读写 | 大文件，不保证可用 |
| Temp | internal://tmp/path | 只读 | 临时文件，重启后失效 |

## 动画样式

### transform
```css
div { transform: translate(10px, 20px) rotate(45deg) scale(1.5); }
```

### animation + @keyframes
```css
.box { animation-name: fadeIn; animation-duration: 1s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

### transition
```css
.box { transition-property: width; transition-duration: 0.3s; }
```

## Media Query 媒体查询

```css
@media (shape: circle) {
  .box { border-radius: 50%; }
}
@media (device-type: watch) and (min-width: 200) {
  .box { width: 100%; }
}
```

支持的媒体特性：
- `shape`：circle / rect / pill-shaped
- `device-type`：watch / band / smartspeaker
- `width` / `min-width` / `max-width`（dp单位，不带单位书写）
- `height` / `min-height` / `max-height`

常见设备 dp 参考：
- Xiaomi Watch S1 Pro/S5：480×480px, DPR=2, 宽=240dp
- Xiaomi Watch S3/S4/H1：466×466px, DPR=2, 宽=233dp
- REDMI Watch 5：432×514px, DPR=2, 宽=216dp
- 小米手环9：192×490px, DPR=2, 宽=96dp

## 国际化（i18n）

```html
<text>{{ $t('message.hello') }}</text>
<text>{{ $t('message.greeting', { name: '小明' }) }}</text>
```

```javascript
this.$t('message.hello')
```

文件：`src/i18n/zh-CN.json`, `src/i18n/defaults.json`

## 最佳实践

### 内存优化
- 非 UI 数据不放 ViewModel（放在 export default 外部）
- 数据原地修改，避免重新赋值整个数组/对象
- 使用 `static` 标记不变节点
- 页面销毁时清除定时器
- 读取的数据用完后置 null 释放

### 启动性能
- 避免 setTimeout 延迟跳转，用 async/await
- Logo 页避免 HTTP 请求
- 首页数据做本地缓存，先读缓存展示
- UI 先行，不等数据加载完才渲染

### 渲染性能
- list 超过 10 条使用分页渲染
- 减少 border-radius 与背景图同时使用
- 图片尺寸与组件尺寸保持一致
- 减少标签嵌套层级

### 圆形屏幕安全区域
- 上下安全边距：屏幕高度 10%
- 左右安全边距：屏幕宽度 7-8%
- 内容超出一屏用 `<scroll scroll-y="true">` 包裹

```css
@media (shape: circle) {
  .container { padding: 50px 36px; }
}
@media (shape: rect) {
  .container { padding: 20px 16px; }
}
```

### 异步接口 Promise 封装
```javascript
function promisify(fn) {
  return (opts = {}) => new Promise((resolve, reject) => {
    fn({ ...opts, success: resolve, fail: (data, code) => reject({ data, code }) })
  })
}
```

## 完整页面示例

```html
<template>
  <div class="page">
    <text class="title">{{title}}</text>
    <div class="list-wrap">
      <div for="{{items}}" tid="id" class="item" onclick="onItemClick($item)">
        <image src="{{$item.icon}}" class="icon" />
        <text class="name">{{$item.name}}</text>
      </div>
    </div>
    <div if="{{items.length === 0}}" class="empty">
      <text>暂无数据</text>
    </div>
  </div>
</template>

<style>
  .page { flex-direction: column; padding: 20px; }
  .title { font-size: 36px; font-weight: bold; margin-bottom: 20px; }
  .list-wrap { flex-direction: column; }
  .item {
    flex-direction: row; align-items: center;
    padding: 15px 0; border-bottom: 1px solid #eeeeee;
  }
  .icon { width: 60px; height: 60px; margin-right: 15px; }
  .name { font-size: 28px; color: #333333; }
  .empty { justify-content: center; align-items: center; margin-top: 100px; }
</style>

<script>
  import router from '@system.router'
  import storage from '@system.storage'

  export default {
    private: {
      title: '我的应用',
      items: []
    },
    onInit() {
      this.loadData()
    },
    loadData() {
      storage.get({
        key: 'items',
        success: (data) => {
          if (data) { this.items = JSON.parse(data) }
        }
      })
    },
    onItemClick(item) {
      router.push({ uri: '/pages/detail', params: { id: item.id } })
    }
  }
</script>
```
