import service from "./index";

export interface HotelListParams {
    page: number;
    pageSize: number;
    homestayName?: string;
}

export function getHotelList(params: HotelListParams) {
    return service.get("/admin/ecadmin/village-homestay/page", { params });
}

export function getHotelItem(id: number) {
    return service.get(`/admin/ecadmin/village-homestay/${id}`);
}
