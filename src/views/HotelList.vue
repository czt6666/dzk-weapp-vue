<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>

        <!-- 排序按钮 -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";
import WaterfallItem from "@/components/hotel/HotelItem.vue";
import { getHotelList } from "@/apis/hotel";
import { debounce } from "@/utils/index";

const router = useRouter();
const currentSort = ref("latest");

let page = 1;
const pageSize = 10;

// 原始数据 + 分两列
const list = ref<any[]>([]);
const tempList = ref<any[]>([]);
const columns = ref<any[][]>([[], []]);

// 模拟异步加载数据
async function fetchData(page: number, pageSize: number) {
    const res = await getHotelList({ page, pageSize });

    if (list.value.length + res.data.records.length > res.data.total) {
        return [];
    }
    const resList = res?.data?.records || [];

    return resList;
}

async function onRefresh() {
    page = 1;
    list.value = [];
    list.value = await fetchData(page, pageSize);
    splitToColumns(list.value);
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
    router.push(`/hotel/${id}`);
}

function handleSortChange(command: string) {
    currentSort.value = command;
    ElMessage.success(`已切换排序：${getSortName(command)}`);
    onRefresh();
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
.sort-dropdown {
    height: 40px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
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
</style>
