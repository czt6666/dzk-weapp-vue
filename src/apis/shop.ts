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
