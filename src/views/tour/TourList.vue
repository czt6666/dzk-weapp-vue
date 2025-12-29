<template>
    <div class="page">
        <div class="banner">
            <HolidayCarousel />
        </div>

        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                placeholder="搜索旅游标题 / 关键词..."
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id" class="scroll-list-item">
                        <TourListItem
                            :info="item"
                            @click="goDetail(item.id)"
                            @favorite="toggleFavorite(item.id, $event)"
                        />
                    </li>
                </ul>
            </SmartScrollList>
        </div>
    </div>
</template>

<script lang="ts" setup name="TourList">
import { ref } from "vue";
import HolidayCarousel from "@/components/HolidayCarousel.vue";
import TourListItem from "@/components/listitem/TourListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import SearchInput from "@/components/input/SearchInput.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getTourRouteList } from "@/apis/tour";
import { debounce } from "@/utils/index";
import { createCollect, deleteCollect } from "@/apis/collect";

const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);
const keyword = ref("");

async function fetchData(page: number, pageSize: number, keyword?: string) {
    try {
        // 替换为 旅游列表接口
        const res = await getTourRouteList({ name: keyword, page, pageSize });
        if (list.value.length + res.data.records.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.records || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取旅游列表失败");
        console.error(err);
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
    list.value = await fetchData(page, pageSize, keyword.value);
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
}

function goDetail(id: number) {
    router.push({ name: "TourInfo", params: { id } });
}

async function toggleFavorite(id: number, isFavorite: boolean) {
    if (isFavorite) {
        createCollect({ userId: 1, targetId: id, targetType: "tour_route" });
    } else {
        deleteCollect({ userId: 1, targetId: id, targetType: "tour_route" });
    }
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: $bg-gradient-main;

    .banner {
        width: 100%;
        position: relative;
    }

    .toolbar {
        padding: $spacing-sm $spacing-md;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
    }

    .list {
        flex: 1;
        height: 500px;
        padding: $spacing-sm 0 0;

        .scroll-list-item {
            margin-bottom: $spacing-sm;
        }
    }
}
</style>
