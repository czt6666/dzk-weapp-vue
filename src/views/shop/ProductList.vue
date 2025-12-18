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
const pageSize = 6;
const keyword = ref("");
const list = ref<IProduct[]>([]);
const favorite = useShopFavoriteStore();
const router = useRouter();

async function fetchData(page: number, pageSize: number, keyword: string) {
    try {
        const res = await getProductList({ page, pageSize, title: keyword });

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
        createCollect({ userId: 10, targetId: id, targetType: "product" });
    } else {
        deleteCollect({ userId: 10, targetId: id, targetType: "product" });
    }
}
</script>

<style lang="scss" scoped>
.shop-list {
    padding-top: 24px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #fbf7ef, #fff);
}

.hero {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
    padding: 0 12px;

    h1 {
        color: #34523a;
        font-weight: bold;
    }

    .sub {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .btn.primary {
        background: #7fb069;
        color: #fff;
        border: none;
        border-radius: 24px;
        padding: 6px 16px;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
            background: #6a945c;
        }
    }
}

.list {
    flex: 1;
    height: 500px;

    .scroll-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
    padding: 18px;
    border-radius: 8px;
    max-width: 900px;
    width: 90%;
    max-height: 90%;
    overflow: auto;
}
.images {
    display: flex;
    gap: 8px;
    img {
        max-width: 220px;
        border-radius: 6px;
    }
}
.primary {
    background: #7fb069;
    color: #fff;
}
.cart-float {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    .cart-count {
        position: absolute;
        top: -2px;
        right: -4px;
        background: #db4437;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 12px;
    }
}
</style>
