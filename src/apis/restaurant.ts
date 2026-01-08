import service from "./index";

export function getRestaurantList(params: { name?: string }) {
    return service.get("/admin/ecadmin/restaurant/list", { params });
}

export function getRestaurantDetail(params: { id: number }) {
    return service.get(`/admin/ecadmin/restaurant/${params.id}`);
}

export function getCategoryList(params: { restaurantName: string }) {
    const defaultParams = {
        pageNum: 1,
        pageSize: 9999,
        ...params,
    };
    return service.get(`/restaurant/dishCategory/list`, { params: defaultParams });
}

export function getDishList(params: { restaurantName: string }) {
    const defaultParams = {
        pageNum: 1,
        pageSize: 9999,
        ...params,
    };
    return service.get(`/restaurant/dish/list`, { params: defaultParams });
}

export interface IRestaurantInfo {
    id: number;
    name: string;
    businessStartTime: string;
    businessEndTime: string;
    logoUrl: string;
    address: string;
    coordinateLat?: number;
    coordinateLng?: number;
    phone: string;
    notice: string;
    villageName: string;
    collectNumber?: number; // 收藏数量
    isCollect?: boolean; // 是否已收藏
}

export interface IDishCategory {
    id: number;
    categoryName: string;
    restaurantName: string;
    imageUrl?: string;
}

export interface IDishItem {
    id: number;
    restaurantId: number;
    categoryId: number;
    restaurantName: string;
    categoryName: string;
    dishName: string;
    coverImgUrl: string;
    dishStatus: number;
    price: number;
    unit: string;
    summary: string;
}
