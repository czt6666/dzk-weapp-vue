import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";

const pages = import.meta.glob("../views/test/**/*.vue");

// 生成路由数组
function generateRoutes() {
    const routes: RouteRecordRaw[] = [];

    Object.keys(pages).forEach((path) => {
        const routePath = path
            .replace("../views", "")
            .replace(/\.vue$/, "")
            .replace(/\/index$/, "/")
            .toLocaleLowerCase();

        routes.push({
            path: routePath === "" ? "/" : routePath, // 根路径
            component: pages[path] as () => Promise<unknown>, // 懒加载组件
            name: routePath.split("/").filter(Boolean).join("-") || "home", // 自动生成name
        });
    });

    return routes;
}

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "HomePage",
        component: HomePage,
        meta: { isTab: true, title: "首页" },
    },
    {
        path: "/my",
        name: "MyPage",
        component: () => import("../views/MyPage.vue"),
        meta: { isTab: true, title: "我的" },
    },
    {
        path: "/news",
        name: "NewsList",
        component: () => import("../views/news/NewsList.vue"),
        meta: { title: "红色庄科" },
    },
    {
        path: "/news/actualtime",
        name: "ActualTimeList",
        component: () => import("../views/news/ActualTimeList.vue"),
        meta: { title: "时事资讯" },
    },
    {
        path: "/news/actualtime/:id",
        name: "ActualTimeInfo",
        component: () => import("../views/news/ActualTimeInfo.vue"),
        props: true,
        meta: { title: "时事资讯详情" },
    },
    {
        path: "/news/:id",
        name: "NewsInfo",
        component: () => import("../views/news/NewsInfo.vue"),
        props: true,
        meta: { title: "新闻详情" },
    },
    {
        path: "/hotels",
        name: "HotelList",
        component: () => import("../views/hotel/HotelList.vue"),
        meta: { isTab: true, title: "民宿" },
    },
    {
        path: "/hotels/:id",
        name: "HotelInfo",
        component: () => import("../views/hotel/HotelInfo.vue"),
        props: true,
        meta: { title: "民宿详情" },
    },
    {
        path: "/shop",
        name: "ShopList",
        component: () => import("../views/shop/ProductList.vue"),
        meta: { isTab: true, title: "特产" },
    },
    {
        path: "/shop/:id",
        name: "ShopInfo",
        component: () => import("../views/shop/ProductInfo.vue"),
        props: true,
        meta: { title: "商品详情" },
    },
    {
        path: "/shop/favorites",
        name: "ShopFavorites",
        component: () => import("../views/shop/Favorites.vue"),
        meta: { title: "我的购物车" },
    },
    {
        path: "/restaurant",
        name: "RestaurantList",
        component: () => import("../views/restaurant/StoreList.vue"),
        meta: { isTab: true, title: "美食" },
    },
    {
        path: "/restaurant/order",
        name: "RestaurantOrder",
        component: () => import("../views/restaurant/OrderPage.vue"),
        meta: { title: "点餐" },
    },
    {
        path: "/restaurant/order/detail",
        name: "OrderDetail",
        component: () => import("../views/restaurant/OrderDetail.vue"),
        meta: { title: "订单详情" },
    },
    {
        path: "/map",
        name: "Map",
        component: () => import("../views/map/RestaurantMap.vue"),
        meta: { title: "位置地图" },
    },
    {
        path: "/tour",
        name: "TourList",
        component: () => import("../views/tour/TourList.vue"),
        meta: { title: "红色旅游" },
    },
    {
        path: "/tour/:id",
        name: "TourInfo",
        component: () => import("../views/tour/TourInfo.vue"),
        props: true,
        meta: { title: "旅游详情" },
    },
    {
        path: "/study",
        name: "StudyList",
        component: () => import("../views/study/StudyList.vue"),
        meta: { title: "研学基地" },
    },
    {
        path: "/study/plan/:id",
        name: "StudyPlanInfo",
        component: () => import("../views/study/StudyPlanInfo.vue"),
        props: true,
        meta: { title: "研学方案" },
    },
    {
        path: "/study/activity/:id",
        name: "StudyActivityInfo",
        component: () => import("../views/study/StudyActivityInfo.vue"),
        props: true,
        meta: { title: "研学活动" },
    },
    {
        path: "/retirement",
        name: "RetirementList",
        component: () => import("../views/retirement/RetirementList.vue"),
        meta: { title: "康养生活" },
    },
    {
        path: "/retirement/:id",
        name: "RetirementInfo",
        component: () => import("../views/retirement/RetirementInfo.vue"),
        props: true,
        meta: { title: "康养详情" },
    },
    {
        path: "/test",
        children: generateRoutes(),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
