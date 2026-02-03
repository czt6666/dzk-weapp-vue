import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "@/styles/main.scss";
// ElementPlus：不要在入口全量注册/全量引入样式（会显著增大首包）
// 组件按需引入由 unplugin-vue-components + ElementPlusResolver 负责
// 这里仅保留“服务组件”(ElMessage/ElMessageBox 等)所需的最小样式
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount("#app");
