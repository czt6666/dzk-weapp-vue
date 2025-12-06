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
                        <span class="distance">{{ restaurantInfo.distance }}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主内容区 - 左右布局 -->
        <main class="main-content">
            <!-- 左侧分类 -->
            <aside class="category-sidebar">
                <div v-if="loading" class="loading">加载中...</div>
                <div
                    v-for="cat in categories"
                    :key="cat.id"
                    :class="['category-item', { active: activeCategory === cat.id }]"
                    @click="activeCategory = cat.id"
                >
                    <span class="cat-icon">{{ cat.icon }}</span>
                    <span class="cat-name">{{ cat.name }}</span>
                </div>
            </aside>

            <!-- 右侧商品列表 -->
            <section class="product-section">
                <div v-if="loading" class="loading-products">
                    <div class="spinner"></div>
                    <p>正在加载美味...</p>
                </div>
                <div v-else class="product-list">
                    <div v-for="item in currentProducts" :key="item.id" class="product-card">
                        <div class="product-image">{{ item.image }}</div>

                        <div class="product-info">
                            <div class="product-header">
                                <h3 class="product-name">{{ item.name }}</h3>
                                <span v-if="item.tag" class="product-tag">{{ item.tag }}</span>
                            </div>

                            <p class="product-desc">{{ item.description }}</p>

                            <div class="product-meta">
                                <span class="sales" v-if="item.sales">月售{{ item.sales }}</span>
                            </div>

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
                    <div class="start-price">另需配送费￥5</div>
                </div>

                <button class="checkout-btn" :disabled="cartStore.totalItems === 0">去结算</button>
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
                            <div class="item-image">{{ item.image }}</div>
                            <div class="item-info">
                                <div class="item-name">{{ item.name }}</div>
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
                        <div
                            v-for="(img, idx) in restaurantInfo.images"
                            :key="idx"
                            class="store-img"
                        >
                            {{ img }}
                        </div>
                    </div>

                    <div class="store-detail-section">
                        <h2 class="store-detail-name">{{ restaurantInfo.name }}</h2>
                        <div class="store-rating">
                            <span class="rating-score">⭐ {{ restaurantInfo.rating }}</span>
                            <span class="rating-text">综合评分</span>
                        </div>
                    </div>

                    <div class="store-tags">
                        <span v-for="tag in restaurantInfo.tags" :key="tag" class="tag">{{
                            tag
                        }}</span>
                    </div>

                    <div class="store-detail-section">
                        <div class="detail-item">
                            <span class="label">📍 地址</span>
                            <span class="value">{{ restaurantInfo.address }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">📞 电话</span>
                            <span class="value">{{ restaurantInfo.phone }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">🕐 营业时间</span>
                            <span class="value">{{ restaurantInfo.hours }}</span>
                        </div>
                    </div>

                    <div class="store-detail-section">
                        <h4>店铺介绍</h4>
                        <p class="store-description">{{ restaurantInfo.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/stores/orderCart";
import {
    fetchRestaurantInfo,
    fetchCategories,
    fetchMenuItems,
    type RestaurantInfo,
    type Category,
    type MenuItem,
} from "@/apis/restaurant";

const cartStore = useCartStore();
const activeCategory = ref("member");
const showCart = ref(false);
const showStoreDetail = ref(false);
const loading = ref(true);

const restaurantInfo = ref<RestaurantInfo | null>(null);
const categories = ref<Category[]>([]);
const menuItems = ref<MenuItem[]>([]);

const currentProducts = computed(() => {
    return menuItems.value.filter((item) => item.categoryId === activeCategory.value);
});

onMounted(async () => {
    try {
        loading.value = true;
        const [info, cats, items] = await Promise.all([
            fetchRestaurantInfo(),
            fetchCategories(),
            fetchMenuItems(),
        ]);

        restaurantInfo.value = info;
        categories.value = cats;
        menuItems.value = items;
    } catch (error) {
        console.error("加载数据失败:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
    -webkit-font-smoothing: antialiased;
}

.restaurant-app {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 60px;

    .header {
        background: white;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        position: sticky;
        top: 0;
        z-index: 100;

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;

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
                        background: #ff6b35;
                        color: white;
                    }
                }
            }
        }
    }

    .main-content {
        display: flex;
        height: calc(100vh - 110px);

        .category-sidebar {
            width: 90px;
            background: #f8f8f8;
            overflow-y: auto;
            border-right: 1px solid #e8e8e8;

            .loading {
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 13px;
            }

            .category-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px 8px;
                cursor: pointer;
                transition: all 0.2s;
                border-left: 3px solid transparent;

                .cat-icon {
                    font-size: 24px;
                    margin-bottom: 4px;
                }

                .cat-name {
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                &.active {
                    background: white;
                    border-left-color: #ff6b35;

                    .cat-name {
                        color: #ff6b35;
                        font-weight: 600;
                    }
                }

                &:hover:not(.active) {
                    background: #f0f0f0;
                }
            }
        }

        .product-section {
            flex: 1;
            overflow-y: auto;
            background: white;

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

            .product-list {
                padding: 12px;

                .product-card {
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    border-bottom: 1px solid #f0f0f0;

                    &:hover {
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

                            .product-tag {
                                padding: 2px 6px;
                                background: linear-gradient(135deg, #ffd700, #ff8c00);
                                color: white;
                                font-size: 11px;
                                border-radius: 2px;
                                white-space: nowrap;
                            }
                        }

                        .product-desc {
                            font-size: 12px;
                            color: #999;
                            margin-bottom: 4px;
                            line-height: 1.3;
                        }

                        .product-meta {
                            margin-bottom: 8px;

                            .sales {
                                font-size: 11px;
                                color: #999;
                            }
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
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;

                                    &.btn-minus {
                                        color: #ff6b35;

                                        &:hover {
                                            border-color: #ff6b35;
                                            background: #fff5f0;
                                        }
                                    }

                                    &.btn-plus {
                                        background: #ff6b35;
                                        border-color: #ff6b35;
                                        color: white;

                                        &:hover {
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
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                border: none;
                                background: #ff6b35;
                                color: white;
                                font-size: 18px;
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                &:hover {
                                    background: #ff5722;
                                    transform: scale(1.05);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .cart-footer {
        position: fixed;
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
            padding: 10px 16px;
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
                    top: -4px;
                    right: -4px;
                    min-width: 18px;
                    height: 18px;
                    padding: 0 4px;
                    background: #f44336;
                    color: white;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
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
                padding: 10px 24px;
                border-radius: 20px;
                border: none;
                background: #ff6b35;
                color: white;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;

                &:hover:not(:disabled) {
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
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;

            h3 {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }

            .close-btn {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: none;
                background: #f5f5f5;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background: #e8e8e8;
                }
            }
        }

        .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;

            .empty-state {
                text-align: center;
                padding: 40px 0;
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
                    padding: 12px;
                    background: #fafafa;
                    border-radius: 6px;

                    .item-image {
                        font-size: 32px;
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
            padding: 12px 16px;
            border-top: 1px solid #f0f0f0;

            .clear-btn {
                width: 100%;
                padding: 10px;
                border-radius: 6px;
                border: none;
                background: #f5f5f5;
                color: #666;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;

                &:hover {
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    flex-shrink: 0;
                }
            }

            .store-detail-section {
                margin-bottom: 20px;

                .store-detail-name {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .store-rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;

                    .rating-score {
                        font-size: 16px;
                        font-weight: 600;
                        color: #ff9800;
                    }

                    .rating-text {
                        font-size: 13px;
                        color: #999;
                    }
                }

                h4 {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .detail-item {
                    display: flex;
                    padding: 10px 0;
                    border-bottom: 1px solid #f5f5f5;
                    font-size: 14px;

                    &:last-child {
                        border-bottom: none;
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
                }

                .store-description {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #666;
                }
            }

            .store-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;

                .tag {
                    padding: 4px 10px;
                    background: #fff5f0;
                    color: #ff6b35;
                    font-size: 12px;
                    border-radius: 12px;
                    border: 1px solid #ffe8dc;
                }
            }
        }
    }
}
</style>
