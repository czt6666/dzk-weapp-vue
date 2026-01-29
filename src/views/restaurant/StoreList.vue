<template>
    <div class="store-list-page">
        <!-- 搜索栏 -->
        <div class="search-section">
            <SearchInput
                v-model="keyword"
                placeholder="请输入门店名称"
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <!-- 门店列表 -->
        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)" :pullUp="false">
                <div v-if="stores.length === 0" class="empty-state">
                    <div class="empty-icon">🏪</div>
                    <p>暂无门店信息</p>
                </div>

                <div v-else class="store-items">
                    <StoreCard
                        v-for="store in stores"
                        :key="store.id"
                        :store="store"
                        @click="goToStore"
                        @favorite="toggleFavorite(store.id, $event)"
                    />
                </div>
            </SmartScrollList>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchInput from "@/components/input/SearchInput.vue";
import StoreCard from "@/components/listitem/StoreListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import { getRestaurantList, type IRestaurantInfo } from "@/apis/restaurant";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { createFavoriteToggle } from "@/utils/favorite";
import { debounce } from "@/utils";

const keyword = ref("");
const stores = ref<IRestaurantInfo[]>([]);
const router = useRouter();

async function fetchData() {
    try {
        const result = await getRestaurantList({ name: keyword.value.trim() });
        return result.data.records || [];
    } catch (error) {
        ElMessage.error("获取门店列表失败");
        console.error("获取门店列表失败:", error);
        return [];
    }
}

async function onRefresh() {
    stores.value = await fetchData();
}

async function onLoadMore() {
    // 门店列表通常是一次性返回所有数据，不需要分页加载
    // 如果将来需要分页，可以在这里实现
    ElMessage.success("没有更多数据了");
}

function handleSearch() {
    if (!keyword.value.trim()) {
        ElMessage.warning("请输入搜索关键词");
        return;
    }
    onRefresh();
}

function handleReset() {
    keyword.value = "";
    onRefresh();
}

const goToStore = (store: IRestaurantInfo) => {
    router.push({ name: "RestaurantOrder", query: { id: store.id, name: store.name } });
};

// 使用生成器创建收藏切换函数
const toggleFavorite = createFavoriteToggle("restaurant", stores);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.store-list-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: $bg-gradient-main;
}

// 搜索区域
.search-section {
    flex-shrink: 0;
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
}

// 主列表区域
.list {
    flex: 1;
    min-height: 0;
    padding: $spacing-sm 0 0;

    .store-items {
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }

    // 空状态
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: $spacing-xxxl $spacing-md;
        color: $text-tertiary;

        .empty-icon {
            font-size: 64px;
            margin-bottom: $spacing-lg;
            opacity: 0.5;
        }
    }
}
</style>
