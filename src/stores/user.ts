import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginByUsername, register } from "@/apis/user";
import { STORAGE_TOKEN_KEY, STORAGE_USER_INFO_KEY } from "@/utils/constence";

export interface IUserInfo {
    userId?: number;
    nickname?: string;
    phone?: string;
    username?: string;
    avatar?: string | null;
}

export const useUserStore = defineStore("user", () => {
    // 从 localStorage 恢复用户信息
    const initUserInfo = (): IUserInfo | null => {
        try {
            const stored = localStorage.getItem(STORAGE_USER_INFO_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    };

    const userInfo = ref<IUserInfo | null>(initUserInfo());

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
        // 持久化用户信息到 localStorage
        if (info) {
            localStorage.setItem(STORAGE_USER_INFO_KEY, JSON.stringify(info));
        } else {
            localStorage.removeItem(STORAGE_USER_INFO_KEY);
        }
    }

    // 手机号 + 密码登录
    async function loginByPassword(phone: string, password: string) {
        const res = await loginByUsername({ username: phone, password });
        // 后端返回的数据结构：{ phone, nickname, avatar, userId, token, username }
        const data = res.data || {};
        if (!data.token) {
            throw new Error("登录返回缺少 token");
        }
        setToken(data.token);
        setUserInfo({
            userId: data.userId,
            nickname: data.nickname,
            phone: data.phone,
            username: data.username,
            avatar: data.avatar,
        });
        console.log("登录成功，用户信息:", userInfo.value);
    }

    // 注册
    async function registerUser(phone: string, password: string, confirmPassword: string) {
        const res = await register({ username: phone, password, confirmPassword });
        // 注册成功后返回用户信息
        const data = res.data || {};
        return data;
    }

    function logout() {
        setToken(null);
        setUserInfo(null);
        // 清除 localStorage 中的用户数据
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_INFO_KEY);
    }

    return {
        userInfo,
        isLoggedIn,
        setToken,
        setUserInfo,
        loginByPassword,
        register: registerUser,
        logout,
    };
});
