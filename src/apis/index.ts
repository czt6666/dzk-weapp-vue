import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "", // 配置在 .env
    timeout: 10000, // 10秒超时
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 如果有 token，可以统一加到 headers
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data;
        // 统一处理 code
        if (res.code && res.code !== "200") {
            // 可以弹框提示错误
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default service;
