<template>
    <div class="order-detail">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="orderInfo" class="order-content">
            <!-- 订单头部 -->
            <div class="order-header">
                <h2 class="order-title">订单详情</h2>
                <div class="order-id">订单号：{{ orderInfo.orderNo }}</div>
            </div>

            <!-- 店铺信息 -->
            <div v-if="restaurantInfo" class="store-info">
                <h3 class="section-title">店铺信息</h3>
                <div class="store-card">
                    <div class="store-header">
                        <el-image
                            v-if="restaurantInfo.logoUrl"
                            :src="imgUrl(restaurantInfo.logoUrl)"
                            class="store-logo"
                            fit="cover"
                        />
                        <div v-else class="store-logo-placeholder">🏪</div>
                        <div class="store-details">
                            <div class="store-name">{{ restaurantInfo.name }}</div>
                            <div class="store-address" v-if="restaurantInfo.address">
                                <span class="icon">📍</span>
                                {{ restaurantInfo.address }}
                            </div>
                            <div
                                class="store-phone"
                                v-if="restaurantInfo.phone"
                                @click="handlePhoneClick"
                            >
                                <span class="icon">📞</span>
                                {{ restaurantInfo.phone }}
                                <ActionArrow />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 订单商品列表 -->
            <div class="order-items">
                <h3 class="section-title">商品信息</h3>
                <div class="items-list">
                    <div v-for="item in orderInfo.orderItems" :key="item.id" class="order-item">
                        <div class="item-name">{{ item.dishName }}</div>
                        <div class="item-quantity">x{{ item.quantity }}</div>
                        <div class="item-price">¥{{ item.subtotalAmount.toFixed(2) }}</div>
                    </div>
                </div>
            </div>

            <!-- 订单金额 -->
            <div class="order-summary">
                <div class="summary-row">
                    <span class="label">订单金额</span>
                    <span class="value total-amount">¥{{ orderInfo.totalAmount.toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                    <span class="label">下单时间</span>
                    <span class="value">{{ formatTime(orderInfo.createTime) }}</span>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="order-actions">
                <button class="back-btn" @click="goBack">返回</button>
            </div>
        </div>
        <div v-else class="error">订单信息加载失败</div>

        <!-- 提示弹窗 -->
        <div v-if="showTipModal" class="modal-overlay" @click="showTipModal = false">
            <div class="tip-modal" @click.stop>
                <div class="modal-header">
                    <h3>温馨提示</h3>
                    <button class="close-btn" @click="showTipModal = false">✕</button>
                </div>
                <div class="modal-body">
                    <div class="tip-content">
                        <div class="tip-icon">💡</div>
                        <p class="tip-text">无需支付，请截图保存订单信息，线下展示给店家</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="confirm-btn" @click="showTipModal = false">我知道了</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="OrderDetail">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { IOrderDetail, IRestaurantInfo } from "@/apis/restaurant";
import { getOrderDetail, getRestaurantDetail } from "@/apis/restaurant";
import { useUserStore } from "@/stores/user";
import { imgUrl } from "@/utils";
import { showPhoneModal } from "@/utils/phoneModal";
import ActionArrow from "@/components/base/ActionArrow.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const orderInfo = ref<IOrderDetail | null>(null);
const restaurantInfo = ref<IRestaurantInfo | null>(null);
const showTipModal = ref(false);

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

// 返回
function goBack() {
    router.back();
}

// 处理电话号码点击
function handlePhoneClick() {
    if (restaurantInfo.value?.phone) {
        showPhoneModal(restaurantInfo.value.phone);
    }
}

onMounted(async () => {
    // 从路由query中获取订单id
    const orderId = route.query.orderId;
    if (!orderId) {
        loading.value = false;
        ElMessage.error("缺少订单ID");
        return;
    }

    try {
        loading.value = true;
        // 使用订单id请求订单详情
        const res = await getOrderDetail(Number(orderId));

        if (res.data) {
            orderInfo.value = res.data;

            // 获取餐厅信息
            if (res.data.restaurantId) {
                try {
                    const restaurantRes = await getRestaurantDetail({ id: res.data.restaurantId });
                    restaurantInfo.value = restaurantRes.data;
                } catch (error) {
                    console.error("获取餐厅信息失败:", error);
                    // 即使获取餐厅信息失败，也继续显示订单信息
                }
            }

            loading.value = false;
            // 显示提示弹窗
            setTimeout(() => {
                showTipModal.value = true;
            }, 300);
        } else {
            loading.value = false;
            ElMessage.error("订单信息加载失败");
        }
    } catch (error: any) {
        console.error("获取订单详情失败:", error);
        ElMessage.error(error?.response?.data?.msg || error?.msg || "订单信息加载失败");
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
.order-detail {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20px;
}

.loading,
.error {
    text-align: center;
    padding: 40px 0;
    color: #999;
}

.order-content {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.order-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .order-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
    }

    .order-id {
        font-size: 14px;
        color: #666;
    }
}

.store-info {
    margin-bottom: 24px;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
    }

    .store-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 12px;

        .store-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;

            .store-logo {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                flex-shrink: 0;

                :deep(img) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .store-logo-placeholder {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                flex-shrink: 0;
            }

            .store-details {
                flex: 1;
                min-width: 0;

                .store-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .store-address,
                .store-phone {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 4px;
                    display: flex;
                    align-items: center;
                    gap: 4px;

                    .icon {
                        font-size: 12px;
                        flex-shrink: 0;
                    }
                }
            }
        }
    }
}

.order-items {
    margin-bottom: 24px;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
    }

    .items-list {
        .order-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }

            .item-name {
                flex: 1;
                font-size: 15px;
                color: #333;
            }

            .item-quantity {
                font-size: 14px;
                color: #999;
                margin: 0 12px;
            }

            .item-price {
                font-size: 15px;
                font-weight: 600;
                color: #ff6b35;
                min-width: 80px;
                text-align: right;
            }
        }
    }
}

.order-summary {
    padding: 16px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 24px;

    .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        &:last-child {
            margin-bottom: 0;
        }

        .label {
            font-size: 14px;
            color: #666;
        }

        .value {
            font-size: 14px;
            color: #333;
            font-weight: 500;

            &.total-amount {
                font-size: 18px;
                font-weight: 600;
                color: #ff6b35;
            }
        }
    }
}

.order-actions {
    .back-btn {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: none;
        background: #ff6b35;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:active {
            background: #e55a2b;
        }
    }
}

/* 提示弹窗 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

.tip-modal {
    background: white;
    border-radius: 12px;
    width: 85%;
    max-width: 400px;
    overflow: hidden;
    animation: slideUp 0.3s ease;

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;

        h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }

        .close-btn {
            width: 28px;
            height: 28px;
            border: none;
            background: #f5f5f5;
            border-radius: 50%;
            font-size: 18px;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;

            &:active {
                background: #e8e8e8;
            }
        }
    }

    .modal-body {
        padding: 24px 20px;

        .tip-content {
            text-align: center;

            .tip-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .tip-text {
                font-size: 16px;
                color: #333;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    .modal-footer {
        padding: 12px 20px 20px;
        border-top: 1px solid #f0f0f0;

        .confirm-btn {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: none;
            background: #ff6b35;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;

            &:active {
                background: #e55a2b;
            }
        }
    }
}

.store-phone {
    cursor: pointer;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &:active {
        opacity: 0.7;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
