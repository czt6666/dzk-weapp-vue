<template>
    <div class="app">
        <TopBar class="top-bar" />
        <div class="router-view">
            <RouterView v-slot="{ Component, route: currentRoute }">
                <Transition v-if="shouldTransition" name="fade-slide" mode="out-in">
                    <component :is="Component" :key="currentRoute.path" />
                </Transition>
                <component v-else :is="Component" :key="currentRoute.path" />
            </RouterView>
        </div>
        <TabBar />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TopBar from "@/components/TopBar.vue";
import TabBar from "@/components/TabBar.vue";

const router = useRouter();
const shouldTransition = ref(false);

// 使用路由守卫来检测是否是 tab 之间的切换
router.beforeEach((to, from) => {
    const toIsTab = to.meta.isTab === true;
    const fromIsTab = from.meta.isTab === true;

    // 只有当两个路由都是 tab 路由时才应用过渡
    shouldTransition.value = toIsTab && fromIsTab;

    return true;
});
</script>

<style lang="scss" scoped>
.app {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;

    .router-view {
        height: 0;
        flex: 1 1 0;
        padding-bottom: 60px; // 为底部 TabBar 留出空间
        overflow-y: auto;
        position: relative;
    }
}

// 路由切换过渡动画
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>
