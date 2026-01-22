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
                    <el-image :src="imgUrl(item.previewImage)" alt="商品图片" fit="cover" />
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
            <div class="empty-icon">
                <img :src="emptyFavoriteIcon" alt="空收藏夹" />
            </div>
            <p class="empty-text">还没有收藏任何商品~</p>
            <p class="empty-hint">快去收藏你喜欢的商品吧</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useShopFavoriteStore } from "@/stores/shopFavorite";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { imgUrl } from "@/utils";
import emptyFavoriteIcon from "@/assets/svg/empty-favorite.svg";

const favorite = useShopFavoriteStore();
const router = useRouter();

// 页面挂载时获取收藏列表
onMounted(() => {
    favorite.fetchFavorites();
});

// 取消收藏
async function remove(skuId: number) {
    try {
        await ElMessageBox.confirm("确定要取消收藏吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        });
        favorite.remove(skuId);
    } catch {
        // 用户取消操作
    }
}

// 打开购买链接
function openLink(link: string) {
    window.open(link, "_blank");
}

// 跳转商品详情
function goDetail(item: any) {
    router.push({ name: "ShopInfo", params: { id: item.spuId || item.id } });
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
@use "sass:color";

.favorites-page {
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

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: $spacing-md;
}

.favorite-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-large;
    box-shadow: $shadow-md;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: $transition-base;
}

.favorite-card:active {
    opacity: 0.8;
}

.thumb {
    position: relative;
    width: 100%;
    padding-top: 70%;
    overflow: hidden;
    cursor: pointer;
}

.thumb :deep(.el-image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
}


.info {
    padding: $spacing-md;
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
    color: $color-green-primary;
    font-size: 1rem;
}

.actions {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm $spacing-md $spacing-md;
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
    background-color: $color-green-primary;
    color: #fff;
}

button.buy:active {
    background-color: color.adjust($color-green-primary, $lightness: -10%);
}

button.remove {
    background-color: #f5f5f5;
    color: #555;
}

button.remove:active {
    background-color: #ffefef;
    color: #e53935;
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

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
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
