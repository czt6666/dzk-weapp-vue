import service from "./index";

export function getHotelList(params: { page: number; pageSize: number }) {
    return service.get("/village/news/list", { params });
}

export function getHotelItem(params: { id: number }) {
    return service.get("/village/news/detail", { params });
}
