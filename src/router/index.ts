import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

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
        path: "/test",
        children: generateRoutes(),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
