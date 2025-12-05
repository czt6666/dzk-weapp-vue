<template>
    <Carousel :images="currentImages" />
</template>

<script setup>
import Carousel from "@/components/base/Carousel.vue";

// 1. 定义节气和节日数据（包含日期和类型）
const festivals = [
    // 节日
    { name: "元旦", date: "01-01", type: "festival" },
    { name: "春节", date: "02-01", type: "festival" }, // 示例日期，实际需动态计算
    { name: "清明节", date: "04-04", type: "festival" },
    { name: "劳动节", date: "05-01", type: "festival" },
    { name: "端午节", date: "06-03", type: "festival" },
    { name: "中秋节", date: "09-15", type: "festival" },
    { name: "国庆节", date: "10-01", type: "festival" },

    // 节气
    { name: "立春", date: "02-04", type: "solar" },
    { name: "立夏", date: "05-06", type: "solar" },
    { name: "立秋", date: "08-08", type: "solar" },
    { name: "立冬", date: "11-08", type: "solar" },
    { name: "春分", date: "03-21", type: "solar" },
    { name: "夏至", date: "06-21", type: "solar" },
    { name: "秋分", date: "09-23", type: "solar" },
    { name: "冬至", date: "12-22", type: "solar" },
];

// 2. 图片资源配置（按节日/节气类型分类）
const imageResources = {
    // 通用节日图片
    festival: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1531379631145-c3ec6021a47c?w=1200&h=400&fit=crop",
    ],
    // 节气图片
    solar: [
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
    ],
    // 春季主题
    spring: [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1200&h=400&fit=crop",
    ],
    // 夏季主题
    summer: [
        "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?w=1200&h=400&fit=crop",
    ],
    // 秋季主题
    autumn: [
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1200&h=400&fit=crop",
    ],
    // 冬季主题
    winter: [
        "https://images.unsplash.com/photo-1482350496146-339e08c7e178?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1513672267492-691303d3b2c6?w=1200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=400&fit=crop",
    ],
};

// 3. 获取当前日期并格式化
const getCurrentDate = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${month}-${day}`;
};

// 4. 计算即将到来的节日/节气
const getUpcomingFestival = () => {
    const currentDate = getCurrentDate();
    let upcoming = null;
    let minDiff = Infinity;

    festivals.forEach((festival) => {
        // 计算日期差值
        const [fMonth, fDay] = festival.date.split("-").map(Number);
        const [cMonth, cDay] = currentDate.split("-").map(Number);

        let diff;
        if (fMonth > cMonth || (fMonth === cMonth && fDay >= cDay)) {
            // 今年的节日
            diff = (fMonth - cMonth) * 30 + (fDay - cDay);
        } else {
            // 明年的节日
            diff = (12 - cMonth + fMonth) * 30 + (fDay - cDay);
        }

        if (diff < minDiff) {
            minDiff = diff;
            upcoming = festival;
        }
    });

    return upcoming;
};

// 5. 根据季节获取图片主题
const getSeasonTheme = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
};

// 6. 计算当前应显示的图片
const currentImages = computed(() => {
    const upcomingFestival = getUpcomingFestival();
    const seasonTheme = getSeasonTheme();

    // 如果有即将到来的节日/节气（30天内），使用对应类型图片
    if (upcomingFestival) {
        return imageResources[upcomingFestival.type] || imageResources[seasonTheme];
    }

    // 否则使用季节主题图片
    return imageResources[seasonTheme];
});
</script>
