module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["*.ux"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "espree"
      },
      rules: {
        // 模板插值引用的页面数据会被误报为未使用变量
        "no-unused-vars": "off"
      }
    }
  ]
}
