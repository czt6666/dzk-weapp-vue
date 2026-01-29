<template>
    <div class="login-page">
        <!-- 背景装饰元素 -->
        <div class="bg-decoration">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
        </div>

        <div class="card-container">
            <div class="flip-card" :class="{ flipped: isRegister }">
                <div class="flip-card-inner">
                    <!-- 登录卡片 - 正面 -->
                    <div class="flip-card-front login-card">
                        <div class="card-header">
                            <div class="logo-wrapper">
                                <div class="logo-icon">🔐</div>
                            </div>
                            <h1 class="title">账号登录</h1>
                            <p class="subtitle">使用手机号 + 密码登录系统</p>
                        </div>

                        <div class="form-container">
                            <div class="form-item">
                                <label class="label">
                                    <span class="label-icon">📱</span>
                                    手机号
                                </label>
                                <el-input
                                    v-model="loginPhone"
                                    maxlength="11"
                                    placeholder="请输入手机号"
                                    clearable
                                    size="large"
                                    class="custom-input"
                                />
                            </div>

                            <div class="form-item">
                                <label class="label">
                                    <span class="label-icon">🔑</span>
                                    密码
                                </label>
                                <el-input
                                    v-model="loginPassword"
                                    type="password"
                                    placeholder="请输入密码"
                                    show-password
                                    size="large"
                                    class="custom-input"
                                    @keyup.enter="handleLogin"
                                />
                            </div>

                            <el-button
                                class="submit-btn"
                                type="primary"
                                size="large"
                                :loading="loggingIn"
                                @click="handleLogin"
                            >
                                <span v-if="!loggingIn">登录</span>
                                <span v-else>登录中...</span>
                            </el-button>

                            <div class="switch-tip">
                                <span>还没有账号？</span>
                                <el-link type="primary" @click="switchToRegister">立即注册</el-link>
                            </div>
                        </div>
                    </div>

                    <!-- 注册卡片 - 背面 -->
                    <div class="flip-card-back register-card">
                        <div class="card-header">
                            <div class="logo-wrapper">
                                <div class="logo-icon">✨</div>
                            </div>
                            <h1 class="title">账号注册</h1>
                            <p class="subtitle">使用手机号 + 密码注册账号</p>
                        </div>

                        <div class="form-container">
                            <div class="form-item">
                                <label class="label">
                                    <span class="label-icon">📱</span>
                                    手机号
                                </label>
                                <el-input
                                    v-model="registerPhone"
                                    maxlength="11"
                                    placeholder="请输入手机号"
                                    clearable
                                    size="large"
                                    class="custom-input"
                                />
                            </div>

                            <div class="form-item">
                                <label class="label">
                                    <span class="label-icon">🔑</span>
                                    密码
                                </label>
                                <el-input
                                    v-model="registerPassword"
                                    type="password"
                                    placeholder="请输入密码（至少6位）"
                                    show-password
                                    size="large"
                                    class="custom-input"
                                    @keyup.enter="handleRegister"
                                />
                            </div>

                            <div class="form-item">
                                <label class="label">
                                    <span class="label-icon">🔒</span>
                                    确认密码
                                </label>
                                <el-input
                                    v-model="confirmPassword"
                                    type="password"
                                    placeholder="请再次输入密码"
                                    show-password
                                    size="large"
                                    class="custom-input"
                                    @keyup.enter="handleRegister"
                                />
                            </div>

                            <el-button
                                class="submit-btn"
                                type="primary"
                                size="large"
                                :loading="registering"
                                @click="handleRegister"
                            >
                                <span v-if="!registering">注册</span>
                                <span v-else>注册中...</span>
                            </el-button>

                            <div class="switch-tip">
                                <span>已有账号？</span>
                                <el-link type="primary" @click="switchToLogin">立即登录</el-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { register, loginByUsername } from "@/apis/user";

const router = useRouter();
const userStore = useUserStore();

// 登录表单
const loginPhone = ref("");
const loginPassword = ref("");
const loggingIn = ref(false);

// 注册表单
const registerPhone = ref("");
const registerPassword = ref("");
const confirmPassword = ref("");
const registering = ref(false);

// 切换状态
const isRegister = ref(false);

function validatePhone(phone: string): boolean {
    const reg = /^1\d{10}$/;
    if (!reg.test(phone)) {
        ElMessage.warning("请输入正确的手机号");
        return false;
    }
    return true;
}

function validatePassword(password: string, minLength: number = 6): boolean {
    if (!password || password.length < minLength) {
        ElMessage.warning(`密码至少需要${minLength}位`);
        return false;
    }
    return true;
}

function switchToRegister() {
    isRegister.value = true;
}

function switchToLogin() {
    isRegister.value = false;
}

async function handleLogin() {
    if (!validatePhone(loginPhone.value)) return;
    if (!validatePassword(loginPassword.value)) return;

    try {
        loggingIn.value = true;
        await userStore.loginByPassword(loginPhone.value, loginPassword.value);
        ElMessage.success("登录成功");
    } catch (err: any) {
        ElMessage.error(err.msg || err.message || "登录失败");
    } finally {
        loggingIn.value = false;
    }
}

async function handleRegister() {
    if (!validatePhone(registerPhone.value)) return;
    if (!validatePassword(registerPassword.value)) return;

    if (registerPassword.value !== confirmPassword.value) {
        ElMessage.warning("两次输入的密码不一致");
        return;
    }

    try {
        registering.value = true;
        await userStore.register(
            registerPhone.value,
            registerPassword.value,
            confirmPassword.value,
        );
        ElMessage.success("注册成功，请登录");
        // 注册成功后切换到登录页面，并填充手机号
        loginPhone.value = registerPhone.value;
        switchToLogin();
    } catch (err: any) {
        ElMessage.error(err.msg || err.message || "注册失败");
    } finally {
        registering.value = false;
    }
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "sass:color";

.login-page {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: $spacing-md;
    background: $bg-gradient-main;
    overflow: hidden;
    perspective: 1000px;

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
        0%,
        100% {
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

.card-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    height: 600px;
}

.flip-card {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;

    &.flipped {
        transform: rotateY(180deg);
    }
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    padding: $spacing-xxxl $spacing-xl;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-radius: $radius-large;
    box-shadow: $shadow-xl;
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.flip-card-front {
    animation: cardFadeIn 0.6s ease-out;
}

.flip-card-back {
    transform: rotateY(180deg);
}

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

.login-card,
.register-card {
    display: flex;
    flex-direction: column;

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
                0%,
                100% {
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
        flex: 1;
        display: flex;
        flex-direction: column;

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


                    &.is-focus {
                        box-shadow: 0 4px 16px rgba($color-green-primary, 0.25);
                        border-color: $color-green-primary;
                    }
                }
            }
        }

        .submit-btn {
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

            &:active:not(:disabled) {
                background: color.adjust($color-green-primary, $lightness: -5%);
            }

            &:active:not(:disabled) {
                transform: translateY(0);
            }

            &:disabled {
                opacity: 0.7;
            }
        }

        .switch-tip {
            margin-top: $spacing-lg;
            text-align: center;
            font-size: 14px;
            color: $text-secondary;

            a {
                vertical-align: top;
            }

            :deep(.el-link) {
                font-size: 14px;
                margin-left: 4px;
            }
        }
    }
}

// 响应式设计
@media (max-width: 480px) {
    .login-page {
        padding: $spacing-md;

        .card-container {
            height: auto;
            min-height: 500px;
        }

        .flip-card-front,
        .flip-card-back {
            padding: $spacing-xxl $spacing-lg;
            border-radius: $radius-large;
            position: absolute;
            top: 0;
            left: 0;
            height: auto;
            min-height: 500px;
        }

        .flip-card {
            height: auto;
        }

        .flip-card-inner {
            height: auto;
        }

        .login-card,
        .register-card {
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
