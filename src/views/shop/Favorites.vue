<template>
    <div class="favorites-page">
        <header class="header">
            <h1>我的收藏夹</h1>
            <p class="sub">收藏的宝贝都在这里啦～</p>
        </header>

        <!-- 收藏列表 -->
        <section v-if="favorite.list.length" class="favorites-grid">
            <div v-for="item in favorite.list" :key="item.id" class="favorite-card">
                <div class="thumb" @click="goDetail(item)">
                    <img :src="imgUrl(item.previewImage)" alt="商品图片" />
                </div>
                <div class="info">
                    <h3>{{ item.title }}</h3>
                    <p class="desc">{{ item.intro }}</p>
                    <p class="specs">规格：{{ item.specs }}</p>
                    <p class="price">¥{{ item.price }}</p>
                </div>
                <div class="actions">
                    <button class="buy" @click.stop="openLink(item.link)">去购买</button>
                    <button class="remove" @click.stop="remove(item.skuId)">取消收藏</button>
                </div>
            </div>
        </section>

        <!-- 空状态 -->
        <div v-else class="empty">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png" />
            <p>还没有收藏任何商品~</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useShopFavoriteStore } from "@/stores/shopFavorite";
import { useRouter } from "vue-router";
import { imgUrl } from "@/utils";

const favorite = useShopFavoriteStore();
const router = useRouter();

// 页面挂载时获取收藏列表
onMounted(() => {
    favorite.fetchFavorites();
});

// 取消收藏
function remove(skuId: number) {
    if (confirm("确定要取消收藏吗？")) {
        favorite.remove(skuId);
    }
}

// 打开购买链接
function openLink(link: string) {
    window.open(link, "_blank");
}

// 跳转商品详情
function goDetail(item: any) {
    router.push(`/shop/detail/${item.spuId || item.id}`);
}
</script>

<style scoped>
.favorites-page {
    overflow-y: auto;
    height: 100%;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.header h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
}

.header .sub {
    color: #888;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
}

.favorite-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
}

.favorite-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.thumb {
    position: relative;
    width: 100%;
    padding-top: 70%;
    overflow: hidden;
    cursor: pointer;
}

.thumb img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.thumb:hover img {
    transform: scale(1.05);
}

.info {
    padding: 1rem;
    flex-grow: 1;
}

.info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    color: #333;
}

.info .desc {
    font-size: 0.9rem;
    color: #777;
    height: 2.6em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 0.4rem;
}

.info .specs {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.4rem;
}

.info .price {
    font-weight: bold;
    color: #42b983;
    font-size: 1rem;
}

.actions {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 1rem 1rem;
}

button {
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s;
}

button.buy {
    background-color: #42b983;
    color: #fff;
}

button.buy:hover {
    background-color: #38a06d;
}

button.remove {
    background-color: #f5f5f5;
    color: #555;
}

button.remove:hover {
    background-color: #ffefef;
    color: #e53935;
}

.empty {
    text-align: center;
    padding: 5rem 0;
    color: #888;
}

.empty img {
    width: 150px;
    opacity: 0.7;
    margin-bottom: 1rem;
}
</style>
