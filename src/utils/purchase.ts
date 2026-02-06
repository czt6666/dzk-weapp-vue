import { ElMessage } from "element-plus";

/**
 * 商品购买渠道类型
 * 0-无，1-仅微店，2-仅小程序
 */
export type UploadMethodStatus = 0 | 1 | 2;

/**
 * 商品购买信息接口
 */
export interface PurchaseInfo {
    uploadMethodStatus?: UploadMethodStatus;
    miniProgramAppid?: string;
    miniProgramPath?: string;
    microShopAppid?: string;
    microShopProductId?: string;
    merchantPosterImg?: string;
    link?: string; // 备用链接
}

/**
 * 跳转到微信小程序
 * @param appid 小程序 AppID
 * @param path 小程序页面路径
 * @param errorMessage 错误提示信息（可选）
 */
export function jumpToMiniProgram(
    appid: string,
    path: string,
    errorMessage = "商品信息错误，跳转失败",
) {
    const trimmedAppid = appid?.trim() || "";
    const trimmedPath = path?.trim() || "";

    if (!trimmedAppid || !trimmedPath) {
        ElMessage.warning(errorMessage);
        return;
    }

    // 检测是否是微信环境
    const wxObj = typeof window !== "undefined" ? (window as any).wx : undefined;

    if (!wxObj) {
        console.warn("jumpToMiniProgram: 非微信环境，无法跳转");
        ElMessage.warning("当前不在微信环境中，无法跳转");
        return;
    }

    if (!wxObj.miniProgram) {
        console.warn("jumpToMiniProgram: 非小程序 web-view 环境，wx.miniProgram 不可用");
        ElMessage.warning("当前环境不支持小程序跳转");
        return;
    }

    // 使用 getEnv 判断是否在小程序环境中
    if (!wxObj.miniProgram.getEnv) {
        console.warn("jumpToMiniProgram: wx.miniProgram.getEnv 不可用");
        ElMessage.warning("当前环境不支持小程序跳转");
        return;
    }

    // 编码路径参数
    const encodedPath = encodeURIComponent(trimmedPath);
    const query = `appId=${trimmedAppid}&path=${encodedPath}`;

    // 执行跳转
    wxObj.miniProgram.navigateTo({
        url: `/pages/jump/jump?${query}`,
        success() {
            console.log("跳转到小程序成功", { appId: trimmedAppid, path: trimmedPath });
        },
        fail(err: any) {
            console.error("跳转失败", err);
            ElMessage.error("跳转失败，请稍后重试");
        },
    });
}

/**
 * 打开微店购买
 * @param productId 微店商品ID
 * @param appid 微店 AppID（可选）
 */
export function openMicroShop(productId?: string, appid?: string) {
    // 微店跳转：目前后端只提供了 microShopProductId 和 microShopAppid
    // 但没有明确的跳转协议，暂时提供提示
    const trimmedProductId = productId?.trim() || "";
    if (!trimmedProductId) {
        ElMessage.warning("缺少微店商品信息");
        return;
    }

    // TODO: 实现微店跳转逻辑
    ElMessage.info("微店跳转功能开发中");
}

/**
 * 处理商品购买逻辑
 * 根据小程序/微店链接是否完整判断跳转方式
 * @param product 商品信息
 * @returns 是否成功处理购买
 */
export function handlePurchase(product: PurchaseInfo): boolean {
    // 优先判断小程序：如果 miniProgramAppid 和 miniProgramPath 都有值，跳转小程序
    const hasMiniProgram = hasMiniProgramChannel(product);
    console.log("hasMiniProgram:", hasMiniProgram);

    if (hasMiniProgram) {
        const appid = product.miniProgramAppid || "";
        const path = product.miniProgramPath || "";
        jumpToMiniProgram(appid, path, "商品信息错误，跳转失败");
        return true;
    }

    // 其次判断微店：如果 microShopAppid 和 microShopProductId 都有值，跳转微店
    const hasMicroShop = hasMicroShopChannel(product);
    if (hasMicroShop) {
        openMicroShop(product.microShopProductId, product.microShopAppid);
        return true;
    }

    // 都没有，提示用户
    ElMessage.warning("该商品暂无可用的购买渠道");
    return false;
}

/**
 * 检查商品是否有小程序购买渠道
 * @param product 商品信息
 * @returns 是否有小程序购买渠道（需要 appid 和 path 都有值）
 */
export function hasMiniProgramChannel(product: PurchaseInfo): boolean {
    const appid = (product.miniProgramAppid || "").trim();
    const path = (product.miniProgramPath || "").trim();
    return !!appid && !!path;
}

/**
 * 检查商品是否有微店购买渠道
 * @param product 商品信息
 * @returns 是否有微店购买渠道（需要 appid 和 productId 都有值）
 */
export function hasMicroShopChannel(product: PurchaseInfo): boolean {
    const appid = (product.microShopAppid || "").trim();
    const productId = (product.microShopProductId || "").trim();
    return !!appid && !!productId;
}

/**
 * 检查商品是否有小程序购买渠道（兼容旧接口）
 * @deprecated 使用 hasMiniProgramChannel 代替
 */
export function hasMiniProgram(product: PurchaseInfo): boolean {
    return hasMiniProgramChannel(product);
}

/**
 * 检查商品是否有微店购买渠道（兼容旧接口）
 * @deprecated 使用 hasMicroShopChannel 代替
 */
export function hasMicroShop(product: PurchaseInfo): boolean {
    return hasMicroShopChannel(product);
}
