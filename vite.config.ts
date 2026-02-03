import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { Server } from "net";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

function getPort(): Promise<number> {
    const port = 5173; // 默认端口
    return new Promise((resolve) => {
        function tryPort(currentPort: number) {
            const server = new Server();
            server.on("error", () => {
                server.close();
                tryPort(currentPort + 1);
            });
            server.on("listening", () => {
                server.close();
                resolve(currentPort);
            });
            server.listen(currentPort);
        }
        tryPort(port);
    });
}

export default async function () {
    const port = await getPort();
    const isDev = process.env.NODE_ENV !== "production";

    return defineConfig({
        base: "/dzk-weapp-vue/",
        plugins: [
            vue(),
            // 仅在开发环境启用 devtools，避免生产构建引入额外代码
            ...(isDev ? [vueDevTools()] : []),
            AutoImport({
                imports: [
                    "vue", // 自动导入 ref, reactive, computed...
                    "vue-router", // 自动导入 useRouter, useRoute...
                ],
                // 让 ElMessage/ElMessageBox 等服务也能自动导入（样式在 main.ts 里按需引入）
                resolvers: [ElementPlusResolver()],
                dts: "src/auto-imports.d.ts", // 声明文件生成路径
                eslintrc: {
                    enabled: true, // 生成 .eslintrc-auto-import.json，配合 ESLint 检查
                    filepath: "./.eslintrc-auto-import.json",
                    globalsPropValue: true,
                },
                dirs: ["./src/composables"], // 自动导入自定义函数/工具
            }),
            Components({
                // ElementPlus 组件按需引入 + 按需样式（避免 main.ts 全量 element-plus/dist/index.css）
                resolvers: [ElementPlusResolver({ importStyle: "css" })],
            }),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
                "~": "/node_modules",
            },
            extensions: [".ts", ".js", ".vue", ".json"],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                },
            },
        },
        // 开发服务器配置
        server: {
            host: "0.0.0.0",
            port,
            open: true,
        },
        // 构建配置
        build: {
            sourcemap: false, // 生产环境关闭 source map
            outDir: "dist",
            target: "es2015",
        },
        // 环境变量注入，例如 global -> self，处理 Web Worker 问题（如 monaco）
        define: {
            global: "self",
        },
    });
}
