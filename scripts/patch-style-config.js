"use strict"

// 修复 @aiot-toolkit/parser 样式白名单缺少 selectedFontSize 导致的构建警告
// selected-font-size 运行时生效，但工具链校验白名单未收录该属性
const fs = require("fs")
const path = require("path")

const target = path.join(
  "node_modules",
  "@aiot-toolkit",
  "parser",
  "lib",
  "ux",
  "config",
  "vela",
  "StyleAttributeConfig.js"
)

const snippet =
  "  selectedFontSize: {\n" +
  "    // csstree-validator不可校验\n" +
  "    validate: sourceNode => {\n" +
  "      return validateLengthNode(sourceNode);\n" +
  "    }\n" +
  "    // 按照一般转换即可，无需额外转换\n" +
  "  },\n"

if (!fs.existsSync(target)) {
  console.log("[patch-style] 未找到 parser 配置文件，跳过")
  process.exit(0)
}

const content = fs.readFileSync(target, "utf8")

if (content.includes("selectedFontSize")) {
  console.log("[patch-style] selectedFontSize 已存在，跳过")
  process.exit(0)
}

if (!content.includes("  selectedColor: {")) {
  console.log("[patch-style] 未找到 selectedColor 锚点，跳过")
  process.exit(0)
}

const updated = content.replace("  selectedColor: {", snippet + "  selectedColor: {")
fs.writeFileSync(target, updated)
console.log("[patch-style] 已注入 selectedFontSize 到样式白名单")
