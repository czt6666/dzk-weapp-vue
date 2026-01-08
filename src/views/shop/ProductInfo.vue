<template>
    <div class="product-detail">
        <!-- 预览区：轮播主图 + 缩略图 -->
        <div class="preview">
            <div class="main-img-box">
                <el-image :src="imgUrl(currentImage)" class="main-img" fit="contain" />
            </div>

            <div class="thumbs">
                <el-image
                    v-for="(img, idx) in product.previewImages"
                    :key="idx"
                    :src="imgUrl(img)"
                    :class="{ active: idx === currentIndex }"
                    @click="setCurrentImage(idx)"
                    fit="cover"
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
            <el-image
                v-for="(img, idx) in product.detailImages"
                :key="idx"
                :src="imgUrl(img)"
                class="detail-img"
                fit="contain"
            />
        </div>
    </div>
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
        <div class="merchant" @click="goToShopInfo">
            <el-image :src="imgUrl(product.shopAvatar)" fit="cover" />
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
import type { IProductDetail, ISpecItem } from "@/views/shop/types";
import { imgUrl } from "@/utils";
import { getProductItem } from "@/apis/shop";
import { useShopFavoriteStore } from "@/stores/shopFavorite";

const route = useRoute();
const router = useRouter();
const favorite = useShopFavoriteStore();
const id = Number(route.params.id);

const product = ref<IProductDetail>({
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

async function handleAddToCollect(selectedSpec: ISpecItem) {
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
@use "@/styles/variables.scss" as *;
@use "sass:color";

.product-detail {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-md;
    padding-bottom: 66px;
    background: $bg-gradient-main;

    /* 预览区 */
    .preview {
        .main-img-box {
            position: relative;
            width: 100%;
            padding-top: 100%;
            background: #f6f6f6;
            border-radius: 12px;

            :deep(.main-img) {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: $radius-medium;
                }
            }
        }

        .thumbs {
            margin-top: $spacing-md;
            display: flex;
            gap: $spacing-md;
            justify-content: center;

            :deep(.el-image) {
                width: 70px;
                height: 70px;
                border-radius: $radius-small;
                opacity: 0.6;
                cursor: pointer;
                transition: $transition-fast;
                border: 2px solid transparent;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                &.active {
                    opacity: 1;
                    border-color: $color-green-primary;
                }
                &:hover {
                    opacity: 1;
                }
            }
        }
    }

    /* 文本信息 */
    .info {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border-radius: $radius-large;
        padding: $spacing-md;
        box-shadow: $shadow-sm;

        h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 6px;
            color: $color-green-primary;
        }
        .desc {
            color: $text-secondary;
            font-size: 14px;
            line-height: 1.6;
        }
    }

    /* 商品长图 */
    .detail {
        :deep(.detail-img) {
            width: 100%;
            border-radius: $radius-small;
            background: rgba(255, 255, 255, 0.8);
            margin-bottom: $spacing-md;
            box-shadow: $shadow-sm;

            img {
                width: 100%;
                object-fit: contain;
            }
        }
    }
}

/* 底部栏 */
.bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 $spacing-md;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: $shadow-md;
    gap: $spacing-md;
    z-index: 20;

    .merchant {
        overflow: hidden;
        display: flex;
        align-items: center;
        width: 20%;
        gap: 8px;
        cursor: pointer;
        flex: 1;

        :deep(.el-image) {
            width: 32px;
            height: 32px;
            border-radius: 50%;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        span {
            font-size: 14px;
        }
    }

    .collect-btn,
    .buy-btn {
        flex: 1;
        padding: 10px 0;
        border-radius: $radius-small;
        border: none;
        font-size: 15px;
        cursor: pointer;
        transition: $transition-base;
        font-weight: 600;

        &:active {
            transform: scale(0.98);
        }
    }

    .collect-btn {
        background: rgba(0, 0, 0, 0.05);
        color: $text-primary;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }
    }

    .buy-btn {
        background: $color-green-primary;
        color: #fff;

        &:hover {
            background: color.adjust($color-green-primary, $lightness: -10%);
        }
    }
}

/* 收藏弹窗 */
.collect-popup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 75vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: $radius-large $radius-large 0 0;
    padding: $spacing-md;
    box-shadow: $shadow-xl;
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
                padding: $spacing-md;
                border-radius: $radius-medium;
                background: rgba(0, 0, 0, 0.03);
                border: none;
                text-align: left;
                cursor: pointer;
                transition: $transition-base;

                &:hover {
                    background: $overlay-green-light;
                }
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
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: $spacing-md;
        border-radius: $radius-medium;
        width: 80%;
        text-align: center;
        box-shadow: $shadow-xl;

        h3 {
            margin-bottom: $spacing-md;
            color: $color-green-primary;
        }

        a {
            display: block;
            margin: $spacing-md 0;
            color: $color-green-primary;
            text-decoration: underline;
        }

        .close {
            padding: $spacing-sm $spacing-lg;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: $radius-small;
            cursor: pointer;
            transition: $transition-base;

            &:hover {
                background: rgba(0, 0, 0, 0.1);
            }
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
