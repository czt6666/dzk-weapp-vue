<template>
    <div class="scroll-container">
        <div ref="wrapper" class="scroll-wrapper">
            <div class="scroll-content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import BScroll from "better-scroll";

const wrapper = ref<HTMLElement | null>(null);
let bs: BScroll | null = null;

onMounted(async () => {
    await nextTick();
    if (!wrapper.value) return;
    bs = new BScroll(wrapper.value, {
        scrollY: true,
        scrollbar: true,
        bounceTime: 600,
        probeType: 3,
        mouseWheel: true,
        click: true,
    });
});

onBeforeUnmount(() => bs?.destroy());
</script>

<style scoped>
.scroll-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.scroll-wrapper {
    width: 100%;
    height: 100%;
}
</style>
