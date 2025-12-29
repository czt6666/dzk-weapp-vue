<template>
    <div class="page">
        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                placeholder="搜索酒店名称 / 地址..."
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
                        <WaterfallItem
                            v-for="item in col"
                            :key="item.id"
                            :info="item"
                            @click="goDetail(item.id)"
                            @favorite="toggleFavorite(item.id, $event)"
                        />
                    </div>
                </div>
            </SmartScrollList>
        </div>

        <!-- item 暂存区 -->
        <div class="waterfall-item-temp">
            <WaterfallItem
                v-for="item in tempList"
                :info="item"
                @click="goDetail(item.id)"
                :data-waterfall-id="item.id"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import SearchInput from "@/components/input/SearchInput.vue";
import WaterfallItem from "@/components/listitem/HotelItem.vue";
import { getHotelList } from "@/apis/hotel";
import { debounce } from "@/utils/index";
import { createFavoriteToggle } from "@/utils/favorite";

const router = useRouter();

let page = 1;
const pageSize = 10;

// 原始数据 + 分两列
const list = ref<any[]>([]);
const tempList = ref<any[]>([]);
const columns = ref<any[][]>([[], []]);
const keyword = ref("");

// 使用生成器创建收藏切换函数
const toggleFavorite = createFavoriteToggle("homestay", list);

async function fetchData(page: number, pageSize: number, keyword?: string) {
    try {
        const res = await getHotelList({ page, pageSize, keyword });

        if (list.value.length + res.data.records.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.records || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取民宿列表失败");
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

const left: any[] = [];
const right: any[] = [];
let leftHeight = 0;
let rightHeight = 0;
async function splitToColumns(items: any[]) {
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

    items.forEach((item, index) => {
        const estHeight = (heightMap.get(item.id.toString()) || 200) + 12; // 12px vertical gap
        // console.log(item.id, leftHeight, rightHeight, estHeight);

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

function goDetail(id: number) {
    router.push(`/hotels/${id}`);
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $bg-gradient-main;
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

.search-bar {
    flex: 1;
    min-width: 280px;
    display: flex;
    gap: $spacing-sm;
    .el-input {
        flex: 1;
    }
    .clear-search {
        padding: 0 $spacing-sm;
    }
}

.sort-dropdown {
    height: 40px;
    padding: $spacing-sm $spacing-md;
    display: flex;
    align-items: center;
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
</style>
