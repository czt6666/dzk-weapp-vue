<template>
    <div class="news-carousel-wrapper" ref="wrapper">
        <div class="news-carousel-content" ref="content">
            <div class="news-carousel-slide" v-for="(item, idx) in items" :key="item.id || idx">
                <div class="news-item" @click="handleItemClick(item)">
                    <div class="news-image">
                        <el-image :src="imgUrl(item.imageUrl)" :alt="item.title" fit="cover" />
                        <div class="news-overlay red-overlay"></div>
                    </div>
                    <div class="news-content">
                        <h3 class="news-title">{{ item.title }}</h3>
                        <span class="news-date">{{ formatDate(item.createTime) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部 dot 指示器 -->
        <div v-if="showDots && items.length > 1" class="news-carousel-dots">
            <span
                v-for="(_, idx) in items"
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
import { imgUrl } from "@/utils";

interface NewsItem {
    id: number;
    title: string;
    imageUrl: string;
    createTime: string;
    [key: string]: any;
}

const props = withDefaults(
    defineProps<{
        items: NewsItem[];
        showDots?: boolean; // 是否显示底部dot指示器，默认true
        autoPlay?: boolean; // 是否自动播放，默认true
        autoPlayInterval?: number; // 自动播放间隔（ms），默认3000
    }>(),
    {
        showDots: true,
        autoPlay: true,
        autoPlayInterval: 3000,
    },
);

const emit = defineEmits<{
    (e: "item-click", item: NewsItem): void;
}>();

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

let bs: BScroll | null = null;
const currentIndex = ref(0);
let autoPlayTimer: number | null = null;
let isUserInteracting = false;

// 格式化日期
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
};

// 初始化 better-scroll
const initScroll = async () => {
    await nextTick(); // 确保 DOM 完全渲染
    if (!wrapper.value || !props.items.length) return;

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
            isUserInteracting = true;
            // 用户交互时暂停自动播放
            stopAutoPlay();
            // 2秒后恢复自动播放
            setTimeout(() => {
                isUserInteracting = false;
                if (props.autoPlay) {
                    startAutoPlay();
                }
            }, 2000);
        });

        // 监听 slidePageChanged 事件，当切换完成后更新索引
        bs.on("slidePageChanged", (page: { pageX: number; pageY: number }) => {
            currentIndex.value = page.pageX;
        });

        // 初始化当前索引
        const page = bs.getCurrentPage();
        currentIndex.value = page.pageX;
    }

    // 启动自动播放
    if (props.autoPlay && props.items.length > 1) {
        startAutoPlay();
    }
};

// 启动自动播放
const startAutoPlay = () => {
    if (!bs || props.items.length <= 1 || isUserInteracting) return;

    stopAutoPlay();

    autoPlayTimer = window.setInterval(() => {
        if (bs && !isUserInteracting) {
            bs.next();
        }
    }, props.autoPlayInterval);
};

// 停止自动播放
const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
};

// 切换到上一张
const goToPrev = () => {
    if (bs) {
        bs.prev();
    }
};

// 切换到下一张
const goToNext = () => {
    if (bs) {
        bs.next();
    }
};

// 切换到指定索引
const goToSlide = (index: number, e?: Event) => {
    e?.stopPropagation();

    if (bs && index >= 0 && index < props.items.length) {
        bs.goToPage(index, 0);
    }
};

// 处理项目点击
const handleItemClick = (item: NewsItem) => {
    emit("item-click", item);
};

onMounted(() => {
    initScroll();

    // 监听窗口 resize，重新计算宽度
    window.addEventListener("resize", initScroll);
});

// 组件卸载时清理
onUnmounted(() => {
    stopAutoPlay();
    if (bs) {
        bs.destroy();
        bs = null;
    }
    window.removeEventListener("resize", initScroll);
});

// 监听数据变化，重新初始化
watch(
    () => props.items,
    () => {
        initScroll();
    },
    { deep: true },
);

// 监听自动播放设置变化
watch(
    () => props.autoPlay,
    (newVal) => {
        if (newVal) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    },
);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.news-carousel-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;
    height: 120px;

    .news-carousel-content {
        height: 100%;
        white-space: nowrap;
        display: inline-block;
    }

    .news-carousel-slide {
        display: inline-block;
        vertical-align: top;
        height: 100%;

        .news-item {
            width: 100%;
            height: 120px;
            position: relative;
            border-radius: $radius-medium;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            &:active {
                transform: scale(0.98);
            }

            .news-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                :deep(.el-image) {
                    width: 100%;
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }
                }

                .news-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .red-overlay {
                    background: $overlay-red-gradient;
                }
            }

            .news-content {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px;
                color: white;
                z-index: 2;

                .news-title {
                    font-size: 13px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .news-date {
                    font-size: 11px;
                    opacity: 0.9;
                }
            }
        }
    }

    // 底部 dot 指示器
    .news-carousel-dots {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.3);
        padding: 4px 8px;
        border-radius: 12px;

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;

            &.active {
                background: white;
                width: 16px;
                border-radius: 3px;
            }

            &:active {
                background: rgba(255, 255, 255, 0.8);
            }
        }
    }
}
</style>
