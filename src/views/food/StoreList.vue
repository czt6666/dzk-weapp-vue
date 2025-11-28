<template>
    <div class="store-list-page">
        <!-- 搜索栏 -->
        <div class="search-section">
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input
                    v-model="searchKeyword"
                    type="text"
                    placeholder="请输入门店名称"
                    @input="handleSearch"
                    class="search-input"
                />
                <button v-if="searchKeyword" class="clear-btn" @click="clearSearch">✕</button>
            </div>
        </div>

        <!-- 门店列表 -->
        <main class="store-list">
            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>

            <div v-else-if="filteredStores.length === 0" class="empty-state">
                <div class="empty-icon">🏪</div>
                <p>暂无门店信息</p>
            </div>

            <div v-else class="store-items">
                <div
                    v-for="store in filteredStores"
                    :key="store.id"
                    class="store-card"
                    @click="goToStore(store)"
                >
                    <div class="store-header">
                        <div class="store-title">
                            <span class="store-icon">♥</span>
                            <h3 class="store-name">{{ store.name }}</h3>
                            <span class="arrow-icon">›</span>
                        </div>
                        <button class="action-btn primary">去下单</button>
                    </div>

                    <div class="store-info">
                        <div class="info-row">
                            <span class="icon">🕐</span>
                            <span class="text">{{ store.hours }}</span>
                        </div>
                        <div class="info-row">
                            <span class="icon">📍</span>
                            <span class="text">{{ store.address }}</span>
                        </div>
                    </div>

                    <div class="store-footer">
                        <div class="store-tags">
                            <span v-for="tag in store.tags" :key="tag" class="tag">
                                {{ tag }}
                            </span>
                        </div>
                        <div class="store-actions">
                            <button
                                class="icon-btn"
                                @click.stop="callPhone(store.phone)"
                                title="拨打电话"
                            >
                                📞
                            </button>
                            <button class="icon-btn" @click.stop="navigate(store)" title="导航">
                                📍
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchStoreList, type StoreInfo } from "@/apis/food";

// Props & Emits
const emit = defineEmits<{
    back: [];
    selectStore: [store: StoreInfo];
}>();

// State
const loading = ref(true);
const searchKeyword = ref("");
const stores = ref<StoreInfo[]>([]);
const filteredStores = ref<StoreInfo[]>([]);

// Methods
const handleSearch = async () => {
    loading.value = true;
    try {
        const result = await fetchStoreList(searchKeyword.value);
        filteredStores.value = result;
    } catch (error) {
        console.error("搜索失败:", error);
    } finally {
        loading.value = false;
    }
};

const clearSearch = () => {
    searchKeyword.value = "";
    filteredStores.value = stores.value;
};

const goToStore = (store: StoreInfo) => {
    console.log("进入门店:", store.name);
    emit("selectStore", store);
    // 实际项目中这里应该是路由跳转
    // router.push({ name: 'restaurant', params: { id: store.id } })
};

const callPhone = (phone: string) => {
    console.log("拨打电话:", phone);
    window.location.href = `tel:${phone}`;
};

const navigate = (store: StoreInfo) => {
    console.log("导航到:", store.address);
    // 实际项目中调用地图导航API
    if (store.lat && store.lng) {
        window.location.href = `https://uri.amap.com/navigation?to=${store.lng},${store.lat},${store.name}`;
    } else {
        alert(`导航地址: ${store.address}`);
    }
};

// Lifecycle
onMounted(async () => {
    try {
        const result = await fetchStoreList();
        stores.value = result;
        filteredStores.value = result;
    } catch (error) {
        console.error("加载门店列表失败:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.store-list-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: white;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

        .back-btn {
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 4px;
            font-size: 24px;
            color: #333;

            .arrow {
                font-weight: 300;
            }
        }

        .city-selector {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;

            .city-name {
                font-size: 16px;
                font-weight: 500;
                color: #333;
            }

            .dropdown-icon {
                font-size: 10px;
                color: #999;
            }
        }

        .header-placeholder {
            width: 32px;
        }
    }

    .search-section {
        padding: 12px 16px;
        background: white;

        .search-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 4px;

            .search-icon {
                font-size: 16px;
                color: #999;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                font-size: 14px;
                color: #333;
                outline: none;

                &::placeholder {
                    color: #bbb;
                }
            }

            .clear-btn {
                border: none;
                background: transparent;
                cursor: pointer;
                padding: 4px;
                font-size: 14px;
                color: #999;
            }
        }
    }

    .store-list {
        overflow-y: auto;
        padding: 12px 16px;

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 0;
            color: #999;

            .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #f0f0f0;
                border-top-color: #4caf50;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-bottom: 12px;
            }

            p {
                font-size: 14px;
            }
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .empty-state {
            text-align: center;
            padding: 60px 0;
            color: #999;

            .empty-icon {
                font-size: 48px;
                margin-bottom: 12px;
                opacity: 0.3;
            }

            p {
                font-size: 14px;
            }
        }

        .store-items {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .store-card {
                background: white;
                border-radius: 8px;
                padding: 14px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

                &:active {
                    transform: scale(0.98);
                    background: #fafafa;
                }

                .store-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;

                    .store-title {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        flex: 1;

                        .store-icon {
                            font-size: 18px;
                            color: #999;
                        }

                        .store-name {
                            font-size: 16px;
                            font-weight: 600;
                            color: #333;
                            flex: 1;
                        }

                        .arrow-icon {
                            font-size: 20px;
                            color: #bbb;
                            font-weight: 300;
                        }
                    }

                    .action-btn {
                        padding: 6px 16px;
                        border-radius: 20px;
                        border: none;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        white-space: nowrap;
                        transition: all 0.2s;

                        &.primary {
                            background: #4caf50;
                            color: white;

                            &:hover {
                                background: #45a049;
                            }

                            &:active {
                                transform: scale(0.95);
                            }
                        }
                    }
                }

                .store-info {
                    margin-bottom: 12px;

                    .info-row {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 6px;
                        font-size: 13px;
                        color: #666;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .icon {
                            font-size: 14px;
                            color: #999;
                        }

                        .text {
                            flex: 1;
                            line-height: 1.4;
                        }
                    }
                }

                .store-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 10px;
                    border-top: 1px solid #f5f5f5;

                    .store-tags {
                        display: flex;
                        gap: 6px;
                        flex-wrap: wrap;

                        .tag {
                            padding: 3px 8px;
                            background: #fff9e6;
                            color: #f39c12;
                            font-size: 11px;
                            border-radius: 3px;
                            border: 1px solid #ffe8b3;
                        }
                    }

                    .store-actions {
                        display: flex;
                        gap: 8px;

                        .icon-btn {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            border: 1px solid #e8e8e8;
                            background: white;
                            cursor: pointer;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s;

                            &:hover {
                                background: #f5f5f5;
                                border-color: #ddd;
                            }

                            &:active {
                                transform: scale(0.9);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
