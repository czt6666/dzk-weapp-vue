<template>
    <div class="home">
        <!-- 顶部 -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <span class="logo-icon">🚩</span>
                    <div class="logo-text">
                        <h1>红色乡村</h1>
                        <p>传承·振兴</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主要导航 -->
        <main class="main-content">
            <div class="nav-grid">
                <div
                    v-for="item in navItems"
                    :key="item.route"
                    class="nav-card"
                    @click="router.push(item.route)"
                >
                    <span class="nav-icon">{{ item.icon }}</span>
                    <span class="nav-name">{{ item.name }}</span>
                </div>
            </div>

            <!-- 开发者工具 -->
            <div class="dev-tools">
                <input
                    v-model="inputRoute"
                    type="text"
                    placeholder="输入路由地址"
                    class="route-input"
                />
                <button @click="goInputRoute" class="route-btn">跳转</button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const inputRoute = ref("/test/");

const navItems = [
    { name: "红色资讯", route: "/news", icon: "📰" },
    { name: "特色民宿", route: "/hotels", icon: "🏠" },
    { name: "特产商城", route: "/shop", icon: "🛍️" },
    { name: "美食订单", route: "/restaurant", icon: "🍜" },
    { name: "红色旅游", route: "/tour", icon: "🗺️" },
    { name: "红色研学", route: "/study", icon: "📚" },
    { name: "康养生活", route: "/retirement", icon: "🌿" },
    { name: "登录注册", route: "/login", icon: "👤" },
];

function goInputRoute() {
    router.push(inputRoute.value);
}
</script>

<style lang="scss" scoped>
.home {
    overflow-y: scroll;
    height: 100vh;
    background: linear-gradient(135deg, #fef5f5 0%, #fff8f8 100%);
}

.header {
    background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
    padding: 24px 20px;
    box-shadow: 0 2px 8px rgba(198, 40, 40, 0.1);

    &-content {
        max-width: 1200px;
        margin: 0 auto;
    }
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;

    &-icon {
        font-size: 36px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    &-text {
        color: white;

        h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            letter-spacing: 2px;
        }

        p {
            font-size: 12px;
            margin: 4px 0 0 0;
            opacity: 0.9;
            letter-spacing: 4px;
        }
    }
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px;
}

.nav-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.nav-card {
    background: white;
    border-radius: 12px;
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(198, 40, 40, 0.15);
    }

    &:active {
        transform: translateY(-2px);
    }
}

.nav-icon {
    font-size: 48px;
    transition: transform 0.3s ease;

    .nav-card:hover & {
        transform: scale(1.1);
    }
}

.nav-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    letter-spacing: 1px;
}

.dev-tools {
    background: white;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.route-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 18px;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #d32f2f;
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
    }

    &::placeholder {
        color: #999;
    }
}

.route-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
}
</style>
