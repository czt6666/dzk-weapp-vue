<template>
    <div class="page">
        <div class="container">
            <!-- 头部 -->
            <div class="card mb20">
                <h1 class="title">微信小程序 Web-view API 测试</h1>
                <p class="subtitle">测试微信小程序 web-view 的各种 API 接口</p>
            </div>

            <!-- 环境检测 -->
            <div class="card mb20">
                <h2 class="section-title">ℹ️ 环境检测</h2>

                <div class="row">
                    <span class="row-label">是否小程序环境：</span>
                    <span :class="environment.isMiniProgram ? 'green' : 'red'">
                        {{ environment.isMiniProgram ? "是" : "否" }}
                    </span>
                </div>

                <div class="row">
                    <span class="row-label">User Agent：</span>
                    <span class="text-break">{{ environment.userAgent }}</span>
                </div>

                <div class="row">
                    <span class="row-label">__wxjs_environment：</span>
                    <span>{{ environment.wxjsEnvironment }}</span>
                </div>
            </div>

            <!-- API 测试按钮 -->
            <div class="card mb20">
                <h2 class="section-title">API 测试</h2>

                <div class="btn-grid">
                    <button class="btn blue" @click="testGetEnv">getEnv</button>
                    <button class="btn green" @click="testNavigateTo">navigateTo</button>
                    <button class="btn purple" @click="testNavigateBack">navigateBack</button>
                    <button class="btn orange" @click="testPostMessage">postMessage</button>
                    <button class="btn pink" @click="testSwitchTab">switchTab</button>
                    <button class="btn indigo" @click="testRedirectTo">redirectTo</button>
                    <button class="btn teal" @click="testReLaunch">reLaunch</button>
                    <button class="btn gray" @click="clearLogs">清空日志</button>
                </div>
            </div>

            <!-- 日志输出 -->
            <div class="card mb20">
                <div class="flex-between mb10">
                    <h2 class="section-title">测试日志</h2>
                    <span class="small-text">共 {{ logs.length }} 条日志</span>
                </div>

                <div>
                    <div v-if="logs.length === 0" class="log-empty">
                        暂无日志，点击上方按钮开始测试
                    </div>

                    <div v-for="(log, idx) in logs" :key="idx" class="log-item" :class="log.type">
                        <div class="log-header">
                            <span class="small-text">{{ log.timestamp }}</span>
                        </div>
                        <div class="log-msg">{{ log.message }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="bridge">
import { ref, reactive, onMounted } from "vue";

const logs = ref([]);

const addLog = (message, type = "info") => {
    logs.value.push({
        message,
        type,
        timestamp: new Date().toLocaleTimeString("zh-CN"),
    });
};

const environment = reactive({
    isMiniProgram: false,
    userAgent: "",
    wxjsEnvironment: "",
    checked: false,
});

onMounted(() => {
    const ua = navigator.userAgent;
    const wxEnv = window.__wxjs_environment || "未定义";
    const isMini = ua.includes("miniProgram") || ua.includes("MicroMessenger");

    environment.userAgent = ua;
    environment.wxjsEnvironment = wxEnv;
    environment.isMiniProgram = isMini;

    addLog(`User Agent: ${ua}`);
    addLog(`window.__wxjs_environment: ${wxEnv}`);

    if (isMini) addLog("检测到小程序环境 ✓", "success");
    else addLog("未检测到小程序环境（浏览器）", "warning");

    const checkWxBridge = () => {
        if (window.WeixinJSBridge) {
            addLog("WeixinJSBridge 已就绪 ✓", "success");

            window.WeixinJSBridge.on("onPageStateChange", (res) => {
                addLog(`页面状态变化：${res.active ? "前台" : "后台"}`);
            });
        } else {
            addLog("WeixinJSBridge 未就绪 ✗", "error");
        }
    };

    if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
        document.addEventListener("WeixinJSBridgeReady", checkWxBridge);
        addLog("等待 WeixinJSBridgeReady...");
    } else checkWxBridge();
});

/** ------- API 测试函数 ------- **/
const testGetEnv = () => {
    addLog("测试 getEnv...");
    if (window.wx?.miniProgram?.getEnv) {
        wx.miniProgram.getEnv((res) => {
            addLog(res.miniprogram ? "在小程序中 ✓" : "不在小程序中 ✗");
        });
    } else addLog("wx.miniProgram.getEnv 不可用", "error");
};

const testNavigateTo = () => {
    addLog("测试 navigateTo...");
    if (window.wx?.miniProgram?.navigateTo) {
        wx.miniProgram.navigateTo({
            url: "/pages/test/test",
            success: () => addLog("navigateTo 成功 ✓", "success"),
            fail: (err) => addLog(`navigateTo 失败: ${err.errMsg}`, "error"),
        });
    } else addLog("navigateTo 不可用", "error");
};

const testNavigateBack = () => {
    addLog("测试 navigateBack...");
    if (window.wx?.miniProgram?.navigateBack) {
        wx.miniProgram.navigateBack({
            delta: 1,
            success: () => addLog("navigateBack 成功 ✓", "success"),
            fail: (err) => addLog(`navigateBack 失败: ${err.errMsg}`, "error"),
        });
    } else addLog("navigateBack 不可用", "error");
};

const testPostMessage = () => {
    addLog("测试 postMessage...");
    if (window.wx?.miniProgram?.postMessage) {
        wx.miniProgram.postMessage({ data: "Hello from webview!" });
        addLog("发送字符串 ✓", "success");

        wx.miniProgram.postMessage({
            data: { foo: "bar", time: Date.now() },
        });
        addLog("发送对象 ✓", "success");
    } else addLog("postMessage 不可用", "error");
};

const testSwitchTab = () => {
    addLog("测试 switchTab...");
    if (window.wx?.miniProgram?.switchTab) {
        wx.miniProgram.switchTab({
            url: "/pages/index/index",
            success: () => addLog("switchTab 成功 ✓", "success"),
            fail: (err) => addLog(`switchTab 失败: ${err.errMsg}`, "error"),
        });
    } else addLog("switchTab 不可用", "error");
};

const testRedirectTo = () => {
    addLog("测试 redirectTo...");
    if (window.wx?.miniProgram?.redirectTo) {
        wx.miniProgram.redirectTo({
            url: "/pages/test/test",
            success: () => addLog("redirectTo 成功 ✓", "success"),
            fail: (err) => addLog(`redirectTo 失败: ${err.errMsg}`, "error"),
        });
    } else addLog("redirectTo 不可用", "error");
};

const testReLaunch = () => {
    addLog("测试 reLaunch...");
    if (window.wx?.miniProgram?.reLaunch) {
        wx.miniProgram.reLaunch({
            url: "/pages/index/index",
            success: () => addLog("reLaunch 成功 ✓", "success"),
            fail: (err) => addLog(`reLaunch 失败: ${err.errMsg}`, "error"),
        });
    } else addLog("reLaunch 不可用", "error");
};

const clearLogs = () => {
    logs.value = [];
    addLog("日志已清空");
};
</script>

<style scoped>
/* 整页滚动 */
.page {
    overflow-y: auto;
    height: 100%;
    background: linear-gradient(135deg, #eaf2ff, #e3e7ff);
    padding: 16px;
}

.container {
    max-width: 860px;
    margin: auto;
}

/* 卡片 */
.card {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

/* 标题 */
.title {
    font-size: 26px;
    margin-bottom: 12px;
    color: #333;
}
.subtitle {
    color: #666;
}

.section-title {
    font-size: 20px;
    margin-bottom: 15px;
    font-weight: bold;
    color: #333;
}

/* 行信息 */
.row {
    margin-bottom: 10px;
    display: flex;
}
.row-label {
    min-width: 140px;
    font-weight: 600;
}
.text-break {
    word-break: break-all;
}
.green {
    color: #1a8f1a;
    font-weight: bold;
}
.red {
    color: #d32f2f;
}

/* 按钮 */
.btn-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}
.btn {
    padding: 10px 14px;
    color: #fff;
    font-size: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
.blue {
    background: #3b82f6;
}
.green {
    background: #22c55e;
}
.purple {
    background: #a855f7;
}
.orange {
    background: #f97316;
}
.pink {
    background: #ec4899;
}
.indigo {
    background: #6366f1;
}
.teal {
    background: #14b8a6;
}
.gray {
    background: #6b7280;
}

/* 日志 */
.log-empty {
    padding: 40px;
    text-align: center;
    color: #999;
}

.log-item {
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
}
.log-item.success {
    background: #ecfdf5;
    border-color: #a7f3d0;
}
.log-item.error {
    background: #fef2f2;
    border-color: #fecaca;
}
.log-item.warning {
    background: #fffbeb;
    border-color: #fde68a;
}
.log-item.info {
    background: #eff6ff;
    border-color: #bfdbfe;
}

.log-header {
    margin-bottom: 6px;
    color: #666;
}

.log-msg {
    color: #333;
    word-break: break-all;
}

.small-text {
    font-size: 12px;
    color: #888;
}

/* 间距 */
.mb10 {
    margin-bottom: 10px;
}
.mb20 {
    margin-bottom: 20px;
}
.mb50 {
    margin-bottom: 50px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.desc {
    margin-bottom: 8px;
    color: #555;
}
.code {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 6px;
}
</style>
