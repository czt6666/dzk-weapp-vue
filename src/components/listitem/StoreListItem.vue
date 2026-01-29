<template>
    <div class="store-card" @click="handleClick">
        <!-- 店铺logo和基本信息 -->
        <div class="store-header">
            <el-image
                v-if="store.logoUrl"
                :src="imgUrl(store.logoUrl)"
                :alt="store.name"
                class="store-logo"
                fit="cover"
            />
            <div v-else class="store-logo-placeholder">🏪</div>

            <div class="store-main-info">
                <h3 class="store-name">{{ store.name }}</h3>
                <div class="store-village" v-if="store.villageName">
                    <span class="village-icon">📍</span>
                    <span>{{ store.villageName }}</span>
                </div>
            </div>

            <div class="action-buttons">
                <!-- 收藏按钮 -->
                <button
                    class="favorite-btn"
                    :class="{ active: isFavorite }"
                    @click.stop="toggleFavorite"
                >
                    <img v-if="isFavorite" :src="heartFilledIcon" alt="已收藏" class="heart-icon" />
                    <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                </button>

                <!-- 去下单按钮 -->
                <button class="order-btn" @click.stop="handleClick">去下单</button>
            </div>
        </div>

        <!-- 介绍 -->
        <div v-if="store.notice" class="store-intro">
            <span class="intro-icon">📝</span>
            <span class="intro-text">{{ store.notice }}</span>
        </div>

        <!-- 营业时间 -->
        <div class="store-info-row">
            <span class="info-icon">🕐</span>
            <span class="info-label">营业时间：</span>
            <span class="info-value">
                {{ store.businessStartTime }} - {{ store.businessEndTime }}
            </span>
        </div>

        <!-- 地址 -->
        <div class="store-info-row address-row" @click.stop="goToMap">
            <span class="info-icon">📍</span>
            <span class="info-label">地址：</span>
            <span class="info-value">{{ store.address }}</span>
            <ActionArrow />
        </div>

        <!-- 电话 -->
        <div class="store-info-row phone-row" @click.stop="handlePhoneClick" v-if="store.phone">
            <span class="info-icon">📞</span>
            <span class="info-label">电话：</span>
            <span class="info-value">{{ store.phone }}</span>
            <ActionArrow />
        </div>

        <!-- 收藏数 -->
        <div class="store-info-row">
            <img :src="heartOutlineIcon" alt="收藏" class="info-icon favorite-icon" />
            <span class="info-label">收藏数：</span>
            <span class="info-value">{{ localFavoriteCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { IRestaurantInfo } from "@/apis/restaurant";
import { imgUrl } from "@/utils";
import { showPhoneModal } from "@/utils/phoneModal";
import ActionArrow from "@/components/base/ActionArrow.vue";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";

const props = defineProps<{
    store: IRestaurantInfo;
}>();

const emit = defineEmits<{
    click: [store: IRestaurantInfo];
    favorite: [isFavorite: boolean];
}>();

const router = useRouter();

// 直接使用父组件传递的收藏状态
const isFavorite = computed(() => props.store.isCollect || false);

// 收藏数
const localFavoriteCount = computed(() => {
    return props.store.collectNumber || 0;
});

const handleClick = () => {
    emit("click", props.store);
};

const toggleFavorite = () => {
    emit("favorite", !isFavorite.value);
};

// 跳转到地图页面
const goToMap = () => {
    if (props.store.coordinateLng && props.store.coordinateLat) {
        router.push({
            name: "Map",
            query: {
                lng: props.store.coordinateLng.toString(),
                lat: props.store.coordinateLat.toString(),
                name: props.store.name,
                address: props.store.address,
                phone: props.store.phone || "",
            },
        });
    }
};

// 处理电话号码点击
const handlePhoneClick = () => {
    if (props.store.phone) {
        showPhoneModal(props.store.phone);
    }
};
</script>

<style lang="scss" scoped>
.store-card {
    background: #fff;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
        opacity: 0.8;
    }
}

// 店铺头部
.store-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;

    :deep(.store-logo) {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        flex-shrink: 0;
        border: 1px solid #f0f0f0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .store-logo-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        flex-shrink: 0;
    }

    .store-main-info {
        flex: 1;
        min-width: 0;
    }

    .store-name {
        font-size: 17px;
        font-weight: 600;
        color: #333;
        margin: 0 0 6px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .store-village {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #666;

        .village-icon {
            font-size: 12px;
        }
    }

    .action-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    .favorite-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f5f5f5;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;

        .heart-icon {
            width: 18px;
            height: 18px;
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

    .order-btn {
        padding: 8px 20px;
        background: linear-gradient(135deg, #d1dccb 0%, #a4b39a 100%);
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        flex-shrink: 0;

        &:active {
            transform: scale(0.98);
        }
    }
}

// 介绍
.store-intro {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.intro-icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 1px;
}

.intro-text {
    color: #666;
    line-height: 1.6;
    flex: 1;
    white-space: pre-wrap;
    word-break: break-word;
}

// 信息行
.store-info-row {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 14px;
    margin-bottom: 6px;

    &:last-of-type {
        margin-bottom: 0;
    }

    &.address-row {
        cursor: pointer;
        transition: background-color 0.2s ease;
        padding: 4px 0;
        margin-left: -4px;
        margin-right: -4px;
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 4px;

        &:active {
            background-color: #f5f5f5;
        }
    }

    .info-icon {
        font-size: 14px;
        flex-shrink: 0;
        margin-top: 1px;

        &.favorite-icon {
            width: 14px;
            height: 14px;
            filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg) brightness(100%)
                contrast(101%);
        }
    }

    .info-label {
        color: #999;
        flex-shrink: 0;
    }

    .info-value {
        color: #333;
        flex: 1;
    }

    .arrow-icon {
        display: flex;
        align-items: center;
    }

    &.phone-row {
        cursor: pointer;
        transition: background-color 0.2s ease;
        padding: 4px 0;
        margin-left: -4px;
        margin-right: -4px;
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 4px;

        &:active {
            background-color: #f5f5f5;
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
