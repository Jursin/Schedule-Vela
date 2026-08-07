# Vela 快应用组件参考

## 容器组件

### div — 基础 Flex 容器
默认 flex-direction: column。支持所有通用样式。

### list + list-item — 高性能列表
```html
<list class="list" onscrollbottom="loadMore">
  <list-item type="item" for="{{list}}" tid="id">
    <text>{{$item.name}}</text>
  </list-item>
</list>
```
- list-item 必须设置 `type` 属性
- 事件: scroll, scrollbottom, scrolltop
- 方法: scrollTo({index}), scrollBy({top})

### scroll — 滚动容器
```html
<scroll scroll-y="true" style="height: 300px;">
  <!-- 内容 -->
</scroll>
```
- 属性: scroll-x, scroll-y, scroll-top, scroll-left
- 样式: scroll-snap-type, scroll-snap-align

### swiper — 滑块视图
```html
<swiper index="0" autoplay="true" interval="3000" loop="true" vertical="false">
  <div><text>页面1</text></div>
  <div><text>页面2</text></div>
</swiper>
```
- 属性: index, autoplay, interval, loop, vertical, indicator
- 样式: indicator-color, indicator-selected-color, indicator-size
- 事件: change({index})
- 方法: swipeTo({index})

### stack — 层叠容器
子组件按层叠顺序排列。

## 基础组件

### text — 文本
- 样式: lines, text-overflow(clip/ellipsis), color, font-size, font-weight, text-align, line-height
- 子组件仅支持 `<span>`

### image — 图片
```html
<image src="/common/logo.png" alt="blank" />
```
- 属性: src, alt("blank"=无占位图)
- 样式: object-fit(contain/cover/none/scale-down)
- 事件: complete({width, height}), error

### span — 行内文本（仅作 text 子组件）

### a — 链接

### progress — 进度条
- type: horizontal / circular
- percent: 进度百分比

### marquee — 跑马灯

### chart — 图表（替代 echarts）

### qrcode — 二维码

### barcode — 条形码

### image-animator — 帧动画

## 表单组件

### input — 输入/按钮/选择
```html
<input type="button" value="点击" onclick="onClick" />
<input type="checkbox" checked="{{checked}}" onchange="onCheck" />
<input type="radio" name="group" value="1" onchange="onRadio" />
```
- type: button, checkbox, radio
- 事件: change({name, value, checked})

### picker — 选择器
- type: text, date, time, multi-text

### slider — 滑块

### switch — 开关

## 通用事件
所有组件支持: touchstart, touchmove, touchend, click, longpress, swipe

## 通用方法
```javascript
this.$element('id').getBoundingClientRect({
  success(data) { /* left, right, top, bottom, width, height */ }
})
this.$element('input1').focus({ focus: true })
```

## 动画
### transform
translate/translateX/translateY, scale/scaleX/scaleY, rotate

### animation + @keyframes
```css
.box { animation-name: fadeIn; animation-duration: 1s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

### transition
```css
.box { transition-property: width; transition-duration: 0.3s; }
```
