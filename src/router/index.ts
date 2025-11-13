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

const routes = [
    {
        path: "/",
        name: "HomePage",
        component: HomePage,
    },
    {
        path: "/login",
        name: "LoginPage",
        component: () => import("../views/LoginPage.vue"),
    },
    {
        path: "/news",
        name: "NewsList",
        component: () => import("../views/NewsList.vue"),
    },
    {
        path: "/news/:id",
        name: "NewsInfo",
        component: () => import("../views/NewsInfo.vue"),
        props: true,
    },
    {
        path: "/hotels",
        name: "HotelList",
        component: () => import("../views/HotelList.vue"),
    },
    {
        path: "/hotels/:id",
        name: "HotelInfo",
        component: () => import("../views/HotelInfo.vue"),
        props: true,
    },
    {
        path: "/shop",
        name: "ShopList",
        component: () => import("../views/shop/ShopList.vue"),
    },
    {
        path: "/shop/:id",
        name: "ShopInfo",
        component: () => import("../views/shop/ShopInfo.vue"),
        props: true,
    },
    {
        path: "/shop/cart",
        name: "ShopCart",
        component: () => import("../views/shop/CartPage.vue"),
    },
    {
        path: "/shop/favorites",
        name: "ShopFavorites",
        component: () => import("../views/shop/Favorites.vue"),
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
