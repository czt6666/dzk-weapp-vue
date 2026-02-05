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

// 下单请求参数
export interface ICreateOrderParams {
    dishIds: number[]; // 菜品ID数组
    quantities: number[]; // 数量数组
    restaurantId: number;
    remark?: string; // 备注（可选）
}

// 创建订单
export function createOrder(params: ICreateOrderParams) {
    return service.post("/restaurant/orders/create", params);
}

// 订单详情中的订单项
export interface IOrderDetailItem {
    id: number;
    dishId: number;
    dishName: string;
    dishPrice: number;
    quantity: number;
    subtotalAmount: number;
    createTime: string;
}

// 订单详情数据
export interface IOrderDetail {
    id: number;
    orderNo: string;
    totalAmount: number;
    restaurantName: string;
    restaurantId: number;
    userId: number;
    orderStatus: number;
    remark: string;
    createTime: string;
    updateTime: string;
    orderItems: IOrderDetailItem[];
}

// 获取订单详情
export function getOrderDetail(orderId: number) {
    return service.get(`/restaurant/orders/detail/${orderId}`);
}
