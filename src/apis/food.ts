// 模拟网络请求
export interface RestaurantInfo {
    id: string;
    name: string;
    address: string;
    distance: string;
    phone: string;
    hours: string;
    description: string;
    rating: number;
    tags: string[];
    images: string[];
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    tag?: string;
    description: string;
    sales?: number;
}

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchRestaurantInfo = async (): Promise<RestaurantInfo> => {
    await delay(500);
    return {
        id: "r001",
        name: "那些克星三号店",
        address: "重庆市渝北区龙溪街道金龙路154号",
        distance: "距离3m",
        phone: "023-67891234",
        hours: "营业时间: 10:00-22:00",
        description:
            "正宗重庆火锅，传承经典味道。选用优质食材，匠心烹制每一道菜品。环境优雅，服务周到，是家庭聚餐、朋友小聚的理想场所。",
        rating: 4.8,
        tags: ["火锅", "川菜", "聚餐", "人均￥80"],
        images: ["🏪", "🍲", "🌶️"],
    };
};

export const fetchCategories = async (): Promise<Category[]> => {
    await delay(300);
    return [
        { id: "member", name: "会员专属", icon: "👑" },
        { id: "hotpot", name: "火锅锅底", icon: "🔥" },
        { id: "meat", name: "肉类", icon: "🥩" },
        { id: "seafood", name: "海鲜", icon: "🦐" },
        { id: "vegetable", name: "蔬菜", icon: "🥬" },
        { id: "meatball", name: "丸滑类", icon: "⚪" },
        { id: "tofu", name: "豆制品", icon: "🧈" },
        { id: "staple", name: "主食", icon: "🍜" },
        { id: "drink", name: "饮品", icon: "🥤" },
    ];
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
    await delay(600);
    return [
        // 会员专属
        {
            id: "m1",
            categoryId: "member",
            name: "清汤锅底自带蔬菜",
            price: 10,
            unit: "份",
            image: "🥬",
            tag: "会员特惠",
            description: "新鲜时蔬配清汤锅底",
            sales: 1523,
        },
        {
            id: "m2",
            categoryId: "member",
            name: "会员专享肥牛套餐",
            price: 58,
            unit: "份",
            image: "🥩",
            tag: "会员专享",
            description: "精选肥牛500g+时令蔬菜",
            sales: 856,
        },

        // 火锅锅底
        {
            id: "h1",
            categoryId: "hotpot",
            name: "清汤锅",
            price: 10,
            unit: "份",
            image: "🍲",
            tag: "养生首选",
            description: "清淡养生，老少皆宜",
            sales: 2341,
        },
        {
            id: "h2",
            categoryId: "hotpot",
            name: "麻辣锅",
            price: 10,
            unit: "份",
            image: "🌶️",
            description: "正宗川味，香辣过瘾",
            sales: 3126,
        },
        {
            id: "h3",
            categoryId: "hotpot",
            name: "番茄锅",
            price: 10,
            unit: "份",
            image: "🍅",
            description: "酸甜可口，营养丰富",
            sales: 1687,
        },
        {
            id: "h4",
            categoryId: "hotpot",
            name: "菌菇锅",
            price: 10,
            unit: "份",
            image: "🍄",
            description: "鲜香浓郁，滋补养生",
            sales: 934,
        },

        // 肉类
        {
            id: "d1",
            categoryId: "meat",
            name: "精品肥牛",
            price: 38,
            unit: "份",
            image: "🥩",
            description: "肉质鲜嫩，入口即化",
            sales: 4521,
        },
        {
            id: "d2",
            categoryId: "meat",
            name: "手切羊肉",
            price: 45,
            unit: "份",
            image: "🐑",
            description: "新鲜现切，不膻不腻",
            sales: 3245,
        },
        {
            id: "d3",
            categoryId: "meat",
            name: "嫩牛肉",
            price: 42,
            unit: "份",
            image: "🥩",
            description: "口感嫩滑，鲜香浓郁",
            sales: 2876,
        },
        {
            id: "d4",
            categoryId: "meat",
            name: "五花肉",
            price: 28,
            unit: "份",
            image: "🥓",
            description: "肥瘦相间，香而不腻",
            sales: 2134,
        },

        // 海鲜
        {
            id: "s1",
            categoryId: "seafood",
            name: "鲜虾滑",
            price: 32,
            unit: "份",
            image: "🦐",
            description: "新鲜大虾制作，Q弹爽口",
            sales: 3567,
        },
        {
            id: "s2",
            categoryId: "seafood",
            name: "鱿鱼须",
            price: 28,
            unit: "份",
            image: "🦑",
            description: "新鲜鱿鱼，口感脆嫩",
            sales: 2341,
        },
        {
            id: "s3",
            categoryId: "seafood",
            name: "蟹柳",
            price: 18,
            unit: "份",
            image: "🦀",
            description: "鲜美可口，营养丰富",
            sales: 1890,
        },

        // 蔬菜
        {
            id: "v1",
            categoryId: "vegetable",
            name: "时令蔬菜拼盘",
            price: 18,
            unit: "份",
            image: "🥗",
            description: "多种时令蔬菜组合",
            sales: 4123,
        },
        {
            id: "v2",
            categoryId: "vegetable",
            name: "生菜",
            price: 8,
            unit: "份",
            image: "🥬",
            description: "新鲜脆嫩，清爽解腻",
            sales: 3456,
        },
        {
            id: "v3",
            categoryId: "vegetable",
            name: "茼蒿",
            price: 12,
            unit: "份",
            image: "🌿",
            description: "清香可口，营养价值高",
            sales: 2789,
        },
        {
            id: "v4",
            categoryId: "vegetable",
            name: "土豆片",
            price: 8,
            unit: "份",
            image: "🥔",
            description: "口感绵软，老少皆宜",
            sales: 3234,
        },

        // 丸滑类
        {
            id: "b1",
            categoryId: "meatball",
            name: "手工丸子",
            price: 22,
            unit: "份",
            image: "⚪",
            description: "纯手工制作，Q弹爽滑",
            sales: 3890,
        },
        {
            id: "b2",
            categoryId: "meatball",
            name: "牛肉丸",
            price: 24,
            unit: "份",
            image: "⚪",
            description: "精选牛肉，弹牙有嚼劲",
            sales: 3567,
        },
        {
            id: "b3",
            categoryId: "meatball",
            name: "鱼豆腐",
            price: 16,
            unit: "份",
            image: "⚪",
            description: "鱼肉香浓，口感细腻",
            sales: 2890,
        },

        // 豆制品
        {
            id: "t1",
            categoryId: "tofu",
            name: "豆腐三宝",
            price: 15,
            unit: "份",
            image: "🧈",
            description: "豆腐、豆皮、腐竹组合",
            sales: 3123,
        },
        {
            id: "t2",
            categoryId: "tofu",
            name: "冻豆腐",
            price: 8,
            unit: "份",
            image: "🧊",
            description: "吸汁入味，口感独特",
            sales: 2567,
        },
        {
            id: "t3",
            categoryId: "tofu",
            name: "千张结",
            price: 10,
            unit: "份",
            image: "🪢",
            description: "劲道有嚼劲，久煮不烂",
            sales: 1890,
        },

        // 主食
        {
            id: "st1",
            categoryId: "staple",
            name: "手工面",
            price: 8,
            unit: "份",
            image: "🍜",
            description: "手工擀制，筋道爽滑",
            sales: 2345,
        },
        {
            id: "st2",
            categoryId: "staple",
            name: "米饭",
            price: 3,
            unit: "份",
            image: "🍚",
            description: "粒粒分明，香软可口",
            sales: 4567,
        },
        {
            id: "st3",
            categoryId: "staple",
            name: "油条",
            price: 6,
            unit: "份",
            image: "🥖",
            description: "酥脆可口，涮锅必备",
            sales: 1234,
        },

        // 饮品
        {
            id: "dr1",
            categoryId: "drink",
            name: "酸梅汤",
            price: 8,
            unit: "杯",
            image: "🥤",
            description: "清凉解腻，生津止渴",
            sales: 3890,
        },
        {
            id: "dr2",
            categoryId: "drink",
            name: "王老吉",
            price: 6,
            unit: "罐",
            image: "🥫",
            description: "降火凉茶，经典饮品",
            sales: 2567,
        },
        {
            id: "dr3",
            categoryId: "drink",
            name: "椰汁",
            price: 8,
            unit: "瓶",
            image: "🥥",
            description: "香浓椰香，清甜可口",
            sales: 2123,
        },
    ];
};
