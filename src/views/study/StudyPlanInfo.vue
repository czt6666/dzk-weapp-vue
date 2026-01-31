<template>
    <div class="study-plan-detail" v-if="info">
        <div class="detail-container">
            <div class="detail-header">
                <h1 class="detail-title">{{ info.planName }}</h1>
                <div class="header-tags">
                    <span class="tag" v-if="info.suitableCrowd"
                        >适合人群：{{ info.suitableCrowd }}</span
                    >
                    <span class="tag" v-if="info.duration">时长：{{ info.duration }}天</span>
                    <span class="tag status-tag" :class="statusClass">{{ statusText }}</span>
                </div>
            </div>

            <div class="info-card">
                <h2 class="card-title">基本信息</h2>
                <div class="info-grid">
                    <div class="info-item route-item">
                        <label>线路</label>
                        <span class="route-text">{{ info.route || "暂无" }}</span>
                    </div>
                    <div class="info-item">
                        <label>方案编号</label>
                        <span>#{{ info.id }}</span>
                    </div>
                    <div class="info-item">
                        <label>创建时间</label>
                        <span>{{ formatDateTime(info.createTime) }}</span>
                    </div>
                </div>
            </div>

            <div class="info-card">
                <h2 class="card-title">方案简介</h2>
                <p v-if="info.briefIntro" class="content-text">{{ info.briefIntro }}</p>
                <p v-else class="empty-text">暂无简介</p>
            </div>

            <div class="info-card">
                <h2 class="card-title">详细内容</h2>
                <p v-if="info.details" class="content-text">{{ info.details }}</p>
                <p v-else class="empty-text">暂无详细内容</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="StudyPlanInfo">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getStudyPlanDetail, type IStudyPlan } from "@/apis/study";

const route = useRoute();
const info = ref<IStudyPlan>();

async function fetchDetail() {
    try {
        const id = Number(route.params.id);
        if (!id) return console.error("id未传入");
        const res = await getStudyPlanDetail(id);
        if (!res.data) {
            return ElMessage.error("获取研学方案失败");
        }
        return res.data;
    } catch {
        return ElMessage.error("获取研学方案失败");
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
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.study-plan-detail {
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

                &.route-item {
                    grid-column: 1 / -1;

                    .route-text {
                        white-space: pre-wrap;
                        word-break: break-word;
                    }
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
