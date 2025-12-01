<template>
    <div class="cart-page">
        <h1>🛒 我的购物车</h1>

        <div v-if="cart.list.length === 0" class="empty">购物车是空的</div>

        <div v-else class="cart-list">
            <div
                v-for="item in cart.list"
                :key="item.productId + '-' + item.specId"
                class="cart-item"
            >
                <img :src="item.image" class="thumb" />
                <div class="info">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.specName }} · ¥{{ item.price }}</p>
                    <div class="controls">
                        <button @click="item.quantity--" :disabled="item.quantity <= 1">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="item.quantity++">+</button>
                        <button class="remove" @click="cart.remove(item.productId, item.specId)">
                            删除
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <footer v-if="cart.list.length > 0">
            <p>共 {{ cart.list.length - 1 }} 件，总计 ¥{{ cart.totalPrice.toFixed(2) }}</p>
            <button class="checkout">去结算</button>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useShopFavoriteStore } from "@/stores/shopFavorite";
const cart = useShopFavoriteStore();
</script>

<style scoped>
.cart-page {
    padding: 1rem;
}
.cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}
.thumb {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
}
.info {
    flex: 1;
    margin-left: 1rem;
}
.controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.controls button {
    padding: 0.3rem 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
}
.remove {
    color: red;
    border: none;
    background: none;
}
footer {
    text-align: right;
    border-top: 1px solid #eee;
    padding-top: 1rem;
    margin-top: 1rem;
}
.checkout {
    background: #42b983;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
}
</style>
