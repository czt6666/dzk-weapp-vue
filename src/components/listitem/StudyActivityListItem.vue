<template>
    <div class="study-activity-item" @click="handleClick">
        <!-- 标题行 -->
        <div class="item-header">
            <h3 class="item-title">{{ info.activityName }}</h3>
            <div class="header-right">
                <span class="status-tag" :class="statusClass">
                    {{ statusText }}
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

        <!-- 活动信息 -->
        <div class="activity-info">
            <div class="info-row">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="label">报名时间：</span>
                <span class="value"
                    >{{ formatDate(info.applyStartDate) }} -
                    {{ formatDate(info.applyEndDate) }}</span
                >
            </div>

            <div class="info-row">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="label">活动时间：</span>
                <span class="value"
                    >{{ formatDate(info.activityStartDate) }} -
                    {{ formatDate(info.activityEndDate) }}</span
                >
            </div>
        </div>

        <!-- 底部信息 -->
        <div class="item-footer">
            <div class="footer-left">
                <div class="info-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span class="price-text">{{ formatPrice(info.price) }}</span>
                </div>

                <div class="info-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ info.registeredNum }}/{{ info.recruitNum }}</span>
                </div>
            </div>

            <div class="info-item favorites">
                <img :src="heartOutlineIcon" alt="收藏数" />
                <span>{{ localFavoriteCount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IStudyActivity } from "@/apis/study";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";

// Props
const props = defineProps<{
    info: IStudyActivity;
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

// 状态文本
const statusText = computed(() => {
    return props.info.status === 1 ? "进行中" : "已结束";
});

// 状态样式
const statusClass = computed(() => {
    return props.info.status === 1 ? "active" : "inactive";
});

// 格式化日期
const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
};

// 格式化价格
const formatPrice = (price: number): string => {
    if (price === 0 || !price) return "免费";
    return `¥${price.toFixed(2)}`;
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
.study-activity-item {
    background: #ffffff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;

    &:hover {
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

        .status-tag {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;

            &.active {
                color: #059669;
                background-color: #d1fae5;
            }

            &.inactive {
                color: #6b7280;
                background-color: #f3f4f6;
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

    .activity-info {
        margin-bottom: 12px;

        .info-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #4b5563;

            &:last-child {
                margin-bottom: 0;
            }

            .icon {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                color: #2563eb;
                stroke-width: 2;
            }

            .label {
                color: #6b7280;
                flex-shrink: 0;
            }

            .value {
                color: #111827;
                flex: 1;
            }
        }
    }

    .item-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;

        .footer-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            color: #4b5563;

            .icon {
                width: 16px;
                height: 16px;
                stroke-width: 2;
            }

            &.price .icon {
                color: #ea580c;
            }

            .price-text {
                font-weight: 600;
                color: #ea580c;
            }
        }

        .info-item.favorites {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;

            img {
                width: 16px;
                height: 16px;
                filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                    contrast(101%);
            }

            span {
                font-size: 14px;
                color: #4b5563;
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
