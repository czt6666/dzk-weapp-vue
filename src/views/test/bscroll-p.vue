<template>
    <div class="scroll-container">
        <div ref="bsWrapper" class="scroll-wrapper">
            <div class="scroll-scroller">
                <!-- 下拉刷新提示 -->
                <div class="pull-tip" v-html="tipText"></div>

                <!-- 列表 -->
                <ul class="scroll-list">
                    <li v-for="i in dataList" :key="i" class="scroll-list-item">
                        {{ i % 5 === 0 ? "scroll up 👆🏻" : `I am item ${i}` }}
                    </li>
                </ul>

                <!-- 上拉加载提示 -->
                <div class="pullup-tips">
                    <div v-if="!isPullUpLoad" class="before-trigger">
                        <span class="pullup-txt">Pull up and load more</span>
                    </div>
                    <div v-else class="after-trigger">
                        <span class="pullup-txt">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BScroll from "better-scroll";
import PullDown from "better-scroll";
import Pullup from "better-scroll";

BScroll.use(PullDown);
BScroll.use(Pullup);

// constants
const TIME_BOUNCE = 800;
const REQUEST_TIME = 2000;
const THRESHOLD = 70;
const STOP = 56;

const PHASE = {
    moving: { enter: "enter", leave: "leave" },
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
const isPullUpLoad = ref(false);
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

// pull down handler
async function pullingDownHandler() {
    setTipText(PHASE.fetching);
    STEP += 1;
    const newData = await mockFetchData();
    dataList.value = [...newData, ...dataList.value];
    setTipText(PHASE.succeed);
    bscroll?.finishPullDown();
    setTimeout(() => bscroll?.refresh(), TIME_BOUNCE + 50);
}

// pull up handler
async function pullingUpHandler() {
    isPullUpLoad.value = true;
    STEP += 1;
    const newData = await mockFetchData();
    dataList.value = [...dataList.value, ...newData];
    bscroll?.finishPullUp();
    bscroll?.refresh();
    isPullUpLoad.value = false;
}

// init better-scroll
function initBScroll() {
    if (!bsWrapper.value) return;

    bscroll = new BScroll(bsWrapper.value, {
        scrollY: true,
        scrollBar: true,
        bounceTime: TIME_BOUNCE,
        useTransition: false,
        pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP,
        },
        pullUpLoad: true,
        observeDOM: true,
    });

    bscroll.on("pullingDown", pullingDownHandler);
    bscroll.on("pullingUp", pullingUpHandler);
    bscroll.on("scrollEnd", () => console.log("scrollEnd"));
    bscroll.on("enterThreshold", () => setTipText(PHASE.moving.enter));
    bscroll.on("leaveThreshold", () => setTipText(PHASE.moving.leave));
}

onMounted(() => {
    dataList.value = generateData();
    initBScroll();
});
</script>

<style lang="scss" scoped>
.scroll-container {
    height: 100%;

    .scroll-wrapper {
        position: relative;
        height: 100%;
        padding: 0 10px;
        border: 1px solid #ccc;
        overflow: hidden;

        .scroll-scroller {
            .pull-tip {
                position: absolute;
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
                transform: translateY(-100%) translateZ(0);
                text-align: center;
                color: #999;
            }

            .scroll-list {
                padding: 0;

                .scroll-list-item {
                    padding: 10px 0;
                    list-style: none;
                    border-bottom: 1px solid #ccc;
                }
            }

            .pullup-tips {
                padding: 20px;
                text-align: center;
                color: #999;
            }
        }
    }
}
</style>
