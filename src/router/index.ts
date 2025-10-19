import { createRouter, createWebHistory } from "vue-router";

const pages = import.meta.glob("../views/**/*.vue");

interface RouteRecord {
    path: string;
    component: (() => Promise<unknown>) | undefined;
    name: string;
    meta?: Record<string, unknown>;
}

// 2️⃣ 生成路由数组
function generateRoutes() {
    const routes: RouteRecord[] = [];

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

    return routes;
}

console.log(import.meta.env);

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: generateRoutes(),
});

export default router;
