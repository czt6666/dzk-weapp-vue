import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginBySms } from "@/apis/user";
import { STORAGE_TOKEN_KEY } from "@/utils/constence";

export interface IUserInfo {
    id?: number;
    nickname?: string;
    phone?: string;
}

export const useUserStore = defineStore("user", () => {
    const token = ref<string | null>(localStorage.getItem(STORAGE_TOKEN_KEY));
    const userInfo = ref<IUserInfo | null>(null);

    const isLoggedIn = computed(() => !!token.value);

    function setToken(newToken: string | null) {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
        } else {
            localStorage.removeItem(STORAGE_TOKEN_KEY);
        }
    }

    function setUserInfo(info: IUserInfo | null) {
        userInfo.value = info;
    }

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

    function logout() {
        setToken(null);
        setUserInfo(null);
    }

    return {
        token,
        userInfo,
        isLoggedIn,
        setToken,
        setUserInfo,
        login,
        logout,
    };
});
