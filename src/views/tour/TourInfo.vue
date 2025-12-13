// TourRouteDetail.vue
<template>
    <div class="tour-route-detail">
        <div class="detail-container">
            <!-- 标题区域 -->
            <div class="detail-header">
                <h1 class="detail-title">{{ info.name }}</h1>
                <div class="header-tags">
                    <span class="tag difficulty-tag">难度：{{ info.difficulty }}</span>
                    <span v-if="info.targetCrowd" class="tag crowd-tag"
                        >目标人群：{{ info.targetCrowd }}</span
                    >
                    <span class="tag status-tag" :class="getStatusClass(info.bizStatus)">
                        {{ info.bizStatus === 1 ? "可预订" : "已下架" }}
                    </span>
                </div>
            </div>

            <!-- 基本信息卡片 -->
            <div class="info-card">
                <h2 class="card-title">基本信息</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>线路类型</label>
                        <span>{{ info.routeType || "暂无" }}</span>
                    </div>
                    <div class="info-item">
                        <label>主题标签</label>
                        <span>{{ info.themeTags || "暂无" }}</span>
                    </div>
                    <div class="info-item">
                        <label>行程天数</label>
                        <span>{{ info.days > 0 ? `${info.days}天` : "暂无" }}</span>
                    </div>
                    <div class="info-item">
                        <label>价格区间</label>
                        <span class="price">{{ formatPrice(info.priceRange) }}</span>
                    </div>
                    <div class="info-item">
                        <label>业务状态</label>
                        <span>{{ info.bizStatus === 1 ? "正常" : "异常" }}</span>
                    </div>
                </div>
            </div>

            <!-- 路线信息卡片 -->
            <div class="info-card">
                <h2 class="card-title">路线详情</h2>
                <div class="route-detail">
                    <div class="location-section">
                        <div class="location-label">
                            <svg
                                class="icon start-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <strong>出发地</strong>
                        </div>
                        <p class="location-address">{{ info.originAddress }}</p>
                        <p class="location-coords">
                            经度: {{ info.originLng }} | 纬度: {{ info.originLat }}
                        </p>
                    </div>

                    <div class="route-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>

                    <div class="location-section">
                        <div class="location-label">
                            <svg
                                class="icon end-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <strong>目的地</strong>
                        </div>
                        <p class="location-address">{{ info.destAddress }}</p>
                        <p class="location-coords">
                            经度: {{ info.destLng }} | 纬度: {{ info.destLat }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- 行程安排 -->
            <div class="info-card">
                <h2 class="card-title">行程安排</h2>
                <div class="content-section">
                    <p v-if="info.itinerary" class="content-text">{{ info.itinerary }}</p>
                    <p v-else class="empty-text">暂无行程安排</p>
                </div>
            </div>

            <!-- 费用说明 -->
            <div class="info-card">
                <h2 class="card-title">费用说明</h2>
                <div class="fee-section">
                    <div class="fee-item">
                        <h3>费用包含</h3>
                        <p v-if="info.costIncluded" class="content-text">
                            {{ info.costIncluded }}
                        </p>
                        <p v-else class="empty-text">暂无说明</p>
                    </div>
                    <div class="fee-item">
                        <h3>费用不含</h3>
                        <p v-if="info.costExcluded" class="content-text">
                            {{ info.costExcluded }}
                        </p>
                        <p v-else class="empty-text">暂无说明</p>
                    </div>
                </div>
            </div>

            <!-- 安全保障 -->
            <div class="info-card">
                <h2 class="card-title">安全保障</h2>
                <div class="content-section">
                    <div class="safety-item">
                        <h3>安全措施</h3>
                        <p v-if="info.safetyMeasures" class="content-text">
                            {{ info.safetyMeasures }}
                        </p>
                        <p v-else class="empty-text">暂无说明</p>
                    </div>
                    <div class="safety-item">
                        <h3>服务保障</h3>
                        <p v-if="info.serviceGuarantee" class="content-text">
                            {{ info.serviceGuarantee }}
                        </p>
                        <p v-else class="empty-text">暂无说明</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getTourRouteDetail, type TourRoute } from "@/apis/tour";

const route = useRoute();

const info = ref<TourRoute>({
    id: 0,
    name: "",
    routeType: "",
    themeTags: "",
    destAddress: "",
    destLng: 0,
    destLat: 0,
    itinerary: "",
    costIncluded: "",
    costExcluded: "",
    safetyMeasures: "",
    serviceGuarantee: "",
    originAddress: "",
    originLat: 0,
    originLng: 0,
    days: 0,
    difficulty: "",
    bizStatus: 0,
    targetCrowd: "",
    priceRange: "",
});

async function fetchTourDetail() {
    try {
        const params = route.params;
        const id = Number(params.id);
        if (!id) return console.error("id未传入");

        const res = await getTourRouteDetail(id);
        if (!res.data) {
            return ElMessage.error("路线获取失败");
        }
        return res.data;
    } catch {
        return ElMessage.error("路线获取失败");
    }
}

// 格式化价格
const formatPrice = (price: string): string => {
    if (!price || price === "0") return "面议";
    const num = parseInt(price);
    if (num >= 10000) {
        return `¥${(num / 10000).toFixed(1)}万`;
    }
    return `¥${num.toLocaleString()}`;
};

// 格式化日期时间
const formatDateTime = (datetime: string): string => {
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

// 获取状态样式类
const getStatusClass = (status: number): string => {
    return status === 1 ? "status-active" : "status-inactive";
};

onMounted(async () => {
    info.value = await fetchTourDetail();
});
</script>

<style lang="scss" scoped>
.tour-route-detail {
    height: 100%;
    overflow-y: auto;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 24px;

    .detail-container {
        max-width: 1000px;
        margin: 0 auto;
    }

    .detail-header {
        background: #ffffff;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;

        .detail-title {
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 16px 0;
        }

        .header-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            .tag {
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
            }

            .difficulty-tag {
                background: #fef3c7;
                color: #92400e;
            }

            .crowd-tag {
                background: #dbeafe;
                color: #1e40af;
            }

            .status-tag {
                &.status-active {
                    background: #d1fae5;
                    color: #065f46;
                }

                &.status-inactive {
                    background: #fee2e2;
                    color: #991b1b;
                }
            }
        }
    }

    .info-card {
        background: #ffffff;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;

        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 20px 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;

            .info-item {
                display: flex;
                flex-direction: column;
                gap: 8px;

                label {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                }

                span {
                    font-size: 16px;
                    color: #111827;

                    &.price {
                        font-size: 20px;
                        font-weight: 700;
                        color: #ea580c;
                    }
                }
            }
        }

        .route-detail {
            display: flex;
            align-items: center;
            gap: 24px;

            .location-section {
                flex: 1;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;

                .location-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;

                    .icon {
                        width: 20px;
                        height: 20px;
                        stroke-width: 2;

                        &.start-icon {
                            color: #059669;
                        }

                        &.end-icon {
                            color: #dc2626;
                        }
                    }

                    strong {
                        font-size: 16px;
                        color: #111827;
                    }
                }

                .location-address {
                    font-size: 15px;
                    color: #374151;
                    margin: 0 0 8px 0;
                    line-height: 1.6;
                }

                .location-coords {
                    font-size: 13px;
                    color: #6b7280;
                    margin: 0;
                }
            }

            .route-arrow {
                flex-shrink: 0;

                svg {
                    width: 32px;
                    height: 32px;
                    color: #9ca3af;
                    stroke-width: 2;
                }
            }
        }

        .content-section {
            .content-text {
                font-size: 15px;
                color: #374151;
                line-height: 1.8;
                margin: 0;
                white-space: pre-wrap;
            }

            .empty-text {
                font-size: 14px;
                color: #9ca3af;
                font-style: italic;
                margin: 0;
            }

            .safety-item {
                margin-bottom: 20px;

                &:last-child {
                    margin-bottom: 0;
                }

                h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 12px 0;
                }
            }
        }

        .fee-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;

            .fee-item {
                h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 12px 0;
                }

                .content-text {
                    font-size: 15px;
                    color: #374151;
                    line-height: 1.8;
                    margin: 0;
                    white-space: pre-wrap;
                }

                .empty-text {
                    font-size: 14px;
                    color: #9ca3af;
                    font-style: italic;
                    margin: 0;
                }
            }
        }
    }
}
</style>
