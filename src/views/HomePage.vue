<template>
    <div class="home">
        <!-- 顶部横幅：Logo + 风景轮播图 -->
        <header class="header-banner">
            <div class="banner-overlay"></div>
            <div class="logo-section">
                <div class="logo">
                    <span class="logo-icon">🚩</span>
                    <div class="logo-text">
                        <h1>大庄科乡</h1>
                        <p>传承·振兴</p>
                    </div>
                </div>
            </div>
            <div class="carousel-wrapper">
                <Carousel :images="bannerImages" />
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="main-content">
            <!-- 1. 今日新闻 - 横向滚动 -->
            <section class="news-section">
                <div class="section-header">
                    <h2 class="section-title red-theme">📰 今日新闻</h2>
                    <span class="view-all" @click="goToNewsList">查看全部 →</span>
                </div>
                <div class="news-scroll-container" ref="newsScrollRef">
                    <div class="news-scroll-wrapper">
                        <div
                            v-for="item in newsList"
                            :key="item.id"
                            class="news-item"
                            @click="goToNews(item.id)"
                        >
                            <div class="news-image">
                                <img :src="imgUrl(item.imageUrl)" :alt="item.title" />
                                <div class="news-overlay red-overlay"></div>
                            </div>
                            <div class="news-content">
                                <h3 class="news-title">{{ item.title }}</h3>
                                <span class="news-date">{{ formatDate(item.createTime) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 2. 民宿概览 - 横向轮播 -->
            <section class="hotel-section">
                <div class="section-header">
                    <h2 class="section-title green-theme">🏡 推荐民宿</h2>
                    <span class="view-all" @click="goToHotelList">查看全部 →</span>
                </div>
                <HotelCarousel
                    :hotels="hotelList"
                    :height="240"
                    :show-buttons="true"
                    @item-click="(hotel) => goToHotel(hotel.id)"
                />
            </section>

            <!-- 3. 特色特产 - 瀑布流 -->
            <section class="product-section">
                <div class="section-header">
                    <h2 class="section-title green-theme">🛍️ 特色特产</h2>
                    <span class="view-all" @click="goToProductList">查看全部 →</span>
                </div>
                <div class="product-waterfall">
                    <div
                        v-for="product in productList"
                        :key="product.id"
                        class="product-item"
                        @click="goToProduct(product.id)"
                    >
                        <div class="product-image">
                            <img :src="imgUrl(product.previewImages[0])" :alt="product.title" />
                            <div class="product-label green-label">
                                <span class="product-price"
                                    >¥{{ product.specifications[0].price || "询价" }}</span
                                >
                            </div>
                        </div>
                        <h4 class="product-title">{{ product.title }}</h4>
                    </div>
                </div>
            </section>

            <!-- 4. 乡村美食 - 竖向列表 -->
            <section class="food-section">
                <div class="section-header">
                    <h2 class="section-title green-theme">🍜 乡村美食</h2>
                    <span class="view-all" @click="goToRestaurantList">查看全部 →</span>
                </div>
                <div class="food-list">
                    <div
                        v-for="restaurant in restaurantList"
                        :key="restaurant.id"
                        class="food-item"
                        @click="goToRestaurant(restaurant.id)"
                    >
                        <div class="food-image">
                            <img :src="imgUrl(restaurant.logoUrl)" :alt="restaurant.name" />
                        </div>
                        <div class="food-content green-content">
                            <h3 class="food-name">{{ restaurant.name }}</h3>
                            <p class="food-desc">{{ restaurant.notice || "田园风味，健康美味" }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 5. 红色旅游 - 叠加式长图 -->
            <section class="red-tour-section">
                <div
                    class="red-tour-banner"
                    :style="{ backgroundImage: `url(${redTourBg})` }"
                    @click="goToTour"
                >
                    <div class="red-tour-overlay"></div>
                    <div class="red-tour-content">
                        <h2 class="red-tour-title">🗺️ 红色旅游</h2>
                        <p class="red-tour-desc">{{ tourDesc || "传承红色精神，体验革命文化" }}</p>
                        <div class="red-tour-arrow">→</div>
                    </div>
                </div>
            </section>

            <!-- 6. 研学基地 - 叠加式长图 -->
            <section class="study-section">
                <div
                    class="study-banner"
                    :style="{ backgroundImage: `url(${studyBg})` }"
                    @click="goToStudy"
                >
                    <div class="study-overlay"></div>
                    <div class="study-content">
                        <h2 class="study-title">📚 研学基地</h2>
                        <p class="study-desc">{{ studyDesc || "探索知识，传承文化" }}</p>
                        <div class="study-arrow">→</div>
                    </div>
                </div>
            </section>

            <!-- 7. 康养生活 - 叠加式长图 -->
            <section class="retirement-section">
                <div
                    class="retirement-banner"
                    :style="{ backgroundImage: `url(${retirementBg})` }"
                    @click="goToRetirement"
                >
                    <div class="retirement-overlay"></div>
                    <div class="retirement-content">
                        <h2 class="retirement-title">🌿 康养生活</h2>
                        <p class="retirement-desc">{{ retirementDesc || "健康生活，颐养天年" }}</p>
                        <div class="retirement-arrow">→</div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getNewsList } from "@/apis/news";
import { getHotelList } from "@/apis/hotel";
import { getProductList } from "@/apis/shop";
import { getRestaurantList } from "@/apis/restaurant";
import { getTourRouteList } from "@/apis/tour";
import { getStudyPlanList } from "@/apis/study";
import { getRetirementStationList } from "@/apis/retirement";
import { imgUrl } from "@/utils";
import Carousel from "@/components/base/Carousel.vue";
import HotelCarousel from "@/components/HotelCarousel.vue";
import spring1 from "@/assets/swiper/spring1.jpg";
import summer1 from "@/assets/swiper/summer1.jpg";
import autumn1 from "@/assets/swiper/autumn1.png";
import winter1 from "@/assets/swiper/winter1.jpg";
import spring2 from "@/assets/swiper/spring2.jpg";
import summer2 from "@/assets/swiper/summer2.jpg";

const router = useRouter();

// 轮播图
const bannerImages = [spring1, summer1, autumn1, winter1];

// 背景图
const redTourBg = spring2;
const studyBg = summer2;
const retirementBg = autumn1;

// 数据
const newsList = ref<any[]>([]);
const hotelList = ref<any[]>([]);
const productList = ref<any[]>([]);
const restaurantList = ref<any[]>([]);
const tourDesc = ref("");
const studyDesc = ref("");
const retirementDesc = ref("");

// 格式化日期
function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}`;
}

// 数据加载
async function loadNews() {
    try {
        const res = await getNewsList({ page: 1, pageSize: 10 });
        newsList.value = (res.data?.list || []).slice(0, 5);
    } catch (err: any) {
        console.error("加载新闻失败:", err);
    }
}

async function loadHotels() {
    try {
        const res = await getHotelList({ page: 1, pageSize: 5 });
        hotelList.value = res.data?.records || [];
    } catch (err: any) {
        console.error("加载民宿失败:", err);
    }
}

async function loadProducts() {
    try {
        const res = await getProductList({ page: 1, pageRow: 6 });
        productList.value = res.data?.list || res.data?.records || [];
    } catch (err: any) {
        console.error("加载特产失败:", err);
    }
}

async function loadRestaurants() {
    try {
        const res = await getRestaurantList({});
        restaurantList.value = (res.data.records || []).slice(0, 3);
    } catch (err: any) {
        console.error("加载美食失败:", err);
    }
}

// 导航
function goToNews(id: number) {
    router.push(`/news/${id}`);
}

function goToHotel(id: number) {
    router.push(`/hotels/${id}`);
}

function goToProduct(id: number) {
    router.push(`/shop/${id}`);
}

function goToRestaurant(id: number) {
    router.push({
        name: "RestaurantOrder",
        query: { id, name: restaurantList.value.find((r) => r.id === id)?.name },
    });
}

function goToTour() {
    router.push("/tour");
}

function goToStudy() {
    router.push("/study");
}

function goToRetirement() {
    router.push("/retirement");
}

// 跳转到列表页
function goToNewsList() {
    router.push("/news");
}

function goToHotelList() {
    router.push("/hotels");
}

function goToProductList() {
    router.push("/shop");
}

function goToRestaurantList() {
    router.push("/restaurant");
}

// 加载旅游数据
async function loadTour() {
    try {
        const res = await getTourRouteList({ page: 1, pageSize: 1 });
        const tour = res.data?.records?.[0] || res.data?.list?.[0];
        if (tour) {
            tourDesc.value = tour.name || "传承红色精神，体验革命文化";
        }
    } catch (err: any) {
        console.error("加载旅游数据失败:", err);
    }
}

// 加载研学数据
async function loadStudy() {
    try {
        const res = await getStudyPlanList({ page: 1, pageSize: 1 });
        const study = res.data?.list?.[0] || res.data?.records?.[0];
        if (study) {
            studyDesc.value = study.planName || "探索知识，传承文化";
        }
    } catch (err: any) {
        console.error("加载研学数据失败:", err);
    }
}

// 加载康养数据
async function loadRetirement() {
    try {
        const res = await getRetirementStationList({ page: 1, pageSize: 1 });
        const retirement = res.data?.records?.[0];
        if (retirement) {
            retirementDesc.value = retirement.name || "健康生活，颐养天年";
        }
    } catch (err: any) {
        console.error("加载康养数据失败:", err);
    }
}

onMounted(() => {
    loadNews();
    loadHotels();
    loadProducts();
    loadRestaurants();
    loadTour();
    loadStudy();
    loadRetirement();
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.home {
    height: 100%;
    background: $bg-gradient-main;
    overflow-x: hidden;
    overflow-y: auto;
}

// 顶部横幅
.header-banner {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;

    .banner-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $overlay-red-banner;
        z-index: 2;
        pointer-events: none;
    }

    .logo-section {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 3;

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;

            .logo-icon {
                font-size: 40px;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            }

            .logo-text {
                color: white;
                text-shadow: $shadow-text;

                h1 {
                    font-size: 28px;
                    font-weight: 600;
                    margin: 0;
                    letter-spacing: 2px;
                }

                p {
                    font-size: 14px;
                    margin: 4px 0 0 0;
                    opacity: 0.95;
                    letter-spacing: 4px;
                }
            }
        }
    }

    .carousel-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }
}

// 主内容区域
.main-content {
    padding: $spacing-md $spacing-md $spacing-md;
    max-width: 1200px;
    margin: 0 auto;
}

// 通用区块样式
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
        font-size: 22px;
        font-weight: 600;
        margin: 0;
        letter-spacing: 1px;

        &.red-theme {
            color: $color-red-primary;
        }

        &.green-theme {
            color: $color-green-primary;
        }
    }

    .view-all {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        white-space: nowrap;

        &:hover {
            color: $color-green-primary;
            transform: translateX(2px);
        }

        &:active {
            opacity: 0.7;
        }
    }
}

// 1. 今日新闻 - 横向滚动
.news-section {
    margin-bottom: 32px;

    .news-scroll-container {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        .news-scroll-wrapper {
            display: flex;
            gap: 12px;
            padding-bottom: 8px;
        }

        .news-item {
            flex-shrink: 0;
            width: 280px;
            height: 140px;
            position: relative;
            border-radius: $radius-medium;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;

            &:active {
                transform: scale(0.98);
            }

            .news-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .news-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .red-overlay {
                    background: $overlay-red-gradient;
                }
            }

            .news-content {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 12px;
                color: white;
                z-index: 2;

                .news-title {
                    font-size: 15px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .news-date {
                    font-size: 12px;
                    opacity: 0.9;
                }
            }

            &:hover .news-image img {
                transform: scale(1.05);
            }
        }
    }
}

// 2. 民宿概览 - 横向轮播
.hotel-section {
    margin-bottom: 32px;
}

// 3. 特色特产 - 瀑布流
.product-section {
    margin-bottom: 32px;

    .product-waterfall {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .product-item {
            cursor: pointer;
            transition: transform 0.3s ease;

            &:active {
                transform: scale(0.98);
            }

            .product-image {
                position: relative;
                width: 100%;
                aspect-ratio: 3/4;
                border-radius: $radius-medium;
                overflow: hidden;
                margin-bottom: 8px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .product-label {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    padding: 6px 12px;
                    background: $overlay-green-label;
                    color: white;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }
            }

            .product-title {
                font-size: 14px;
                font-weight: 500;
                color: #333;
                margin: 0;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            &:hover .product-image img {
                transform: scale(1.05);
            }
        }
    }
}

// 4. 乡村美食 - 竖向列表
.food-section {
    margin-bottom: 32px;

    .food-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .food-item {
            display: flex;
            width: 100%;
            height: 140px;
            border-radius: $radius-large;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
            background: linear-gradient(135deg, rgba(255, 229, 229, 0.3), rgba(255, 248, 248, 0.2));

            &:active {
                transform: scale(0.98);
            }

            .food-image {
                flex-shrink: 0;
                width: 140px;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .food-content {
                flex: 1;
                padding: 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                &.green-content {
                    background: $overlay-green-light;
                }

                .food-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: $color-green-primary;
                    margin: 0 0 8px 0;
                }

                .food-desc {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }
        }
    }
}

// 5. 红色旅游 - 叠加式长图
.red-tour-section {
    margin-bottom: 32px;

    .red-tour-banner {
        position: relative;
        width: 100%;
        height: 200px;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:active {
            transform: scale(0.98);
        }

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .red-tour-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $overlay-red-strong;
        }

        .red-tour-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
            padding: $spacing-md;

            .red-tour-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 8px 0;
                text-shadow: $shadow-text;
            }

            .red-tour-desc {
                font-size: 14px;
                margin: 0 0 12px 0;
                opacity: 0.95;
            }

            .red-tour-arrow {
                font-size: 32px;
                opacity: 0.9;
                animation: arrow-bounce 2s infinite;
            }
        }
    }
}

// 6. 研学基地 - 叠加式长图
.study-section {
    margin-bottom: 32px;

    .study-banner {
        position: relative;
        width: 100%;
        height: 200px;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:active {
            transform: scale(0.98);
        }

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .study-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $overlay-red-strong;
        }

        .study-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
            padding: $spacing-md;

            .study-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 8px 0;
                text-shadow: $shadow-text;
            }

            .study-desc {
                font-size: 14px;
                margin: 0 0 12px 0;
                opacity: 0.95;
            }

            .study-arrow {
                font-size: 32px;
                opacity: 0.9;
                animation: arrow-bounce 2s infinite;
            }
        }
    }
}

// 7. 康养生活 - 叠加式长图
.retirement-section {
    margin-bottom: 32px;

    .retirement-banner {
        position: relative;
        width: 100%;
        height: 200px;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:active {
            transform: scale(0.98);
        }

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .retirement-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $overlay-green-strong;
        }

        .retirement-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
            padding: $spacing-md;

            .retirement-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 8px 0;
                text-shadow: $shadow-text;
            }

            .retirement-desc {
                font-size: 14px;
                margin: 0 0 12px 0;
                opacity: 0.95;
            }

            .retirement-arrow {
                font-size: 32px;
                opacity: 0.9;
                animation: arrow-bounce 2s infinite;
            }
        }
    }
}

@keyframes arrow-bounce {
    0%,
    100% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(8px);
    }
}

// 响应式
@media (max-width: 768px) {
    .header-banner {
        height: 240px;
    }

    .news-section .news-scroll-container .news-scroll-wrapper .news-item {
        width: 240px;
        height: 120px;
    }

    .hotel-section .hotel-carousel-container {
        height: 200px;
    }
}
</style>
