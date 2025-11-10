import service from "./index";

export function getShopList(params: {
    page: number;
    pageSize: number;
    q?: string;
    status?: string;
}) {
    return service.get("/products/subject/list", { params });
}

export function getShopItem(params: { id: number }) {
    return service.get("/products/subject/detail", { params });
}

interface CartAddDTO {
    userId: number;
    skuId: number;
}

// 收藏商品（其实是加入购物车）
export function addToCart(data: CartAddDTO) {
    return service.post("/admin/ecadmin/cart/add", data);
}

// 获取收藏列表
export function getCartList(userId: number) {
    return service.get("/admin/ecadmin/cart/list", { params: { userId } });
}

// 删除收藏商品
export function removeCartItem(userId: number, skuId: number) {
    return service.delete(`/admin/ecadmin/cart/${skuId}`, {
        params: { userId },
    });
}
