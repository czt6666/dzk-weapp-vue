<template>
    <div class="store-list-page">
        <!-- 搜索栏 -->
        <div class="search-section">
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input
                    v-model="keyword"
                    type="text"
                    placeholder="请输入门店名称"
                    @input="fetchData"
                    class="search-input"
                />
                <button v-if="keyword" class="clear-btn" @click="clearSearch">✕</button>
            </div>
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
                <div
                    v-for="store in stores"
                    :key="store.id"
                    class="store-card"
                    @click="goToStore(store)"
                >
                    <!-- 店铺logo和基本信息 -->
                    <div class="store-header">
                        <img
                            v-if="store.logoUrl"
                            :src="imgUrl(store.logoUrl)"
                            :alt="store.name"
                            class="store-logo"
                        />
                        <div v-else class="store-logo-placeholder">🏪</div>

                        <div class="store-main-info">
                            <h3 class="store-name">{{ store.name }}</h3>
                            <div class="store-village" v-if="store.villageName">
                                <span class="village-icon">📍</span>
                                <span>{{ store.villageName }}</span>
                            </div>
                        </div>

                        <button class="order-btn" @click.stop="goToStore(store)">去下单</button>
                    </div>

                    <!-- 营业时间 -->
                    <div class="store-info-row">
                        <span class="info-icon">🕐</span>
                        <span class="info-label">营业时间：</span>
                        <span class="info-value">
                            {{ store.businessStartTime }} - {{ store.businessEndTime }}
                        </span>
                    </div>

                    <!-- 地址 -->
                    <div class="store-info-row">
                        <span class="info-icon">📍</span>
                        <span class="info-label">地址：</span>
                        <span class="info-value">{{ store.address }}</span>
                    </div>

                    <!-- 电话 -->
                    <div class="store-info-row">
                        <span class="info-icon">📞</span>
                        <span class="info-label">电话：</span>
                        <span class="info-value">{{ store.phone }}</span>
                    </div>

                    <!-- 公告 -->
                    <div v-if="store.notice" class="store-notice">
                        <span class="notice-icon">📢</span>
                        <span class="notice-text">{{ store.notice }}</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRestaurantList, fetchStoreList, type RestaurantInfo } from "@/apis/restaurant";
import { useRouter } from "vue-router";
import { imgUrl } from "@/utils";

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
    router.push({ name: "RestaurantOrder", query: { id: store.id } });
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
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-bar {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 24px;
    padding: 10px 16px;
    transition: all 0.3s ease;

    &:focus-within {
        background: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
}

.search-icon {
    font-size: 18px;
    margin-right: 8px;
    color: #999;
}

.search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 15px;
    color: #333;

    &::placeholder {
        color: #aaa;
    }
}

.clear-btn {
    background: #ddd;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.2s ease;

    &:hover {
        background: #ccc;
    }
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
    gap: 16px;
}

.store-card {
    background: #fff;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
}

// 店铺头部
.store-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;

    .store-logo {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
        border: 1px solid #f0f0f0;
    }

    .store-logo-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        flex-shrink: 0;
    }

    .store-main-info {
        flex: 1;
        min-width: 0;
    }

    .store-name {
        font-size: 17px;
        font-weight: 600;
        color: #333;
        margin: 0 0 6px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .store-village {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #666;

        .village-icon {
            font-size: 12px;
        }
    }

    .order-btn {
        padding: 8px 20px;
        background: linear-gradient(135deg, #d1dccb 0%, #a4b39a 100%);
        color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }
}

// 信息行
.store-info-row {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 14px;

    .info-icon {
        font-size: 14px;
        flex-shrink: 0;
        margin-top: 1px;
    }

    .info-label {
        color: #999;
        flex-shrink: 0;
    }

    .info-value {
        color: #333;
        flex: 1;
    }
}

// 公告
.store-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #fff9e6;
    border-left: 3px solid #ffb800;
    padding: 10px 12px;
    margin: 12px 0;
    border-radius: 4px;
    font-size: 13px;
}

.notice-icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 1px;
}

.notice-text {
    color: #856404;
    line-height: 1.5;
    flex: 1;
}
</style>
