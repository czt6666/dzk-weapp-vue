<template>
    <div class="page">
        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                placeholder="搜索商品名称..."
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <!-- 瀑布流容器 -->
        <div class="waterfall-list">
            <SmartScrollList
                ref="listRef"
                :onRefresh="onRefresh"
                :onLoadMore="debounce(onLoadMore)"
            >
                <div class="columns">
                    <div class="column" v-for="(col, i) in columns" :key="i">
                        <ProductCard
                            v-for="item in col"
                            :key="item.id"
                            :item="item"
                            @open="openProduct"
                            @favorite="toggleFavorite(item.id, $event)"
                        />
                    </div>
                </div>
            </SmartScrollList>
        </div>

        <!-- item 暂存区 -->
        <div class="waterfall-item-temp">
            <ProductCard
                v-for="item in tempList"
                :key="item.id"
                :item="item"
                @open="openProduct"
                :data-waterfall-id="item.id"
            />
        </div>

        <!-- 底部购物车图标 -->
        <div class="cart-float" @click="goFavorites">
            <span>⭐</span>
            <span class="cart-count">{{ favorite.list.length }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/listitem/ProductCard.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import type { IProduct } from "@/views/shop/types";
import { getProductList } from "@/apis/shop";
import { debounce } from "@/utils/index";
import { ElMessage } from "element-plus";
import { useShopFavoriteStore } from "@/stores/shopFavorite";
import SearchInput from "@/components/input/SearchInput.vue";
import { createFavoriteToggle } from "@/utils/favorite";

const router = useRouter();
const favorite = useShopFavoriteStore();

let page = 1;
const pageSize = 10;

// 原始数据 + 分两列
const list = ref<IProduct[]>([]);
const tempList = ref<IProduct[]>([]);
const columns = ref<IProduct[][]>([[], []]);
const keyword = ref("");

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
    if (!keyword.value.trim()) {
        ElMessage.warning("请输入搜索关键词");
        return;
    }
    onRefresh();
}

async function handleReset() {
    keyword.value = "";
    onRefresh();
}

async function onRefresh() {
    page = 1;
    list.value = [];
    left.length = 0;
    right.length = 0;
    leftHeight = 0;
    rightHeight = 0;
    list.value = await fetchData(page, pageSize, keyword.value);
    splitToColumns(list.value);
}

async function onLoadMore() {
    page++;
    const newList = await fetchData(page, pageSize, keyword.value);
    if (!newList.length) {
        ElMessage.success("没有更多数据了");
        page--;
        return;
    }
    list.value.push(...newList);
    splitToColumns(newList);
}

const left: IProduct[] = [];
const right: IProduct[] = [];
let leftHeight = 0;
let rightHeight = 0;
async function splitToColumns(items: IProduct[]) {
    tempList.value = items;
    // 等待DOM挂载（渲染完成）
    await nextTick();

    // 等待所有图片加载完成
    await waitForAllImagesLoaded();

    // 获取所有 item 的真实 DOM 高度
    const itemElements = Array.from(document.querySelectorAll("[data-waterfall-id]"));
    const heightMap = new Map<string, number>();
    itemElements.forEach((el) => {
        const id = el.getAttribute("data-waterfall-id");
        if (id) heightMap.set(id, el.clientHeight);
    });

    items.forEach((item) => {
        const estHeight = (heightMap.get(item.id.toString()) || 200) + 12; // 12px vertical gap

        if (leftHeight <= rightHeight) {
            left.push(item);
            leftHeight += estHeight;
        } else {
            right.push(item);
            rightHeight += estHeight;
        }
    });

    columns.value = [left, right];
    tempList.value = [];
}

function waitForAllImagesLoaded(): Promise<void> {
    const images = Array.from(document.images);
    if (images.length === 0) return Promise.resolve();

    const loadingPromises = images.map(
        (img) =>
            new Promise<void>((resolve) => {
                if (img.complete) return resolve();
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
            }),
    );

    return Promise.all(loadingPromises).then(() => void 0);
}

function openProduct(item: IProduct) {
    router.push(`/shop/${item.id}`);
}

function goFavorites() {
    router.push("/shop/favorites");
}

// 使用生成器创建收藏切换函数
const toggleFavorite = createFavoriteToggle("product", list);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $bg-gradient-main;
    position: relative;
}

.toolbar {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
}

.waterfall-list {
    flex: 1;
    min-height: 0;
    padding: $spacing-sm 0 0;

    .columns {
        display: flex;
        gap: $spacing-md;

        .column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: $spacing-md;
        }
    }
}

.waterfall-item-temp {
    width: 50%;
    padding-left: $spacing-lg;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -999;
    opacity: 0;
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
