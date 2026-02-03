import service from "./index";
import type { ApiResponse } from "./index";

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

// 下单请求参数
export interface ICreateOrderParams {
    dishIds: number[]; // 菜品ID数组
    quantities: number[]; // 数量数组
    userId: number;
    restaurantId: number;
    remark?: string; // 备注（可选）
}

// 订单商品信息
export interface IOrderItem {
    dishId: number;
    dishName: string;
    price: number;
    quantity: number;
}

// 下单返回数据
export interface IOrderResult {
    orderId: string;
    items: IOrderItem[];
    totalAmount: number;
    createTime: string;
}

// 创建订单
export function createOrder(params: ICreateOrderParams, userId?: number) {
    const config: any = {
        headers: {},
    };
    
    // 如果提供了 userId，添加到请求头
    if (userId) {
        config.headers["x-user-id"] = userId;
    }
    
    return service.post<ApiResponse & { data: IOrderResult }>(
        "/restaurant/orders/create",
        params,
        config,
    );
}
