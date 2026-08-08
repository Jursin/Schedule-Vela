<div align="center">

<img src="src/common/logo.png" />

# Schedule Vela 腕上课程表

一款适用于 Xiaomi Vela OS 操作系统的课程表快应用，让每一次查看课表都抬腕即得

<img src="https://blog.jursin.top/images/schedule-vela/banner.png" />

</div>

## ✨ 功能特性
- 以卡片形式显示每日课程及详细信息
- 每日课程分时间段显示
- 可自由切换显示上/下一天课程
- 点击课程卡片进入全屏显示
- 显示上/下课倒计时和进度条

> [!tip]
> 在模拟器上测试过小米手环 8Pro/9/9Pro/10 无显示问题，但只在小米手环 9 上实机测试过

## 📥 安装方式
- [米坛社区](https://www.bandbbs.cn/resources/5772/)
- [AstroBox](https://astrobox.online/open?source=resv2&id=5772&provider=BandBBS)
- [自定义表盘工具](https://api.bandbbs.cn/wftools/bandbbs.html?code=A&state=1855993)

## 💻 开发
- 环境：Node.js
- 安装依赖
  ```
  npm install
  ```
- 首次开发：初始化示例课表
  ```
  cp src/common/example-schedule.example.json src/common/example-schedule.json
  ```
- 代码检查与格式化
  ```
  npm run lint   # eslint 检查并自动修复
  npm run format # prettier 一键格式化
  npm run check  # prettier 格式检查
  ```
- 调试
  ```
  npm run start
  ```
- 构建
  ```
  npm run build
  ```
- 发布
  ```
  npm run release
  ```

## 📦 相关仓库
- [腕上课程表同步器](https://github.com/Jursin/Schedule-Sync)

## 📖 文档
- [详细使用文档](https://blog.jursin.top/blog/tutorials/schedule-vela.html)
- [Xiaomi Vela JS 应用开发文档](https://iot.mi.com/vela/quickapp)

## 📄 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证
