<template>
    <div class="product-detail">
        <!-- 左侧商品预览 -->
        <div class="preview">
            <img :src="imgUrl(currentImage)" class="main-img" />
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

        <!-- 右侧信息 -->
        <div class="info">
            <h1>{{ product.title }}</h1>
            <p class="desc">{{ product.description }}</p>

            <div class="specs">
                <h3>商品规格与售价</h3>
                <div class="spec-list">
                    <button
                        v-for="spec in product.specifications"
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
                <p>浏览量：{{ product.viewCount }}</p>
                <p>上架时间：{{ new Date(product.createTime).toLocaleDateString() }}</p>
            </div>
        </div>

        <div class="merchant">
            <img :src="imgUrl(product.avatar)" alt="" @click="goToShopInfo" />
            <span @click="goToShopInfo">{{ product.nickname }}</span>
        </div>

        <div class="detail">
            <img
                v-for="(img, idx) in product.detailImages"
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
                <a :href="product.link" target="_blank">{{ product.link }}</a>
                <div class="modal-actions">
                    <button @click="showBuyModal = false">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { ProductDetail, SpecItem } from "@/views/shop/types";
import { useCartStore } from "@/stores/cart";
import { imgUrl } from "@/utils";
import { getProductItem } from "@/apis/shop";

const cart = useCartStore();
const showBuyModal = ref(false);
const loading = ref(false);
const product = ref<ProductDetail>({
    id: 0,
    title: "",
    description: "",
    previewImages: [],
    link: "",
    createTime: "",
    detailImages: [],
    updateTime: "",
    cartCount: 0,
    viewCount: 0,
    productUrl: "",
    specifications: [],
    status: 0,
    avatar: "",
    nickname: "",
});
const selectedSpec = ref<SpecItem | null>(product.value.specifications[0] || null);
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

// ========== 图片切换逻辑 ==========
const currentIndex = ref(0);
const currentImage = ref(product.value.previewImages[0]);
let timer: number | null = null;

// 点击切换主图
function setCurrentImage(index: number) {
    currentIndex.value = index;
    currentImage.value = product.value.previewImages[index];
    resetAutoPlay();
}

// 自动播放（3秒切换一张）
function startAutoPlay() {
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

onMounted(startAutoPlay);
onBeforeUnmount(stopAutoPlay);

// 收藏逻辑（调用购物车逻辑）
async function onCollect() {
    if (!selectedSpec.value) return alert("请选择规格");
    loading.value = true;
    try {
        await cart.add(product.value, selectedSpec.value);
    } catch (err: any) {
        alert(err.message);
    } finally {
        loading.value = false;
    }
}

function goToShopInfo() {
    router.push({ name: "ShopHome", params: { id: product.value.id } });
}

onMounted(async () => {
    try {
        const res = await getProductItem(id);

        if (!res.data) return ElMessage.error("商品获取失败");
        product.value = res.data;
    } catch {
        ElMessage.error("商品获取失败");
    }

    loading.value = false;
});
</script>

<style scoped>
.product-detail {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    flex-wrap: wrap;
}

/* 左侧图片区 */
.preview {
    width: 100%;
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
    width: 100%;
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

.merchant {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    img {
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    span {
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
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
