// ✅ 测试 ESLint 配置
// 故意写一些不规范的代码来测试规则是否被触发

// 1️⃣ 测试 no-console
console.log("hello"); // 应该被警告或报错

// 2️⃣ 测试 semi
const a = 1; // 少了分号，应被报错

// 3️⃣ 测试 no-var
var b = 2; // 不允许 var，应被报错

// 4️⃣ 测试 eqeqeq
if (a == b) {
    // 应该被警告：要求用 ===
    console.log("equal");
}

// 5️⃣ 测试 no-unused-vars
const unused = 123; // 未使用变量，应被警告或错误

// 6️⃣ 测试 object-shorthand
const name = "Jack";
const person = { name: name }; // 应被要求简写为 { name }

// 7️⃣ 测试 vue 相关规则（如果是 .vue 文件）
// 在 vue 文件里可以测试缩进、属性换行、v-html 等规则
