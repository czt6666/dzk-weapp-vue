<template>
    <div class="app">
        <TopBar />
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import TopBar from "@/components/TopBar.vue";
</script>

<style lang="scss" scoped>
.app {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}
</style>
