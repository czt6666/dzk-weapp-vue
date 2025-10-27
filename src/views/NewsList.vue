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

const currentSort = ref("latest");
const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);

async function generateData(page: number, pageSize: number) {
    await new Promise((r) => setTimeout(r, 800));
    const list = [];
    const start = (page - 1) * pageSize;

    for (let i = 0; i < pageSize; i++) {
        const id = start + i + 1;
        list.push({
            id,
            title: `这是第 ${id} 条 ${currentSort.value} 新闻标题`,
            date: `2024-08-${((id % 30) + 1).toString().padStart(2, "0")}`,
            views: 1000 + id * 3,
            likes: Math.floor(Math.random() * 100),
            image: `https://picsum.photos/seed/${id}/200/120`,
        });
    }
    console.log(list);

    return list;
}

async function onRefresh() {
    page = 1;
    list.value = await generateData(page, pageSize);

    return list.value;
}

async function onLoadMore() {
    page++;
    const newList = await generateData(page, pageSize);
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
