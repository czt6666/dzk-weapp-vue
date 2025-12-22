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
                            >{{ formatDate(info.applyStartDate) }} -
                            {{ formatDate(info.applyEndDate) }}
                        </span>
                    </div>
                    <div class="info-item">
                        <label>活动时间</label>
                        <span>
                            {{ formatDate(info.activityStartDate) }} -
                            {{ formatDate(info.activityEndDate) }}
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
.study-activity-detail {
    height: 100%;
    overflow-y: auto;
    padding: 24px;
    background: linear-gradient(135deg, #fefce8 0%, #e0f2fe 100%);

    .detail-container {
        max-width: 960px;
        margin: 0 auto;
    }

    .detail-header {
        background: #ffffff;
        padding: 24px 28px;
        border-radius: 14px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
        margin-bottom: 20px;

        .detail-title {
            font-size: 26px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 12px 0;
        }

        .header-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .tag {
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 13px;
                background: #eff6ff;
                color: #1d4ed8;
            }

            .status-tag.status-active {
                background: #d1fae5;
                color: #047857;
            }

            .status-tag.status-inactive {
                background: #fee2e2;
                color: #b91c1c;
            }
        }
    }

    .info-card {
        background: #ffffff;
        padding: 20px 24px;
        border-radius: 14px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        margin-bottom: 18px;

        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 14px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;

            .info-item {
                display: flex;
                flex-direction: column;
                gap: 6px;

                label {
                    font-size: 13px;
                    color: #6b7280;
                }

                span {
                    font-size: 15px;
                    color: #111827;
                }

                .price {
                    font-size: 20px;
                    font-weight: 700;
                    color: #ea580c;
                }
            }
        }

        .content-text {
            font-size: 15px;
            color: #374151;
            line-height: 1.8;
            white-space: pre-wrap;
            margin: 0;
        }

        .empty-text {
            font-size: 14px;
            color: #9ca3af;
            font-style: italic;
            margin: 0;
        }
    }
}
</style>
