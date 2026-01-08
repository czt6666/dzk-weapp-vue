import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "@/styles/main.scss";
import ElementPlus from "element-plus";
import { STORAGE_TOKEN_KEY } from "@/utils/constence";
import { useUserStore } from "@/stores/user";

// 调试代码：设置默认 token（在应用初始化之前）
const DEBUG_TOKEN =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNzY3NjA3ODYzLCJ1c2VySWQiOjUsImlhdCI6MTc2NzAwMzA2M30.65w54bifvx3AGz59zbm-TKUej5wOfMOpnO5IhA0j1RI8BkCLfk0sDmMO26a0UtmztRKUeaO-neVqVZn0jIuwSg";
const existingToken = localStorage.getItem(STORAGE_TOKEN_KEY);
if (!existingToken) {
    localStorage.setItem(STORAGE_TOKEN_KEY, DEBUG_TOKEN);
    console.log("🔧 [调试] 已设置默认 token");
}

const app = createApp(App);

app.use(ElementPlus);
const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount("#app");
