export interface SpecItem {
    specName: string; // 规格名（可能与上面 name 不同，用于后台管理）
    price: number; // 价格
    id: number; // 唯一标识
    stock: number; // 库存
}

export interface Product {
    id: number; // 商品ID
    title: string; // 商品标题
    description: string; // 商品描述
    previewImages: string[]; // 预览图数组
    link: string; // 商品链接
    createTime: string; // 创建时间（ISO时间字符串）
    detailImages: string[]; // 详情图片
    updateTime: string; // 更新时间（ISO时间字符串）
    cartCount: number; // 加入购物车数量
    viewCount: number; // 浏览量
    productUrl: string; // 商品跳转链接或标识
    specifications: SpecItem[]; // 后台规格列表
    status: number; // 状态（如 1=上架，0=下架）
}
