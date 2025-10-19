<template>
    <div class="scroll-container">
        <div
            class="scroll-inner"
            ref="scrollInner"
            :style="{
                transform: `translateY(${bounceY}px)`,
                // transition: `transform ${bounceTime}ms cubic-bezier(0.33, 1, 0.68, 1)`,
                transition: `transform ${bounceTime}ms cubic-bezier(0.25, 1, 0.5, 1)`,
            }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const scrollInner = ref<HTMLDivElement | null>(null);
const bounceY = ref(0);
const bounceTime = ref(0);

let isBouncing = false;
let lastScrollTop = 0;
let lastTime = 0;
let velocity = 0;
let rafId = 0;

// 模拟回弹：根据速度计算回弹幅度和时间
const bounceUp = (v: number) => {
    if (isBouncing) return;
    isBouncing = true;

    const k = 0.003; // 控制系数
    const h = Math.sqrt(Math.pow(v, 2) / (2 * k));
    bounceY.value = v > 0 ? -h : h;
    bounceTime.value = 450 + Math.sqrt(h);

    setTimeout(() => {
        bounceY.value = 0;
        isBouncing = false;
    }, bounceTime.value * 1.1);
};

// 用 requestAnimationFrame 测速，性能更高
const handleScroll = () => {
    const el = scrollInner.value;
    if (!el) return;

    const now = performance.now();
    const deltaT = now - lastTime;
    const deltaY = el.scrollTop - lastScrollTop;
    velocity = deltaY / deltaT; // px/ms

    lastScrollTop = el.scrollTop;
    lastTime = now;

    // 顶部
    if (el.scrollTop <= 0 && velocity < 0) {
        bounceUp(velocity);
    }

    // 底部
    if (el.scrollTop + el.clientHeight >= el.scrollHeight && velocity > 0) {
        bounceUp(velocity);
    }

    requestAnimationFrame(handleScroll);
};

onMounted(() => {
    lastScrollTop = scrollInner.value?.scrollTop || 0;
    lastTime = performance.now();
    rafId = requestAnimationFrame(handleScroll);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.scroll-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.scroll-inner {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    will-change: transform;
}
</style>
