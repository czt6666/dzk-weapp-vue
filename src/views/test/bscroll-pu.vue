<template>
    <div class="pullup">
        <div ref="scroll" class="pullup-wrapper">
            <div class="pullup-content">
                <ul class="pullup-list">
                    <li v-for="i in data" :key="i" class="pullup-list-item">
                        {{ i % 5 === 0 ? "scroll up 👆🏻" : `I am item ${i}` }}
                    </li>
                </ul>
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
import Pullup from "better-scroll";

BScroll.use(Pullup);

const isPullUpLoad = ref(false);
const data = ref<number>(30);
const scroll = ref<HTMLElement | null>(null);
let bscroll: BScroll | null = null;

function ajaxGet(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(20); // 模拟返回新数据条数
        }, 1000);
    });
}

async function requestData() {
    try {
        const newData = await ajaxGet();
        data.value += newData;
    } catch (err) {
        console.error(err);
    }
}

async function pullingUpHandler() {
    isPullUpLoad.value = true;
    await requestData();
    bscroll?.finishPullUp();
    bscroll?.refresh();
    isPullUpLoad.value = false;
}

function initBScroll() {
    if (!scroll.value) return;
    bscroll = new BScroll(scroll.value, {
        pullUpLoad: true,
    });
    bscroll.on("pullingUp", pullingUpHandler);
}

onMounted(() => {
    initBScroll();
});
</script>

<style lang="scss" scoped>
.pullup {
    height: 100%;

    .pullup-wrapper {
        height: 100%;
        padding: 0 10px;
        border: 1px solid #ccc;
        overflow: hidden;
    }

    .pullup-list {
        padding: 0;
    }

    .pullup-list-item {
        padding: 10px 0;
        list-style: none;
        border-bottom: 1px solid #ccc;
    }

    .pullup-tips {
        padding: 20px;
        text-align: center;
        color: #999;
    }
}
</style>
