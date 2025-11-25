import service from "./index";

export function getHotelList(params: { page: number; pageSize: number; keyword?: string }) {
    return service.get("/admin/ecadmin/village-homestay/page", { params });
}

export function getHotelItem(id: number) {
    return service.get(`/admin/ecadmin/village-homestay/${id}`);
}
