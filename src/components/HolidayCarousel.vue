<template>
    <Carousel :images="currentImages" />
</template>

<script setup>
import { computed } from "vue";
import Carousel from "@/components/base/Carousel.vue";
import { getAllFestivals } from "@/utils/festival";
import yushui from "@/assets/festival/yushui.jpg";
import xiaoshu from "@/assets/festival/xiaoshu.png";
import lixia from "@/assets/festival/lixia.jpg";
import spring1 from "@/assets/festival/spring1.jpg";
import spring2 from "@/assets/festival/spring2.jpg";
import summer1 from "@/assets/festival/summer1.jpg";
import summer2 from "@/assets/festival/summer2.jpg";
import autumn1 from "@/assets/festival/autumn1.png";
import winter1 from "@/assets/festival/winter1.jpg";
import default1 from "@/assets/festival/default1.jpg";
import default2 from "@/assets/festival/default2.png";
import default3 from "@/assets/festival/default3.jpg";
import default4 from "@/assets/festival/default4.jpg";
import default5 from "@/assets/festival/default5.png";
import default6 from "@/assets/festival/default6.png";
import default7 from "@/assets/festival/default7.png";
import default8 from "@/assets/festival/default8.png";
import default9 from "@/assets/festival/default9.jpg";

// 👉 修改这里即可模拟日期
const TEST_DATE = null;
// const TEST_DATE = new Date("2025-01-29"); // 春节
// const TEST_DATE = new Date("2025-06-10"); // 端午
// const TEST_DATE = new Date("2025-09-06"); // 中秋

function getNow() {
    return TEST_DATE ? new Date(TEST_DATE) : new Date();
}

const imageResources = {
    // 节日
    newYear: [],
    labourDay: [],
    qingmingFestival: [],
    nationalDay: [],
    springFestival: [],
    lanternFestival: [],
    dragonBoat: [],
    qixi: [],
    midAutumn: [],
    doubleNinth: [],

    // 节气
    minorCold: [],
    majorCold: [],
    springStart: [],
    rainWater: [],
    awakening: [],
    springEquinox: [],
    qingming: [],
    grainRain: [],
    summerStart: [],
    grainFull: [],
    grainInEar: [],
    summerSolstice: [],
    minorHeat: [],
    majorHeat: [],
    autumnStart: [],
    limitHeat: [],
    whiteDew: [],
    autumnEquinox: [],
    coldDew: [],
    frostDescent: [],
    winterStart: [],
    minorSnow: [],
    majorSnow: [],
    winterSolstice: [],

    // 季节
    spring: [yushui, lixia, spring1, spring2],
    summer: [yushui, lixia, summer1, summer2],
    autumn: [yushui, lixia, autumn1],
    winter: [yushui, lixia, winter1],

    //
    default: [
        default1,
        default2,
        default3,
        default4,
        default5,
        default6,
        default7,
        default8,
        default9,
    ],
};

function getUpcomingFestivals() {
    const now = getNow();
    const year = now.getFullYear();
    const all = getAllFestivals(year);

    return all.filter((item) => item.start <= now && item.end >= now);
}

function getSeasonTheme() {
    const m = getNow().getMonth() + 1;
    if (m >= 3 && m <= 5) return "spring";
    if (m >= 6 && m <= 8) return "summer";
    if (m >= 9 && m <= 11) return "autumn";
    return "winter";
}

const currentImages = computed(() => {
    const MAX_IMAGES = 6;
    const festivals = getUpcomingFestivals();
    const season = getSeasonTheme();

    // 节日图片
    const festivalImages = festivals.flatMap((f) => imageResources[f.id] || []);

    // 季节图片
    const seasonImages = imageResources[season] || [];

    const result = [...festivalImages, ...seasonImages];

    // default 补齐
    if (result.length < MAX_IMAGES) {
        const need = MAX_IMAGES - result.length;
        const defaultImages = [...imageResources.default] || [];

        for (let i = 0; i < need; i++) {
            const index = Math.floor(Math.random() * defaultImages.length);
            result.push(defaultImages[index]);
            defaultImages.splice(index, 1);
        }
    }
    console.log(result);

    return result;
});
</script>
