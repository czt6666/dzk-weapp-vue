import { defineStore } from "pinia";
import { ref } from "vue";
import { addToCart, getCartList, removeCartItem } from "@/apis/shop";
import type { IProduct, ISpecItem } from "@/views/shop/types";

export const useShopFavoriteStore = defineStore("shopFavorite", () => {
    const list = ref<any[]>([]);
    const userId = 1;

    async function fetchFavorites() {
        try {
            const res = await getCartList(userId);
            if (res.code === 200) list.value = res.data || [];
        } catch (err: any) {
            ElMessage.error(err.msg || "获取收藏夹列表失败");
        }
    }

    async function add(spec: ISpecItem) {
        try {
            const res = await addToCart({ userId, skuId: spec.id });
            if (res.code === 200) {
                await fetchFavorites();
                ElMessage.success("已添加到收藏夹！");
            } else {
                ElMessage.error(res.msg || "收藏失败");
            }
        } catch (err: any) {
            ElMessage.error(err.msg || "收藏失败");
        }
    }

    async function remove(skuId: number) {
        try {
            const res = await removeCartItem(userId, skuId);
            if (res.code === 200) {
                await fetchFavorites();
            } else {
                ElMessage.error(res.msg || "取消收藏失败");
            }
        } catch (err: any) {
            ElMessage.error(err.msg || "取消收藏失败");
        }
    }

    const totalPrice = computed(() => {
        return list.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    return { list, fetchFavorites, add, remove, totalPrice };
});
