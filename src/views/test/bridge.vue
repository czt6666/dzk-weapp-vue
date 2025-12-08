<template>
    <div class="wx-bridge-page">
        <h2>微信小程序通信测试（web-view）</h2>

        <button class="btn" @click="sendToMiniProgram">发送消息给小程序</button>

        <div class="block">
            <h3>来自小程序的消息：</h3>
            <pre>{{ fromMini }}</pre>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 小程序发来的信息
const fromMini = ref("暂无消息");

// H5 → 小程序
function sendToMiniProgram() {
    if (!window.WeixinJSBridge) {
        alert("WeixinJSBridge 未注入");
        return;
    }
    window.WeixinJSBridge.invoke(
        "postMessage",
        {
            action: "h5_to_mini",
            data: {
                msg: "来自 H5 的消息",
                time: Date.now(),
            },
        },
        () => {},
    );
}

// 小程序 → H5
function handleMiniMessage(e) {
    try {
        fromMini.value = JSON.stringify(e.data, null, 2);
    } catch (err) {
        fromMini.value = "解析失败";
    }
}

onMounted(() => {
    // 监听来自微信小程序的消息
    window.addEventListener("message", handleMiniMessage);
});
</script>

<style scoped>
.wx-bridge-page {
    max-width: 500px;
    margin: 0 auto;
    padding: 16px;
}
.btn {
    padding: 6px 14px;
    background: #409eff;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}
.btn:hover {
    background: #66b1ff;
}
.block {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
