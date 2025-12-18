<template>
    <div class="page">
        <div class="banner">
            <HolidayCarousel />
        </div>

        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                placeholder="搜索退休站标题 / 关键词..."
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id" class="scroll-list-item">
                        <RetirementListItem
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
import RetirementListItem from "@/components/listitem/RetirementListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import SearchInput from "@/components/input/SearchInput.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getRetirementStationList } from "@/apis/retirement";
import { debounce } from "@/utils/index";
import { createCollect, deleteCollect } from "@/apis/collect";

const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);
const keyword = ref("");

async function fetchData(page: number, pageSize: number, keyword?: string) {
    try {
        const res = await getRetirementStationList({ name: keyword, page, pageSize });
        if (list.value.length + res.data.records.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.records || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取退休站列表失败");
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
    router.push({ name: "RetirementInfo", params: { id } });
}

async function toggleFavorite(id: number, isFavorite: boolean) {
    if (isFavorite) {
        createCollect({ userId: 10, targetId: id, targetType: "elderly_station" });
    } else {
        deleteCollect({ userId: 10, targetId: id, targetType: "elderly_station" });
    }
}
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .banner {
        width: 100%;
    }

    .toolbar {
        padding: 8px 12px;
    }

    .list {
        flex: 1;
        height: 500px;

        .scroll-list-item {
            margin-bottom: 8px;
        }
    }
}
</style>
