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

// // 1x1 base64 占位图
// const FALLBACK_BASE64 =
//     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8z/C/HwAFgwJ/lZSmOQAAAABJRU5ErkJggg==";

// function checkImgAvailable(url: string, callback: typeof imgUrl): boolean {
//     console.log("checkImgAvailable:", url);

//     // 异步加载图片
//     const img = new Image();
//     img.onload = () => {
//         console.log("img loaded:", url);
//         callback(url, true);
//     };
//     img.onerror = () => {
//         console.log("img error:", url);
//         callback(FALLBACK_BASE64, true);
//     };
//     img.src = url;

//     // 同步阶段先抛错
//     throw new Error("checkImgAvailable is loading");
// }

// export function imgUrl(url: string | null | undefined, isCheck: boolean = false): string {
//     // 当回调触发时 isCheck=true，此时直接返回 url
//     if (isCheck) return url!;

//     if (!url) return FALLBACK_BASE64;

//     // http 或 data URL
//     if (url.startsWith("http") || url.startsWith("data:")) {
//         try {
//             return checkImgAvailable(url, imgUrl) ? url : FALLBACK_BASE64;
//         } catch (err) {
//             // 第一次必然走这里
//             console.warn(err);
//             return FALLBACK_BASE64;
//         }
//     }

//     // 后端的路径
//     const base = import.meta.env.VITE_API_BASE_URL;
//     const newUrl = url.startsWith("/api") ? url.slice(4) : url;
//     const finalUrl = joinUrl(base, newUrl);
//     console.log("imgUrl final:", finalUrl);

//     try {
//         return checkImgAvailable(finalUrl, imgUrl) ? finalUrl : FALLBACK_BASE64;
//     } catch (err) {
//         console.warn(err);
//         return FALLBACK_BASE64;
//     }
// }

// function joinUrl(base: string, path: string) {
//     return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
// }

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
