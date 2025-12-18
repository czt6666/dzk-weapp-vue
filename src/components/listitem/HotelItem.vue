<template>
    <div class="item-card" @click="handleClick">
        <div class="image-wrapper">
            <el-image :src="imgUrl(info.coverImage)" alt="封面图" lazy />
            <div class="favorite-overlay" @click.stop="toggleFavorite">
                <div class="favorite-btn" :class="{ active: isFavorite }">
                    <img v-if="isFavorite" :src="heartFilledIcon" alt="已收藏" class="heart-icon" />
                    <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                </div>
            </div>
        </div>
        <div class="info">
            <h3 class="title">{{ info.homestayName }}</h3>
            <span class="description">{{ info.description }}</span>
            <span class="location">
                <img :src="addressIcon" alt="位置图标" />
                {{ info.address }}
            </span>
            <div class="stats">
                <span class="rating">
                    <img v-for="i in info.starLevel" :key="i" :src="ratingIcon" />
                </span>
                <span class="favorites">
                    <img :src="heartOutlineIcon" alt="收藏数" />
                    {{ localFavoriteCount }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { imgUrl } from "@/utils";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";
import addressIcon from "@/assets/svg/address.svg";
import ratingIcon from "@/assets/svg/rating.svg";

const props = defineProps<{ info: any }>();
const emit = defineEmits<{
    click: [];
    favorite: [isFavorite: boolean];
}>();

// 使用接口返回的isCollect初始化收藏状态
const isFavorite = ref(props.info.isCollect || false);

// 监听info变化，更新收藏状态
watch(
    () => props.info.isCollect,
    (newVal) => {
        isFavorite.value = newVal || false;
    },
    { immediate: true }
);

// 本地收藏数（用于显示动态变化）
const localFavoriteCount = computed(() => {
    const baseCount = props.info.collectNumber || 0;
    return isFavorite.value ? baseCount + 1 : baseCount;
});

const handleClick = () => {
    emit("click");
};

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value;
    emit("favorite", isFavorite.value);
};
</script>

<style scoped lang="scss">
.item-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 11;
        overflow: hidden;
        background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

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

        &:hover :deep(.el-image img) {
            transform: scale(1.05);
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

            &:hover {
                transform: scale(1.1);
                background: rgba(255, 255, 255, 1);

                .heart-icon {
                    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg)
                        brightness(100%) contrast(101%);
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

    .info {
        padding: 5px 10px 10px;

        .title {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            line-height: 1.5;

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

        .location {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: #7f8c8d;
            line-height: 1.4;
            margin-bottom: 8px;

            img {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
                filter: invert(65%) sepia(8%) saturate(456%) hue-rotate(155deg) brightness(92%)
                    contrast(88%);
            }

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .stats {
            display: flex;
            align-items: center;
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

            .rating {
                width: 80%;
                display: flex;
                align-items: center;
                gap: 2px;
            }

            .rating img {
                filter: invert(69%) sepia(78%) saturate(1583%) hue-rotate(7deg) brightness(94%)
                    contrast(91%);
            }

            .favorites img {
                filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                    contrast(101%);
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
