import service from "./index";

export interface ApiResponse {
    info: any;
    msg: string;
    code: string;
}

export function getHotelList(params: { page: number; pageSize: number }) {
    return service.get("/admin/ecadmin/village-homestay/page", { params });
}

export function getHotelItem(id: number) {
    return service.get(`/admin/ecadmin/village-homestay/${id}`);
}
