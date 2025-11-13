<template>
    <div class="container">
        <h2>H5 + 小程序 登录演示</h2>
        <button @click="requestMiniLogin">请求小程序登录</button>
        <p v-if="code">获取到的登录 code：{{ code }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const code = ref("");

// 请求小程序调用 wx.login
const requestMiniLogin = () => {
    if (window.wx && wx.miniProgram && wx.miniProgram.postMessage) {
        wx.miniProgram.postMessage({ data: { type: "requestLogin" } });
        console.log("已向小程序发送登录请求");
    } else {
        alert("请在小程序内打开该页面");
    }
};

// 监听小程序发来的消息
onMounted(() => {
    window.addEventListener("message", (e) => {
        const payload = e.data;
        if (payload?.type === "loginResult") {
            if (payload.code) {
                code.value = payload.code;
                alert("登录成功！code: " + payload.code);
            } else if (payload.error) {
                alert("登录失败：" + JSON.stringify(payload.error));
            }
        }
    });
});
</script>

<style scoped>
.container {
    text-align: center;
    margin-top: 50px;
}
button {
    padding: 8px 16px;
    font-size: 16px;
}
</style>
