/**
 * 防抖函数：等待 delay 毫秒后执行
 * @param fn 目标函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行一次（默认 false）
 */
export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay = 300,
    immediate = false,
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let called = false;

    return function (...args: Parameters<T>) {
        if (timer) clearTimeout(timer);

        if (immediate && !called) {
            fn(...args);
            called = true;
        }

        timer = setTimeout(() => {
            if (!immediate) fn(...args);
            called = false;
            timer = null;
        }, delay);
    };
}

/**
 * 节流函数：每隔 delay 毫秒最多执行一次
 * @param fn 目标函数
 * @param delay 间隔时间（毫秒）
 */
export function throttle<T extends (...args: any[]) => void>(
    fn: T,
    delay = 300,
): (...args: Parameters<T>) => void {
    let lastTime = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        const now = Date.now();
        const remaining = delay - (now - lastTime);

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastTime = now;
            fn(...args);
        } else if (!timer) {
            timer = setTimeout(() => {
                lastTime = Date.now();
                timer = null;
                fn(...args);
            }, remaining);
        }
    };
}

export const imgUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("data:")) return url;
    const base = import.meta.env.VITE_API_BASE_URL;
    const newUrl = url.startsWith("/api") ? url.slice(4) : url;
    return joinUrl(base, newUrl);
};

const joinUrl = (base: string, path: string) => {
    return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 降级方案：使用传统方法
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * 检测设备是否支持打电话
 * @returns boolean
 */
export function isPhoneSupported(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
    );
    return isMobile;
}

/**
 * 拨打电话
 * @param phone 电话号码
 */
export function callPhone(phone: string): void {
    if (phone) {
        window.location.href = `tel:${phone}`;
    }
}
