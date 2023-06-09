module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        // 尾逗号
        trailingComma: "none",
        // 分号结尾
        semi: true,
        // 行尾序列
        endOfLine: "auto"
      }
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-undef": "off",
    "no-unused-vars": "off"
  }
};
