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
                        <ProductCard :item="item" @open="openProduct" />
                    </li>
                </ul>
            </SmartScrollList>
        </div>

        <!-- 商品详情弹窗 -->
        <transition name="page-fade" mode="out-in">
            <div v-if="showDetail" class="overlay" @click.self="showDetail = false">
                <div class="dialog">
                    <h3>{{ current?.title }}</h3>
                    <div class="images">
                        <img v-for="(d, i) in current?.details" :key="i" :src="d" alt="detail" />
                    </div>
                    <p class="desc">{{ current?.desc }}</p>
                    <div class="specs">
                        <div v-for="s in current?.specs" :key="s.name" class="spec-row">
                            {{ s.name }} — ¥{{ s.price }} · 库存 {{ s.stock }}
                        </div>
                    </div>
                    <div class="actions">
                        <a
                            v-if="current?.link"
                            :href="current.link"
                            target="_blank"
                            class="btn primary"
                            >去购买</a
                        >
                        <button class="btn" @click="showDetail = false">关闭</button>
                    </div>
                </div>
            </div>
        </transition>
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/shop/ProductCard.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import type { Product } from "./types";
import { debounce } from "@/utils/index";
import { ElMessage } from "element-plus";

let page = 1;
const pageSize = 6;
const q = ref("");
const list = ref<Product[]>([]);
const showDetail = ref(false);
const current = ref<Product | null>(null);

/** 模拟商品数据 **/
const allMockData: any[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `乡村好物 ${i + 1}`,
    desc: "这是一件来自乡村的纯天然农产或手工制品。",
    cover: `https://picsum.photos/seed/${i + 1}/300/200`,
    details: [
        `https://picsum.photos/seed/detail${i + 1}a/400/300`,
        `https://picsum.photos/seed/detail${i + 1}b/400/300`,
    ],
    specs: [
        { name: "标准款", price: 29.9 + i, stock: 100 - i },
        { name: "礼盒装", price: 49.9 + i, stock: 50 - i },
    ],
    link: "https://example.com",
}));
console.log(allMockData);

/** 模拟接口 **/
async function fetchData(page: number, pageSize: number, q: string) {
    await new Promise((r) => setTimeout(r, 400)); // 模拟延迟
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return allMockData.slice(start, end);
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

/** 打开商品详情 **/
function openProduct(item: Product) {
    current.value = item;
    showDetail.value = true;
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
</style>
