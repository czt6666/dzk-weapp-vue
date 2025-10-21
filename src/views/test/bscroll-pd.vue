<template>
    <div class="pulldown-sina">
        <div class="pulldown-bswrapper" ref="bsWrapper">
            <div class="pulldown-scroller">
                <div class="pulldown-wrapper" v-html="tipText"></div>
                <ul class="pulldown-list">
                    <li v-for="i in dataList" :key="i" class="pulldown-list-item">
                        {{ `I am item ${i}` }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BScroll from "better-scroll";
import PullDown from "better-scroll";

BScroll.use(PullDown);

// constants
const TIME_BOUNCE = 800;
const REQUEST_TIME = 2000;
const THRESHOLD = 90; // 顶部下拉的距离
const STOP = 56; // 回弹悬停的距离

const PHASE = {
    moving: {
        enter: "enter",
        leave: "leave",
    },
    fetching: "fetching",
    succeed: "succeed",
};

const ARROW_BOTTOM =
    '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>';
const ARROW_UP =
    '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>';

// state
let STEP = 0;
const tipText = ref<string>("");
const dataList = ref<number[]>([]);
const bsWrapper = ref<HTMLElement | null>(null);
let bscroll: BScroll | null = null;

// generate data
function generateData(): number[] {
    const BASE = 10;
    const begin = BASE * STEP;
    const end = BASE * (STEP + 1);
    const ret: number[] = [];
    for (let i = end; i > begin; i--) {
        ret.push(i);
    }
    return ret;
}

// set tip text
function setTipText(phase: string = PHASE.moving.enter) {
    const TEXTS_MAP: Record<string, string> = {
        enter: `${ARROW_BOTTOM} Pull down`,
        leave: `${ARROW_UP} Release`,
        fetching: "Loading...",
        succeed: "Refresh succeed",
    };
    tipText.value = TEXTS_MAP[phase] || "";
}

// mock fetch
function mockFetchData(): Promise<number[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateData());
        }, REQUEST_TIME);
    });
}

// get data
async function getData() {
    const newData = await mockFetchData();
    dataList.value = [...newData, ...dataList.value];
}

// pull down handler
async function pullingDownHandler() {
    setTipText(PHASE.fetching);
    STEP += 1;
    await getData();
    setTipText(PHASE.succeed);
    bscroll?.finishPullDown();
    setTimeout(() => bscroll?.refresh(), TIME_BOUNCE + 50);
}

// init better-scroll
function initBScroll() {
    if (!bsWrapper.value) return;
    bscroll = new BScroll(bsWrapper.value, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        useTransition: false,
        pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP,
        },
    });

    bscroll.on("pullingDown", pullingDownHandler);
    bscroll.on("scrollEnd", () => console.log("scrollEnd"));
    bscroll.on("enterThreshold", () => setTipText(PHASE.moving.enter));
    bscroll.on("leaveThreshold", () => setTipText(PHASE.moving.leave));
}

// initial load
onMounted(() => {
    dataList.value = generateData();
    initBScroll();
});
</script>

<style lang="scss" scoped>
.pulldown-sina {
    height: 100%;
}

.pulldown-bswrapper {
    position: relative;
    height: 100%;
    padding: 0 10px;
    border: 1px solid #ccc;
    overflow: hidden;
}

.pulldown-list {
    padding: 0;
}

.pulldown-list-item {
    padding: 10px 0;
    list-style: none;
    border-bottom: 1px solid #ccc;
}

.pulldown-wrapper {
    position: absolute;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    transform: translateY(-100%) translateZ(0);
    text-align: center;
    color: #999;
}
</style>
