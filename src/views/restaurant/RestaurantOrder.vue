<template>
    <div class="restaurant-app">
        <!-- 头部店铺信息 -->
        <header class="header">
            <div class="header-top">
                <div class="store-info-brief" @click="showStoreDetail = true">
                    <h1 class="store-name">{{ restaurantInfo?.name || "加载中..." }}</h1>
                    <div class="store-meta" v-if="restaurantInfo">
                        <span class="icon">📍</span>
                        <span class="address">{{ restaurantInfo.address }}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主内容区 - 左右布局 -->
        <main class="main-content">
            <!-- 左侧分类 -->
            <aside class="category-sidebar">
                <div v-if="loading" class="loading">加载中...</div>
                <div v-else-if="categories.length === 0" class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>暂无分类</p>
                </div>
                <div
                    v-else
                    v-for="cat in categories"
                    :key="cat.id"
                    :class="['category-item', { active: activeCategory === cat.id }]"
                    @click="activeCategory = cat.id"
                >
                    <el-image
                        v-if="cat.imageUrl"
                        class="cat-icon"
                        :src="imgUrl(cat.imageUrl)"
                        alt=""
                        fit="cover"
                    />
                    <span v-else class="cat-icon">{{ "🍽️" }}</span>
                    <span class="cat-name">{{ cat.categoryName }}</span>
                </div>
            </aside>

            <!-- 右侧商品列表 -->
            <section class="product-section">
                <div v-if="loading" class="loading-products">
                    <div class="spinner"></div>
                    <p>正在加载美味...</p>
                </div>
                <div v-else-if="categories.length === 0" class="empty-products">
                    <div class="empty-icon">🍽️</div>
                    <p class="empty-text">暂无菜品分类</p>
                    <p class="empty-hint">该店铺暂无菜品</p>
                </div>
                <div v-else-if="currentProducts.length === 0" class="empty-products">
                    <div class="empty-icon">📭</div>
                    <p class="empty-text">该分类暂无菜品</p>
                    <p class="empty-hint">换个分类试试吧</p>
                </div>
                <div v-else class="product-list">
                    <div v-for="item in currentProducts" :key="item.id" class="product-card">
                        <el-image
                            class="product-image"
                            :src="getDishImageUrl(item.coverImgUrl)"
                            :preview-src-list="item.coverImgUrl ? [imgUrl(item.coverImgUrl)] : []"
                            :preview-teleported="true"
                            alt="商品图片"
                            fit="cover"
                        />

                        <div class="product-info">
                            <div class="product-header">
                                <h3 class="product-name">{{ item.dishName }}</h3>
                            </div>
                            <p class="product-desc">{{ item.summary }}</p>

                            <div class="product-footer">
                                <div class="price">
                                    <span class="currency">¥</span>
                                    <span class="amount">{{ item.price }}</span>
                                    <span class="unit">/{{ item.unit }}</span>
                                </div>

                                <div class="quantity-control" v-if="cartStore.cartItems[item.id]">
                                    <button
                                        class="btn-minus"
                                        @click="cartStore.removeItem(item.id)"
                                    >
                                        −
                                    </button>
                                    <span class="quantity">{{
                                        cartStore.cartItems[item.id]?.quantity || 0
                                    }}</span>
                                    <button class="btn-plus" @click="cartStore.addItem(item)">
                                        +
                                    </button>
                                </div>
                                <button v-else class="btn-add" @click="cartStore.addItem(item)">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- 底部购物车 -->
        <footer class="cart-footer">
            <div class="cart-bar">
                <button class="cart-icon-btn" @click="showCart = true">
                    <div class="cart-icon">🛒</div>
                    <span v-if="cartStore.totalItems > 0" class="cart-badge">
                        {{ cartStore.totalItems }}
                    </span>
                </button>

                <div class="cart-info">
                    <div class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</div>
                </div>

                <!-- <button
                    class="checkout-btn"
                    :disabled="cartStore.totalItems === 0"
                    @click="handleCheckout"
                >
                    去下单
                </button> -->
            </div>
        </footer>

        <!-- 购物车详情弹窗 -->
        <div v-if="showCart" class="modal-overlay" @click="showCart = false">
            <div class="cart-modal" @click.stop>
                <div class="modal-header">
                    <h3>购物车</h3>
                    <button class="close-btn" @click="showCart = false">✕</button>
                </div>

                <div class="modal-body">
                    <div v-if="cartStore.cartList.length === 0" class="empty-state">
                        <div class="empty-icon">🛒</div>
                        <p>购物车是空的</p>
                    </div>

                    <div v-else class="cart-items">
                        <div v-for="item in cartStore.cartList" :key="item.id" class="cart-item">
                            <div class="item-image">
                                <el-image :src="getDishImageUrl(item.coverImgUrl)" alt="商品图片" />
                            </div>
                            <div class="item-info">
                                <div class="item-name">{{ item.dishName }}</div>
                                <div class="item-price">¥{{ item.price }}</div>
                            </div>
                            <div class="item-control">
                                <button class="ctrl-btn" @click="cartStore.removeItem(item.id)">
                                    −
                                </button>
                                <span class="item-quantity">{{ item.quantity }}</span>
                                <button class="ctrl-btn plus" @click="cartStore.addItem(item)">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="clear-btn" @click="cartStore.clearCart">清空购物车</button>
                </div>
            </div>
        </div>

        <!-- 店铺详情弹窗 -->
        <div v-if="showStoreDetail" class="modal-overlay" @click="showStoreDetail = false">
            <div class="store-detail-modal" @click.stop>
                <div class="modal-header">
                    <h3>店铺信息</h3>
                    <button class="close-btn" @click="showStoreDetail = false">✕</button>
                </div>

                <div class="modal-body" v-if="restaurantInfo">
                    <div class="store-images">
                        <el-image
                            :src="imgUrl(restaurantInfo.logoUrl)"
                            :preview-src-list="[imgUrl(restaurantInfo.logoUrl)]"
                            :preview-teleported="true"
                            fit="cover"
                            alt="店铺logo"
                            class="store-img"
                            style="cursor: pointer"
                        />
                    </div>

                    <div class="store-detail-section">
                        <h3 class="store-detail-name">{{ restaurantInfo.name }}</h3>
                    </div>

                    <div class="store-detail-section">
                        <div
                            class="detail-item address-item"
                            v-if="restaurantInfo.coordinateLng && restaurantInfo.coordinateLat"
                            @click="goToMap"
                        >
                            <span class="label">📍 地址</span>
                            <span class="value">{{ restaurantInfo.address }}</span>
                            <ActionArrow />
                        </div>
                        <div v-else class="detail-item">
                            <span class="label">📍 地址</span>
                            <span class="value">{{ restaurantInfo.address }}</span>
                        </div>
                        <div
                            class="detail-item phone-item"
                            @click="handlePhoneClick"
                            v-if="restaurantInfo.phone"
                        >
                            <span class="label">📞 电话</span>
                            <span class="value">{{ restaurantInfo.phone }}</span>
                            <ActionArrow />
                        </div>
                        <div class="detail-item">
                            <span class="label">🕐 营业时间</span>
                            <span class="value"
                                >{{ restaurantInfo.businessStartTime }} -
                                {{ restaurantInfo.businessEndTime }}</span
                            >
                        </div>
                    </div>

                    <div class="store-detail-section">
                        <h4>店铺介绍</h4>
                        <p class="store-description">{{ restaurantInfo.notice || "暂无介绍" }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="RestaurantOrder">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useCartStore } from "@/stores/orderCart";
import { useUserStore } from "@/stores/user";
import {
    getRestaurantDetail,
    getCategoryList,
    getDishList,
    createOrder,
    type IRestaurantInfo,
    type IDishCategory,
    type IDishItem,
} from "@/apis/restaurant";
import { imgUrl } from "@/utils";
import { showPhoneModal } from "@/utils/phoneModal";
import ActionArrow from "@/components/base/ActionArrow.vue";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const activeCategory = ref<number>(0);
const showCart = ref(false);
const showStoreDetail = ref(false);
const loading = ref(true);
const submitting = ref(false);

const restaurantInfo = ref<IRestaurantInfo | null>(null);
const categories = ref<IDishCategory[]>([]);
const menuItems = ref<IDishItem[]>([]);

const restaurantName = computed(() => {
    return route.query.name as string;
});

const restaurantId = computed(() => {
    return Number(route.query.id);
});

const currentProducts = computed(() => {
    return menuItems.value.filter((item) => item.categoryId === activeCategory.value);
});

// 菜品默认图（无图时使用）
const DISH_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="%23f5f0eb"/><text x="50%" y="45%" text-anchor="middle" fill="%23c4b5a8" font-size="24">暂无</text><text x="50%" y="62%" text-anchor="middle" fill="%23c4b5a8" font-size="24">照片</text></svg>`;

function getDishImageUrl(coverImgUrl: string | null | undefined): string {
    const url = imgUrl(coverImgUrl);
    return url || DISH_PLACEHOLDER;
}

// 跳转到地图页面
function goToMap() {
    if (restaurantInfo.value?.coordinateLng && restaurantInfo.value?.coordinateLat) {
        router.push({
            name: "Map",
            query: {
                lng: restaurantInfo.value.coordinateLng.toString(),
                lat: restaurantInfo.value.coordinateLat.toString(),
                name: restaurantInfo.value.name,
                address: restaurantInfo.value.address,
                phone: restaurantInfo.value.phone || "",
            },
        });
    }
}

// 处理电话号码点击
function handlePhoneClick() {
    if (restaurantInfo.value?.phone) {
        showPhoneModal(restaurantInfo.value.phone);
    }
}

// 处理下单
async function handleCheckout() {
    if (cartStore.totalItems === 0) {
        ElMessage.warning("购物车是空的");
        return;
    }

    // userId 相关功能已注释
    const userId = userStore.userInfo?.userId;
    if (!userId) {
        ElMessage.error("请先登录");
        router.push({ name: "MyPage" });
        return;
    }

    // 检查餐厅信息
    if (!restaurantInfo.value?.id) {
        ElMessage.error("餐厅信息错误");
        return;
    }

    try {
        submitting.value = true;

        // 构建下单参数：将购物车数据转换为 dishIds 和 quantities 数组
        const dishIds: number[] = [];
        const quantities: number[] = [];

        cartStore.cartList.forEach((item) => {
            dishIds.push(item.id);
            quantities.push(item.quantity);
        });

        const res = await createOrder({
            dishIds,
            quantities,
            restaurantId: restaurantInfo.value.id,
            remark: "", // 备注，可以后续添加输入框让用户填写
        });

        if (res.data) {
            ElMessage.success("下单成功");
            // 清空购物车
            cartStore.clearCart();
            // 跳转到订单页面，传递订单id
            router.push({
                name: "OrderDetail",
                query: {
                    orderId: res.data,
                },
            });
        } else {
            ElMessage.error("下单失败，请重试");
        }
    } catch (error: any) {
        console.error("下单失败:", error);
        ElMessage.error(error?.response?.data?.message || error?.msg || "下单失败，请重试");
    } finally {
        submitting.value = false;
    }
}

onMounted(async () => {
    try {
        loading.value = true;
        const [info, cats, items] = await Promise.all([
            getRestaurantDetail({ id: restaurantId.value }),
            getCategoryList({ restaurantName: restaurantName.value }),
            getDishList({ restaurantName: restaurantName.value }),
        ]);

        restaurantInfo.value = info.data;
        categories.value = cats.data?.records ?? [];
        menuItems.value = items.data?.records ?? [];

        activeCategory.value = categories.value[0]?.id || 0;
    } catch (error) {
        console.error("加载数据失败:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss">
@use "@/styles/variables.scss" as *;

.restaurant-app {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $bg-gradient-main;

    .header {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: $shadow-md;
        position: sticky;
        top: 0;
        z-index: 100;

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: $spacing-sm $spacing-md;

            .store-info-brief {
                flex: 1;
                cursor: pointer;

                .store-name {
                    font-size: 17px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }

                .store-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #999;

                    .icon {
                        font-size: 13px;
                    }

                    .address {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .distance {
                        color: #ff6b35;
                        font-weight: 500;
                    }
                }
            }

            .service-tabs {
                display: flex;
                gap: 6px;

                .tab-btn {
                    padding: 4px 12px;
                    border-radius: 4px;
                    border: 1px solid #ff6b35;
                    background: white;
                    color: #ff6b35;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;

                    &.active {
                        background: $color-green-primary;
                        color: white;
                    }
                }
            }
        }
    }

    .main-content {
        display: flex;
        flex: 1 1 0;
        min-height: 0; /* 允许 flex 子项收缩，使 overflow 生效 */
        margin-bottom: 61px;

        .category-sidebar {
            width: 90px;
            flex-shrink: 0;
            min-height: 0;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            border-right: 1px solid rgba(0, 0, 0, 0.1);

            .loading {
                padding: $spacing-md;
                text-align: center;
                color: #999;
                font-size: 13px;
            }

            .empty-state {
                padding: $spacing-xl $spacing-lg;
                text-align: center;
                color: #999;

                .empty-icon {
                    font-size: 36px;
                    margin-bottom: 8px;
                    opacity: 0.5;
                }

                p {
                    margin: 0;
                    font-size: 12px;
                }
            }

            .category-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: $spacing-md $spacing-sm;
                cursor: pointer;
                transition: all 0.2s;
                border-left: 3px solid transparent;

                .cat-icon {
                    width: 32px;
                    height: 32px;
                    font-size: 24px;
                    margin-bottom: 4px;

                    :deep(img) {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .cat-name {
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                &.active {
                    background: rgba(255, 255, 255, 0.9);
                    border-left-color: $color-green-primary;

                    .cat-name {
                        color: $color-green-primary;
                        font-weight: 600;
                    }
                }

                &:active:not(.active) {
                    background: #f0f0f0;
                }
            }
        }

        .product-section {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);

            .loading-products {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
                color: #999;

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f0f0f0;
                    border-top-color: #ff6b35;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 12px;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            }

            .empty-products {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: $spacing-xxl $spacing-md;
                color: #999;
                text-align: center;

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                    opacity: 0.4;
                }

                .empty-text {
                    font-size: 15px;
                    font-weight: 500;
                    color: #666;
                    margin: 0 0 6px 0;
                }

                .empty-hint {
                    font-size: 13px;
                    margin: 0;
                    color: #aaa;
                }
            }

            .product-list {
                padding: $spacing-md;

                .product-card {
                    display: flex;
                    gap: 12px;
                    padding: $spacing-md;
                    border-bottom: 1px solid #f0f0f0;

                    &:active {
                        background: #fafafa;
                    }

                    .product-image {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #fff5f0, #ffe8dc);
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                        flex-shrink: 0;

                        :deep(.el-image) {
                            width: 100%;
                            height: 100%;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 4px;
                            }
                        }
                    }

                    .product-info {
                        flex: 1;
                        display: flex;
                        flex-direction: column;

                        .product-header {
                            display: flex;
                            align-items: flex-start;
                            gap: 8px;
                            margin-bottom: 4px;

                            .product-name {
                                font-size: 15px;
                                font-weight: 600;
                                color: #333;
                                flex: 1;
                            }
                        }

                        .product-desc {
                            font-size: 12px;
                            color: #999;
                            margin-bottom: 4px;
                            line-height: 1.3;
                        }

                        .product-footer {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: auto;

                            .price {
                                color: #ff6b35;
                                font-weight: 600;

                                .currency {
                                    font-size: 12px;
                                }

                                .amount {
                                    font-size: 18px;
                                }

                                .unit {
                                    font-size: 12px;
                                    color: #999;
                                    margin-left: 2px;
                                }
                            }

                            .quantity-control {
                                display: flex;
                                align-items: center;
                                gap: 10px;

                                button {
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    border: 1px solid #ddd;
                                    background: white;
                                    font-size: 16px;
                                    line-height: 1;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    padding: 0;

                                    &.btn-minus {
                                        color: #ff6b35;

                                        &:active {
                                            border-color: #ff6b35;
                                            background: #fff5f0;
                                        }
                                    }

                                    &.btn-plus {
                                        background: #ff6b35;
                                        border-color: #ff6b35;
                                        color: white;

                                        &:active {
                                            background: #ff5722;
                                        }
                                    }
                                }

                                .quantity {
                                    font-weight: 600;
                                    color: #333;
                                    min-width: 24px;
                                    text-align: center;
                                }
                            }

                            .btn-add {
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                border: none;
                                background: #ff6b35;
                                color: white;
                                font-size: 16px;
                                line-height: 1;
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 0;

                                &:active {
                                    background: #ff5722;
                                    transform: scale(0.95);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .cart-footer {
        position: absolute;
        padding: $spacing-md 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e8e8e8;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        z-index: 99;

        .cart-bar {
            display: flex;
            align-items: center;
            padding: $spacing-sm $spacing-md;
            gap: 12px;

            .cart-icon-btn {
                position: relative;
                border: none;
                background: transparent;
                cursor: pointer;
                padding: 0;

                .cart-icon {
                    width: 44px;
                    height: 44px;
                    background: #ff6b35;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
                }

                .cart-badge {
                    position: absolute;
                    top: -1px;
                    right: -4px;
                    min-width: 18px;
                    height: 18px;
                    background: #f44336;
                    color: white;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1;
                    padding: 0;
                }
            }

            .cart-info {
                flex: 1;

                .total-price {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 2px;
                }

                .start-price {
                    font-size: 11px;
                    color: #999;
                }
            }

            .checkout-btn {
                padding: $spacing-sm $spacing-xxl;
                border-radius: 20px;
                border: none;
                background: #ff6b35;
                color: white;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;

                &:active:not(:disabled) {
                    background: #ff5722;
                }

                &:disabled {
                    background: #ddd;
                    cursor: not-allowed;
                }
            }
        }
    }

    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 200;
        display: flex;
        align-items: flex-end;
        animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .cart-modal,
    .store-detail-modal {
        background: white;
        width: 100%;
        border-radius: 12px 12px 0 0;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s;

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: $spacing-md;
            border-bottom: 1px solid #f0f0f0;

            > h3 {
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }

            .close-btn {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: none;
                background: #f5f5f5;
                color: #666;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;

                &:active {
                    background: #e8e8e8;
                }
            }
        }

        .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: $spacing-md;

            .empty-state {
                text-align: center;
                padding: $spacing-xl 0;
                color: #999;

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                    opacity: 0.3;
                }

                p {
                    font-size: 14px;
                }
            }

            .cart-items {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: $spacing-md;
                    background: #fafafa;
                    border-radius: 6px;

                    .item-image {
                        width: 60px;
                        height: 60px;
                        flex-shrink: 0;
                        border-radius: 6px;
                        overflow: hidden;

                        :deep(.el-image) {
                            width: 100%;
                            height: 100%;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                max-width: 60px;
                                max-height: 60px;
                            }
                        }
                    }

                    .item-info {
                        flex: 1;

                        .item-name {
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 4px;
                            color: #333;
                        }

                        .item-price {
                            color: #ff6b35;
                            font-weight: 600;
                            font-size: 14px;
                        }
                    }

                    .item-control {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .ctrl-btn {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 1px solid #ddd;
                            background: white;
                            font-size: 14px;
                            cursor: pointer;
                            color: #ff6b35;

                            &.plus {
                                background: #ff6b35;
                                border-color: #ff6b35;
                                color: white;
                            }
                        }

                        .item-quantity {
                            font-weight: 600;
                            min-width: 24px;
                            text-align: center;
                            font-size: 14px;
                        }
                    }
                }
            }
        }

        .modal-footer {
            padding: $spacing-sm $spacing-md;
            border-top: 1px solid #f0f0f0;

            .clear-btn {
                width: 100%;
                padding: $spacing-md;
                border-radius: 6px;
                border: none;
                background: #f5f5f5;
                color: #666;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;

                &:active {
                    background: #e8e8e8;
                }
            }
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    .store-detail-modal {
        max-height: 80vh;

        .modal-header .close-btn {
            color: #333;
        }

        .modal-body {
            .store-images {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
                overflow-x: auto;

                .store-img {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #fff5f0, #ffe8dc);
                    border-radius: 6px;
                    flex-shrink: 0;
                }
            }

            .store-detail-section {
                margin-bottom: 20px;

                .store-detail-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                h4 {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .detail-item {
                    display: flex;
                    padding: $spacing-sm 0;
                    border-bottom: 1px solid #f5f5f5;
                    font-size: 14px;

                    &:last-child {
                        border-bottom: none;
                    }

                    &.address-item {
                        cursor: pointer;
                        transition: background-color 0.2s;
                        border-radius: 6px;
                        padding: 8px;
                        margin: -8px;
                        align-items: center;

                        &:active {
                            background-color: #f5f5f5;
                        }
                    }

                    .label {
                        width: 100px;
                        color: #666;
                        flex-shrink: 0;
                    }

                    .value {
                        flex: 1;
                        color: #333;
                    }

                    &.address-item,
                    &.phone-item {
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                        padding: 8px;
                        margin: -8px;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;

                        &:active {
                            background-color: #f5f5f5;
                        }

                        &:active :deep(.action-arrow) {
                            transform: translateX(2px);
                        }
                    }
                }

                .store-description {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #666;
                    white-space: pre-line;
                }

                .map-wrapper {
                    width: 100%;
                    height: 220px;
                    margin-top: 12px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}
</style>

<style lang="scss">
// 移动端图片预览器样式修复
.el-image-viewer__wrapper {
    .el-image-viewer__mask {
        background-color: rgba(0, 0, 0, 0.8) !important;
    }

    .el-image-viewer__canvas {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;

        img {
            max-width: 100vw;
            max-height: 100vh;
            width: auto;
            height: auto;
            object-fit: contain;
        }
    }

    .el-image-viewer__actions {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        padding: 8px 16px;

        .el-image-viewer__actions__inner {
            display: flex;
            gap: 20px;
        }
    }

    .el-image-viewer__close {
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
