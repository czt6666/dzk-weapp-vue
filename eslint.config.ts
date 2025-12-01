import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import { globalIgnores } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfigWithVueTs(
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,tsx,vue}"],
    },

    globalIgnores([
        "**/node_modules/**",
        "**/dist/**",
        "**/dist-ssr/**",
        "**/coverage/**",
        "**/.vscode/**",
        "**/.idea/**",
        "**/public/**",
    ]),

    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    skipFormatting,

    {
        languageOptions: {
            parser: require("vue-eslint-parser"),
            parserOptions: {
                parser: require("@typescript-eslint/parser"), // 让 TS 能被识别
                project: "./tsconfig.app.json", // 对应你的 tsconfig 路径
                tsconfigRootDir: __dirname, // 确保路径正确
                sourceType: "module", // 启用 ESM
                ecmaVersion: "latest", // 允许使用现代语法
            },
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
            },
        },

        rules: {
            // ---------------------- 基础风格 ----------------------
            "no-console": ["warn", { allow: ["warn", "error"] }], // 禁止随意使用 console.log
            "no-debugger": "error", // 禁止 debugger
            semi: ["error", "always"], // 强制语句以分号结尾
            "no-multiple-empty-lines": ["error", { max: 2 }], // 限制空行最多 2 行
            "no-trailing-spaces": "error", // 禁止行尾空格
            eqeqeq: ["warn", "always"], // 要求使用 === 而不是 ==
            curly: ["error", "multi-line"], // if/else 必须带 {}

            // ---------------------- Vue 相关 ----------------------
            "vue/max-attributes-per-line": ["error", { singleline: 5, multiline: { max: 2 } }],
            "vue/singleline-html-element-content-newline": "off", // 允许单行元素内容换行
            "vue/no-unused-components": "warn", // 允许警告未使用组件
            "vue/no-v-html": "off", // 允许使用 v-html
            "vue/v-on-event-hyphenation": "off", // 事件名允许驼峰
            "vue/html-indent": ["error", 4], // Vue 模板 4 空格缩进
            "vue/html-self-closing": [
                "error",
                {
                    html: { void: "any", normal: "any", component: "any" },
                    svg: "never",
                    math: "never",
                },
            ],

            // ---------------------- TS 相关 ----------------------
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
    },
);
