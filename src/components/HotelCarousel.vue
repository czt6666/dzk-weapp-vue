<template>
    <div class="hotel-carousel-wrapper" ref="wrapper" :style="{ height: `${height}px` }">
        <div class="hotel-carousel-content" ref="content">
            <div
                class="hotel-carousel-slide"
                v-for="(hotel, idx) in hotels"
                :key="hotel.id"
                :style="{ width: slideWidth + 'px' }"
            >
                <div class="hotel-card" @click="handleItemClick(hotel)">
                    <div class="hotel-image">
                        <el-image
                            :src="getImageUrl(hotel.imageUrl || hotel.coverImage)"
                            :alt="hotel.name"
                            fit="cover"
                        />
                        <div class="hotel-label">
                            <h3 class="hotel-name">{{ hotel.contactName }}</h3>
                            <p class="hotel-highlight">{{ hotel.homestayName }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 左右控制按钮 -->
        <div v-if="showButtons && hotels.length > 1" class="carousel-controls">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed, onUnmounted } from "vue";
import BScroll from "better-scroll";
import { imgUrl } from "@/utils";

const props = withDefaults(
    defineProps<{
        hotels: any[];
        height?: number;
        showButtons?: boolean;
        getImageUrl?: (url: string) => string;
    }>(),
    {
        height: 240,
        showButtons: true,
    },
);

const emit = defineEmits<{
    (e: "item-click", hotel: any): void;
}>();

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

let bs: BScroll | null = null;

// 计算每张幻灯片宽度
const slideWidth = computed(() => {
    return wrapper.value?.clientWidth ?? 0;
});

// 获取图片 URL
const getImageUrl = (url: string) => {
    if (props.getImageUrl) {
        return props.getImageUrl(url);
    }
    return imgUrl(url);
};

// 初始化 better-scroll
const initScroll = async () => {
    await nextTick();
    if (!wrapper.value || !props.hotels.length) return;

    if (bs) {
        bs.destroy();
        bs = null;
    }

    bs = new BScroll(wrapper.value, {
        scrollX: true,
        scrollY: false,
        slide: {
            loop: true,
            threshold: 100,
            speed: 400,
        },
        momentum: false,
        bounce: false,
        useTransition: true,
        probeType: 2,
        click: true,
        stopPropagation: true,
    });
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

// 处理项目点击
const handleItemClick = (hotel: any) => {
    emit("item-click", hotel);
};

onMounted(() => {
    initScroll();
    window.addEventListener("resize", initScroll);
});

onUnmounted(() => {
    if (bs) {
        bs.destroy();
        bs = null;
    }
    window.removeEventListener("resize", initScroll);
});

watch(
    () => props.hotels,
    () => {
        initScroll();
    },
    { deep: true },
);

watch(
    () => props.height,
    () => {
        initScroll();
    },
);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.hotel-carousel-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;
    border-radius: $radius-large;

    .hotel-carousel-content {
        height: 100%;
        white-space: nowrap;
        display: inline-block;
    }

    .hotel-carousel-slide {
        display: inline-block;
        vertical-align: top;
        height: 100%;

        .hotel-card {
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;

            .hotel-image {
                width: 100%;
                height: 100%;
                position: relative;

                :deep(.el-image) {
                    width: 100%;
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .hotel-label {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 10px $spacing-lg;
                    background: $overlay-green-gradient;
                    color: white;

                    .hotel-name {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 0 0 2px 0;
                    }

                    .hotel-highlight {
                        font-size: 13px;
                        margin: 0;
                        opacity: 0.9;
                    }
                }
            }
        }
    }

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
                pointer-events: none;
            }

            &:hover:not(:disabled) {
                background: white;
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
}
</style>
