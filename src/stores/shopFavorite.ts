import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { addToCart, getCartList, removeCartItem } from "@/apis/shop";
import { useUserStore } from "@/stores/user";
import type { IProduct, ISpecItem } from "@/views/shop/types";

export const useShopFavoriteStore = defineStore("shopFavorite", () => {
    const list = ref<any[]>([]);
    const userStore = useUserStore();

    // 获取真实用户ID
    const userId = computed(() => {
        return userStore.userInfo?.userId;
    });

    async function fetchFavorites() {
        const currentUserId = userId.value;
        if (!currentUserId) {
            ElMessage.warning("请先登录");
            return;
        }
        try {
            const res = await getCartList(currentUserId);
            if (res.code === 200) list.value = res.data || [];
        } catch (err: any) {
            ElMessage.error(err.msg || "获取购物车列表失败");
        }
    }

    async function add(spec: ISpecItem) {
        const currentUserId = userId.value;
        if (!currentUserId) {
            ElMessage.warning("请先登录");
            return;
        }
        try {
            const res = await addToCart({ userId: currentUserId, skuId: spec.id });
            if (res.code === 200) {
                await fetchFavorites();
                ElMessage.success("已添加到购物车！");
            } else {
                ElMessage.error(res.msg || "添加到购物车失败");
            }
        } catch (err: any) {
            ElMessage.error(err.msg || "添加到购物车失败");
        }
    }

    async function remove(skuId: number) {
        const currentUserId = userId.value;
        if (!currentUserId) {
            ElMessage.warning("请先登录");
            return;
        }
        try {
            const res = await removeCartItem(currentUserId, skuId);
            if (res.code === 200) {
                await fetchFavorites();
            } else {
                ElMessage.error(res.msg || "取消购物车失败");
            }
        } catch (err: any) {
            ElMessage.error(err.msg || "取消购物车失败");
        }
    }

    const totalPrice = computed(() => {
        return list.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    return { list, fetchFavorites, add, remove, totalPrice };
});
