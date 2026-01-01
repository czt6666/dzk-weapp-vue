import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { STORAGE_TOKEN_KEY } from "@/utils/constence";

export interface ApiResponse {
    code: string | number;
    data: any;
    msg: string;
}

export interface CustomAxiosInstance extends AxiosInstance {
    get<T = ApiResponse>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = ApiResponse>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = ApiResponse>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = ApiResponse>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "", // 配置在 .env
    timeout: 10000, // 10秒超时
}) as CustomAxiosInstance;

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 如果有 token，可以统一加到 headers
        const token = localStorage.getItem(STORAGE_TOKEN_KEY);
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
    (response: AxiosResponse): any => {
        const res = response.data;
        // 统一处理 code
        if (res.code === undefined) {
            console.error("响应缺少 code 字段:", res);
            return Promise.reject(res);
        }

        if (res.code !== "200" && res.code !== 200 && res.code !== "1" && res.code !== 1) {
            if (res.code == 1) console.warn("响应码为 1");

            return Promise.reject(res);
        }

        // 归一化 data 字段
        res.data = res.data ? res.data : res.info || {};

        return res;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default service;
