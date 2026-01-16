<template>
    <div
        class="carousel-wrapper"
        ref="wrapper"
        :style="{ height: height ? `${height}px` : '100%' }"
    >
        <div class="carousel-content" ref="content">
            <div
                class="carousel-slide"
                v-for="(img, idx) in images"
                :key="idx"
                :style="{ width: slideWidth + 'px' }"
            >
                <div class="carousel-image-container">
                    <el-image
                        :src="img"
                        class="carousel-image"
                        :alt="`Slide ${idx + 1}`"
                        fit="cover"
                    />
                </div>
            </div>
        </div>

        <!-- 左右控制按钮 -->
        <div v-if="showButtons && images.length > 1" class="carousel-controls">
            <button class="carousel-btn prev" @click.stop="goToPrev" :disabled="!bs">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
            <button class="carousel-btn next" @click.stop="goToNext" :disabled="!bs">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>

        <!-- 底部 dot 指示器 -->
        <div v-if="showDots && images.length > 1" class="carousel-dots">
            <span
                v-for="(_, idx) in images"
                :key="idx"
                class="dot"
                :class="{ active: currentIndex === idx }"
                @click.stop="goToSlide(idx, $event)"
            ></span>
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
        height?: number; // 轮播图高度（px）
        showButtons?: boolean; // 是否显示左右控制按钮，默认false
        showDots?: boolean; // 是否显示底部dot指示器，默认true
    }>(),
    {
        height: undefined,
        showButtons: false,
        showDots: true,
    },
);

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

let bs: BScroll | null = null;
const currentIndex = ref(0);

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
        eventPassthrough: "vertical",
        probeType: 2, // 滚动事件触发时机，用于监听 slideWillChange
        click: true, // 启用点击事件
        stopPropagation: true, // 阻止事件冒泡
    });

    // 监听滚动事件，更新当前索引
    if (bs) {
        // 监听 slideWillChange 事件，在用户拖动时实时更新索引
        bs.on("slideWillChange", (page: { pageX: number; pageY: number }) => {
            currentIndex.value = page.pageX;
        });

        // 监听 slidePageChanged 事件，当切换完成后更新索引
        bs.on("slidePageChanged", (page: { pageX: number; pageY: number }) => {
            currentIndex.value = page.pageX;
        });

        // 初始化当前索引
        const page = bs.getCurrentPage();
        currentIndex.value = page.pageX;
    }
};

// 切换到上一张
const goToPrev = (e?: Event) => {
    e?.stopPropagation();
    if (bs) {
        bs.prev();
    }
};

// 切换到下一张
const goToNext = (e?: Event) => {
    e?.stopPropagation();
    if (bs) {
        bs.next();
    }
};

// 切换到指定索引
const goToSlide = (index: number, e?: Event) => {
    e?.stopPropagation();

    if (bs && index >= 0 && index < props.images.length) {
        // goToPage(pageX, pageY, time, easing)
        // 横向滚动，所以 pageX 是索引，pageY 是 0
        bs.goToPage(index, 0);
        // 不需要手动设置 currentIndex，事件会自动更新
    }
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

        :deep(.carousel-image) {
            width: 100%;
            height: 100%;
            display: block;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
        }
    }

    // 左右控制按钮
    .carousel-controls {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 12px;
        pointer-events: none;
        z-index: 10;

        .carousel-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;

            svg {
                width: 24px;
                height: 24px;
                pointer-events: none; // 确保 SVG 不阻止按钮的点击事件
            }

            &:active:not(:disabled) {
                transform: scale(0.95);
            }

            &:active:not(:disabled) {
                transform: scale(0.95);
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }

    // 底部 dot 指示器
    .carousel-dots {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;

            &.active {
                background: white;
                width: 24px;
                border-radius: 4px;
            }

            &:active {
                background: rgba(255, 255, 255, 0.8);
            }
        }
    }
}
</style>
