<template>
    <section class="shop-list">
        <header class="hero">
            <h1>乡村好物 · 精选</h1>
            <p class="sub">天然 / 朴实 / 精选来自乡间的手作与农产</p>

            <!-- 搜索框 -->
            <div class="controls">
                <div class="search-box">
                    <i class="icon-search"></i>
                    <input v-model="q" placeholder="搜索商品名称..." @keyup.enter="onSearch" />
                </div>
                <button class="btn primary" @click="onSearch">搜索</button>
            </div>
        </header>

        <!-- 商品列表 -->
        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <li v-for="item in list" :key="item.id">
                        <ProductCard :item="item" @open="openProduct" @add-cart="addToCart" />
                    </li>
                </ul>
            </SmartScrollList>
        </div>
        <!-- 底部购物车图标 -->
        <div class="cart-float" @click="goFavorites">
            <span>⭐</span>
            <span class="cart-count">{{ cart.list.length }}</span>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/shop/ProductCard.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import type { Product } from "@/views/shop/types";
import { getShopList } from "@/apis/shop";
import { debounce } from "@/utils/index";
import { ElMessage } from "element-plus";
import { useCartStore } from "@/stores/cart";

let page = 1;
const pageSize = 6;
const q = ref("");
const list = ref<Product[]>([]);
const cart = useCartStore();
const router = useRouter();

/** 模拟商品数据 **/
const allMockData: any[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `乡村好物 ${i + 1}`,
    description: "这是一件来自乡村的纯天然农产或手工制品。",
    previewImages: [
        `https://picsum.photos/seed/preview${i + 1}a/300/200`,
        `https://picsum.photos/seed/preview${i + 1}b/300/200`,
    ],
    link: "https://example.com",
    createTime: "2025-11-06T08:18:37.000+00:00",
    detailImages: [
        "/uploads/e3c7d9b2-34a5-4d15-9b4e-edb7cd1ef500.png",
        "/uploads/93ce033c-1fb7-4d1f-9698-a8a05cf204b3.png",
    ],
    updateTime: "2025-11-06T08:18:37.000+00:00",
    cartCount: 0,
    viewCount: 0,
    productUrl: "123",
    specifications: [
        {
            specName: "123",
            price: 123,
            id: 1,
            stock: 123,
        },
    ],
    status: 1,
}));
console.log(allMockData);

/** 接口（带搜索能力） **/
// async function fetchData(page: number, pageSize: number, q: string) {
//     await new Promise((r) => setTimeout(r, 400)); // 模拟延迟
//     const keyword = q.trim().toLowerCase();

//     // 先在全部 mock 商品里按标题 / 描述过滤
//     const source = keyword
//         ? allMockData.filter((item) => {
//             const title = String(item.title || "").toLowerCase();
//             const desc = String(item.description || "").toLowerCase();
//             return title.includes(keyword) || desc.includes(keyword);
//         })
//         : allMockData;

//     // 再做分页
//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     return source.slice(start, end);
// }

async function fetchData(page: number, pageSize: number, q: string) {
    const res = await getShopList({ page, pageSize });

    if (list.value.length + res.data.records.length > res.data.total) {
        return [];
    }
    const resList = res?.data?.records || [];

    return resList;
}

/** 搜索 **/
async function onSearch() {
    page = 1;
    list.value = [];
    list.value = await fetchData(page, pageSize, q.value);
    if (!list.value.length) ElMessage.warning("没有找到相关商品");
}

async function onRefresh() {
    try {
        page = 1;
        list.value = [];
        list.value = await fetchData(page, pageSize, q.value);
        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取商品列表失败");
        return list.value;
    }
}

async function onLoadMore() {
    try {
        page++;
        const newList = await fetchData(page, pageSize, q.value);
        if (!newList.length) {
            ElMessage.success("没有更多数据了");
            page--;
            return list.value;
        }
        list.value.push(...newList);
        return list.value;
    } catch (err: any) {
        ElMessage.error(err.msg);
        page--;
        return list.value;
    }
}

/** 打开详情页 **/
function openProduct(item: Product) {
    router.push(`/shop/${item.id}`);
}

function addToCart(item: Product) {
    const exist = cart.value.find((p) => p.id === item.id);
    if (!exist) {
        cart.value.push(item);
        ElMessage.success(`已添加「${item.title}」到购物车`);
    } else {
        ElMessage.info("该商品已在购物车中");
    }
}

/** 进入收藏夹页 **/
function goFavorites() {
    router.push("/shop/favorites");
}
</script>

<style lang="scss" scoped>
.shop-list {
    padding-top: 24px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #fbf7ef, #fff);
}

.hero {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
    padding: 0 12px;

    h1 {
        color: #34523a;
        font-weight: bold;
    }

    .sub {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .search-box {
        flex: 1;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 24px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        transition: all 0.2s ease;

        &:focus-within {
            border-color: #7fb069;
            box-shadow: 0 0 4px rgba(127, 176, 105, 0.3);
        }

        .icon-search {
            width: 16px;
            height: 16px;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%237fb069" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"/></svg>')
                no-repeat center/contain;
            margin-right: 6px;
        }

        input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            padding: 4px 0;
        }
    }

    .btn.primary {
        background: #7fb069;
        color: #fff;
        border: none;
        border-radius: 24px;
        padding: 6px 16px;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
            background: #6a945c;
        }
    }
}

.list {
    flex: 1;
    height: 500px;

    .scroll-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
}
.dialog {
    background: #fff;
    padding: 18px;
    border-radius: 8px;
    max-width: 900px;
    width: 90%;
    max-height: 90%;
    overflow: auto;
}
.images {
    display: flex;
    gap: 8px;
    img {
        max-width: 220px;
        border-radius: 6px;
    }
}
.primary {
    background: #7fb069;
    color: #fff;
}
.cart-float {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    .cart-count {
        position: absolute;
        top: -2px;
        right: -4px;
        background: #db4437;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 12px;
    }
}
</style>
