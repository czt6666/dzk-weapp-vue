import service from "./index";

export function getTourRouteList(params: { name?: string; page: number; pageSize: number }) {
    return service.get("/admin/ecadmin/tour/route/list", { params });
}

export function getTourRouteDetail(id: number) {
    return service.get(`/admin/ecadmin/tour/route/${id}`);
}

// 定义路线类型
export interface TourRoute {
    id: number;
    name: string;
    routeType: string;
    themeTags: string;
    originAddress: string;
    originLat: number;
    originLng: number;
    destAddress: string;
    destLat: number;
    destLng: number;
    days: number;
    difficulty: string;
    itinerary: string;
    bizStatus: number;
    targetCrowd: string;
    priceRange: string;
    safetyMeasures: string;
    serviceGuarantee: string;
    costIncluded: string;
    costExcluded: string;
}
