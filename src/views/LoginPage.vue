<template>
    <div class="login-page">
        <div class="login-card">
            <h1 class="title">账号登录</h1>
            <p class="subtitle">使用手机号 + 验证码登录系统</p>

            <div class="form-item">
                <label class="label">手机号</label>
                <el-input
                    v-model="phone"
                    maxlength="11"
                    placeholder="请输入手机号"
                    clearable
                />
            </div>

            <div class="form-item code-row">
                <div class="code-input">
                    <label class="label">验证码</label>
                    <el-input v-model="code" maxlength="6" placeholder="请输入短信验证码" />
                </div>
                <el-button
                    class="code-btn"
                    type="primary"
                    plain
                    :disabled="sendingCode || countdown > 0"
                    @click="handleSendCode"
                >
                    <span v-if="countdown === 0">获取验证码</span>
                    <span v-else>{{ countdown }}s后重试</span>
                </el-button>
            </div>

            <el-button
                class="login-btn"
                type="primary"
                :loading="loggingIn"
                @click="handleLogin"
            >
                登录
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { sendSmsCode } from "@/apis/user";

const router = useRouter();
const userStore = useUserStore();

const phone = ref("");
const code = ref("");
const sendingCode = ref(false);
const countdown = ref(0);
const loggingIn = ref(false);
let timer: number | null = null;

function validatePhone(): boolean {
    const reg = /^1\d{10}$/;
    if (!reg.test(phone.value)) {
        ElMessage.warning("请输入正确的手机号");
        return false;
    }
    return true;
}

async function handleSendCode() {
    if (!validatePhone()) return;
    if (countdown.value > 0 || sendingCode.value) return;
    try {
        sendingCode.value = true;
        await sendSmsCode({ phone: phone.value });
        ElMessage.success("验证码已发送");
        countdown.value = 60;
        timer && window.clearInterval(timer);
        timer = window.setInterval(() => {
            if (countdown.value <= 1) {
                countdown.value = 0;
                timer && window.clearInterval(timer);
                timer = null;
            } else {
                countdown.value -= 1;
            }
        }, 1000);
    } catch (err: any) {
        ElMessage.error(err.msg || "发送验证码失败");
    } finally {
        sendingCode.value = false;
    }
}

async function handleLogin() {
    if (!validatePhone()) return;
    if (!code.value.trim()) {
        ElMessage.warning("请输入验证码");
        return;
    }
    try {
        loggingIn.value = true;
        await userStore.login(phone.value, code.value);
        ElMessage.success("登录成功");
        router.push({ name: "HomePage" });
    } catch (err: any) {
        ElMessage.error(err.msg || err.message || "登录失败");
    } finally {
        loggingIn.value = false;
    }
}
</script>

<style scoped lang="scss">
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #eef2ff 0%, #e0f2fe 40%, #e5f9f0 100%);
}

.login-card {
    width: 360px;
    padding: 32px 28px 28px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow:
        0 10px 30px rgba(15, 23, 42, 0.12),
        0 1px 3px rgba(15, 23, 42, 0.08);

    .title {
        font-size: 22px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
        text-align: center;
    }

    .subtitle {
        font-size: 13px;
        color: #6b7280;
        text-align: center;
        margin-bottom: 24px;
    }

    .form-item {
        margin-bottom: 16px;

        .label {
            display: block;
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 6px;
        }
    }

    .code-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;

        .code-input {
            flex: 1;
        }

        .code-btn {
            white-space: nowrap;
        }
    }

    .login-btn {
        width: 100%;
        margin-top: 8px;
    }
}
</style>
