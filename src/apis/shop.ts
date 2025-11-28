import service from "./index";

// 商品相关
export function getProductList(params: { page: number; pageSize: number; title?: string }) {
    return service.get("/products/subject/list", { params });
}

export function getProductItem(id: number) {
    return service.get("/products/subject/detail", { params: { id } });
}

interface CartAddDTO {
    userId: number;
    skuId: number;
}

// 收藏商品
export function addToCart(data: CartAddDTO) {
    return service.post("/admin/ecadmin/cart/add", data);
}

export function getCartList(userId: number) {
    return service.get("/admin/ecadmin/cart/list", { params: { userId } });
}

export function removeCartItem(userId: number, skuId: number) {
    return service.delete(`/admin/ecadmin/cart/${skuId}`, {
        params: { userId },
    });
}

// 商铺相关
export function getShopInfo(id: number) {
    return service.get("/admin/ecadmin/shop/info", { params: { id } });
}

export function getShopList(params: {
    ref?: string;
    pageNum: number;
    pageSize: number;
    productType?: string;
    shopName?: string;
    village: string;
}) {
    return service.get("/admin/ecadmin/shop/list", { params });
}
