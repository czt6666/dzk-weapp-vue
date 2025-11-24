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
