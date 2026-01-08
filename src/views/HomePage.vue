<template>
    <div class="home-page">
        <img class="background-image" :src="homeBg" />

        <svg
            class="svg-overlay"
            viewBox="0 0 1672 2508"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.5 355V468.5L812.5 614.5L864 561V0.5H259L3.5 355Z"
                class="hot-area"
                @click="goToModule('NewsList')"
            />
            <path
                d="M0.5 493.5V1365.5C74.5 1349.5 247.075 1303.52 284.5 1291.5C353 1269.5 505 1234 539 1200C573 1166 620 1126.5 652.5 1043.5C679.322 975 694 831 732.5 749L805 637.5L40.5 493.5H0.5Z"
                class="hot-area"
                @click="goToModule('RetirementList')"
            />
            <path
                d="M886.5 2V596C886.5 596 1086.5 495 1110.5 489.5C1134.5 484 1320.5 462.5 1356.5 449C1392.5 435.5 1382.5 424.5 1414 413.5C1445.5 402.5 1665.5 44 1665.5 44V2H886.5Z"
                class="hot-area"
                @click="goToModule('TourList')"
            />
            <path
                d="M1615.5 1801H814V1363H1130.5L1615.5 1429.5V1801Z"
                class="hot-area"
                @click="goToModule('ShopList')"
            />
            <path
                d="M1673 1836.5H813V2195.5C813 2224 822 2323 887.5 2378C939.9 2422 1041.67 2452 1086 2461.5H1673V1836.5Z"
                class="hot-area"
                @click="goToModule('RestaurantList')"
            />
            <path
                d="M61 2321.5V1796.5H718C721.333 1877.17 726 2048.4 718 2088C708 2137.5 672 2188.5 631 2239C598.2 2279.4 514.667 2310.83 477 2321.5H61Z"
                class="hot-area"
                @click="goToModule('HotelList')"
            />
            <path
                d="M1674 1345V488.5C1644 547 1563 590.5 1550.5 603C1540.5 613 1421.67 651.5 1363.5 669.5C1306.17 678.333 1186.7 696.7 1167.5 699.5C1143.5 703 1135.5 722 1103 730.5C1070.5 739 999 853 994 863.5C989 874 882 1134 875 1154.5C869.4 1170.9 810 1257 781 1298C806.167 1292.67 836 1272.5 882 1275C928 1277.5 1225 1326.5 1284.5 1334.5C1344 1342.5 1626.8 1374.4 1640 1368C1653.2 1361.6 1668.17 1350 1674 1345Z"
                class="hot-area"
                @click="goToModule('StudyList')"
            />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import homeBg from "@/assets/home.jpg";

const router = useRouter();

function goToModule(routeName: string) {
    try {
        router.push({ name: routeName });
    } catch (error) {
        console.error("路由跳转失败:", error);
    }
}
</script>

<style lang="scss" scoped>
.home-page {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: pink;
}

.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.svg-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: none;
    background: rgba(255, 0, 0, 0.05);

    .hot-area {
        // fill: rgba(0, 255, 0, 0.3);
        // stroke: red;
        // stroke-width: 4;
        // transition: all 0.3s ease;
        fill: transparent;
        cursor: pointer;
        pointer-events: all;
    }
}
</style>
