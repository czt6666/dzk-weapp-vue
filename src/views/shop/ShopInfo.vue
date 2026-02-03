<template>
    <div class="product-detail">
        <!-- 预览区：轮播主图 + 缩略图 -->
        <div class="preview">
            <div class="main-img-box">
                <el-image
                    :src="imgUrl(currentImage)"
                    :preview-src-list="previewImageList"
                    :initial-index="currentIndex"
                    :preview-teleported="true"
                    class="main-img"
                    fit="contain"
                />
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
                :preview-src-list="detailImageList"
                :initial-index="idx"
                :preview-teleported="true"
                class="detail-img"
                fit="contain"
            />
        </div>
    </div>
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
        <div class="merchant">
            <el-image :src="imgUrl(product.shopAvatar)" fit="cover" />
            <span>{{ product.storeName }}</span>
        </div>

        <button
            class="collect-btn"
            @click="
                showCollect = true;
                onCollectPopupShow();
            "
        >
            加入购物车
        </button>
        <button class="buy-btn" @click="showBuyModal = true">购买</button>
    </div>

    <!-- 加入购物车弹窗 -->
    <transition name="slideup">
        <div v-if="showCollect" class="collect-popup">
            <div class="popup-header">
                <span>加入购物车</span>
                <button
                    class="close-btn"
                    @click="
                        showCollect = false;
                        selectedSpec = null;
                    "
                >
                    ×
                </button>
            </div>

            <div class="popup-body">
                <p>规格</p>
                <div class="collect-list">
                    <button
                        v-for="(item, idx) in product.specifications"
                        :key="idx"
                        class="item"
                        :class="{ active: selectedSpec?.id === item.id }"
                        @click="selectedSpec = item"
                    >
                        {{ item.specName }}: {{ item.price }}元
                    </button>
                </div>
            </div>

            <div class="popup-footer">
                <button
                    class="collect-confirm-btn"
                    @click="handleConfirmCollect"
                    :disabled="!selectedSpec"
                >
                    加入购物车
                </button>
            </div>
        </div>
    </transition>

    <!-- 购买弹窗 -->
    <transition name="fade">
        <div v-if="showBuyModal" class="buy-modal">
            <div class="modal-content">
                <h3>前往购买</h3>
                <img class="merchant-img" :src="imgUrl(product.merchantPosterImg)" alt="" />
                <div>
                    <span v-if="hasMiniProgram" @click="jumpToWx()">
                        打开小程序购买
                    </span>
                    <span v-else-if="hasMicroShop" @click="openMicroShop()">
                        打开微店购买
                    </span>
                    <span v-else>该商品暂无可线上的购买渠道</span>
                </div>
                <button class="close" @click="showBuyModal = false">关闭</button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts" name="ShopInfo">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { IProductDetail, ISpecItem } from "@/views/shop/types";
import { imgUrl } from "@/utils";
import { getProductItem } from "@/apis/shop";
import { useShopFavoriteStore } from "@/stores/shopFavorite";
import { jumpToMiniProgram, openMicroShop } from "@/utils/purchase";

const route = useRoute();
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
    specifications: [],
    status: 0,
    shopAvatar: "",
    storeName: "",
    uploadMethodStatus: 0,
    miniProgramAppid: "",
    miniProgramPath: "",
    microShopAppid: "",
    microShopProductId: "",
    merchantPosterImg: "",
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

async function handleConfirmCollect() {
    if (!selectedSpec.value) {
        ElMessage.warning("请选择规格");
        return;
    }
    await favorite.add(selectedSpec.value);
    showCollect.value = false;
    selectedSpec.value = null;
}

// 监听弹窗显示，默认选择第一个规格
function onCollectPopupShow() {
    if (product.value.specifications && product.value.specifications.length > 0) {
        const firstSpec = product.value.specifications[0];
        if (firstSpec) {
            selectedSpec.value = firstSpec;
        }
    }
}

// 跳转到微信小程序
function jumpToWx() {
    jumpToMiniProgram(
        product.value.miniProgramAppid || "",
        product.value.miniProgramPath || "",
        "商品信息错误，跳转失败",
    );
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
const selectedSpec = ref<ISpecItem | null>(null);

// 检查是否有小程序购买渠道
const hasMiniProgram = computed(() => {
    return !!product.value.miniProgramAppid && !!product.value.miniProgramPath;
});

// 检查是否有微店购买渠道
const hasMicroShop = computed(() => {
    return !!product.value.microShopAppid && !!product.value.microShopProductId;
});

// 预览图片列表
const previewImageList = computed(() => {
    return product.value.previewImages.map((img) => imgUrl(img));
});

// 详情图片列表
const detailImageList = computed(() => {
    return product.value.detailImages.map((img) => imgUrl(img));
});

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
                cursor: pointer;
                transition: transform 0.2s ease;

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
                &:active {
                    opacity: 0.8;
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
            white-space: pre-wrap;
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
            cursor: pointer;
            transition: transform 0.2s ease;

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
            min-width: 32px;
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

        &:active {
            background: rgba(0, 0, 0, 0.1);
        }
    }

    .buy-btn {
        background: $color-green-primary;
        color: #fff;

        &:active {
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
        padding-bottom: 80px; // 为底部按钮留出空间

        .collect-list {
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;

            .item {
                padding: $spacing-md;
                border-radius: $radius-medium;
                background: rgba(0, 0, 0, 0.03);
                border: 2px solid transparent;
                text-align: left;
                cursor: pointer;
                transition: $transition-base;

                &:active {
                    background: $overlay-green-light;
                }

                &.active {
                    background: $overlay-green-light;
                    border-color: $color-green-primary;
                    color: $color-green-primary;
                    font-weight: 600;
                }
            }
        }
    }

    .popup-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: $spacing-md;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.98);

        .collect-confirm-btn {
            width: 100%;
            padding: 14px 0;
            border-radius: $radius-medium;
            border: none;
            background: $color-green-primary;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: $transition-base;

            &:active:not(:disabled) {
                background: color.adjust($color-green-primary, $lightness: -10%);
                transform: scale(0.98);
            }

            &:disabled {
                background: rgba(0, 0, 0, 0.1);
                color: rgba(0, 0, 0, 0.3);
                cursor: not-allowed;
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

        .merchant-img {
            width: 100%;
            border-radius: 10px;
            margin-bottom: $spacing-md;
        }

        span {
            display: block;
            color: $color-green-primary;
            margin-bottom: $spacing-md;
            text-decoration: underline;
        }

        .close {
            padding: $spacing-sm $spacing-lg;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: $radius-small;
            cursor: pointer;
            transition: $transition-base;

            &:active {
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
