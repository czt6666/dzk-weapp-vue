<template>
    <div class="product-detail">
        <!-- 左侧商品预览 -->
        <div class="preview">
            <img :src="currentImage" class="main-img" />
            <div class="thumbs">
                <img
                    v-for="(img, idx) in props.product.previewImages"
                    :key="idx"
                    :src="imgUrl(img)"
                    :class="{ active: idx === currentIndex }"
                    @click="setCurrentImage(idx)"
                />
            </div>
        </div>

        <!-- 右侧信息 -->
        <div class="info">
            <h1>{{ props.product.title }}</h1>
            <p class="desc">{{ props.product.description }}</p>

            <div class="specs">
                <h3>商品规格与售价</h3>
                <div class="spec-list">
                    <button
                        v-for="spec in props.product.specifications"
                        :key="spec.id"
                        :class="{ active: selectedSpec?.id === spec.id }"
                        :disabled="spec.stock <= 0"
                        @click="selectedSpec = spec"
                    >
                        {{ spec.specName }}（¥{{ spec.price }}）
                    </button>
                </div>
            </div>

            <div class="meta">
                <p>浏览量：{{ props.product.viewCount }}</p>
                <p>上架时间：{{ new Date(props.product.createTime).toLocaleDateString() }}</p>
            </div>
        </div>

        <div class="detail">
            <img
                v-for="(img, idx) in props.product.detailImages"
                :key="idx"
                :src="imgUrl(img)"
                class="detail-img"
            />
        </div>

        <!-- 底部操作区 -->
        <div class="bottom-bar">
            <!-- 收藏按钮 -->
            <button class="add-btn" :disabled="!selectedSpec || loading" @click="onCollect">
                {{ loading ? "处理中..." : "收藏商品" }}
            </button>
            <button class="buy" @click="showBuyModal = true">去购买</button>
        </div>

        <!-- 弹出购买链接 -->
        <div v-if="showBuyModal" class="buy-modal">
            <div class="modal-content">
                <h3>前往购买</h3>
                <p>点击下方链接前往官方销售页：</p>
                <a :href="props.product.link" target="_blank">{{ props.product.link }}</a>
                <div class="modal-actions">
                    <button @click="showBuyModal = false">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Product, SpecItem } from "@/views/shop/types";
import { useCartStore } from "@/stores/cart";
import { imgUrl } from "@/utils";

const props = {
    product: {
        id: 1,
        title: `乡村好物 ${1}`,
        description: "这是一件来自乡村的纯天然农产或手工制品。",
        previewImages: [
            `https://picsum.photos/seed/preview${1}a/600/400`,
            `https://picsum.photos/seed/preview${1}b/600/400`,
            `https://picsum.photos/seed/preview${1}c/600/400`,
        ],
        link: "https://example.com",
        createTime: "2025-11-06T08:18:37.000+00:00",
        detailImages: [
            "/uploads/e3c7d9b2-34a5-4d15-9b4e-edb7cd1ef500.png",
            "/uploads/93ce033c-1fb7-4d1f-9698-a8a05cf204b3.png",
        ],
        updateTime: "2025-11-06T08:18:37.000+00:00",
        cartCount: 0,
        viewCount: 12,
        productUrl: "123",
        specifications: [
            { specName: "标准装", price: 99, id: 1, stock: 123 },
            { specName: "豪华装", price: 199, id: 2, stock: 12 },
        ],
        status: 1,
    },
};

const selectedSpec = ref<SpecItem | null>(props.product.specifications[0] || null);
const cart = useCartStore();
const showBuyModal = ref(false);
const loading = ref(false);

// ========== 图片切换逻辑 ==========
const currentIndex = ref(0);
const currentImage = ref(props.product.previewImages[0]);
let timer: number | null = null;

// 点击切换主图
function setCurrentImage(index: number) {
    currentIndex.value = index;
    currentImage.value = props.product.previewImages[index];
    resetAutoPlay();
}

// 自动播放（3秒切换一张）
function startAutoPlay() {
    timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % props.product.previewImages.length;
        currentImage.value = props.product.previewImages[currentIndex.value];
    }, 3000);
}

function stopAutoPlay() {
    if (timer) clearInterval(timer);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

onMounted(startAutoPlay);
onBeforeUnmount(stopAutoPlay);

// 收藏逻辑（调用购物车逻辑）
async function onCollect() {
    if (!selectedSpec.value) return alert("请选择规格");
    loading.value = true;
    try {
        await cart.add(props.product, selectedSpec.value);
    } catch (err: any) {
        alert(err.message);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.product-detail {
    overflow-y: auto;
    height: 100%;
    display: flex;
    gap: 2rem;
    padding: 1rem 1rem 80px;
    flex-wrap: wrap;
}

/* 左侧图片区 */
.preview {
    flex: 1;
    min-width: 320px;
    position: relative;
}
.main-img {
    width: 100%;
    border-radius: 12px;
    object-fit: cover;
    transition: opacity 0.5s ease;
}
.thumbs {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: center;
}
.thumbs img {
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid transparent;
    opacity: 0.7;
    transition: all 0.3s;
}
.thumbs img:hover {
    opacity: 1;
}
.thumbs img.active {
    border-color: #42b983;
    opacity: 1;
}

/* 右侧信息区 */
.info {
    flex: 1;
    min-width: 300px;
}
.spec-list {
    margin-top: 0.5rem;
}
.spec-list button {
    margin: 0.4rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    cursor: pointer;
    background: white;
}
.spec-list .active {
    border-color: #42b983;
    color: #42b983;
    background: #e8f5ee;
}
.fav-btn {
    margin-top: 1rem;
    background: none;
    border: none;
    color: #ff5a5f;
    font-size: 1rem;
    cursor: pointer;
}

/* 底部操作栏 */
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 10;
}
.bottom-bar button {
    flex: 1;
    margin: 0 10px;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}
.favorite {
    background: #f7f7f7;
}
.buy {
    background: #42b983;
    color: white;
}
.detail-img {
    width: 100%;
    margin-bottom: 12px;
}

/* 弹窗样式 */
.buy-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    width: 300px;
    text-align: center;
}
.modal-content a {
    display: block;
    margin: 1rem 0;
    color: #42b983;
    word-break: break-all;
}
.modal-actions button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: #eee;
}
</style>
