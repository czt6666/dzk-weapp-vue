<template>
    <div class="pull-list-container">
        <div ref="wrapper" class="pull-list-wrapper">
            <div class="pull-list-scroller">
                <!-- 下拉刷新提示 -->
                <div class="pull-tip" v-html="tipText"></div>

                <!-- 列表内容 -->
                <ul class="pull-list">
                    <li v-for="item in dataList" :key="item" class="pull-list-item">
                        我是第 {{ item }} 条数据
                    </li>
                </ul>

                <!-- 上拉加载提示 -->
                <div class="pullup-tip">
                    <div v-if="!isPullUpLoading" class="before-trigger">上拉加载更多</div>
                    <div v-else class="after-trigger">加载中...</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import BScroll from "better-scroll";

// ------------------------ 常量 ------------------------
const TIME_BOUNCE = 800;
const REQUEST_TIME = 1500;
const THRESHOLD = 70;
const STOP = 56;
let PAGE = 0;

// 状态枚举
const PHASE = {
    enter: "enter",
    leave: "leave",
    fetching: "fetching",
    succeed: "succeed",
};

// 图标
const ARROW_DOWN =
    '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>';
const ARROW_UP =
    '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>';

// ------------------------ 响应式变量 ------------------------
const dataList = ref<number[]>([]);
const isPullUpLoading = ref(false);
const tipText = ref("");
const wrapper = ref<HTMLElement | null>(null);
let bscroll: BScroll | null = null;

// ------------------------ 函数定义 ------------------------
function generateData(): number[] {
    const base = 10;
    const start = PAGE * base;
    const end = (PAGE + 1) * base;
    return Array.from({ length: base }, (_, i) => start + i + 1);
}

function setTipText(phase: string = PHASE.enter) {
    const TEXT_MAP: Record<string, string> = {
        enter: `${ARROW_DOWN} 下拉刷新`,
        leave: `${ARROW_UP} 释放更新`,
        fetching: "加载中...",
        succeed: "刷新成功",
    };
    tipText.value = TEXT_MAP[phase] || "";
}

function mockFetch(): Promise<number[]> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(generateData()), REQUEST_TIME);
    });
}

async function onPullDown() {
    setTipText(PHASE.fetching);
    PAGE++;
    const newData = await mockFetch();
    dataList.value = [...newData, ...dataList.value];
    setTipText(PHASE.succeed);
    bscroll?.finishPullDown();
    setTimeout(() => bscroll?.refresh(), TIME_BOUNCE);
}

async function onPullUp() {
    isPullUpLoading.value = true;
    PAGE++;
    const newData = await mockFetch();
    dataList.value = [...dataList.value, ...newData];
    bscroll?.finishPullUp();
    bscroll?.refresh();
    isPullUpLoading.value = false;
}

function initScroll() {
    if (!wrapper.value) return;
    bscroll = new BScroll(wrapper.value, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        probeType: 3,
        pullDownRefresh: { threshold: THRESHOLD, stop: STOP },
        pullUpLoad: true,
        observeDOM: true,
    });

    bscroll.on("pullingDown", onPullDown);
    bscroll.on("pullingUp", onPullUp);
    bscroll.on("enterThreshold", () => setTipText(PHASE.enter));
    bscroll.on("leaveThreshold", () => setTipText(PHASE.leave));
}

// ------------------------ 生命周期 ------------------------
onMounted(() => {
    dataList.value = generateData();
    initScroll();
});

onBeforeUnmount(() => {
    bscroll?.destroy();
});
</script>

<style scoped lang="scss">
.pull-list-container {
    height: 100%;
    background: #fafafa;

    .pull-list-wrapper {
        position: relative;
        height: 100%;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .pull-list-scroller {
        .pull-tip {
            position: absolute;
            top: 0;
            width: 100%;
            padding: 16px 0;
            transform: translateY(-100%);
            text-align: center;
            color: #666;
            font-size: 14px;

            svg {
                vertical-align: middle;
                margin-right: 4px;
            }
        }

        .pull-list {
            padding: 0;
            margin: 0;

            .pull-list-item {
                list-style: none;
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
                font-size: 15px;
                background: #fff;

                &:nth-child(even) {
                    background: #f9f9f9;
                }
            }
        }

        .pullup-tip {
            padding: 16px 0;
            text-align: center;
            color: #999;
            font-size: 14px;
        }
    }
}
</style>
