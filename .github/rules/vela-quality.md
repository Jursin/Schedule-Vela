---
description: 代码质量标准 — 命名规范、错误处理、资源清理、禁止行为、自检清单
alwaysApply: true
---

# Vela 快应用代码质量标准

> ⚠️ 本文件为强制执行规则，AI 必须无条件遵守。

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `userName`, `getUserInfo()` |
| 组件 | PascalCase | `UserCard`, `MusicPlayer` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 页面路由 | kebab-case | `pages/user-detail/index.ux` |

## 错误处理

**所有 API 调用必须包含错误处理**：

```javascript
// 正确 ✅
import fetch from '@system.fetch'
fetch.fetch({
  url: 'https://api.example.com/data',
  success: (response) => {
    // 处理成功
  },
  fail: (data, code) => {
    console.error(`请求失败: code=${code}`)
    // 错误兜底
  }
})

// 错误 ❌ — 没有错误处理
fetch.fetch({ url: 'https://api.example.com/data' })
```

## 网络请求规范

- **必须**设置超时时间
- **必须**提供失败兜底逻辑（如展示缓存数据或错误提示）
- **禁止**不处理 fail 回调

## 资源清理

在 `onDestroy` 中**必须**清理：

| 资源类型 | 清理方式 |
|----------|----------|
| 定时器 | `clearInterval(id)` / `clearTimeout(id)` |
| 事件监听 | `offXxx(event, handler)` |
| 动画 | 取消动画帧 |

```javascript
export default {
  private: {
    timerId: null
  },
  onShow() {
    this.timerId = setInterval(() => { /* ... */ }, 1000)
  },
  onDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }
}
```

## 禁止行为

| 编号 | 禁止行为 | 原因 |
|------|----------|------|
| Q1 | `console.debug` 调试输出 | 使用系统日志或 prompt API |
| Q2 | 未处理的 Promise / fail 回调 | 导致静默失败 |
| Q3 | `onDestroy` 中未清理资源 | 内存泄漏 |
| Q4 | 非 UI 数据放入 ViewModel | 影响渲染性能 |
| Q5 | 直接重新赋值对象/数组 | 应原地修改属性 |
| Q6 | 在循环中创建闭包 | 性能问题 |
| Q7 | 超长函数（>50行） | 拆分为独立方法 |

## 代码自检清单

代码生成完成后，**必须**逐项检查：

- [ ] 所有组件来自白名单
- [ ] 所有 API 来白名单且在 features 中声明
- [ ] 无第三方依赖（package.json 检查）
- [ ] 无 console.log（使用 console.error 记录错误除外）
- [ ] 所有 fetch/API 调用有 fail 处理
- [ ] 所有定时器在 onDestroy 中清理
- [ ] 路由配置与实际页面文件一致
- [ ] .ux 文件 template 只有一个根节点
- [ ] 圆屏安全区域已应用
- [ ] CSS 仅使用 class 选择器（无元素/ID/后代/伪类选择器）
- [ ] CSS 无嵌套写法（扁平结构）
- [ ] CSS 无 Less/Sass/SCSS 语法
- [ ] class 命名符合 kebab-case 规范
- [ ] 用户提供设计稿时，已通过 MCP 获取设计稿节点数据
- [ ] 组件结构与设计稿层级一致
- [ ] 颜色、字号、间距与设计稿一致
- [ ] 所有静态资源已从设计稿导出到 `src/common/images/` 对应子目录
- [ ] 图片资源命名符合规范，无 placeholder 或外部 URL
- [ ] Mock 数据使用本地图片路径
- [ ] 页面视觉还原度与 UI 稿一致
