<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>

        <div class="toolbar">
            <div class="search-bar">
                <el-input
                    v-model="keyword"
                    placeholder="搜索民宿名称"
                    clearable
                    @keyup.enter="handleSearch"
                    @clear="handleResetSearch"
                >
                    <template #append>
                        <el-button type="primary" :loading="isSearching" @click="handleSearch">
                            搜索
                        </el-button>
                    </template>
                </el-input>
                <el-button v-if="searchKeyword" class="clear-search" text @click="handleResetSearch">
                    清除搜索
                </el-button>
            </div>

            <div class="sort-dropdown">
                <el-dropdown trigger="click" @command="handleSortChange">
                    <span class="el-dropdown-link">
                        排序
                        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="latest">最新</el-dropdown-item>
                            <el-dropdown-item command="hot">最热</el-dropdown-item>
                            <el-dropdown-item command="recommend">推荐</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <div v-if="searchKeyword" class="search-hint">
            正在查看与
            <span class="keyword">{{ searchKeyword }}</span>
            相关的民宿
        </div>

        <div class="waterfall-list">
            <SmartScrollList
                ref="listRef"
                :onRefresh="onRefresh"
                :onLoadMore="debounce(onLoadMore)"
            >
                <div v-if="showEmptyState" class="empty-tip">暂无相关民宿，换个关键词试试吧～</div>
                <div v-else class="columns">
                    <div class="column" v-for="(col, i) in columns" :key="i">
                        <WaterfallItem
                            v-for="item in col"
                            :key="item.id"
                            :info="item"
                            @click="goDetail(item.id)"
                        />
                    </div>
                </div>
            </SmartScrollList>
        </div>

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
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import WaterfallItem from "@/components/hotel/HotelItem.vue";
import { getHotelList } from "@/apis/hotel";
import { debounce } from "@/utils/index";

const router = useRouter();
const currentSort = ref("latest");
const keyword = ref("");
const searchKeyword = ref("");
const isSearching = ref(false);
const listRef = ref<InstanceType<typeof SmartScrollList> | null>(null);

let page = 1;
const pageSize = 10;

const list = ref<any[]>([]);
const tempList = ref<any[]>([]);
const columns = ref<any[][]>([[], []]);
const hasFetchedOnce = ref(false);
const isEmptyResult = computed(
    () => columns.value.every((col) => col.length === 0) && tempList.value.length === 0 && list.value.length === 0,
);
const showEmptyState = computed(() => hasFetchedOnce.value && isEmptyResult.value);

async function fetchData(page: number, pageSize: number) {
    const params = {
        page,
        pageSize,
        homestayName: searchKeyword.value || undefined,
    };
    const res = await getHotelList(params);

    if (list.value.length + res.data.records.length > res.data.total) {
        return [];
    }
    const resList = filterByKeyword(res?.data?.records || []);

    return resList;
}

async function onRefresh() {
    page = 1;
    list.value = [];
    resetColumnsState();
    list.value = await fetchData(page, pageSize);
    await splitToColumns(list.value);
    hasFetchedOnce.value = true;
    if (!list.value.length && searchKeyword.value) {
        ElMessage.info("没有查询到相关民宿，试试其他关键词吧");
    }
}

async function onLoadMore() {
    page++;
    const newList = await fetchData(page, pageSize);
    if (newList.length === 0) {
        ElMessage.success("没有更多数据了");
        page--;
        return list.value;
    }
    list.value.push(...newList);

    splitToColumns(newList);
}

let left: any[] = [];
let right: any[] = [];
let leftHeight = 0;
let rightHeight = 0;

function resetColumnsState() {
    left = [];
    right = [];
    leftHeight = 0;
    rightHeight = 0;
    columns.value = [left, right];
}

function filterByKeyword(items: any[]) {
    if (!searchKeyword.value) return items;
    const kw = searchKeyword.value.toLowerCase();
    return items.filter((item) => {
        const name = String(item?.homestayName || item?.name || "").toLowerCase();
        if (name) {
            return name.includes(kw);
        }
        const fallback = String(item?.title || item?.description || "").toLowerCase();
        return fallback.includes(kw);
    });
}

async function splitToColumns(items: any[]) {
    tempList.value = items;
    await nextTick();
    await waitForAllImagesLoaded();

    const itemElements = Array.from(document.querySelectorAll("[data-waterfall-id]"));
    const heightMap = new Map<string, number>();
    itemElements.forEach((el) => {
        const id = el.getAttribute("data-waterfall-id");

        if (id) heightMap.set(id, el.clientHeight);
    });

    items.forEach((item) => {
        const estHeight = (heightMap.get(item.id.toString()) || 200) + 12;

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

function handleSortChange(command: string) {
    currentSort.value = command;
    ElMessage.success(`已切换排序：${getSortName(command)}`);
    onRefresh();
}

async function handleSearch() {
    if (isSearching.value) return;
    isSearching.value = true;
    try {
        searchKeyword.value = keyword.value.trim();
        await onRefresh();
    } finally {
        isSearching.value = false;
    }
}

async function handleResetSearch() {
    keyword.value = "";
    if (!searchKeyword.value) return;
    searchKeyword.value = "";
    await onRefresh();
}

function getSortName(type: string) {
    switch (type) {
        case "latest":
            return "最新";
        case "hot":
            return "最热";
        case "recommend":
            return "推荐";
        default:
            return "未知";
    }
}
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.banner {
    width: 100%;
    height: 200px;
    > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
    align-items: center;
}
.search-bar {
    flex: 1;
    min-width: 280px;
    display: flex;
    gap: 8px;
    .el-input {
        flex: 1;
    }
    .clear-search {
        padding: 0 8px;
    }
}
.sort-dropdown {
    height: 40px;
    padding: 8px 0;
    display: flex;
    align-items: center;
}
.search-hint {
    padding: 0 16px 8px;
    font-size: 14px;
    color: #666;
    .keyword {
        margin: 0 4px;
        color: #409eff;
        font-weight: 500;
    }
}
.waterfall-list {
    flex: 1;
    overflow-y: auto;

    .columns {
        display: flex;
        gap: 12px;

        .column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
}

.waterfall-item-temp {
    width: 50%;
    padding-left: 16px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -999;
    opacity: 0;
}
.empty-tip {
    padding: 80px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
}
</style>
