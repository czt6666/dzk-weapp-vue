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
        <!-- {{ list }} -->

        <div class="news-list">
            <SmartScrollList ref="listRef" :onRefresh="onRefresh" :onLoadMore="onLoadMore">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id" class="scroll-list-item">
                        <NewsListItem :info="item" @click="goDetail(item.id)" />
                    </li>
                </ul>
            </SmartScrollList>
        </div>
    </div>
</template>
<script lang="ts" setup name="NewsList">
import NewsListItem from "@/components/news/NewsListItem.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getNewsList } from "@/apis/news";

const currentSort = ref("latest");
const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);

async function generateData(page: number, pageSize: number) {
    const res = await getNewsList({ page, pageSize });
    if (list.value.length + res.info.list.length > res.info.totalCount) {
        return [];
    }
    const resList = res?.info?.list || [];

    return resList;
}

async function onRefresh() {
    page = 1;
    list.value = await generateData(page, pageSize);

    return list.value;
}

async function onLoadMore() {
    page++;
    const newList = await generateData(page, pageSize);
    if (newList.length === 0) {
        ElMessage.success("没有更多数据了");
        page--;
        return list.value;
    }
    list.value.push(...newList);

    return list.value;
}

function goDetail(id: number) {
    router.push(`/news/${id}`);
}

function handleSortChange(command: string) {
    currentSort.value = command;
    ElMessage.success(`已切换排序：${getSortName(command)}`);
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
    height: 31px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
}
.news-list {
    flex: 1;
    height: 500px; // ?
    // background-color: pink;

    .scroll-list-item {
        margin-bottom: 8px;
    }
}
</style>
