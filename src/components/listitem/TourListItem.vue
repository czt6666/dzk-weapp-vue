// TourRouteItem.vue
<template>
    <div class="tour-route-item" @click="handleClick">
        <!-- 标题行 -->
        <div class="item-header">
            <h3 class="item-title">{{ info.name }}</h3>
            <span :class="['difficulty-tag', `difficulty-${info.difficulty}`]">
                {{ info.difficulty }}
            </span>
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
import type { ITourRoute } from "@/apis/tour";

// Props
const props = defineProps<{
    info: ITourRoute;
}>();

// Emits
const emit = defineEmits<{
    click: [id: number];
}>();

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
    if (match) {
        return `${match[1]} ${match[2].substring(0, 10)}...`;
    }
    return address.substring(0, 20) + "...";
};

// 点击事件
const handleClick = () => {
    emit("click", props.info.id);
};
</script>

<style lang="scss" scoped>
.tour-route-item {
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
    }
}
</style>
