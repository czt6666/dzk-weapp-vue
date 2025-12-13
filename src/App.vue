<template>
    <div class="app">
        <TopBar class="top-bar" />
        <div class="router-view">
            <RouterView />
        </div>
    </div>
</template>

<script lang="ts" setup>
import TopBar from "@/components/TopBar.vue";
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
    }
}
</style>
