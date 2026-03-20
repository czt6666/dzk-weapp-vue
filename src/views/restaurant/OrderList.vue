<template>
    <div class="order-list-page">
        <header class="header">
            <h1>我的订单</h1>
            <p class="sub">所有订单都在这里啦～</p>
        </header>

        <!-- 订单列表 -->
        <section v-if="!loading && orderList.length" class="order-grid">
            <div
                v-for="order in orderList"
                :key="order.id"
                class="order-card"
                @click="goToDetail(order.id)"
            >
                <div class="order-header">
                    <div class="order-info">
                        <div class="order-no">订单号：{{ order.orderNo }}</div>
                        <div class="order-time">{{ formatTime(order.createTime) }}</div>
                    </div>
                    <div class="order-status" :class="getStatusClass(order.orderStatus)">
                        {{ getStatusText(order.orderStatus) }}
                    </div>
                </div>

                <div class="order-content">
                    <div class="restaurant-name">
                        <span class="icon">🍽️</span>
                        {{ order.restaurantName }}
                    </div>
                    <div class="order-items-preview">
                        <span
                            v-for="(item, index) in order.orderItems.slice(0, 3)"
                            :key="item.id"
                            class="item-tag"
                        >
                            {{ item.dishName }} x{{ item.quantity }}
                        </span>
                        <span v-if="order.orderItems.length > 3" class="more-items">
                            等{{ order.orderItems.length }}件商品
                        </span>
                    </div>
                </div>

                <div class="order-footer">
                    <div class="total-amount">¥{{ order.totalAmount.toFixed(2) }}</div>
                    <div class="view-detail">查看详情 →</div>
                </div>
            </div>
        </section>

        <!-- 加载中 -->
        <div v-else-if="loading" class="loading">
            <div class="loading-icon">⏳</div>
            <p class="loading-text">正在加载订单...</p>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty">
            <div class="empty-icon">
                <div class="order-icon-large">📋</div>
            </div>
            <p class="empty-text">暂无订单~</p>
            <p class="empty-hint">快去下单吧</p>
        </div>
    </div>
</template>

<script setup lang="ts" name="OrderList">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getOrderList, getOrderDetail, type IOrderDetail } from "@/apis/restaurant";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const orderList = ref<IOrderDetail[]>([]);

// 格式化时间
function formatTime(timeStr: string) {
    try {
        const date = new Date(timeStr);
        return date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return timeStr;
    }
}

// 获取订单状态文本
function getStatusText(status: number): string {
    const statusMap: Record<number, string> = {
        0: "待支付",
        1: "已下单",
        2: "已完成",
        3: "已取消",
    };
    return statusMap[status] || "未知状态";
}

// 获取订单状态样式类
function getStatusClass(status: number): string {
    const classMap: Record<number, string> = {
        0: "status-pending",
        1: "status-confirmed",
        2: "status-completed",
        3: "status-cancelled",
    };
    return classMap[status] || "status-unknown";
}

// 规范化订单ID列表
function normalizeOrderIds(data: any): number[] {
    const raw = data?.records ?? data;
    if (!raw) return [];

    if (Array.isArray(raw)) {
        return raw
            .map((x: any) => {
                if (typeof x === "number") return x;
                if (typeof x === "string") return Number(x);
                if (typeof x?.id === "number") return x.id;
                if (typeof x?.orderId === "number") return x.orderId;
                if (typeof x?.orderId === "string") return Number(x.orderId);
                return NaN;
            })
            .filter((x: number) => Number.isFinite(x));
    }

    if (typeof raw === "number") return [raw];
    if (typeof raw === "string" && raw) return [Number(raw)].filter(Number.isFinite);
    return [];
}

// 获取订单列表
async function fetchOrders() {
    const userId = userStore.userInfo?.userId;
    if (!userId) {
        ElMessage.warning("请先登录");
        router.push({ name: "MyPage" });
        return;
    }

    try {
        loading.value = true;
        const res: any = await getOrderList({ userId });
        const orderIds = normalizeOrderIds(res.data);

        if (orderIds.length === 0) {
            orderList.value = [];
            return;
        }

        // 批量获取订单详情
        const orderPromises = orderIds.map((id) =>
            getOrderDetail(id).catch((err) => {
                console.error(`获取订单 ${id} 详情失败:`, err);
                return null;
            }),
        );

        const orderResults = await Promise.all(orderPromises);
        orderList.value = orderResults
            .filter((r) => r != null && r.data != null)
            .map((r) => r!.data)
            .sort((a, b) => {
                // 按创建时间倒序排列
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
            });
    } catch (err: any) {
        console.error("获取订单列表失败:", err);
        ElMessage.error(err?.msg || err?.message || "获取订单列表失败");
        orderList.value = [];
    } finally {
        loading.value = false;
    }
}

// 跳转到订单详情
function goToDetail(orderId: number) {
    router.push({
        name: "OrderDetail",
        query: { orderId: String(orderId) },
    });
}

onMounted(() => {
    fetchOrders();
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "sass:color";

.order-list-page {
    overflow-y: auto;
    height: 100%;
    padding: $spacing-md;
    max-width: 1200px;
    margin: auto;
    background: $bg-gradient-main;
}

.header {
    text-align: center;
    margin-bottom: $spacing-md;
}

.header h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: $color-green-primary;
}

.header .sub {
    color: #888;
}

.order-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $spacing-md;
}

.order-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-large;
    box-shadow: $shadow-md;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: $transition-base;
    cursor: pointer;
    padding: $spacing-md;
}

.order-card:active {
    opacity: 0.8;
    transform: scale(0.98);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid #f0f0f0;

    .order-info {
        flex: 1;

        .order-no {
            font-size: 0.95rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .order-time {
            font-size: 0.8rem;
            color: #999;
        }
    }

    .order-status {
        font-size: 0.85rem;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 500;

        &.status-pending {
            background: #fff3cd;
            color: #856404;
        }

        &.status-confirmed {
            background: #d1ecf1;
            color: #0c5460;
        }

        &.status-completed {
            background: #d4edda;
            color: #155724;
        }

        &.status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }

        &.status-unknown {
            background: #e2e3e5;
            color: #383d41;
        }
    }
}

.order-content {
    flex-grow: 1;
    margin-bottom: $spacing-sm;

    .restaurant-name {
        font-size: 0.95rem;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 4px;

        .icon {
            font-size: 1rem;
        }
    }

    .order-items-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .item-tag {
            font-size: 0.8rem;
            color: #666;
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 4px;
        }

        .more-items {
            font-size: 0.8rem;
            color: #999;
        }
    }
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: $spacing-sm;
    border-top: 1px solid #f0f0f0;

    .total-amount {
        font-size: 1.1rem;
        font-weight: bold;
        color: $color-green-primary;
    }

    .view-detail {
        font-size: 0.85rem;
        color: #666;
    }
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xxxl $spacing-md;
    min-height: 60vh;
    color: $text-secondary;

    .loading-icon {
        font-size: 48px;
        margin-bottom: $spacing-md;
        animation: spin 1s linear infinite;
    }

    .loading-text {
        font-size: 14px;
        color: $text-secondary;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xxxl $spacing-md;
    min-height: 60vh;
    color: $text-secondary;

    .empty-icon {
        width: 120px;
        height: 120px;
        margin-bottom: $spacing-lg;
        opacity: 0.4;
        color: $text-tertiary;
        display: flex;
        align-items: center;
        justify-content: center;

        .order-icon-large {
            font-size: 80px;
        }
    }

    .empty-text {
        font-size: 16px;
        color: $text-secondary;
        margin-bottom: $spacing-sm;
        font-weight: 500;
    }

    .empty-hint {
        font-size: 14px;
        color: $text-tertiary;
    }
}
</style>
