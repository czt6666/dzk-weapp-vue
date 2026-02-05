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
            // 优化分包策略，减小初始包体积并提升缓存效率
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        // 将 node_modules 中的依赖分包
                        if (id.includes("node_modules")) {
                            // Vue 核心库单独打包
                            if (id.includes("vue") && !id.includes("vue-router")) {
                                return "vue-vendor";
                            }
                            // Vue Router 单独打包
                            if (id.includes("vue-router")) {
                                return "vue-router-vendor";
                            }
                            // Pinia 单独打包
                            if (id.includes("pinia")) {
                                return "pinia-vendor";
                            }
                            // Element Plus 单独打包（按需引入后体积较小）
                            if (id.includes("element-plus")) {
                                return "element-plus-vendor";
                            }
                            // Swiper 单独打包（较大）
                            if (id.includes("swiper")) {
                                return "swiper-vendor";
                            }
                            // Better Scroll 单独打包
                            if (id.includes("better-scroll")) {
                                return "better-scroll-vendor";
                            }
                            // Axios 单独打包
                            if (id.includes("axios")) {
                                return "axios-vendor";
                            }
                            // 其他第三方库统一打包
                            return "vendor";
                        }
                    },
                    // 优化 chunk 文件名，便于缓存
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    entryFileNames: "assets/js/[name]-[hash].js",
                    assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
                },
            },
        },
        // 环境变量注入，例如 global -> self，处理 Web Worker 问题（如 monaco）
        define: {
            global: "self",
        },
    });
}
