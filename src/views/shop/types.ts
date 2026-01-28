export interface ISpecItem {
    specName: string; // 规格名（可能与上面 name 不同，用于后台管理）
    price: number; // 价格
    id: number; // 唯一标识
    stock: number; // 库存
}

export interface IProduct {
    id: number; // 商品ID
    title: string; // 商品标题
    description: string; // 商品描述
    previewImages: string[]; // 预览图数组
    createTime: string; // 创建时间（ISO时间字符串）
    detailImages: string[]; // 详情图片
    updateTime: string; // 更新时间（ISO时间字符串）
    cartCount: number; // 加入购物车数量
    viewCount: number; // 浏览量
    specifications: ISpecItem[]; // 后台规格列表
    status: number; // 状态（如 1=上架，0=下架）
    collectNumber?: number; // 收藏数量
    isCollect?: boolean; // 是否已收藏
    // 商品上架渠道
    uploadMethodStatus?: 0 | 1 | 2; // 0-无，1-仅微店，2-仅小程序
    miniProgramAppid?: string; // 小程序 AppID
    miniProgramPath?: string; // 小程序页面路径
    microShopAppid?: string; // 微店 AppID（如有）
    microShopProductId?: string; // 微店商品ID（如有）
    merchantPosterImg?: string; // 海报图
}

export interface IProductDetail extends IProduct {
    shopAvatar: string; // 商铺头像
    storeName: string; // 商铺名称
}
