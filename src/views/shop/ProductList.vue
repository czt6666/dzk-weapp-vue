<template>
    <section class="shop-list">
        <header class="hero">
            <h1>乡村好物 · 精选</h1>
            <p class="sub">天然 / 朴实 / 精选来自乡间的手作与农产</p>

            <!-- 搜索框 -->
            <div class="controls">
                <SearchInput
                    v-model="keyword"
                    placeholder="搜索商品名称..."
                    @handleSearch="handleSearch"
                    @handleReset="handleReset"
                />
            </div>
        </header>

        <!-- 商品列表 -->
        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id">
                        <ProductCard
                            :item="item"
                            @open="openProduct"
                            @favorite="toggleFavorite(item.id, $event)"
                        />
                    </li>
                </ul>
            </SmartScrollList>
        </div>
        <!-- 底部购物车图标 -->
        <div class="cart-float" @click="goFavorites">
            <span>⭐</span>
            <span class="cart-count">{{ favorite.list.length }}</span>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/listitem/ProductCard.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import type { IProduct } from "@/views/shop/types";
import { getProductList } from "@/apis/shop";
import { debounce } from "@/utils/index";
import { ElMessage } from "element-plus";
import { useShopFavoriteStore } from "@/stores/shopFavorite";
import SearchInput from "@/components/input/SearchInput.vue";
import { createCollect, deleteCollect } from "@/apis/collect";

let page = 1;
const pageSize = 10;
const keyword = ref("");
const list = ref<IProduct[]>([]);
const favorite = useShopFavoriteStore();
const router = useRouter();

async function fetchData(page: number, pageSize: number, keyword: string) {
    try {
        const res = await getProductList({ page, pageRow: pageSize, title: keyword });

        if (list.value.length + res.data.records.length > res.data.total) {
            return [];
        }
        const resList = res?.data?.records || [];

        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取商品列表失败");
        return [];
    }
}

async function handleSearch() {
    page = 1;
    list.value = [];
    list.value = await fetchData(page, pageSize, keyword.value);
    if (!list.value.length) ElMessage.warning("没有找到相关商品");
}

async function handleReset() {
    keyword.value = "";
    onRefresh();
}

async function onRefresh() {
    try {
        page = 1;
        list.value = [];
        list.value = await fetchData(page, pageSize, keyword.value);
        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取商品列表失败");
        return list.value;
    }
}

async function onLoadMore() {
    try {
        page++;
        const newList = await fetchData(page, pageSize, keyword.value);
        if (!newList.length) {
            ElMessage.success("没有更多数据了");
            page--;
            return list.value;
        }
        list.value.push(...newList);
        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg);
        page--;
        return list.value;
    }
}

function openProduct(item: IProduct) {
    router.push(`/shop/${item.id}`);
}

function goFavorites() {
    router.push("/shop/favorites");
}

async function toggleFavorite(id: number, isFavorite: boolean) {
    if (isFavorite) {
        createCollect({ userId: 1, targetId: id, targetType: "product" });
    } else {
        deleteCollect({ userId: 1, targetId: id, targetType: "product" });
    }
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.shop-list {
    padding-top: $spacing-md;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $bg-gradient-main;
}

.hero {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
    padding: 0 $spacing-md;

    h1 {
        color: $color-green-primary;
        font-weight: bold;
        font-size: 22px;
    }

    .sub {
        color: $text-secondary;
        font-size: 14px;
        margin-bottom: $spacing-sm;
    }

    .controls {
        display: flex;
        gap: $spacing-sm;
        align-items: center;
    }

    .btn.primary {
        background: $color-green-primary;
        color: #fff;
        border: none;
        border-radius: 24px;
        padding: 6px $spacing-lg;
        cursor: pointer;
        transition: $transition-fast;

        &:hover {
            background: darken($color-green-primary, 10%);
        }
    }
}

.list {
    flex: 1;
    height: 500px;
    padding: $spacing-md 0 0;

    .scroll-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog {
    background: #fff;
    padding: $spacing-lg;
    border-radius: $radius-small;
    max-width: 900px;
    width: 90%;
    max-height: 90%;
    overflow: auto;
    box-shadow: $shadow-xl;
}

.images {
    display: flex;
    gap: $spacing-sm;
    img {
        max-width: 220px;
        border-radius: $radius-small;
    }
}

.primary {
    background: $color-green-primary;
    color: #fff;
}

.cart-float {
    position: absolute;
    bottom: $spacing-xxl;
    right: $spacing-xxl;
    width: 48px;
    height: 48px;
    border-radius: $radius-round;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background-color: #fff;
    box-shadow: $shadow-md;
    z-index: 1000;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
        transform: scale(1.1);
        box-shadow: $shadow-lg;
    }

    .cart-count {
        position: absolute;
        top: -2px;
        right: -4px;
        background: $color-red-primary;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 12px;
    }
}
</style>
