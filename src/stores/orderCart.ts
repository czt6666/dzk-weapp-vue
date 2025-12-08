import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { DishItem } from "@/apis/restaurant";

export interface CartItem extends DishItem {
    quantity: number;
}

export const useCartStore = defineStore("orderCart", () => {
    const cartItems = ref<Record<number, CartItem>>({});

    const addItem = (item: Omit<CartItem, "quantity">) => {
        if (cartItems.value[item.id]?.quantity) {
            cartItems.value[item.id]!.quantity++;
        } else {
            cartItems.value[item.id] = { ...item, quantity: 1 };
        }
    };

    const removeItem = (itemId: number) => {
        if (cartItems.value[itemId]) {
            if (cartItems.value[itemId].quantity > 1) {
                cartItems.value[itemId].quantity--;
            } else {
                delete cartItems.value[itemId];
            }
        }
    };

    const clearCart = () => {
        cartItems.value = {};
    };

    const totalItems = computed(() => {
        return Object.values(cartItems.value).reduce((sum, item) => sum + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return Object.values(cartItems.value).reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
    });

    const cartList = computed(() => Object.values(cartItems.value));

    return {
        cartItems,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        cartList,
    };
});
