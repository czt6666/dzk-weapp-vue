<template>
    <article class="product-card" @click="openDetail">
        <div class="thumb">
            <img :src="imgUrl(firstImage)" alt="预览" />
            <span v-if="item.status !== 1" class="status" :class="item.status">已下架</span>

            <!-- 收藏按钮 -->
            <div class="favorite-overlay" @click.stop="toggleFavorite">
                <div class="favorite-btn" :class="{ active: isFavorite }">
                    <img v-if="isFavorite" :src="heartFilledIcon" alt="已收藏" class="heart-icon" />
                    <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                </div>
            </div>
        </div>

        <div class="meta">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.description }}</p>

            <div class="foot">
                <button class="btn detail" @click.stop="openDetail">查看详情</button>
                <div class="favorite-count" @click.stop="toggleFavorite">
                    <img :src="heartOutlineIcon" alt="收藏" />
                    <span>{{ localFavoriteCount }}</span>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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

// 使用接口返回的isCollect初始化收藏状态
const isFavorite = ref(props.item.isCollect || false);

// 监听item变化，更新收藏状态
watch(
    () => props.item.isCollect,
    (newVal) => {
        isFavorite.value = newVal || false;
    },
    { immediate: true },
);

// 本地收藏数（用于显示动态变化）
const localFavoriteCount = computed(() => {
    const baseCount = props.item.collectNumber || 0;
    return isFavorite.value ? baseCount + 1 : baseCount;
});

const firstImage = computed(() => {
    const imgs = props.item.previewImages ?? [];
    if (imgs.length > 0) return imgs[0];
    if ((props.item as any).cover) return (props.item as any).cover;
    return placeholder;
});

function openDetail() {
    emit("open", props.item);
}

function toggleFavorite() {
    isFavorite.value = !isFavorite.value;
    emit("favorite", isFavorite.value);
}
</script>

<style scoped lang="scss">
.product-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
}

.thumb {
    position: relative;
    height: 170px;
    background: #f8f5ee;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    // 收藏按钮
    .favorite-overlay {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
    }

    .favorite-btn {
        width: 34px;
        height: 34px;
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
            width: 18px;
            height: 18px;
            transition: all 0.3s ease;
            filter: invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg);
        }

        &:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 1);

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

.meta {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #2f2a1f;
        margin-bottom: 6px;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4;
    }

    .desc {
        font-size: 13px;
        color: #6f5e44;
        line-height: 1.4;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8px;
    }

    .foot {
        margin-top: auto;
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .btn {
        flex: 1;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: 0.2s ease;

        &.detail {
            background: #ece8de;
            color: #333;
            &:hover {
                background: #ddd5c5;
            }
        }
    }

    .favorite-count {
        width: 16%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 8px;
        background: #fff5f5;
        border-radius: 8px;
        border: 1px solid #ffe0e0;

        img {
            width: 16px;
            height: 16px;
            filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                contrast(101%);
        }

        span {
            font-size: 13px;
            font-weight: 600;
            color: #ff6b6b;
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
