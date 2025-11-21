<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>

        <!-- 搜索 + 排序 -->
        <div class="toolbar">
            <div class="search-bar">
                <div class="search-input">
                    <i class="icon icon-search"></i>
                    <input
                        v-model="keyword"
                        type="text"
                        placeholder="搜索新闻标题 / 关键词..."
                        @keyup.enter="handleSearch"
                    />
                    <button v-if="keyword" class="clear-btn" @click="handleResetSearch">×</button>
                </div>
                <button class="search-btn" @click="handleSearch">搜索</button>
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
            正在查看标题或关键词包含
            <span class="keyword">{{ searchKeyword }}</span>
            的新闻
        </div>

        <div class="news-list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id" class="scroll-list-item">
                        <NewsListItem :info="item" @click="goDetail(item.id)" />
                    </li>
                    <li v-if="!list.length && searchKeyword" class="empty-tip">
                        暂无匹配的新闻，换个关键词试试～
                    </li>
                </ul>
            </SmartScrollList>
        </div>
    </div>
</template>
<script lang="ts" setup name="NewsList">
import NewsListItem from "@/components/news/NewsListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getNewsList } from "@/apis/news";
import { debounce } from "@/utils/index";

const currentSort = ref("latest");
const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);
const keyword = ref("");
const searchKeyword = ref("");

async function fetchData(page: number, pageSize: number) {
    const res = await getNewsList({ page, pageSize });
    if (list.value.length + res.data.list.length > res.data.totalCount) {
        return [];
    }
    const resList = res?.data?.list || [];
    return filterByKeyword(resList);
}

async function onRefresh() {
    try {
        page = 1;
        list.value = [];
        list.value = await fetchData(page, pageSize);
        if (!list.value.length && searchKeyword.value) {
            ElMessage.info("没有找到相关新闻");
        }
        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取新闻列表失败");
        return list.value;
    }
}

async function onLoadMore() {
    try {
        page++;
        const newList = await fetchData(page, pageSize);
        if (newList.length === 0) {
            ElMessage.success("没有更多数据了");
            page--;
            return list.value;
        }
        list.value.push(...newList);

        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg);
        page--;
        return list.value;
    }
}

function goDetail(id: number) {
    router.push(`/news/${id}`);
}

function handleSortChange(command: string) {
    currentSort.value = command;
    ElMessage.success(`已切换排序：${getSortName(command)}`);
}

function filterByKeyword(items: any[]) {
    if (!searchKeyword.value) return items;
    const kw = searchKeyword.value.toLowerCase();
    return items.filter((item) => {
        const title = String(item?.title || "").toLowerCase();
        const keywordField = String(item?.keyword || item?.keywords || "").toLowerCase();
        return title.includes(kw) || keywordField.includes(kw);
    });
}

async function handleSearch() {
    searchKeyword.value = keyword.value.trim();
    await onRefresh();
}

async function handleResetSearch() {
    if (!searchKeyword.value && !keyword.value) return;
    keyword.value = "";
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
    gap: 12px;
    padding: 8px 12px;
    align-items: center;
}
.search-bar {
    flex: 1;
    display: flex;
    gap: 10px;
    align-items: center;
}
.search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 28px;
    border: 1px solid #d4d4d4;
    padding: 6px 14px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) inset;
}
.search-input input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #333;
}
.icon-search {
    width: 18px;
    height: 18px;
    margin-right: 6px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%2383b266" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1016 9.5a6.5 6.5 0 00-1.22 3.79l.27.28h.79l5 5-1.5 1.5-5-5zm-5 0A4.5 4.5 0 1111 5a4.5 4.5 0 01-.5 9z"/></svg>')
        no-repeat center/contain;
}
.clear-btn {
    border: none;
    background: transparent;
    font-size: 18px;
    line-height: 1;
    color: #bbb;
    cursor: pointer;
}
.search-btn {
    border: none;
    background: linear-gradient(135deg, #7fb069, #6da757);
    color: #fff;
    border-radius: 24px;
    padding: 8px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
}
.search-btn:hover {
    opacity: 0.9;
}
.sort-dropdown {
    height: 31px;
    display: flex;
    align-items: center;
}
.search-hint {
    padding: 0 12px 4px;
    font-size: 14px;
    color: #666;
    .keyword {
        margin: 0 4px;
        color: #409eff;
        font-weight: 500;
    }
}
.news-list {
    flex: 1;
    height: 500px;

    .scroll-list-item {
        margin-bottom: 8px;
    }

    .empty-tip {
        padding: 40px 0;
        text-align: center;
        color: #999;
        font-size: 14px;
    }
}
</style>
