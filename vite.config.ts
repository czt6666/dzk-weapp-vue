import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { Server } from "net";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

function getPort(): Promise<number> {
    let port = 5173; // 默认端口
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

    return defineConfig({
        base: "/ec-weapp-vue/",
        plugins: [
            vue(),
            vueDevTools(),
            AutoImport({
                imports: [
                    "vue", // 自动导入 ref, reactive, computed...
                    "vue-router", // 自动导入 useRouter, useRoute...
                ],
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
                resolvers: [ElementPlusResolver()],
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
