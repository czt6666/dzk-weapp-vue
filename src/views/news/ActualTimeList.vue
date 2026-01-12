<template>
    <div class="page">
        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                placeholder="搜索时事资讯标题 / 关键词..."
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id" class="scroll-list-item">
                        <NewsListItem :info="item" @click="goDetail(item.id)" />
                    </li>
                </ul>
            </SmartScrollList>
        </div>
    </div>
</template>

<script lang="ts" setup name="ActualTimeList">
import { ref } from "vue";
import NewsListItem from "@/components/listitem/NewsListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import SearchInput from "@/components/input/SearchInput.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getActualTimeList } from "@/apis/news";
import { debounce } from "@/utils/index";

const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);
const keyword = ref("");

async function fetchData(page: number, pageSize: number, keyword?: string) {
    try {
        const res = await getActualTimeList({ page, pageSize, keyword });
        if (list.value.length + res.data.list.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.list || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取时事资讯列表失败");
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
    router.push({ name: "NewsInfo", params: { id } });
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

    .toolbar {
        flex-shrink: 0;
        padding: $spacing-sm $spacing-md;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
    }

    .list {
        flex: 1;
        min-height: 0;
        padding: $spacing-sm 0 0;

        .scroll-list {
            display: flex;
            flex-direction: column;
            gap: $spacing-sm;
        }
    }
}
</style>

