<template>
    <div class="scroll-container">
        <div v-loading="initLoading" ref="bsWrapper" class="scroll-wrapper">
            <div class="scroll-scroller">
                <!-- 下拉刷新提示 -->
                <div class="pull-tip" v-html="tipHtml"></div>

                <!-- 列表 -->
                <slot></slot>

                <!-- 上拉加载提示 -->
                <div class="pullup-tips" v-show="pullUpTip !== 'hidden'">
                    {{ pullUpTip }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BScroll from "better-scroll";

const props = defineProps({
    pullDown: { type: Boolean, default: true },
    pullUp: { type: Boolean, default: true },
    onRefresh: { type: Function, required: true },
    onLoadMore: { type: Function, required: true },
});

// ---------- constants & svg ----------
const TIME_BOUNCE = 800;

const ARROW_BOTTOM =
    '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"/></svg>';
const ARROW_UP =
    '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"/></svg>';

// ---------- reactive state ----------
const tipHtml = ref(`${ARROW_BOTTOM} 下拉刷新`);
const pullUpTip = ref("上拉加载更多");
const bsWrapper = ref<HTMLElement | null>(null);
const initLoading = ref(false);
let bscroll: BScroll | null = null;

// small helper to set tip text
function setPullDownTip(phase: "enter" | "leave" | "fetching" | "succeed" | "idle") {
    const map = {
        enter: `${ARROW_BOTTOM} 下拉刷新`,
        leave: `${ARROW_UP} 释放刷新`,
        fetching: `加载中...`,
        succeed: `刷新成功`,
        idle: `${ARROW_BOTTOM} 下拉刷新`,
    };
    tipHtml.value = map[phase] || map.idle;
}

function setPullUpTip(phase: "enter" | "leave" | "fetching" | "succeed" | "idle") {
    const map = {
        enter: "上拉加载更多",
        leave: "释放加载更多",
        fetching: "加载中...",
        succeed: "hidden",
        idle: "上拉加载更多",
    };
    pullUpTip.value = map[phase] || map.idle;
}

let isFetching = false;

async function doRefresh() {
    if (isFetching) return;
    isFetching = true;
    try {
        setPullDownTip("fetching");
        await props.onRefresh();
        setPullDownTip("succeed");
        bscroll?.finishPullDown();

        // refresh after a small delay to allow bounce animation
        setTimeout(() => {
            bscroll?.refresh();
            setPullDownTip("idle");
        }, TIME_BOUNCE + 50);
    } catch (e) {
        // 出错也恢复状态
        setPullDownTip("idle");
        bscroll?.finishPullDown();
        bscroll?.refresh();
        // console.error("doRefresh error", e);
    } finally {
        isFetching = false;
    }
}

async function doLoadMore() {
    if (isFetching) return;
    isFetching = true;
    try {
        setPullUpTip("fetching");

        await props.onLoadMore();
        setPullUpTip("succeed");
        await nextTick();

        setTimeout(() => {
            setPullUpTip("idle");
            bscroll?.finishPullUp();
            bscroll?.refresh();
        }, TIME_BOUNCE + 50);
    } catch (e) {
        setPullUpTip("idle");
        console.error("doLoadMore error", e);
        bscroll?.finishPullUp();
        bscroll?.refresh();
    } finally {
        isFetching = false;
    }
}

// ---------- better-scroll init ----------
function initBScroll() {
    if (!bsWrapper.value) return;
    console.log(props);

    bscroll = new BScroll(bsWrapper.value, {
        scrollY: true,
        scrollbar: true,
        probeType: 3,
        click: true,
        bounceTime: TIME_BOUNCE,
        pullDownRefresh: props.pullDown,
        pullUpLoad: props.pullUp,
        observeDOM: true,
    });

    if (props.pullDown) {
        bscroll.on("pullingDown", async () => {
            await doRefresh();
        });
    }

    if (props.pullUp) {
        bscroll.on("pullingUp", async () => {
            await doLoadMore();
        });
    }

    bscroll.on("enterThreshold", () => (setPullDownTip("enter"), setPullUpTip("enter")));
    bscroll.on("leaveThreshold", () => (setPullDownTip("leave"), setPullUpTip("leave")));
    bscroll.on("scrollEnd", () => {});
}

onMounted(async () => {
    initBScroll();

    try {
        initLoading.value = true;
        await doRefresh();
    } catch (e) {
        console.error("initial fetch error", e);
    } finally {
        initLoading.value = false;
    }
    await nextTick();
});

onBeforeUnmount(() => {
    bscroll?.destroy();
    bscroll = null;
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.scroll-container {
    height: 100%;

    .scroll-wrapper {
        position: relative;
        height: 100%;
        padding: 0 $spacing-md;
        overflow: hidden;

        .scroll-scroller {
            padding-bottom: 10px;
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
            }

            .pullup-tips {
                line-height: 40px;
                text-align: center;
                color: #999;
            }
        }
    }
}
</style>
