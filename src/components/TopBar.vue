<template>
    <header class="mobile-header" v-if="showBack">
        <div class="back-btn" @click="goBack">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </div>
        <h1 class="title">{{ title }}</h1>
    </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const title = (route.meta.title as string) || "";

const showBack = ref(false);

watch(
    () => route.path,
    (newPath) => {
        showBack.value = newPath !== "/";
    },
    {
        immediate: true,
    },
);

const goBack = () => {
    router.back();
};
</script>

<style scoped lang="scss">
.mobile-header {
    // position: fixed;
    // top: 0;
    // left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 18px 4px;
    background: #fff;
}

.back-btn {
    background: transparent;
    cursor: pointer;
}

.title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-right: 36px; // 留出返回按钮空间
}
</style>
