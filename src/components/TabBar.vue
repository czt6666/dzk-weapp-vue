<template>
    <nav class="tab-bar">
        <div
            v-for="item in tabItems"
            :key="item.name"
            class="tab-item"
            :class="{ active: isActive(item.route) }"
            @click="handleTabClick(item.route)"
        >
            <div class="tab-icon">
                <span class="icon">{{ item.icon }}</span>
            </div>
            <span class="tab-label">{{ item.name }}</span>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

interface TabItem {
    name: string;
    route: string;
    icon: string;
}

const tabItems: TabItem[] = [
    { name: "首页", route: "/", icon: "🌟" },
    { name: "民宿", route: "/hotels", icon: "🏡" },
    { name: "商城", route: "/shop", icon: "🛍️" },
    { name: "美食", route: "/restaurant", icon: "🍜" },
    { name: "登录", route: "/login", icon: "👤" },
];

function isActive(routePath: string): boolean {
    if (routePath === "/") {
        return route.path === "/";
    }
    return route.path.startsWith(routePath);
}

function handleTabClick(routePath: string) {
    if (route.path !== routePath) {
        router.push(routePath);
    }
}
</script>

<style lang="scss" scoped>
.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px 0;
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    .tab-icon {
        margin-bottom: 4px;
        position: relative;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

        .icon {
            font-size: 24px;
            display: block;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-origin: center;
        }
    }

    .tab-label {
        font-size: 12px;
        color: #666;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(0);
    }

    &.active {
        .tab-icon .icon {
            transform: scale(1.15) translateY(-2px);
        }

        .tab-label {
            color: #c62828;
            font-weight: 600;
            transform: translateY(0);
        }
    }

    &:active {
        transform: scale(0.95);
        transition: transform 0.15s ease;
    }

    &:not(.active):hover {
        .tab-icon .icon {
            transform: scale(1.05);
        }
    }
}
</style>
