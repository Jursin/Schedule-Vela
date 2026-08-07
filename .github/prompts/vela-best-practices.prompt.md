# Vela 快应用最佳实践

## 内存优化（手表设备内存有限，必须严格控制）

1. **非 UI 数据不放 ViewModel**
```javascript
const someObj = { a: 1 }  // ✅ 放在 export default 外部
export default {
  private: {
    someObj: { a: 1 }     // ❌ 不需要绑定到 UI 的数据不要放这里
  }
}
```

2. **数据原地修改，避免重新赋值**
```javascript
// ❌ this.list = [{ name: 'bb' }]
// ✅ this.list[0].name = 'bb'
```

3. **使用 static 标记不变节点**
```html
<text static>{{title}}</text>
<block static><text>{{fixedTitle}}</text></block>
```

4. **页面销毁时清除定时器**
```javascript
onDestroy() { if (this.timer) clearTimeout(this.timer) }
```

5. 读取的数据用完后置 null 释放
6. 调用 `global.runGC()` 手动 GC（不要频繁调用）

## 启动性能优化

- 避免 setTimeout 延迟跳转，用 async/await
- Logo 页避免 HTTP 请求
- 首页数据做本地缓存，先读缓存展示，异步更新
- UI 先行，不等数据加载完才渲染

## 渲染性能优化

- list 超过 10 条使用分页渲染
- 长文案分块渲染，监听 scroll 触底加载
- Swiper 多图使用懒加载（只保留 3 个子组件动态更新）
- 减少 border-radius 与背景图同时使用
- 图片尺寸与组件尺寸保持一致
- 减少标签嵌套层级

## 圆形屏幕安全区域

```css
@media (shape: circle) {
  .container { padding: 50px 36px; }
}
@media (shape: rect) {
  .container { padding: 20px 16px; }
}
```

## 图片使用规范

- 尽量使用本地图片
- 在线图片不超过 200KB
- 首次加载大图增加 loading，下载后缓存到 `internal://files/`
- 优先 PNG8 格式，用 tinypng.com 压缩

## 代码规范

- `template` 只能有一个根节点
- `list-item` 中谨慎使用 if/else/show
- `image` 的 src 不要用变量拼接路径，直接用完整变量
- `input` 等无子元素标签必须自闭合
- 角度 CSS 属性必须带单位: `rotate: 360deg`

## 异常处理

- 网络异常给用户提示
- 空数据/接口错误要有兜底
- 添加 try-catch 捕获 JS 异常
- 按钮防重复点击
- onShow 中的 fetch 注意息屏亮屏会重新触发

## 国际化（i18n）

```html
<text>{{ $t('message.hello') }}</text>
```
```javascript
this.$t('message.hello')
```
文件: `src/i18n/zh-CN.json`, `src/i18n/defaults.json`
