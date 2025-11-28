<template>
    <div class="product-detail">
        <!-- 预览区：轮播主图 + 缩略图 -->
        <div class="preview">
            <div class="main-img-box">
                <img :src="imgUrl(currentImage)" class="main-img" />
            </div>

            <div class="thumbs">
                <img
                    v-for="(img, idx) in product.previewImages"
                    :key="idx"
                    :src="imgUrl(img)"
                    :class="{ active: idx === currentIndex }"
                    @click="setCurrentImage(idx)"
                />
            </div>
        </div>

        <!-- 商品标题 & 描述 -->
        <div class="info">
            <h1>{{ product.title }}</h1>
            <p class="desc">{{ product.description }}</p>
            <p>上架时间：{{ new Date(product.createTime).toLocaleDateString() }}</p>
        </div>

        <!-- 详情长图 -->
        <div class="detail">
            <img
                v-for="(img, idx) in product.detailImages"
                :key="idx"
                :src="imgUrl(img)"
                class="detail-img"
            />
        </div>
    </div>
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
        <div class="merchant" @click="goToShopInfo">
            <img :src="imgUrl(product.shopAvatar)" />
            <span>{{ product.storeName }}</span>
        </div>

        <button class="collect-btn" @click="showCollect = true">收藏</button>
        <button class="buy-btn" @click="showBuyModal = true">购买</button>
    </div>

    <!-- 收藏滑上弹窗 -->
    <transition name="slideup">
        <div v-if="showCollect" class="collect-popup">
            <div class="popup-header">
                <span>收藏商品</span>
                <button class="close-btn" @click="showCollect = false">×</button>
            </div>

            <div class="popup-body">
                <p>规格</p>
                <div class="collect-list">
                    <button
                        v-for="(item, idx) in product.specifications"
                        :key="idx"
                        class="item"
                        @click="handleAddToCollect(item)"
                    >
                        {{ item.specName }}: {{ item.price }}元
                    </button>
                </div>
            </div>
        </div>
    </transition>

    <!-- 购买弹窗 -->
    <transition name="fade">
        <div v-if="showBuyModal" class="buy-modal">
            <div class="modal-content">
                <h3>前往购买</h3>
                <a :href="product.productUrl" target="_blank">{{ product.productUrl }}</a>
                <button class="close" @click="showBuyModal = false">关闭</button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ProductDetail, SpecItem } from "@/views/shop/types";
import { imgUrl } from "@/utils";
import { getProductItem } from "@/apis/shop";
import { useShopFavoriteStore } from "@/stores/shopFavorite";

const route = useRoute();
const router = useRouter();
const favorite = useShopFavoriteStore();
const id = Number(route.params.id);

const product = ref<ProductDetail>({
    id: 0,
    title: "",
    description: "",
    previewImages: [],
    createTime: "",
    detailImages: [],
    updateTime: "",
    cartCount: 0,
    viewCount: 0,
    productUrl: "",
    specifications: [],
    status: 0,
    shopAvatar: "",
    storeName: "",
});

const currentIndex = ref(0);
const currentImage = ref<string | undefined>("");
let timer: number | null = null;

function setCurrentImage(index: number) {
    currentIndex.value = index;
    currentImage.value = product.value.previewImages[index];
    resetAutoPlay();
}

function startAutoPlay() {
    if (!product.value.previewImages.length) return;
    timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % product.value.previewImages.length;
        currentImage.value = product.value.previewImages[currentIndex.value];
    }, 3000);
}

function stopAutoPlay() {
    if (timer) clearInterval(timer);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

async function handleAddToCollect(selectedSpec: SpecItem) {
    await favorite.add(selectedSpec);
}

onMounted(async () => {
    try {
        const res = await getProductItem(id);
        product.value = res.data;
        currentImage.value = product.value.previewImages[0] || "";
        startAutoPlay();
    } catch (err: any) {
        ElMessage.error(err.msg || "获取商品详情失败");
    }
});

onBeforeUnmount(stopAutoPlay);

const showCollect = ref(false);
const showBuyModal = ref(false);

function goToShopInfo() {
    router.push({ name: "ShopHome", params: { id: product.value.id } });
}
</script>

<style lang="scss" scoped>
.product-detail {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px;
    padding-bottom: 66px;

    /* 预览区 */
    .preview {
        .main-img-box {
            position: relative;
            width: 100%;
            padding-top: 100%;
            background: #f6f6f6;
            border-radius: 12px;

            .main-img {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 12px;
            }
        }

        .thumbs {
            margin-top: 10px;
            display: flex;
            gap: 10px;
            justify-content: center;

            img {
                width: 70px;
                height: 70px;
                border-radius: 8px;
                object-fit: cover;
                opacity: 0.6;
                cursor: pointer;
                transition: 0.2s;
                border: 2px solid transparent;

                &.active {
                    opacity: 1;
                    border-color: #42b983;
                }
                &:hover {
                    opacity: 1;
                }
            }
        }
    }

    /* 文本信息 */
    .info {
        h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 6px;
        }
        .desc {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
    }

    /* 商品长图 */
    .detail {
        .detail-img {
            width: 100%;
            border-radius: 8px;
            background: #f7f7f7;
            margin-bottom: 12px;
            object-fit: contain;
        }
    }
}

/* 底部栏 */
.bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-top: 1px solid #ccc;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    gap: 10px;
    z-index: 20;

    .merchant {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        flex: 1;

        img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        span {
            font-size: 14px;
        }
    }

    .collect-btn,
    .buy-btn {
        flex: 1;
        padding: 10px 0;
        border-radius: 8px;
        border: none;
        font-size: 15px;
        cursor: pointer;
    }

    .collect-btn {
        background: #f2f2f2;
    }

    .buy-btn {
        background: #42b983;
        color: #fff;
    }
}

/* 收藏弹窗 */
.collect-popup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 75vh;
    background: #fff;
    border-radius: 16px 16px 0 0;
    padding: 16px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    z-index: 30;

    .popup-header {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;

        .close-btn {
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
        }
    }

    .popup-body {
        font-size: 14px;
        color: #333;

        .collect-list {
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;

            .item {
                padding: 12px;
                border-radius: 10px;
                background: #f7f7f7;
                border: none;
                text-align: left;
                cursor: pointer;
            }
        }
    }
}

.slideup-enter-active {
    animation: slideUp 0.25s;
}
.slideup-leave-active {
    animation: slideUp 0.25s reverse;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

/* 购买弹窗 */
.buy-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 40;

    .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        width: 80%;
        text-align: center;

        h3 {
            margin-bottom: 10px;
        }

        a {
            display: block;
            margin: 12px 0;
            color: #42b983;
        }

        .close {
            padding: 8px 16px;
            background: #f2f2f2;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
