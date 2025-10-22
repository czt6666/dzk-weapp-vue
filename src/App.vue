<template>
    <div class="app">
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import Desktop from "@/components/Desktop.vue";
import InertiaScroll from "@/components/base/InertiaScroll.vue";
import ScrollTest from "@/components/ScrollTest.vue";
</script>

<style lang="scss" scoped>
.app {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}
</style>
