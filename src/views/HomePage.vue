<template>
    <div class="home" ref="homeRef">
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
                <HolidayCarousel />
            </div>
            <!-- 底部渐变遮罩和快捷按钮 -->
            <div class="banner-bottom-gradient">
                <div class="quick-buttons">
                    <div class="quick-btn" @click="goToRestaurantList">
                        <img :src="foodIcon" alt="美食" class="btn-icon" />
                        <span class="btn-text">美食</span>
                    </div>
                    <div class="quick-btn" @click="goToProductList">
                        <img :src="shopIcon" alt="特产" class="btn-icon" />
                        <span class="btn-text">特产</span>
                    </div>
                    <div class="quick-btn" @click="goToHotelList">
                        <img :src="hotelIcon" alt="民宿" class="btn-icon" />
                        <span class="btn-text">民宿</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="main-content">
            <!-- 1. 红色庄科和时事资讯 - 一行两列 -->
            <section class="news-section">
                <div class="news-dual-column">
                    <!-- 红色庄科 -->
                    <div class="news-column">
                        <div class="section-header">
                            <h2 class="section-title red-theme">
                                <img :src="newsIcon" alt="红色庄科" class="title-icon" />
                                红色庄科
                            </h2>
                            <span class="view-all" @click="goToNewsList">更多 →</span>
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
                                        <el-image
                                            :src="imgUrl(item.imageUrl)"
                                            :alt="item.title"
                                            fit="cover"
                                        />
                                        <div class="news-overlay red-overlay"></div>
                                    </div>
                                    <div class="news-content">
                                        <h3 class="news-title">{{ item.title }}</h3>
                                        <span class="news-date">{{
                                            formatDate(item.createTime)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 时事资讯 -->
                    <div class="news-column">
                        <div class="section-header">
                            <h2 class="section-title red-theme">
                                <img :src="newsIcon" alt="时事资讯" class="title-icon" />
                                时事资讯
                            </h2>
                            <span class="view-all" @click="goToActualTimeList">更多 →</span>
                        </div>
                        <div class="news-scroll-container" ref="actualTimeScrollRef">
                            <div class="news-scroll-wrapper">
                                <div
                                    v-for="item in actualTimeList"
                                    :key="item.id"
                                    class="news-item"
                                    @click="goToActualTime(item.id)"
                                >
                                    <div class="news-image">
                                        <el-image
                                            :src="imgUrl(item.imageUrl)"
                                            :alt="item.title"
                                            fit="cover"
                                        />
                                        <div class="news-overlay red-overlay"></div>
                                    </div>
                                    <div class="news-content">
                                        <h3 class="news-title">{{ item.title }}</h3>
                                        <span class="news-date">{{
                                            formatDate(item.createTime)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 2. 美食和特产 - 左右排列，竖着展示三个 -->
            <section class="food-product-section">
                <div class="food-product-dual">
                    <!-- 乡村美食 -->
                    <div class="food-column">
                        <div class="section-header">
                            <h2 class="section-title green-theme">
                                <img :src="foodIcon" alt="乡村美食" class="title-icon" />
                                乡村美食
                            </h2>
                        </div>
                        <div class="food-vertical-list">
                            <div
                                v-for="restaurant in restaurantList"
                                :key="restaurant.id"
                                class="food-item"
                                @click="goToRestaurant(restaurant.id)"
                            >
                                <div class="food-image">
                                    <el-image
                                        :src="imgUrl(restaurant.logoUrl)"
                                        :alt="restaurant.name"
                                        fit="cover"
                                    />
                                </div>
                                <div class="food-content green-content">
                                    <h3 class="food-name">{{ restaurant.name }}</h3>
                                    <p class="food-desc">
                                        {{ restaurant.notice || "田园风味，健康美味" }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 特色特产 -->
                    <div class="product-column">
                        <div class="section-header">
                            <h2 class="section-title green-theme">
                                <img :src="shopIcon" alt="特色特产" class="title-icon" />
                                特色特产
                            </h2>
                        </div>
                        <div class="product-vertical-list">
                            <div
                                v-for="product in productList"
                                :key="product.id"
                                class="product-item"
                                @click="goToProduct(product.id)"
                            >
                                <div class="product-image">
                                    <el-image
                                        :src="imgUrl(product.previewImages[0])"
                                        :alt="product.title"
                                        fit="cover"
                                    />
                                </div>
                                <div class="product-content green-content">
                                    <h3 class="product-name">{{ product.title }}</h3>
                                    <p class="product-price">
                                        {{
                                            product.specifications[0]?.price
                                                ? `¥${product.specifications[0].price}/${product.specifications[0].specName || ""}`
                                                : "询价"
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 3. 红色旅游和研学基地 - 左右排列 -->
            <section class="tour-study-section">
                <div class="tour-study-dual">
                    <!-- 红色旅游 -->
                    <div class="tour-item" @click="goToTour">
                        <div class="tour-banner" :style="{ backgroundImage: `url(${redTourBg})` }">
                            <div class="tour-overlay"></div>
                            <div class="tour-content">
                                <h2 class="tour-title">
                                    <img :src="tourIcon" alt="红色旅游" class="title-icon" />
                                    红色旅游
                                </h2>
                                <p class="tour-desc">
                                    {{ tourDesc || "传承红色精神，体验革命文化" }}
                                </p>
                                <div class="tour-arrow">→</div>
                            </div>
                        </div>
                    </div>
                    <!-- 研学基地 -->
                    <div class="study-item" @click="goToStudy">
                        <div class="study-banner" :style="{ backgroundImage: `url(${studyBg})` }">
                            <div class="study-overlay"></div>
                            <div class="study-content">
                                <h2 class="study-title">
                                    <img :src="studyIcon" alt="研学基地" class="title-icon" />
                                    研学基地
                                </h2>
                                <p class="study-desc">{{ studyDesc || "探索知识，传承文化" }}</p>
                                <div class="study-arrow">→</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="retirement-section">
                    <div
                        class="retirement-banner"
                        :style="{ backgroundImage: `url(${retirementBg})` }"
                        @click="goToRetirement"
                    >
                        <div class="retirement-overlay"></div>
                        <div class="retirement-content">
                            <h2 class="retirement-title">
                                <img :src="retirementIcon" alt="康养生活" class="title-icon" />
                                康养生活
                            </h2>
                            <p class="retirement-desc">
                                {{ retirementDesc || "健康生活，颐养天年" }}
                            </p>
                            <div class="retirement-arrow">→</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 5. 民宿 - 瀑布流 -->
            <section class="hotel-section">
                <div class="section-header">
                    <h2 class="section-title green-theme">
                        <img :src="hotelIcon" alt="推荐民宿" class="title-icon" />
                        推荐民宿
                    </h2>
                    <span class="view-all" @click="goToHotelList">更多 →</span>
                </div>
                <div class="hotel-waterfall">
                    <div
                        v-for="hotel in hotelList"
                        :key="hotel.id"
                        class="hotel-item"
                        @click="goToHotel(hotel.id)"
                    >
                        <div class="hotel-image">
                            <el-image
                                :src="imgUrl(hotel.imageUrl || hotel.coverImage)"
                                :alt="hotel.homestayName"
                                fit="cover"
                            />
                        </div>
                        <div class="hotel-info">
                            <h3 class="hotel-name">{{ hotel.homestayName }}</h3>
                            <p class="hotel-contact">{{ hotel.contactName }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getNewsList, getActualTimeList } from "@/apis/news";
import { getHotelList } from "@/apis/hotel";
import { getProductList } from "@/apis/shop";
import { getRestaurantList } from "@/apis/restaurant";
import { getTourRouteList } from "@/apis/tour";
import { getStudyPlanList } from "@/apis/study";
import { getRetirementStationList } from "@/apis/retirement";
import { imgUrl } from "@/utils";
import { useScrollPosition } from "@/composables/useScrollPosition";
import HolidayCarousel from "@/components/HolidayCarousel.vue";
import HotelCarousel from "@/components/HotelCarousel.vue";
import spring2 from "@/assets/swiper/spring2.jpg";
import summer2 from "@/assets/swiper/summer2.jpg";
import autumn1 from "@/assets/swiper/autumn1.png";
import foodIcon from "@/assets/svg/food.png";
import shopIcon from "@/assets/svg/shop.png";
import hotelIcon from "@/assets/svg/hotel.png";
import newsIcon from "@/assets/svg/news.png";
import tourIcon from "@/assets/svg/tour.png";
import studyIcon from "@/assets/svg/study.png";
import retirementIcon from "@/assets/svg/retirement.png";

const router = useRouter();

// 滚动位置记忆
const homeRef = ref<HTMLElement | null>(null);
const newsScrollRef = ref<HTMLElement | null>(null);
const actualTimeScrollRef = ref<HTMLElement | null>(null);
useScrollPosition(homeRef, "homePage");

// 背景图
const redTourBg = spring2;
const studyBg = summer2;
const retirementBg = autumn1;

// 数据
const newsList = ref<any[]>([]);
const actualTimeList = ref<any[]>([]);
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
        newsList.value = (res.data?.list || []).slice(0, 3);
    } catch (err: any) {
        console.error("加载新闻失败:", err);
    }
}

async function loadActualTime() {
    try {
        const res = await getActualTimeList({ page: 1, pageSize: 10 });
        actualTimeList.value = (res.data?.list || []).slice(0, 3);
    } catch (err: any) {
        console.error("加载时事资讯失败:", err);
    }
}

async function loadHotels() {
    try {
        const res = await getHotelList({ page: 1, pageSize: 10 });
        hotelList.value = res.data?.records || [];
    } catch (err: any) {
        console.error("加载民宿失败:", err);
    }
}

async function loadProducts() {
    try {
        const res = await getProductList({ page: 1, pageRow: 10 });
        const list = res.data?.list || res.data?.records || [];
        // 按collectNumber排序，取前3个
        productList.value = list
            .sort((a: any, b: any) => (b.collectNumber || 0) - (a.collectNumber || 0))
            .slice(0, 3);
    } catch (err: any) {
        console.error("加载特产失败:", err);
    }
}

async function loadRestaurants() {
    try {
        const res = await getRestaurantList({});
        const list = res.data?.records || [];
        // 按collectNumber排序，取前3个
        restaurantList.value = list
            .sort((a: any, b: any) => (b.collectNumber || 0) - (a.collectNumber || 0))
            .slice(0, 3);
    } catch (err: any) {
        console.error("加载美食失败:", err);
    }
}

// 导航
function goToNews(id: number) {
    router.push({ name: "NewsInfo", params: { id } });
}

function goToHotel(id: number) {
    router.push({ name: "HotelInfo", params: { id } });
}

function goToProduct(id: number) {
    router.push({ name: "ShopInfo", params: { id } });
}

function goToRestaurant(id: number) {
    router.push({
        name: "RestaurantOrder",
        query: { id, name: restaurantList.value.find((r) => r.id === id)?.name },
    });
}

function goToTour() {
    router.push({ name: "TourList" });
}

function goToStudy() {
    router.push({ name: "StudyList" });
}

function goToRetirement() {
    router.push({ name: "RetirementList" });
}

// 跳转到列表页
function goToNewsList() {
    router.push({ name: "NewsList" });
}

function goToActualTimeList() {
    router.push({ name: "ActualTimeList" });
}

function goToActualTime(id: number) {
    router.push({ name: "NewsInfo", params: { id } });
}

function goToHotelList() {
    router.push({ name: "HotelList" });
}

function goToProductList() {
    router.push({ name: "ShopList" });
}

function goToRestaurantList() {
    router.push({ name: "RestaurantList" });
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
    loadActualTime();
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
    height: 290px;
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
        height: 93%;
    }

    // 底部渐变遮罩和快捷按钮
    .banner-bottom-gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        background: linear-gradient(to top, #ffe5e5 0%, transparent 100%);
        z-index: 99;
        display: flex;
        align-items: flex-end;
        padding: 0 20px 0px;
        pointer-events: none;

        .quick-buttons {
            display: flex;
            gap: 20px;
            width: 100%;
            justify-content: center;
            pointer-events: all;

            .quick-btn {
                flex: 1;
                max-width: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;

                &:active {
                    transform: scale(0.95);
                }

                &:hover {
                    transform: translateY(-2px);
                }

                .btn-icon {
                    width: 32px;
                    height: 32px;
                    margin-bottom: 6px;
                    display: block;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }

                .btn-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
            }
        }
    }
}

// 主内容区域
.main-content {
    padding: $spacing-sm $spacing-sm $spacing-md;
    max-width: 1200px;
    margin: 0 auto;
}

// 通用区块样式
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .section-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 6px;

        .title-icon {
            width: 20px;
            height: 20px;
            display: block;
        }

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

// 1. 红色庄科和时事资讯 - 一行两列（固定布局）
.news-section {
    margin-bottom: 20px;

    .news-dual-column {
        display: flex;
        gap: 12px;
        width: 100%;

        .news-column {
            flex: 0 0 calc(50% - 6px);
            width: calc(50% - 6px);
            display: flex;
            flex-direction: column;

            .section-header {
                margin-bottom: 10px;

                .section-title {
                    font-size: 18px;
                }
            }

            .news-scroll-container {
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                width: 100%;

                &::-webkit-scrollbar {
                    display: none;
                }

                .news-scroll-wrapper {
                    display: flex;
                    gap: 10px;
                    padding-bottom: 8px;
                }

                .news-item {
                    flex-shrink: 0;
                    width: 200px;
                    height: 120px;
                    position: relative;
                    border-radius: $radius-medium;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

                    &:active {
                        transform: scale(0.98);
                    }

                    .news-image {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;

                        :deep(.el-image) {
                            width: 100%;
                            height: 100%;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                transition: transform 0.3s ease;
                            }
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
                        padding: 10px;
                        color: white;
                        z-index: 2;

                        .news-title {
                            font-size: 13px;
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
                            font-size: 11px;
                            opacity: 0.9;
                        }
                    }

                    &:hover .news-image :deep(.el-image img) {
                        transform: scale(1.05);
                    }
                }
            }
        }
    }
}

// 2. 美食和特产 - 左右排列，竖着展示三个
.food-product-section {
    margin-bottom: 20px;

    .food-product-dual {
        display: flex;
        gap: 12px;
        width: 100%;

        .food-column,
        .product-column {
            flex: 0 0 calc(50% - 6px);
            width: calc(50% - 6px);
            display: flex;
            flex-direction: column;

            .section-header {
                margin-bottom: 10px;

                .section-title {
                    font-size: 18px;
                }
            }
        }

        .food-vertical-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .food-item {
                display: flex;
                width: 100%;
                height: 100px;
                border-radius: $radius-medium;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease;
                background: linear-gradient(
                    135deg,
                    rgba(255, 229, 229, 0.3),
                    rgba(255, 248, 248, 0.2)
                );

                &:active {
                    transform: scale(0.98);
                }

                .food-image {
                    flex-shrink: 0;
                    width: 100px;
                    height: 100%;

                    :deep(.el-image) {
                        width: 100%;
                        height: 100%;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }

                .food-content {
                    flex: 1;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    &.green-content {
                        background: $overlay-green-light;
                    }

                    .food-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: $color-green-primary;
                        margin: 0 0 4px 0;
                        line-height: 1.3;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .food-desc {
                        font-size: 11px;
                        color: #666;
                        margin: 0;
                        line-height: 1.4;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
            }
        }

        .product-vertical-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .product-item {
                display: flex;
                width: 100%;
                height: 100px;
                border-radius: $radius-medium;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease;
                background: linear-gradient(
                    135deg,
                    rgba(255, 229, 229, 0.3),
                    rgba(255, 248, 248, 0.2)
                );

                &:active {
                    transform: scale(0.98);
                }

                .product-image {
                    flex-shrink: 0;
                    width: 100px;
                    height: 100%;

                    :deep(.el-image) {
                        width: 100%;
                        height: 100%;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }

                .product-content {
                    flex: 1;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    &.green-content {
                        background: $overlay-green-light;
                    }

                    .product-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: $color-green-primary;
                        margin: 0 0 4px 0;
                        line-height: 1.3;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .product-price {
                        font-size: 12px;
                        color: $color-green-primary;
                        font-weight: 600;
                        margin: 0;
                        line-height: 1.4;
                    }
                }
            }
        }
    }
}

// 3. 红色旅游和研学基地 - 左右排列
.tour-study-section {
    margin-bottom: 20px;

    .tour-study-dual {
        display: flex;
        gap: 12px;
        width: 100%;

        .tour-item,
        .study-item {
            flex: 0 0 calc(50% - 6px);
            width: calc(50% - 6px);

            .tour-banner,
            .study-banner {
                position: relative;
                width: 100%;
                height: 160px;
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;

                &:active {
                    transform: scale(0.98);
                }

                .tour-overlay,
                .study-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: $overlay-red-strong;
                }

                .tour-content,
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

                    .tour-title,
                    .study-title {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 0 0 6px 0;
                        text-shadow: $shadow-text;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;

                        .title-icon {
                            width: 18px;
                            height: 18px;
                            display: block;
                            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
                        }
                    }

                    .tour-desc,
                    .study-desc {
                        font-size: 12px;
                        margin: 0 0 8px 0;
                        opacity: 0.95;
                    }

                    .tour-arrow,
                    .study-arrow {
                        font-size: 28px;
                        opacity: 0.9;
                        animation: arrow-bounce 2s infinite;
                    }
                }
            }
        }
    }
}

// 4. 康养生活 - 高度减小一半
.retirement-section {
    margin: 10px 0;

    .retirement-banner {
        position: relative;
        width: 100%;
        height: 80px;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        &:active {
            transform: scale(0.98);
        }

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
            padding: $spacing-sm;

            .retirement-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 4px 0;
                text-shadow: $shadow-text;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;

                .title-icon {
                    width: 18px;
                    height: 18px;
                    display: block;
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
                }
            }

            .retirement-desc {
                font-size: 12px;
                margin: 0;
                opacity: 0.95;
            }

            .retirement-arrow {
                display: none;
            }
        }
    }
}

// 5. 民宿 - 瀑布流
.hotel-section {
    margin-bottom: 20px;

    .hotel-waterfall {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .hotel-item {
            background: white;
            border-radius: $radius-medium;
            overflow: hidden;
            cursor: pointer;
            transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

            &:active {
                transform: scale(0.98);
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            }

            .hotel-image {
                width: 100%;
                height: 180px;
                overflow: hidden;

                :deep(.el-image) {
                    width: 100%;
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }
                }
            }

            .hotel-info {
                padding: 12px;

                .hotel-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 6px 0;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .hotel-contact {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }

            &:hover .hotel-image :deep(.el-image img) {
                transform: scale(1.05);
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
</style>
