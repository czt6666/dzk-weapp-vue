<template>
    <div class="shop-page">
        <header class="shop-header">
            <div class="left">
                <img class="shop-avatar" :src="avatarUrl" alt="店铺头像" />
                <div class="shop-info">
                    <h1 class="shop-name">{{ shop.shopName }}</h1>
                    <div class="shop-meta">
                        <span class="village">{{ shop.village }}</span>
                        <span class="dot">·</span>
                        <span class="type">{{ shop.productType }}</span>
                        <span class="status" :class="{ open: shop.businessStatus === 1 }">{{
                            shop.businessStatus === 1 ? "营业中" : "休息中"
                        }}</span>
                    </div>
                    <p class="intro" v-if="shop.shopIntro">{{ shop.shopIntro }}</p>
                </div>
            </div>
            <div class="actions">
                <button class="btn primary">收藏小店</button>
                <button class="btn outline">联系客服</button>
            </div>
        </header>

        <section class="stats">
            <div class="stat">近半年下单 <strong>700+</strong></div>
            <div class="stat">平均 {{ avgShipHours }} 小时发货</div>
            <div class="stat">客服平均 {{ avgReplyMinutes }} 分钟内回复</div>
        </section>

        <nav class="category-nav">
            <div v-for="(c, i) in categories" :key="i" class="cat-card">
                <img :src="c.img" alt="分类图" />
                <div class="cat-title">{{ c.title }}</div>
            </div>
        </nav>

        <main class="product-area">
            <div class="product-list">
                <div v-for="product in products" :key="product.id" class="product-card">
                    <img class="product-img" :src="product.img" alt="商品图" />
                    <div class="product-body">
                        <h3 class="product-title">{{ product.title }}</h3>
                        <p class="product-sub">{{ product.sub || "好评如潮" }}</p>
                        <div class="product-footer">
                            <div class="price">
                                ¥<strong>{{ product.price }}</strong> 起
                            </div>
                            <div class="sold">已售 {{ product.sold }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// --------- types ----------
interface ShopData {
    id: number;
    shopName: string;
    shopAbbreviation: string;
    productType: string;
    businessStatus: number;
    village: string;
    shopIntro: string;
    shopAvatar: string;
    shopAddress: string;
    qualificationFiles: string;
    userId: number;
    createTime: string;
    updateTime: string;
    displayNo: number;
}

interface ApiResponse {
    code: number;
    msg: string | null;
    data: ShopData;
}

// ---------- 模拟接口返回（使用用户给的结构） ----------
const apiResponse: ApiResponse = {
    code: 200,
    msg: null,
    data: {
        id: 1,
        shopName: "小院子",
        shopAbbreviation: "xyz",
        productType: "杂货",
        businessStatus: 1,
        village: "田园村",
        shopIntro: "本店主营本地土特产，保证新鲜，欢迎选购~",
        shopAvatar: "c00b5d34-24bb-4330-be13-33dd2d06b85c.png",
        shopAddress: "",
        qualificationFiles: '{"license":[],"industry":[],"property":[],"other":[]}',
        userId: 10012,
        createTime: "2025-11-21T20:33:45",
        updateTime: "2025-11-21T20:34:09",
        displayNo: 0,
    },
};

// ---------- component state ----------
const shop = ref<ShopData>(apiResponse.data);

// 使用上传的本地图片（开发者提供的路径）作为演示头像。
// 该路径会被平台转换为可访问 URL：/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png
const avatarUrl = computed(() => {
    // 如果后端只返回文件名，这里拼接本地路径（在你的环境中替换为真实 CDN/接口地址）
    const filename = shop.value.shopAvatar || "";
    // dev: 使用上传文件作为占位图（平台将 /mnt/data/... 转换为 URL）
    if (filename && filename.includes(".png")) {
        return "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png";
    }
    return "";
});

// 下面是假数据的商品列表，示意页面布局与样式
const products = ref([
    {
        id: 1,
        title: "大庄科乡燕山板栗仁（礼盒）",
        sub: "3人送过｜先用后付",
        img: "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png",
        price: 40,
        sold: 257,
    },
    {
        id: 2,
        title: "大庄科乡核桃油（冷榨）",
        sub: "5人觉得“油色清亮”",
        img: "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png",
        price: 138,
        sold: 48,
    },
    // 更多占位商品
]);

const categories = ref([
    { title: "本店热销", img: "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png" },
    { title: "回头客常买", img: "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png" },
    { title: "大家都在送", img: "/mnt/data/adca921e-3668-4806-8203-6069b8787cea.png" },
]);

const avgShipHours = ref(13);
const avgReplyMinutes = ref(2);

onMounted(() => {
    // 实际使用中这里调用接口加载真实数据
    // loadShop().then(r => shop.value = r.data)
});
</script>

<style lang="scss" scoped>
$primary: #ff5a4d;
$muted: #707070;

.shop-page {
    max-width: 980px;
    margin: 16px auto;
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", Arial;
}

.shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .left {
        display: flex;
        gap: 12px;
        align-items: center;

        .shop-avatar {
            width: 88px;
            height: 88px;
            border-radius: 12px;
            object-fit: cover;
            border: 2px solid #f7f7f7;
            background: linear-gradient(180deg, #f9f9f9, #fff);
        }

        .shop-info {
            .shop-name {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
            }
            .shop-meta {
                margin-top: 6px;
                color: $muted;
                font-size: 12px;
                display: flex;
                gap: 6px;
                align-items: center;

                .status {
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 11px;
                    background: #f5f5f5;

                    &.open {
                        color: $primary;
                        background: rgba(255, 90, 77, 0.08);
                    }
                }
            }
            .intro {
                margin-top: 8px;
                color: $muted;
                font-size: 13px;
            }
        }
    }

    .actions {
        display: flex;
        gap: 8px;

        .btn {
            padding: 8px 14px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid transparent;

            &.primary {
                background: $primary;
                color: #fff;
            }

            &.outline {
                border-color: #eee;
                background: #fff;
                color: $muted;
            }
        }
    }
}

.stats {
    display: flex;
    gap: 18px;
    margin: 14px 0;
    color: $muted;
    font-size: 13px;

    .stat {
        background: #fafafa;
        padding: 10px 12px;
        border-radius: 8px;
    }
}

.category-nav {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;

    .cat-card {
        flex: 1 1 0;
        background: linear-gradient(180deg, #fff, #fbfbfb);
        border-radius: 10px;
        padding: 10px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(16, 24, 40, 0.03);

        img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
        }
        .cat-title {
            margin-top: 8px;
            font-weight: 600;
        }
    }
}

.product-area {
    .product-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;

        .product-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);

            .product-img {
                width: 100%;
                height: 160px;
                object-fit: cover;
            }
            .product-body {
                padding: 10px;
            }
            .product-title {
                margin: 0;
                font-size: 15px;
                font-weight: 700;
            }
            .product-sub {
                color: $muted;
                font-size: 12px;
                margin: 6px 0;
            }
            .product-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                .price {
                    color: $primary;
                }
                .sold {
                    color: $muted;
                    font-size: 12px;
                }
            }
        }
    }
}

@media (max-width: 720px) {
    .shop-page {
        padding: 12px;
    }
    .shop-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .actions {
        width: 100%;
        justify-content: space-between;
    }
}
</style>
