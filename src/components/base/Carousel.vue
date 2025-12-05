<template>
    <div class="carousel-wrapper" ref="wrapper" :style="{ height: `${height}px` }">
        <div class="carousel-content" ref="content">
            <div
                class="carousel-slide"
                v-for="(img, idx) in images"
                :key="idx"
                :style="{ width: slideWidth + 'px' }"
            >
                <div class="carousel-image-container">
                    <img :src="img" class="carousel-image" :alt="`Slide ${idx + 1}`" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed, onUnmounted } from "vue";
import BScroll from "better-scroll";

const props = withDefaults(
    defineProps<{
        images: string[];
        slideWidth?: number; // 每张 slide 的宽度（px），可选
        height?: number; // 轮播图高度（px），默认200px
        imageFit?: "cover" | "contain" | "fill"; // 图片填充方式，默认cover
    }>(),
    {
        height: 200,
        imageFit: "cover",
    },
);

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

let bs: BScroll | null = null;

// 计算每张幻灯片宽度
const slideWidth = computed(() => {
    if (props.slideWidth) return props.slideWidth;
    return wrapper.value?.clientWidth ?? 0;
});

// 初始化 better-scroll
const initScroll = async () => {
    await nextTick(); // 确保 DOM 完全渲染
    if (!wrapper.value || !props.images.length) return;

    // 销毁旧实例
    if (bs) {
        bs.destroy();
        bs = null;
    }

    // 创建新实例
    bs = new BScroll(wrapper.value, {
        scrollX: true,
        scrollY: false,
        slide: {
            loop: true, // 循环滚动
            threshold: 100, // 滑动阈值
            speed: 400, // 滑动速度
        },
        momentum: false, // 避免惯性滚动导致跳页
        bounce: false,
        useTransition: true,
        probeType: 2, // 滚动事件触发时机
    });
};

onMounted(() => {
    initScroll();

    // 监听窗口 resize，重新计算宽度
    window.addEventListener("resize", initScroll);
});

// 组件卸载时清理
onUnmounted(() => {
    if (bs) {
        bs.destroy();
        bs = null;
    }
    window.removeEventListener("resize", initScroll);
});

// 监听图片列表变化，重新初始化
watch(
    () => props.images,
    () => {
        initScroll();
    },
    { deep: true },
);

// 监听高度变化，重新初始化
watch(
    () => props.height,
    () => {
        initScroll();
    },
);
</script>

<style lang="scss" scoped>
.carousel-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;

    .carousel-content {
        height: 100%;
        white-space: nowrap;
        display: inline-block;
    }

    .carousel-slide {
        display: inline-block;
        vertical-align: top;
        height: 100%;

        .carousel-image-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
        }

        .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: v-bind(imageFit); // 使用动态绑定的填充方式
            display: block;
            transition: transform 0.3s ease;
        }
    }
}
</style>
