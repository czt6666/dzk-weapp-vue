<template>
    <nav class="tab-bar">
        <div
            v-for="item in tabItems"
            :key="item.name"
            class="tab-item"
            :class="{ active: isActive(item.routeName) }"
            @click="handleTabClick(item.routeName)"
        >
            <div class="tab-icon">
                <img :src="item.icon" :alt="item.name" class="icon" />
            </div>
            <span class="tab-label">{{ item.name }}</span>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import homeIcon from "@/assets/svg/home.png";
import shopIcon from "@/assets/svg/shop.png";
import newsIcon from "@/assets/svg/news.png";
import userIcon from "@/assets/svg/user.png";

const router = useRouter();
const route = useRoute();

interface TabItem {
    name: string;
    routeName: string;
    icon: string;
}

const tabItems: TabItem[] = [
    { name: "首页", routeName: "HomePage", icon: homeIcon },
    { name: "特产", routeName: "ShopList", icon: shopIcon },
    { name: "资讯", routeName: "NewsList", icon: newsIcon },
    { name: "我的", routeName: "MyPage", icon: userIcon },
];

function isActive(routeName: string): boolean {
    return route.name === routeName;
}

function handleTabClick(routeName: string) {
    if (route.name !== routeName) {
        router.push({ name: routeName });
    }
}
</script>

<style lang="scss" scoped>
.tab-bar {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 8px 0;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
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
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            width: 26px;
            height: 26px;
            display: block;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-origin: center;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
            opacity: 0.7;
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
            transform: scale(1.2) translateY(-2px);
            filter: drop-shadow(0 2px 4px rgba(198, 40, 40, 0.3));
            opacity: 1;
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
