import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const pages = import.meta.glob("../views/**/*.vue");

// 2️⃣ 生成路由数组
function generateRoutes() {
    const routes: RouteRecordRaw[] = [];

    Object.keys(pages).forEach((path) => {
        // 去掉开头的 "../views" 和结尾的 ".vue"
        const routePath = path
            .replace("../views", "")
            .replace(/\.vue$/, "")
            .replace(/\/index$/, "/");

        routes.push({
            path: routePath === "" ? "/" : routePath, // 根路径
            component: pages[path], // 懒加载组件
            name: routePath.split("/").filter(Boolean).join("-") || "home", // 自动生成name
        });
    });

    console.log(routes);

    return routes;
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: generateRoutes(),
});

export default router;
