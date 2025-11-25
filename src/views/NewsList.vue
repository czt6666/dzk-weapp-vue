<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>

        <div class="toolbar">
            <div class="search-bar">
                <div class="search-input">
                    <el-icon><Search style="margin-right: 5px" /></el-icon>
                    <input
                        v-model="keyword"
                        type="text"
                        placeholder="搜索新闻标题 / 关键词..."
                        @keyup.enter="handleSearch"
                    />
                    <button v-if="keyword" class="clear-btn" @click="handleReset">×</button>
                </div>
                <button class="search-btn" @click="handleSearch">搜索</button>
            </div>
        </div>

        <div class="news-list">
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

<script lang="ts" setup name="NewsList">
import { ref } from "vue";
import NewsListItem from "@/components/news/NewsListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getNewsList } from "@/apis/news";
import { debounce } from "@/utils/index";

const router = useRouter();

let page = 1;
const pageSize = 10;
const list = ref<any[]>([]);
const keyword = ref("");

async function fetchData(page: number, pageSize: number, keyword?: string) {
    try {
        const res = await getNewsList({ page, pageSize, keyword });
        if (list.value.length + res.data.list.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.list || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取新闻列表失败");
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
    page = 1;
    list.value = [];
    onRefresh();
}

async function onRefresh() {
    page = 1;
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
    router.push(`/news/${id}`);
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
        height: 200px;

        img {
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

        .search-bar {
            flex: 1;
            display: flex;
            gap: 10px;
            align-items: center;

            .search-input {
                flex: 1;
                display: flex;
                align-items: center;
                background: #fff;
                border-radius: 28px;
                border: 1px solid #d4d4d4;
                padding: 6px 14px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) inset;

                input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 14px;
                    color: #333;
                }

                .clear-btn {
                    border: none;
                    background: transparent;
                    font-size: 18px;
                    line-height: 1;
                    color: #bbb;
                    cursor: pointer;
                }
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

                &:hover {
                    opacity: 0.9;
                }
            }
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
}
</style>
