<template>
    <article class="product-card" @click="openDetail" :data-waterfall-id="item.id">
        <div class="thumb">
            <el-image :src="imgUrl(firstImage)" alt="预览" fit="cover" />
            <span v-if="item.status !== 1" class="status" :class="item.status">已下架</span>

            <!-- 收藏按钮 -->
            <div class="favorite-overlay" @click.stop="toggleFavorite">
                <div class="favorite-btn" :class="{ active: isFavorite }">
                    <img v-if="isFavorite" :src="heartFilledIcon" alt="已收藏" class="heart-icon" />
                    <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                </div>
            </div>
        </div>

        <div class="info">
            <h3 class="title">{{ item.title }}</h3>
            <span class="description">{{ item.description }}</span>
            <div class="stats">
                <span class="price" v-if="minPrice"> ¥{{ minPrice }} </span>
                <span class="favorites" @click.stop="toggleFavorite">
                    <img :src="isFavorite ? heartFilledIcon : heartOutlineIcon" alt="收藏数" />
                    {{ localFavoriteCount }}
                </span>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IProduct } from "@/views/shop/types";
import { imgUrl } from "@/utils";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";

const props = defineProps<{ item: IProduct }>();
const emit = defineEmits<{
    open: [item: IProduct];
    favorite: [isFavorite: boolean];
}>();

const placeholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f4efe3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b5a688">无图</text></svg>';

// 直接使用父组件传递的收藏状态
const isFavorite = computed(() => props.item.isCollect || false);

// 收藏数
const localFavoriteCount = computed(() => {
    return props.item.collectNumber || 0;
});

const firstImage = computed(() => {
    const imgs = props.item.previewImages ?? [];
    if (imgs.length > 0) return imgs[0];
    if ((props.item as any).cover) return (props.item as any).cover;
    return placeholder;
});

// 计算最便宜的价格
const minPrice = computed(() => {
    const specs = props.item.specifications || [];
    if (specs.length === 0) return null;
    const prices = specs.map((s: any) => s.price || 0).filter((p: number) => p > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices).toFixed(2);
});

function openDetail() {
    emit("open", props.item);
}

function toggleFavorite() {
    emit("favorite", !isFavorite.value);
}
</script>

<style scoped lang="scss">
.product-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
        opacity: 0.8;
    }
}

.thumb {
    position: relative;
    width: 100%;
    overflow: hidden;

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

    .status {
        position: absolute;
        left: 10px;
        bottom: 10px;
        padding: 6px 8px;
        border-radius: 6px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        z-index: 5;
    }

    .favorite-overlay {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
    }

    .favorite-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .heart-icon {
            width: 20px;
            height: 20px;
            transition: all 0.3s ease;
            filter: invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg);
        }

        &:active {
            transform: scale(0.95);

            .heart-icon {
                filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                    contrast(101%);
            }
        }

        &.active {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);

            .heart-icon {
                filter: brightness(0) invert(1);
                animation: heartBeat 0.3s ease;
            }
        }
    }
}

.status.on {
    background: #7fb069;
}

.status.off {
    background: #a8a8a8;
}

.info {
    padding: 5px 10px 10px;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        line-height: 1.5;
        margin-bottom: 6px;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
    }

    .description {
        display: block;
        font-size: 13px;
        color: #7f8c8d;
        margin-bottom: 8px;
        line-height: 1.4;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
    }

    .stats {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding-top: 5px;
        border-top: 1px solid #f0f0f0;

        span {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: #7f8c8d;
            font-weight: 500;

            img {
                width: 16px;
                height: 16px;
            }
        }

        .price {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 15px;
            color: #ff6b6b;
            font-weight: 600;
            flex: 1;

            .price-icon {
                width: 16px;
                height: 16px;
                stroke-width: 2;
                color: #ff6b6b;
            }
        }

        .favorites {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 2px 4px;
            border-radius: 4px;

            &:active {
                transform: scale(0.95);
            }

            img {
                filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                    contrast(101%);
                transition: all 0.3s ease;
            }
        }
    }
}

@keyframes heartBeat {
    0%,
    100% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.3);
    }
    50% {
        transform: scale(1.1);
    }
}
</style>
