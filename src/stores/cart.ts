import { defineStore } from "pinia";
import { ref } from "vue";
import { addToCart, getCartList, removeCartItem } from "@/apis/shop";
import type { Product, SpecItem } from "@/views/shop/types";
import { el } from "element-plus/es/locales.mjs";

export const useCartStore = defineStore("cart", () => {
    const list = ref<any[]>([]);
    const userId = 1;

    async function fetchCart() {
        const res = await getCartList(userId);
        if (res.code === 200) list.value = res.data || [];
    }

    async function add(product: Product, spec: SpecItem) {
        const res = await addToCart({ userId, skuId: spec.id });
        if (res.code === 200) {
            // ElMessage.success("已收藏该商品！");
            await fetchCart();
        } else {
            throw new Error(res.msg || "收藏失败");
        }
    }

    async function remove(skuId: number) {
        const res = await removeCartItem(userId, skuId);
        if (res.code === 200) {
            await fetchCart();
        } else {
            throw new Error(res.msg || "取消收藏失败");
        }
    }

    return { list, fetchCart, add, remove };
});
