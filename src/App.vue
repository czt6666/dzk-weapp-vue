<template>
    <div class="box">
        <!-- <InertiaScroll>
            <div>
                <div class="item" v-for="item in 100" :key="item">{{ item }}</div>
            </div>
        </InertiaScroll> -->
        <!-- <Desktop /> -->
        <!-- <ScrollTest /> -->
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import Desktop from "@/components/Desktop.vue";
import InertiaScroll from "@/components/InertiaScroll.vue";
import ScrollTest from "@/components/ScrollTest.vue";
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100vh;
}
</style>
