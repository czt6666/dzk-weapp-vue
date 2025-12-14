/* ===============================
 * 1. 农历节日映射（工程级）
 * =============================== */

const SPRING_FESTIVAL_MAP = {
    2020: "2020-01-25",
    2021: "2021-02-12",
    2022: "2022-02-01",
    2023: "2023-01-22",
    2024: "2024-02-10",
    2025: "2025-01-29",
    2026: "2026-02-17",
    2027: "2027-02-06",
    2028: "2028-01-26",
    2029: "2029-02-13",
    2030: "2030-02-03",
    2031: "2031-01-23",
    2032: "2032-02-11",
    2033: "2033-01-31",
    2034: "2034-02-19",
    2035: "2035-02-08",
};

// 其他农历节日 = 春节 + 偏移天数
const LUNAR_OFFSET = {
    lanternFestival: 15, // 元宵节 正月十五
    dragonBoat: 127, // 端午节 五月初五
    qixi: 181, // 七夕
    midAutumn: 236, // 中秋节 八月十五
    doubleNinth: 266, // 重阳节 九月初九
};

/* ===============================
 * 2. 公历 + 农历节日
 * =============================== */

function buildFestivals(year: number) {
    const festivals = [
        {
            name: "元旦",
            id: "newYear",
            start: new Date(year, 0, 1),
            end: new Date(year, 0, 3),
        },
        {
            name: "劳动节",
            id: "labourDay",
            start: new Date(year, 4, 1),
            end: new Date(year, 4, 5),
        },
        {
            name: "清明节",
            id: "qingmingFestival",
            start: new Date(year, 3, 4),
            end: new Date(year, 3, 6),
        },
        {
            name: "国庆节",
            id: "nationalDay",
            start: new Date(year, 9, 1),
            end: new Date(year, 9, 7),
        },
    ];

    // 农历节日
    const springDateStr = SPRING_FESTIVAL_MAP[year as keyof typeof SPRING_FESTIVAL_MAP];
    if (springDateStr) {
        const springDate = new Date(springDateStr);

        festivals.push({
            name: "春节",
            id: "springFestival",
            start: springDate,
            end: new Date(springDate.getTime() + 6 * 86400000),
        });

        festivals.push({
            name: "元宵节",
            id: "lanternFestival",
            start: new Date(springDate.getTime() + LUNAR_OFFSET.lanternFestival * 86400000),
            end: new Date(springDate.getTime() + (LUNAR_OFFSET.lanternFestival + 1) * 86400000),
        });

        festivals.push({
            name: "端午节",
            id: "dragonBoat",
            start: new Date(springDate.getTime() + LUNAR_OFFSET.dragonBoat * 86400000),
            end: new Date(springDate.getTime() + (LUNAR_OFFSET.dragonBoat + 2) * 86400000),
        });

        festivals.push({
            name: "七夕",
            id: "qixi",
            start: new Date(springDate.getTime() + LUNAR_OFFSET.qixi * 86400000),
            end: new Date(springDate.getTime() + (LUNAR_OFFSET.qixi + 1) * 86400000),
        });

        festivals.push({
            name: "中秋节",
            id: "midAutumn",
            start: new Date(springDate.getTime() + LUNAR_OFFSET.midAutumn * 86400000),
            end: new Date(springDate.getTime() + (LUNAR_OFFSET.midAutumn + 2) * 86400000),
        });

        festivals.push({
            name: "重阳节",
            id: "doubleNinth",
            start: new Date(springDate.getTime() + LUNAR_OFFSET.doubleNinth * 86400000),
            end: new Date(springDate.getTime() + (LUNAR_OFFSET.doubleNinth + 1) * 86400000),
        });
    }

    return festivals.map((f) => ({
        ...f,
        type: "festival",
    }));
}

/* ===============================
 * 3. 24 节气（略，假定你已有）
 * =============================== */
const SOLAR_TERMS = [
    { name: "小寒", id: "minorCold", month: 1, c: 6.11 },
    { name: "大寒", id: "majorCold", month: 1, c: 20.84 },
    { name: "立春", id: "springStart", month: 2, c: 4.6295 },
    { name: "雨水", id: "rainWater", month: 2, c: 19.4599 },
    { name: "惊蛰", id: "awakening", month: 3, c: 6.3826 },
    { name: "春分", id: "springEquinox", month: 3, c: 21.4155 },
    { name: "清明", id: "qingming", month: 4, c: 4.81 },
    { name: "谷雨", id: "grainRain", month: 4, c: 20.1 },
    { name: "立夏", id: "summerStart", month: 5, c: 5.52 },
    { name: "小满", id: "grainFull", month: 5, c: 21.04 },
    { name: "芒种", id: "grainInEar", month: 6, c: 5.678 },
    { name: "夏至", id: "summerSolstice", month: 6, c: 21.37 },
    { name: "小暑", id: "minorHeat", month: 7, c: 7.108 },
    { name: "大暑", id: "majorHeat", month: 7, c: 22.83 },
    { name: "立秋", id: "autumnStart", month: 8, c: 7.5 },
    { name: "处暑", id: "limitHeat", month: 8, c: 23.13 },
    { name: "白露", id: "whiteDew", month: 9, c: 7.646 },
    { name: "秋分", id: "autumnEquinox", month: 9, c: 23.042 },
    { name: "寒露", id: "coldDew", month: 10, c: 8.318 },
    { name: "霜降", id: "frostDescent", month: 10, c: 23.438 },
    { name: "立冬", id: "winterStart", month: 11, c: 7.438 },
    { name: "小雪", id: "minorSnow", month: 11, c: 22.36 },
    { name: "大雪", id: "majorSnow", month: 12, c: 7.18 },
    { name: "冬至", id: "winterSolstice", month: 12, c: 21.94 },
];

// 节气日期计算
function calcSolarTerms(year: number) {
    return SOLAR_TERMS.map((term) => {
        const day = Math.floor(term.c + 0.2422 * (year - 1900) - Math.floor((year - 1900) / 4));

        const date = new Date(year, term.month - 1, day);

        return {
            name: term.name,
            id: term.id,
            start: date,
            end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            type: "solar",
        };
    });
}

export function getAllFestivals(year: number) {
    return [...buildFestivals(year), ...calcSolarTerms(year)];
}
