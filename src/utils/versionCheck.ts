import { getVersion } from "@/apis/version";
import { VERSION_REFRESHED_KEY } from "./constence";

const FRONTEND_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0";

/**
 * 检查前后端版本是否一致，不一致则刷新页面（最多刷新一次）
 */
export async function checkVersion(): Promise<boolean> {
    // 本会话已刷新过，不再刷新
    if (sessionStorage.getItem(VERSION_REFRESHED_KEY)) {
        return false;
    }

    try {
        const res = await getVersion();
        const backendVersion = res?.data?.version ?? res?.data ?? "";
        const normalizedBackend = String(backendVersion).trim();
        const normalizedFrontend = String(FRONTEND_VERSION).trim();

        if (normalizedBackend && normalizedBackend !== normalizedFrontend) {
            sessionStorage.setItem(VERSION_REFRESHED_KEY, "1");
            location.reload();
            return true;
        }
    } catch {
        // 接口失败（如 404、网络错误）时不刷新，避免影响正常使用
    }

    return false;
}
