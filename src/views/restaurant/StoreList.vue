<template>
    <div class="store-list-page">
        <!-- 搜索栏 -->
        <div class="search-section">
            <SearchInput
                v-model="keyword"
                placeholder="请输入门店名称"
                @handleSearch="fetchData"
                @handleReset="clearSearch"
            />
        </div>

        <!-- 门店列表 -->
        <main class="store-list">
            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <div v-else-if="stores.length === 0" class="empty-state">
                <div class="empty-icon">🏪</div>
                <p>暂无门店信息</p>
            </div>

            <div v-else class="store-items">
                <StoreCard
                    v-for="store in stores"
                    :key="store.id"
                    :store="store"
                    @click="goToStore"
                    @favorite="handleFavorite"
                />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SearchInput from "@/components/input/SearchInput.vue";
import StoreCard from "@/components/restaurant/StoreCard.vue";
import { getRestaurantList, type RestaurantInfo } from "@/apis/restaurant";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const loading = ref(true);
const keyword = ref("");
const stores = ref<RestaurantInfo[]>([]);
const router = useRouter();

const fetchData = async () => {
    loading.value = true;
    try {
        const result = await getRestaurantList({ name: keyword.value.trim() });
        stores.value = result.data.records;
        return result;
    } catch (error) {
        ElMessage.error("获取门店列表失败");
        console.error("获取门店列表失败:", error);
    } finally {
        loading.value = false;
    }
};

const clearSearch = async () => {
    keyword.value = "";
    await fetchData();
};

const goToStore = (store: RestaurantInfo) => {
    console.log("进入门店:", store.name);
    router.push({ name: "RestaurantOrder", query: { id: store.id, name: store.name } });
};

const handleFavorite = (store: RestaurantInfo, isFavorite: boolean) => {
    console.log("收藏状态:", store.name, isFavorite);
    // TODO: 调用收藏API
    ElMessage.success(isFavorite ? "已收藏" : "已取消收藏");
};

onMounted(async () => {
    await fetchData();
});
</script>

<style lang="scss" scoped>
.store-list-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 20px;
}

// 搜索区域
.search-section {
    padding: 10px;
}

// 主列表区域
.store-list {
    padding: 10px;
}

// 加载状态
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #999;

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}

// 空状态
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #999;

    .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
    }
}

// 店铺卡片列表
.store-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
