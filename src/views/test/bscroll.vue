<template>
    <div class="scroll-wrapper" ref="scrollWrapper">
        <div class="scroll-content">
            <div v-for="item in items" :key="item.id" class="scroll-item">
                {{ item.text }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BScroll from "better-scroll";

const scrollWrapper = ref(null);
const items = ref(
    Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        text: `列表项 ${i + 1}`,
    })),
);

let scroll = null;

onMounted(() => {
    // 初始化Better-Scroll
    scroll = new BScroll(scrollWrapper.value, {
        scrollY: true,
        click: true,
        bounce: true, // 开启回弹效果
        bounceTime: 700, // 回弹动画时间:cite[5]
        probeType: 3, // 实时派发scroll事件
    });

    // 可选：监听滚动事件
    scroll.on("scroll", (position) => {
        console.log(position.x, position.y);
    });

    scroll.on("scrollEnd", () => {
        console.log("滚动结束");
    });
});

onUnmounted(() => {
    if (scroll) {
        scroll.destroy();
    }
});
</script>

<style scoped>
.scroll-wrapper {
    height: 400px;
    overflow: hidden;
    position: relative;
}

.scroll-content {
    min-height: 100%;
}

.scroll-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    background: white;
}
</style>
