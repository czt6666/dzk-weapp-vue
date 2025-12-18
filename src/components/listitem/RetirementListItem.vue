<template>
    <div class="institution-item" @click="handleClick">
        <!-- 顶部 -->
        <div class="header">
            <h3 class="name">{{ info.name }}</h3>
            <span class="status" :class="statusClass">
                {{ statusText }}
            </span>
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
}

const props = defineProps<{
    info: Institution;
}>();

const emit = defineEmits<{
    (e: "click", id: number): void;
}>();

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
    }
}
</style>
