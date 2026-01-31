<template>
    <div class="login-container">
        <!-- 未登录：显示登录页面 -->
        <div v-if="!userStore.userInfo?.userId" class="login-container">
            <LoginPage />
        </div>

        <!-- 已登录：显示个人信息 -->
        <div v-else class="my-page">
            <div class="profile-header">
                <div class="avatar-section">
                    <div class="avatar-wrapper">
                        <el-image
                            v-if="userStore.userInfo?.avatar"
                            :src="imgUrl(userStore.userInfo.avatar)"
                            class="avatar"
                            fit="cover"
                        />
                        <div v-else class="avatar-placeholder">
                            <img src="@/assets/defaultAvatar.jpg" alt="" />
                        </div>
                    </div>
                    <div class="user-info">
                        <h2 class="user-name">
                            {{
                                userStore.userInfo?.phone || userStore.userInfo?.username || "用户"
                            }}
                        </h2>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="menu-list">
                    <div class="menu-item" @click="goToCart">
                        <span class="menu-text">购物车</span>
                        <span class="menu-arrow">→</span>
                    </div>
                </div>

                <div class="logout-section">
                    <el-button class="logout-btn" @click="handleLogout">退出登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="MyPage">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { imgUrl } from "@/utils";
import LoginPage from "@/views/LoginPage.vue";

const router = useRouter();
const userStore = useUserStore();

function goToCart() {
    router.push({ name: "ShopCart" });
}

async function handleLogout() {
    userStore.logout();
    ElMessage.success("已退出登录");
    router.push({ name: "HomePage" });
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.login-container {
    width: 100%;
    height: 100%;
}

.my-page {
    height: 100%;
    background: $bg-gradient-main;
    overflow-y: auto;
}

.profile-header {
    background: linear-gradient(135deg, $color-red-primary 0%, rgba($color-red-primary, 0.8) 100%);
    padding: 24px 16px 20px;
    color: white;

    .avatar-section {
        display: flex;
        align-items: center;
        gap: 12px;

        .avatar-wrapper {
            flex-shrink: 0;

            .avatar,
            .avatar-placeholder {
                width: 60px;
                height: 60px;
                border-radius: $radius-round;
                border: 2px solid rgba(255, 255, 255, 0.3);
                overflow: hidden;
                background: rgba(255, 255, 255, 0.2);

                > img {
                    width: 100%;
                    height: 100%;
                }
            }

            .avatar-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;

                .avatar-icon {
                    font-size: 28px;
                }
            }
        }

        .user-info {
            flex: 1;

            .user-name {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                text-shadow: $shadow-text;
            }
        }
    }
}

.content-section {
    padding: 12px 16px;

    .menu-list {
        background: white;
        border-radius: $radius-medium;
        overflow: hidden;
        margin-bottom: 12px;
        box-shadow: $shadow-sm;

        .menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s ease;

            &:active {
                background: #f5f5f5;
            }

            .menu-text {
                flex: 1;
                font-size: 15px;
                color: $text-primary;
                font-weight: 500;
            }

            .menu-arrow {
                font-size: 14px;
                color: #999;
            }
        }
    }

    .logout-section {
        .logout-btn {
            width: 100%;
            height: 44px;
            background: white;
            color: $color-red-primary;
            border: 1px solid $color-red-primary;
            border-radius: $radius-medium;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s ease;

            &:active {
                background: $color-red-primary;
                color: white;
            }
        }
    }
}
</style>
