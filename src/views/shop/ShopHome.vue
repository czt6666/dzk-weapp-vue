<template>
    <div class="shop-page">
        <!-- Header -->
        <div class="header">
            <el-image :src="avatarUrl" alt="店铺头像" class="avatar" fit="cover" />
            <div class="shop-info">
                <h2 class="shop-name">{{ shop.shopName }}</h2>
                <p class="sub-info">乡村 · {{ shop.village }}</p>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats">
            <div class="stat-item">
                <span class="label">营业状态</span>
                <span class="value" :class="shop.businessStatus === 1 ? 'open' : 'closed'">
                    {{ shop.businessStatus === 1 ? "营业中" : "休息中" }}
                </span>
            </div>
            <div class="stat-item">
                <span class="label">主营类型</span>
                <span class="value">{{ shop.productType }}</span>
            </div>
        </div>

        <!-- Product Section -->
        <div class="products-section">
            <h3 class="section-title">商品</h3>
            <div class="product-list">
                <div v-for="item in products" :key="item.id" class="product-card">
                    <el-image :src="item.img" class="product-img" fit="cover" />
                    <p class="product-name">{{ item.name }}</p>
                    <p class="product-price">￥{{ item.price }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 后端获得的商店数据
const shop = ref({
    id: 5,
    shopName: "苹果店",
    shopAbbreviation: "苹果店",
    productType: "苹果",
    businessStatus: 1,
    village: "田园村",
    shopIntro: "",
    shopAvatar: "90e856ce-6761-41d5-864e-4484b92ac559.png",
    shopAddress: "",
    qualificationFiles: '{"license":[],"industry":[],"property":[],"other":[]}',
    userId: 10016,
    createTime: "2025-11-21T21:38:03",
    updateTime: "2025-11-22T16:39:23",
    displayNo: 0,
});

// 构建头像真实路径
const avatarUrl = `/api/file/${shop.value.shopAvatar}`;

// 商品列表（示例数据）
const products = ref([
    { id: 1, name: "生态苹果礼盒", price: 40, img: "/api/file/apple_box.png" },
    { id: 2, name: "精品红富士", price: 138, img: "/api/file/red_apple.png" },
]);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.shop-page {
    background: $bg-gradient-main;
    padding: $spacing-md;
    font-family: "Noto Sans SC", sans-serif;
}

.header {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-medium;
    box-shadow: $shadow-md;
}

:deep(.avatar) {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid #d39f5a; /* 乡村泥土色 */

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.shop-info {
    margin-left: 12px;
}

.shop-name {
    font-size: 20px;
    font-weight: bold;
    color: $color-green-primary;
}

.sub-info {
    font-size: 14px;
    color: #7b7b7b;
}

.stats {
    display: flex;
    justify-content: space-between;
    margin-top: $spacing-md;
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-medium;
    box-shadow: $shadow-sm;
}

.stat-item {
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.label {
    color: #8a8a8a;
}

.value.open {
    color: $color-green-primary;
    font-weight: bold;
}

.value.closed {
    color: #d9534f;
    font-weight: bold;
}

.products-section {
    margin-top: 20px;
}

.section-title {
    font-size: 18px;
    margin-bottom: 12px;
    font-weight: bold;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.product-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-medium;
    padding: $spacing-md;
    text-align: center;
    box-shadow: $shadow-sm;
    transition: $transition-base;

    &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-md;
    }
}

:deep(.product-img) {
    width: 100%;
    height: 120px;
    border-radius: 8px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.product-name {
    font-size: 14px;
    margin-top: 6px;
}

.product-price {
    color: #d39f5a;
    font-weight: bold;
    margin-top: 4px;
}
</style>
