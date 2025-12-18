<template>
    <div class="institution-item" @click="handleClick">
        <!-- 顶部 -->
        <div class="header">
            <h3 class="name">{{ info.name }}</h3>
            <div class="header-right">
                <span class="status" :class="statusClass">
                    {{ statusText }}
                </span>
                <div class="favorite-overlay" @click.stop="toggleFavorite">
                    <div class="favorite-btn" :class="{ active: isFavorite }">
                        <img v-if="isFavorite" :src="heartFilledIcon" alt="已收藏" class="heart-icon" />
                        <img v-else :src="heartOutlineIcon" alt="收藏" class="heart-icon" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 标签信息 -->
        <div class="tags">
            <span class="tag" v-for="tag in serviceTags" :key="tag">
                {{ tag }}
            </span>
            <span class="tag level">
                {{ info.careLevel }}
            </span>
        </div>

        <!-- 核心信息 -->
        <div class="info">
            <div class="info-row">
                <span class="label">地址：</span>
                <span class="value ellipsis">
                    {{ info.businessAddress || info.registeredAddress }}
                </span>
            </div>

            <div class="info-row">
                <span class="label">床位：</span>
                <span class="value">{{ info.totalBeds }} 张</span>

                <span class="divider" />

                <span class="label">价格：</span>
                <span class="value price">{{ info.priceRange }}</span>

                <span class="divider" />

                <div class="favorites-info">
                    <img :src="heartOutlineIcon" alt="收藏数" class="favorite-icon" />
                    <span class="value">{{ localFavoriteCount }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import heartFilledIcon from "@/assets/svg/heart-filled.svg";
import heartOutlineIcon from "@/assets/svg/heart-outline.svg";

interface Institution {
    id: number;
    name: string;
    businessAddress?: string;
    registeredAddress?: string;
    serviceMode: string;
    careLevel: string;
    totalBeds: number;
    priceRange: string;
    businessStatus: number;
    collectNumber?: number;
    isCollect?: boolean;
}

const props = defineProps<{
    info: Institution;
}>();

const emit = defineEmits<{
    (e: "click", id: number): void;
    (e: "favorite", isFavorite: boolean): void;
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

const serviceTags = computed(() => props.info.serviceMode?.split(",") || []);

const statusText = computed(() => {
    return props.info.businessStatus === 1 ? "正常运营" : "暂停服务";
});

const statusClass = computed(() => {
    return props.info.businessStatus === 1 ? "active" : "inactive";
});

const emitDetail = () => {
    emit("click", props.info.id);
};

const handleClick = () => {
    emitDetail();
};

// 切换收藏
const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value;
    emit("favorite", isFavorite.value);
};
</script>

<style scoped lang="scss">
.institution-item {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #ebeef5;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        flex: 1;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;

        &.active {
            color: #67c23a;
            background: #f0f9eb;
        }

        &.inactive {
            color: #f56c6c;
            background: #fef0f0;
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

.tags {
    margin: 8px 0;

    .tag {
        display: inline-block;
        font-size: 12px;
        color: #409eff;
        background: #ecf5ff;
        padding: 2px 8px;
        border-radius: 4px;
        margin-right: 6px;
        margin-bottom: 4px;

        &.level {
            color: #e6a23c;
            background: #fdf6ec;
        }
    }
}

.info {
    font-size: 13px;
    color: #606266;

    .info-row {
        display: flex;
        align-items: center;
        margin-top: 6px;

        .label {
            color: #909399;
            flex-shrink: 0;
        }

        .value {
            margin-right: 12px;

            &.price {
                color: #f56c6c;
                font-weight: 500;
            }
        }

        .divider {
            width: 1px;
            height: 12px;
            background: #dcdfe6;
            margin: 0 8px;
        }

        .ellipsis {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .favorites-info {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-left: auto;

            .favorite-icon {
                width: 14px;
                height: 14px;
                filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(334deg)
                    brightness(100%) contrast(101%);
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
