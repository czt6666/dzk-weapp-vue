<template>
    <div class="scroll-container">
        <div ref="bsWrapper" class="scroll-wrapper">
            <div class="scroll-scroller">
                <!-- 下拉刷新提示 -->
                <div class="pull-tip" v-html="tipHtml"></div>

                <!-- 列表 -->
                <ul class="scroll-list">
                    <li
                        v-for="(item, idx) in list"
                        :key="itemKey(item, idx)"
                        class="scroll-list-item"
                    >
                        <slot name="item" :item="item" :index="idx"></slot>
                    </li>
                </ul>

                <!-- 上拉加载提示 -->
                <div class="pullup-tips">
                    <div v-if="!isPullUpLoad" class="before-trigger">
                        <span class="pullup-txt">上拉加载更多</span>
                    </div>
                    <div v-else class="after-trigger">
                        <span class="pullup-txt">加载中...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BScroll from "better-scroll";
// import PullDown from "better-scroll";
// import PullUp from "better-scroll";

// BScroll.use(PullDown);
// BScroll.use(PullUp);

// ---------- props ----------
const props = defineProps({
    fetchData: { type: Function, required: true },
    pageSize: { type: Number, default: 15 },
    itemKey: { type: Function, default: (item: any, idx: number) => idx },
});

// ---------- constants & svg ----------
const TIME_BOUNCE = 800;
const THRESHOLD = 70;
const STOP = 56;

const ARROW_BOTTOM =
    '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"/></svg>';
const ARROW_UP =
    '<svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"/></svg>';

// ---------- reactive state ----------
const list = ref<any[]>([]);
const tipHtml = ref<string>(`${ARROW_BOTTOM} 下拉刷新`);
const isPullUpLoad = ref(false);
const bsWrapper = ref<HTMLElement | null>(null);
const initLoading = ref(false);
let bscroll: BScroll | null = null;

// page 管理
let page = 1;
const pageSize = props.pageSize || 15;

// small helper to set tip text
function setTip(phase: "enter" | "leave" | "fetching" | "succeed" | "idle") {
    const map: Record<string, string> = {
        enter: `${ARROW_BOTTOM} 下拉刷新`,
        leave: `${ARROW_UP} 释放刷新`,
        fetching: `加载中...`,
        succeed: `刷新成功`,
        idle: `${ARROW_BOTTOM} 下拉刷新`,
    };
    tipHtml.value = map[phase] || (map.idle as string);
}

// ---------- fetch wrappers ----------
let isFetching = false;

// 下拉刷新：重置 page 到 initialPage 并请求
async function doRefresh() {
    if (isFetching) return;
    isFetching = true;
    try {
        setTip("fetching");
        page = 1;
        const newData = await props.fetchData(page, pageSize, "refresh");
        // 父组件返回完整列表或新的一页都接受：我们把它当作新的列表（父端更灵活）
        list.value = Array.isArray(newData) ? newData : [];
        setTip("succeed");
        // 通知 better-scroll 完成下拉（如果存在）
        bscroll?.finishPullDown();
        // refresh after a small delay to allow bounce animation
        setTimeout(() => {
            bscroll?.refresh();
            setTip("idle");
        }, TIME_BOUNCE + 50);
    } catch (e) {
        // 出错也恢复状态
        setTip("idle");
        bscroll?.finishPullDown();
        bscroll?.refresh();
        console.error("doRefresh error", e);
    } finally {
        isFetching = false;
    }
}

// 上拉加载：page +1 并请求，追加结果
async function doLoadMore() {
    if (isFetching) return;
    isFetching = true;
    try {
        isPullUpLoad.value = true;
        page += 1;
        const more = await props.fetchData(page, pageSize, "load");
        if (Array.isArray(more) && more.length > 0) {
            list.value = [...list.value, ...more];
        } else {
            // 如果没有更多数据，回退 page
            page = Math.max(1, page - 1);
        }
        bscroll?.finishPullUp();
        bscroll?.refresh();
    } catch (e) {
        console.error("doLoadMore error", e);
        page = Math.max(1, page - 1);
        bscroll?.finishPullUp();
        bscroll?.refresh();
    } finally {
        isPullUpLoad.value = false;
        isFetching = false;
    }
}

// ---------- better-scroll init ----------
function initBScroll() {
    if (!bsWrapper.value) return;

    bscroll = new BScroll(bsWrapper.value, {
        scrollY: true,
        // scrollbar: true,
        probeType: 3,
        click: true,
        bounceTime: TIME_BOUNCE,
        pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP,
        },
        pullUpLoad: true,
        observeDOM: true,
        // test
        disableTouch: false,
        stopPropagation: true,
    });

    bscroll.on("pullingDown", async () => {
        await doRefresh();
    });

    bscroll.on("pullingUp", async () => {
        await doLoadMore();
    });

    bscroll.on("enterThreshold", () => setTip("enter"));
    bscroll.on("leaveThreshold", () => setTip("leave"));
    bscroll.on("scrollEnd", () => {
        // 保持兼容：应用可以监听滚动 end（如果需要可以 emit）
    });
}

onMounted(async () => {
    // 先做一次数据获取（不通过 pull-down 事件）
    try {
        isFetching = true;
        // initLoading.value = true;
        const initial = await props.fetchData(page, pageSize, "refresh");
        list.value = Array.isArray(initial) ? initial : [];
    } catch (e) {
        console.error("initial fetch error", e);
    } finally {
        isFetching = false;
        // initLoading.value = false;
    }
    await nextTick();
    initBScroll();
});

onBeforeUnmount(() => {
    bscroll?.destroy();
    bscroll = null;
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
