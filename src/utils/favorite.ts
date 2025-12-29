import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { createCollect, deleteCollect } from "@/apis/collect";
import { isRef } from "vue";
import type { Ref } from "vue";

/**
 * 收藏状态码定义
 */
enum FavoriteStatusCode {
    SUCCESS = 200,
    ALREADY_COLLECTED = 400,
    NOT_LOGGED_IN = 401,
    TOKEN_EXPIRED = 403,
    OTHER_ERROR = 500,
}

/**
 * 生成收藏切换函数
 * @param targetType 目标类型，如 "homestay"、"news" 等
 * @param list 列表数据（响应式引用或普通数组）
 * @returns 收藏切换函数
 */
export function createFavoriteToggle(targetType: string, list: Ref<any[]> | any[]) {
    const userStore = useUserStore();
    const router = useRouter();

    // 更新列表中对应项的收藏状态
    function updateItemFavoriteStatus(id: number, isFavorite: boolean) {
        const listData = isRef(list) ? list.value : list;
        const item = listData.find((item) => item.id === id);
        if (item) {
            item.isCollect = isFavorite;
            if (isFavorite) {
                item.collectNumber = (item.collectNumber || 0) + 1;
            } else {
                item.collectNumber = Math.max(0, (item.collectNumber || 0) - 1);
            }
        }
    }

    // 处理错误并回滚状态
    function handleError(
        code: number | string,
        msg?: string,
        rollbackId?: number,
        rollbackState?: boolean,
    ) {
        const statusCode = typeof code === "string" ? parseInt(code) : code;
        let errorMsg = msg;

        switch (statusCode) {
            case FavoriteStatusCode.ALREADY_COLLECTED:
                errorMsg = msg || "该内容已收藏";
                break;
            case FavoriteStatusCode.NOT_LOGGED_IN:
                errorMsg = msg || "请先登录";
                router.push({ name: "LoginPage" });
                break;
            case FavoriteStatusCode.TOKEN_EXPIRED:
                errorMsg = msg || "登录已过期，请重新登录";
                userStore.logout();
                router.push({ name: "LoginPage" });
                break;
            default:
                errorMsg = msg || "操作失败，请稍后重试";
        }

        ElMessage.error(errorMsg);

        // 回滚UI状态
        if (rollbackId !== undefined && rollbackState !== undefined) {
            updateItemFavoriteStatus(rollbackId, rollbackState);
        }
    }

    return async function toggleFavorite(id: number, isFavorite: boolean) {
        const userId = userStore.userInfo?.id || 1;
        // if (!userId) {
        //     ElMessage.warning("请先登录");
        //     router.push({ name: "LoginPage" });
        //     return;
        // }

        // 乐观更新UI
        updateItemFavoriteStatus(id, isFavorite);

        try {
            const res = isFavorite
                ? await createCollect({ targetId: id, targetType })
                : await deleteCollect({ targetId: id, targetType });

            const code = typeof res.code === "string" ? parseInt(res.code) : res.code;
            if (code === FavoriteStatusCode.SUCCESS) {
                ElMessage.success(isFavorite ? "收藏成功" : "取消收藏成功");
            } else {
                handleError(code, res.msg, id, !isFavorite);
            }
        } catch (err: any) {
            const errorCode = err.code || err.status || FavoriteStatusCode.OTHER_ERROR;
            handleError(errorCode, err.msg || err.message, id, !isFavorite);
        }
    };
}
