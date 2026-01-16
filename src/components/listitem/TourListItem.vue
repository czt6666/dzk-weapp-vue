// TourRouteItem.vue
<template>
    <div class="tour-route-item" @click="handleClick">
        <!-- 标题行 -->
        <div class="item-header">
            <h3 class="item-title">{{ info.name }}</h3>
            <div class="header-right">
                <span :class="['difficulty-tag', `difficulty-${info.difficulty}`]">
                    {{ info.difficulty }}
                </span>
                <div class="favorite-overlay" @click.stop="toggleFavorite">
                    <div class="favorite-btn" :class="{ active: isFavorite }">
                        <img
                            v-if="isFavorite"
                            :src="heartFilledIcon"
                            alt="已收藏"
                            class="heart-icon"
                        />
                        <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 路线信息 -->
        <div class="route-info">
            <div class="location-info">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div class="location-text">
                    <div class="location-item">
                        <span class="label">起：</span>
                        {{ simplifyAddress(info.originAddress) }}
                    </div>
                    <div class="location-item">
                        <span class="label">终：</span>
                        {{ simplifyAddress(info.destAddress) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 详细信息行 -->
        <div class="item-footer">
            <div v-if="info.days > 0" class="info-item">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ info.days }}天</span>
            </div>

            <div v-if="info.targetCrowd" class="info-item">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{{ info.targetCrowd }}</span>
            </div>

            <div class="info-item favorites">
                <img :src="heartOutlineIcon" alt="收藏数" />
                <span>{{ localFavoriteCount }}</span>
            </div>

            <div v-if="info.priceRange" class="info-item price">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span class="price-text">{{ formatPrice(info.priceRange) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ITourRoute } from "@/apis/tour";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";

// Props
const props = defineProps<{
    info: ITourRoute;
}>();

// Emits
const emit = defineEmits<{
    click: [id: number];
    favorite: [isFavorite: boolean];
}>();

// 直接使用父组件传递的收藏状态
const isFavorite = computed(() => props.info.isCollect || false);

// 收藏数
const localFavoriteCount = computed(() => {
    return props.info.collectNumber || 0;
});

// 格式化价格
const formatPrice = (price: string): string => {
    if (!price || price === "0") return "面议";
    const num = parseInt(price);
    if (num >= 10000) {
        return `¥${(num / 10000).toFixed(1)}万`;
    }
    return `¥${num}`;
};

// 简化地址
const simplifyAddress = (address: string): string => {
    if (!address) return "";
    const match = address.match(/北京市(.+?区)(.+)/);
    if (match && match[1] && match[2]) {
        return `${match[1]} ${match[2].substring(0, 10)}...`;
    }
    return address.substring(0, 20) + "...";
};

// 点击事件
const handleClick = () => {
    emit("click", props.info.id);
};

// 切换收藏
const toggleFavorite = () => {
    emit("favorite", !isFavorite.value);
};
</script>

<style lang="scss" scoped>
.tour-route-item {
    background: #ffffff;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;

    &:active {
        opacity: 0.8;
    }

    .item-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 12px;

        .item-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            flex: 1;
            margin: 0;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .difficulty-tag {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;

            &.difficulty-1 {
                color: #059669;
                background-color: #d1fae5;
            }

            &.difficulty-2 {
                color: #2563eb;
                background-color: #dbeafe;
            }

            &.difficulty-3 {
                color: #d97706;
                background-color: #fef3c7;
            }

            &.difficulty-4 {
                color: #ea580c;
                background-color: #ffedd5;
            }

            &.difficulty-5 {
                color: #dc2626;
                background-color: #fee2e2;
            }
        }

        .favorite-overlay {
            position: relative;
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

    .route-info {
        margin-bottom: 12px;

        .location-info {
            display: flex;
            align-items: flex-start;
            font-size: 14px;
            color: #4b5563;

            .icon {
                width: 16px;
                height: 16px;
                margin-right: 8px;
                margin-top: 2px;
                flex-shrink: 0;
                color: #059669;
                stroke-width: 2;
            }

            .location-text {
                flex: 1;

                .location-item {
                    margin-bottom: 4px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .label {
                        color: #6b7280;
                    }
                }
            }
        }
    }

    .item-footer {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;
        font-size: 14px;
        color: #4b5563;

        .info-item {
            display: flex;
            align-items: center;

            &.price {
                margin-left: auto;

                .price-text {
                    font-weight: 600;
                    color: #ea580c;
                }
            }

            .icon {
                width: 16px;
                height: 16px;
                margin-right: 4px;
                stroke-width: 2;

                &:first-child {
                    color: #2563eb;
                }
            }
        }

        .info-item:nth-child(2) .icon {
            color: #7c3aed;
        }

        .info-item.price .icon {
            color: #ea580c;
        }

        .info-item.favorites {
            display: flex;
            align-items: center;
            gap: 4px;

            img {
                width: 16px;
                height: 16px;
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
