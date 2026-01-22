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

        <!-- 收藏夹按钮 -->
        <div class="favorite-float" @click="goFavorites">
            <div class="favorite-icon">
                <img :src="heartFilledIcon" alt="收藏夹" />
            </div>
            <span class="favorite-text">收藏夹</span>
            <span class="favorite-count" v-if="favorite.list.length > 0">{{ favorite.list.length }}</span>
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
import heartFilledIcon from "@/assets/svg/heart-filled.svg";

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
    router.push({ name: "ShopInfo", params: { id: item.id } });
}

function goFavorites() {
    router.push({ name: "ShopFavorites" });
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

.favorite-float {
    position: absolute;
    bottom: $spacing-xxl;
    right: $spacing-lg;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #ff9500 0%, #ffb347 100%);
    border-radius: 50px;
    box-shadow: 0 4px 16px rgba(255, 149, 0, 0.4);
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 120px;
    justify-content: center;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 149, 0, 0.5);
    }

    &:active {
        transform: translateY(0) scale(0.98);
    }

    .favorite-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }
    }

    .favorite-text {
        color: #fff;
        font-size: 15px;
        font-weight: 600;
        white-space: nowrap;
    }

    .favorite-count {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #fff;
        color: #ff9500;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 12px;
        min-width: 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border: 2px solid #ff9500;
    }
}
</style>
