<template>
    <div class="study-activity-detail" v-if="info">
        <div class="detail-container">
            <div class="detail-header">
                <h1 class="detail-title">{{ info.activityName }}</h1>
                <div class="header-tags">
                    <span class="tag status-tag" :class="statusClass">{{ statusText }}</span>
                    <span class="tag">活动编号：#{{ info.id }}</span>
                    <span class="tag">方案ID：{{ info.planId }}</span>
                </div>
            </div>

            <div class="info-card">
                <h2 class="card-title">时间安排</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>报名时间</label>
                        <span
                            >{{ info.applyStartDate }} -
                            {{ info.applyEndDate }}
                        </span>
                    </div>
                    <div class="info-item">
                        <label>活动时间</label>
                        <span>
                            {{ info.activityStartDate }} -
                            {{ info.activityEndDate }}
                        </span>
                    </div>
                    <div class="info-item">
                        <label>创建时间</label>
                        <span>{{ formatDateTime(info.createTime) }}</span>
                    </div>
                    <div class="info-item">
                        <label>最近更新</label>
                        <span>{{ formatDateTime(info.updateTime) }}</span>
                    </div>
                </div>
            </div>

            <div class="info-card">
                <h2 class="card-title">招募信息</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>价格</label>
                        <span class="price">{{ formatPrice(info.price) }}</span>
                    </div>
                    <div class="info-item">
                        <label>招募人数</label>
                        <span>{{ info.recruitNum }}</span>
                    </div>
                    <div class="info-item">
                        <label>已报名人数</label>
                        <span>{{ info.registeredNum }}</span>
                    </div>
                </div>
            </div>

            <div class="info-card">
                <h2 class="card-title">备注说明</h2>
                <p v-if="info.remark" class="content-text">{{ info.remark }}</p>
                <p v-else class="empty-text">暂无备注</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getStudyActivityDetail, type IStudyActivity } from "@/apis/study";

const route = useRoute();
const info = ref<IStudyActivity>();

async function fetchDetail() {
    try {
        const id = Number(route.params.id);
        if (!id) return console.error("id未传入");
        const res = await getStudyActivityDetail(id);
        if (!res.data) {
            return ElMessage.error("获取研学活动失败");
        }
        return res.data;
    } catch {
        return ElMessage.error("获取研学活动失败");
    }
}

onMounted(async () => {
    info.value = await fetchDetail();
});

const statusText = computed(() => {
    if (!info.value) return "";
    return info.value.status === 1 ? "进行中" : "已结束";
});

const statusClass = computed(() => {
    if (!info.value) return "";
    return info.value.status === 1 ? "status-active" : "status-inactive";
});

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "暂无";
    const date = new Date(dateStr);
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${m}-${d}`;
};

const formatDateTime = (datetime: string | null): string => {
    if (!datetime) return "暂无";
    const date = new Date(datetime);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPrice = (price: number): string => {
    if (!price || price === 0) return "免费";
    return `¥${price.toFixed(2)}`;
};
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.study-activity-detail {
    height: 100%;
    overflow-y: auto;
    padding: $spacing-md;
    background: $bg-gradient-main;

    .detail-container {
        max-width: 960px;
        margin: 0 auto;
    }

    .detail-header {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: $spacing-md;
        border-radius: $radius-large;
        box-shadow: $shadow-md;
        margin-bottom: $spacing-md;

        .detail-title {
            font-size: 26px;
            font-weight: 600;
            color: $color-green-primary;
            margin: 0 0 $spacing-md 0;
        }

        .header-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .tag {
                padding: 4px $spacing-md;
                border-radius: 999px;
                font-size: 13px;
                background: rgba($color-green-primary, 0.1);
                color: $color-green-primary;
            }

            .status-tag.status-active {
                background: $overlay-green-light;
                color: $color-green-primary;
            }

            .status-tag.status-inactive {
                background: rgba($color-red-primary, 0.1);
                color: $color-red-primary;
            }
        }
    }

    .info-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: $spacing-md;
        border-radius: $radius-large;
        box-shadow: $shadow-md;
        margin-bottom: $spacing-md;

        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: $color-green-primary;
            margin: 0 0 $spacing-md 0;
            padding-bottom: $spacing-sm;
            border-bottom: 2px solid rgba($color-green-primary, 0.2);
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: $spacing-md;

            .info-item {
                display: flex;
                flex-direction: column;
                gap: 6px;

                label {
                    font-size: 13px;
                    color: $text-tertiary;
                }

                span {
                    font-size: 15px;
                    color: $text-primary;
                }

                .price {
                    font-size: 20px;
                    font-weight: 700;
                    color: $color-green-primary;
                }
            }
        }

        .content-text {
            font-size: 15px;
            color: $text-primary;
            line-height: 1.8;
            white-space: pre-wrap;
            margin: 0;
        }

        .empty-text {
            font-size: 14px;
            color: $text-tertiary;
            font-style: italic;
            margin: 0;
        }
    }
}
</style>
