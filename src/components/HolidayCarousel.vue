<template>
    <Carousel :images="currentImages" />
</template>

<script setup>
import { computed } from "vue";
import Carousel from "@/components/base/Carousel.vue";
import { getAllFestivals } from "@/utils/festival";
import spring1 from "@/assets/swiper/spring1.jpg";
import spring2 from "@/assets/swiper/spring2.jpg";
import summer1 from "@/assets/swiper/summer1.jpg";
import summer2 from "@/assets/swiper/summer2.jpg";
import autumn1 from "@/assets/swiper/autumn1.png";
import winter1 from "@/assets/swiper/winter1.jpg";
import default1 from "@/assets/swiper/default1.jpg";
import default2 from "@/assets/swiper/default2.png";
import default3 from "@/assets/swiper/default3.jpg";
import default4 from "@/assets/swiper/default4.jpg";
import default5 from "@/assets/swiper/default5.png";
import default6 from "@/assets/swiper/default6.png";
import default7 from "@/assets/swiper/default7.png";
import default8 from "@/assets/swiper/default8.png";
import default9 from "@/assets/swiper/default9.jpg";
// 节日
import yuanxiao from "@/assets/swiper/festival/yuanxiao.jpg";

// 24节气
import bailu from "@/assets/swiper/24terms/bailu.jpg";
import chunfen from "@/assets/swiper/24terms/chunfen.png";
import dashu from "@/assets/swiper/24terms/dashu.jpg";
import daxue from "@/assets/swiper/24terms/daxue.png";
import dongzhi from "@/assets/swiper/24terms/dongzhi.jpg";
import guyu from "@/assets/swiper/24terms/guyu.jpg";
import hanlu from "@/assets/swiper/24terms/hanlu.jpg";
import jingzhe from "@/assets/swiper/24terms/jingzhe.jpg";
import lichun from "@/assets/swiper/24terms/lichun.jpg";
import lidong from "@/assets/swiper/24terms/lidong.jpg";
import liqiu from "@/assets/swiper/24terms/liqiu.jpg";
import lixia from "@/assets/swiper/24terms/lixia.jpg";
import mangzhong from "@/assets/swiper/24terms/mangzhong.jpg";
import qiufen from "@/assets/swiper/24terms/qiufen.jpg";
import shuangjiang from "@/assets/swiper/24terms/shuangjiang.jpg";
import xiaoman from "@/assets/swiper/24terms/xiaoman.jpg";
import xiaoshu from "@/assets/swiper/24terms/xiaoshu.png";
import xiaoxue from "@/assets/swiper/24terms/xiaoxue.jpg";
import yushui from "@/assets/swiper/24terms/yushui.jpg";
import xiaohan from "@/assets/swiper/24terms/xiaohan.jpg";
import dahan from "@/assets/swiper/24terms/dahan.jpg";
import qingming from "@/assets/swiper/24terms/qingming.jpg";
import xiazhi from "@/assets/swiper/24terms/xiazhi.jpg";
import chushu from "@/assets/swiper/24terms/chushu.jpg";

const MAX_IMAGES = 6;

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
    newYear: [yuanxiao],
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
    minorCold: [xiaohan],
    majorCold: [dahan],
    springStart: [lichun],
    rainWater: [yushui],
    awakening: [jingzhe],
    springEquinox: [chunfen],
    qingming: [qingming],
    grainRain: [guyu],
    summerStart: [lixia],
    grainFull: [xiaoman],
    grainInEar: [mangzhong],
    summerSolstice: [xiazhi],
    minorHeat: [xiaoshu],
    majorHeat: [dashu],
    autumnStart: [liqiu],
    limitHeat: [chushu],
    whiteDew: [bailu],
    autumnEquinox: [qiufen],
    coldDew: [hanlu],
    frostDescent: [shuangjiang],
    winterStart: [lidong],
    minorSnow: [xiaoxue],
    majorSnow: [daxue],
    winterSolstice: [dongzhi],

    // 季节
    spring: [yushui, spring1, spring2],
    summer: [yushui, summer1, summer2],
    autumn: [yushui, autumn1],
    winter: [yushui, winter1],

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
