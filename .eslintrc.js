export default {
    root: true, // 只检查当前项目，不影响外部
    env: {
        browser: true, // 允许浏览器全局变量，如 `window`
        node: true, // 允许 Node.js 全局变量，如 `process`
        es6: true, // 启用 ES6 语法
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module", // 允许使用 ES 模块 (`import/export`)
        ecmaVersion: 2020, // 允许最新的 ES 语法
    },
    extends: [
        "eslint:recommended", // ESLint 官方推荐规则
        "plugin:vue/vue3-recommended", // Vue3
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended", // 启用 Prettier 规则，避免格式冲突
    ],
    plugins: ["vue", "prettier", "@typescript-eslint"], // 启用 Prettier 插件
    rules: {
        // 🌟 代码风格
        "no-console": ["warn", { allow: ["log", "warn", "error"] }], // 警告：不允许 `console.log`，但 `console.error` 允许
        "no-debugger": 2, // 错误：禁止使用 `debugger`
        "no-undef": 2, // 错误：禁止使用未声明的变量
        "no-unused-vars": 1, // 警告：禁止声明但未使用的变量
        "no-redeclare": 2, // 错误：禁止重复声明变量
        "no-duplicate-case": 2, // 错误：`switch` 语句中禁止重复 `case`
        "no-extra-boolean-cast": 2, // 错误：禁止不必要的布尔类型转换，如 `!!true`
        semi: ["error", "always"], // 语句必须加 `;`
        "no-multiple-empty-lines": ["error", { max: 2 }], // 最多 2 行空行
        "no-trailing-spaces": "error", // 禁止行尾多余空格

        // 🌟 最佳实践
        eqeqeq: ["warn", "always"], // 警告：使用 `===` 代替 `==`
        "default-case": 2, // `switch` 语句必须有 `default` 分支
        curly: ["error", "multi-line"], // `if`、`else`、`for` 等必须使用 `{}` 代码块
        "no-empty-function": 2, // 禁止定义空函数
        "no-else-return": 2, // `if` 语句中 `return` 后面不能再写 `else`

        // 🌟 ECMAScript 6+ 语法相关
        "arrow-spacing": ["error", { before: true, after: true }], // 箭头函数 `=>` 前后必须有空格
        "no-var": 2, // 禁止使用 `var`，必须使用 `let` 或 `const`
        "object-shorthand": 2, // 对象字面量属性必须使用简写 `{ name }`

        // 🌟 Vue 相关规则
        "vue/max-attributes-per-line": ["error", { singleline: 5, multiline: { max: 2 } }], // 单行最多 4 个属性，多行每行 2 个
        "vue/singleline-html-element-content-newline": "off", // 允许单行元素内容换行
        "vue/no-unused-components": 1, // 警告：禁止未使用的 Vue 组件
        "vue/no-v-html": 0, // 允许 `v-html`，但要小心 XSS
        "vue/v-on-event-hyphenation": "off", // 允许 `v-on` 事件名没有连字符
        "vue/html-indent": ["error", 4], // 4 空格缩进
        // HTML 元素强制自闭合规则
        "vue/html-self-closing": [
            "error",
            {
                html: {
                    void: "any",
                    normal: "any",
                    component: "any",
                },
                svg: "never",
                math: "never",
            },
        ],

        // 🌟 TS 相关规则
        "@typescript-eslint/no-explicit-any": "off", // 允许使用 `any`
        "@typescript-eslint/no-implicit-any-catch": "off", // 允许隐式 `any`
        "@typescript-eslint/strict-boolean-expressions": "off", // 允许 null/undefined 分配
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-invalid-this": "off", // 允许 this 不明确
        "@typescript-eslint/ban-types": "off", // 忽略库类型检查等严格性
        "@typescript-eslint/no-non-null-assertion": "off",
        // ✅ 避免一些类型检查优化
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-unused-vars": "off", // 忽略未使用的变量
    },
    ignorePatterns: [
        "node_modules/", // 忽略 `node_modules`
        "dist/", // 忽略 `dist` 目录（打包输出）
        "coverage/", // 忽略 `coverage`（测试覆盖率报告）
        "debug/", // 忽略 `debug`
        ".vscode/", // 忽略 VSCode 配置目录
        ".idea/", // 忽略 WebStorm 配置目录
        "public/", // 忽略 `public` 目录（静态资源）
    ],
};
