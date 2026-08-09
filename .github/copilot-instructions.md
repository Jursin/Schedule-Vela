# Vela 快应用开发

## 触发条件

当用户消息中包含以下关键词时，**立即自动启动工作流**，无需用户手动引用任何文件：
- Vela 快应用 / vela app / vela quickapp
- 小米快应用 / 小米穿戴应用
- 给 Vela 应用添加功能 / 为快应用新增功能
- 修复 Vela 应用问题 / 快应用 Bug / 页面显示异常
- 优化 Vela 应用 / 快应用性能优化 / 代码优化

---

## 工程体系架构（Harness Engineering）

```
.github/
├── rules/               ← 编译时约束（alwaysApply，AI 无条件遵守）
│   ├── vela-platform.md          # 平台约束：组件+API+禁止依赖+生命周期
│   ├── vela-format.md            # 格式规范：.ux+manifest+package.json+目录结构
│   ├── vela-layout.md            # 布局规范：CSS+圆屏安全区域
│   ├── vela-quality.md           # 质量标准：命名+错误处理+资源清理+禁止行为
│   ├── vela-coding-convention.md # 编码规范
│   ├── vela-css.md               # CSS 编写规范
│   ├── vela-design-driven.md     # 设计驱动开发规范
│   └── vela-figma-mcp.md         # Figma MCP 使用规范
├── agents/              ← 运行时行为体（纯流程编排，rules 自动注入约束）
│   ├── vela-knowledge.agent.md   # 知识库查询
│   ├── vela-feature.agent.md     # 添加功能（增量开发）
│   ├── vela-bugfix.agent.md      # 修复问题（定位+修复 Bug）
│   └── vela-optimize.agent.md    # 整体优化（质量/性能/可维护性）
└── prompts/             ← 知识参考层（按需加载）
    ├── vela-dev-guide.prompt.md       # 完整开发指南
    ├── vela-components.prompt.md      # 组件用法速查
    ├── vela-apis.prompt.md            # API 速查
    └── vela-best-practices.prompt.md  # 最佳实践
```

### 设计原则

| 层级 | 职责 | 加载方式 | 特点 |
|------|------|----------|------|
| **Rules** | 硬约束（什么不能做） | alwaysApply，自动注入 | 不可协商、可验证 |
| **Agents** | 流程编排（怎么做） | 按任务 handoff 调度 | 关注行为序列 |
| **Prompts** | 知识参考（做得好） | 按需引用 | 详细文档、示例 |

### 核心约束（由 Rules 层自动执行）

- 📌 组件白名单 + API 白名单 → `rules/vela-platform.md`
- 📌 .ux 格式 + manifest + package.json → `rules/vela-format.md`
- 📌 Flexbox 布局 + 圆屏安全区域 → `rules/vela-layout.md`
- 📌 命名规范 + 错误处理 + 资源清理 → `rules/vela-quality.md`


### 强制约束（必须遵守）
- 当已有模拟器正在运行时不要运行 npm run build 测试构建
- 必须要测试构建时先申请停止已有模拟器
- 日常开发时直接读取 AIoT Core 输出即可

---

## 自定义 Agent

可在 VS Code Copilot Chat 的 Agent 下拉菜单中选择：

| Agent | 用途 |
|-------|------|
| `Vela 知识库` | 查询组件用法、API 参数、最佳实践 |
| `Vela 添加功能` | 在已有项目中增量添加新功能/新页面/新组件 |
| `Vela 修复问题` | 定位并修复 Bug（先定位根因再最小改动） |
| `Vela 整体优化` | 代码质量、性能、可维护性优化（不改功能行为） |
