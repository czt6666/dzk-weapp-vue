<template>
    <div class="login-page">
        <!-- 背景装饰元素 -->
        <div class="bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>

        <div class="login-card">
            <div class="card-header">
                <div class="logo-wrapper">
                    <div class="logo-icon">🔐</div>
                </div>
                <h1 class="title">账号登录</h1>
                <p class="subtitle">使用手机号 + 验证码登录系统</p>
            </div>

            <div class="form-container">
                <div class="form-item">
                    <label class="label">
                        <span class="label-icon">📱</span>
                        手机号
                    </label>
                    <el-input
                        v-model="phone"
                        maxlength="11"
                        placeholder="请输入手机号"
                        clearable
                        size="large"
                        class="custom-input"
                    />
                </div>

                <div class="form-item code-row">
                    <div class="code-input">
                        <label class="label">
                            <span class="label-icon">🔑</span>
                            验证码
                        </label>
                        <el-input 
                            v-model="code" 
                            maxlength="6" 
                            placeholder="请输入短信验证码"
                            size="large"
                            class="custom-input"
                        />
                    </div>
                    <el-button
                        class="code-btn"
                        type="primary"
                        plain
                        size="large"
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
                    size="large"
                    :loading="loggingIn"
                    @click="handleLogin"
                >
                    <span v-if="!loggingIn">登录</span>
                    <span v-else>登录中...</span>
                </el-button>
            </div>
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
@use "@/styles/variables.scss" as *;

.login-page {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: $spacing-md;
    background: $bg-gradient-main;
    overflow: hidden;

    // 背景装饰圆圈
    .bg-decoration {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;

        .circle {
            position: absolute;
            border-radius: $radius-round;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            animation: float 20s ease-in-out infinite;

            &.circle-1 {
                width: 300px;
                height: 300px;
                top: -100px;
                left: -100px;
                background: rgba($color-red-primary, 0.1);
                animation-delay: 0s;
            }

            &.circle-2 {
                width: 200px;
                height: 200px;
                bottom: -50px;
                right: -50px;
                background: rgba($color-green-primary, 0.1);
                animation-delay: 5s;
            }

            &.circle-3 {
                width: 150px;
                height: 150px;
                top: 50%;
                right: 10%;
                background: rgba($color-red-primary, 0.08);
                animation-delay: 10s;
            }
        }
    }

    // 浮动动画
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -30px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
    }
}

.login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: $spacing-xxxl $spacing-xl;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: $radius-large;
    box-shadow: $shadow-xl;
    border: 1px solid rgba(255, 255, 255, 0.5);
    animation: cardFadeIn 0.6s ease-out;

    @keyframes cardFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .card-header {
        text-align: center;
        margin-bottom: 36px;

        .logo-wrapper {
            margin-bottom: $spacing-xl;

            .logo-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 64px;
                font-size: 32px;
                background: $overlay-green-gradient;
                border-radius: $radius-medium;
                box-shadow: $shadow-lg;
                animation: logoPulse 2s ease-in-out infinite;
            }

            @keyframes logoPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: $shadow-lg;
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: $shadow-xl;
                }
            }
        }

        .title {
            font-size: 28px;
            font-weight: 700;
            color: $color-green-primary;
            margin-bottom: $spacing-sm;
            letter-spacing: -0.5px;
        }

        .subtitle {
            font-size: 14px;
            color: $text-secondary;
            margin: 0;
        }
    }

    .form-container {
        .form-item {
            margin-bottom: $spacing-xxl;

            .label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: 500;
                color: $text-primary;
                margin-bottom: $spacing-md;

                .label-icon {
                    font-size: 16px;
                }
            }

            :deep(.custom-input) {
                .el-input__wrapper {
                    border-radius: $radius-medium;
                    box-shadow: $shadow-sm;
                    transition: $transition-base;

                    &:hover {
                        box-shadow: $shadow-md;
                    }

                    &.is-focus {
                        box-shadow: 0 4px 16px rgba($color-green-primary, 0.25);
                        border-color: $color-green-primary;
                    }
                }
            }
        }

        .code-row {
            display: flex;
            align-items: flex-end;
            gap: $spacing-md;

            .code-input {
                flex: 1;
            }

            .code-btn {
                white-space: nowrap;
                border-radius: $radius-medium;
                font-weight: 500;
                border-color: $color-green-primary;
                color: $color-green-primary;
                transition: $transition-base;

                &:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: $shadow-md;
                    background: $overlay-green-light;
                }
            }
        }

        .login-btn {
            width: 100%;
            margin-top: $spacing-sm;
            height: 48px;
            border-radius: $radius-medium;
            font-size: 16px;
            font-weight: 600;
            background: $color-green-primary;
            border: none;
            box-shadow: $shadow-md;
            transition: $transition-base;

            &:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: $shadow-lg;
                background: darken($color-green-primary, 5%);
            }

            &:active:not(:disabled) {
                transform: translateY(0);
            }

            &:disabled {
                opacity: 0.7;
            }
        }
    }
}

// 响应式设计
@media (max-width: 480px) {
    .login-page {
        padding: $spacing-md;

        .login-card {
            padding: $spacing-xxl $spacing-lg;
            border-radius: $radius-large;

            .card-header {
                margin-bottom: $spacing-xxl;

                .logo-wrapper .logo-icon {
                    width: 56px;
                    height: 56px;
                    font-size: 28px;
                }

                .title {
                    font-size: 24px;
                }

                .subtitle {
                    font-size: 13px;
                }
            }

            .form-container {
                .form-item {
                    margin-bottom: $spacing-xl;
                }
            }
        }
    }
}
</style>
