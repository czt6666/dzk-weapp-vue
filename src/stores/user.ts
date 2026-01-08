import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginBySms, loginByUsername, register } from "@/apis/user";
import { STORAGE_TOKEN_KEY } from "@/utils/constence";

export interface IUserInfo {
    id?: number;
    nickname?: string;
    phone?: string;
}

export const useUserStore = defineStore("user", () => {
    const userInfo = ref<IUserInfo | null>(null);

    const isLoggedIn = computed(() => {
        const token = localStorage.getItem(STORAGE_TOKEN_KEY);
        return !!token;
    });

    function setToken(newToken: string | null) {
        if (newToken) {
            localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
        } else {
            localStorage.removeItem(STORAGE_TOKEN_KEY);
        }
    }

    function setUserInfo(info: IUserInfo | null) {
        userInfo.value = info;
    }

    // 手机号 + 验证码登录（保留原有方法）
    async function login(phone: string, code: string) {
        const res = await loginBySms({ phone, code });
        // 假设后端返回 { token, user }
        const data = res.data || {};
        if (!data.token) {
            throw new Error("登录返回缺少 token");
        }
        setToken(data.token);
        setUserInfo(data.user || { phone });
    }

    // 手机号 + 密码登录
    async function loginByPassword(phone: string, password: string) {
        const res = await loginByUsername({ phone, password });
        // 假设后端返回 { token, user }
        const data = res.data || {};
        if (!data.token) {
            throw new Error("登录返回缺少 token");
        }
        setToken(data.token);
        setUserInfo(data.user || { phone });
    }

    // 注册
    async function registerUser(phone: string, password: string) {
        const res = await register({ username: phone, password });
        // 注册成功后返回用户信息
        const data = res.data || {};
        return data;
    }

    function logout() {
        setToken(null);
        setUserInfo(null);
    }

    return {
        userInfo,
        isLoggedIn,
        setToken,
        setUserInfo,
        login,
        loginByPassword,
        register: registerUser,
        logout,
    };
});
