<template>
    <div ref="wrapper" class="scroll-wrapper">
        <VirtualList
            :data-key="'id'"
            :data-sources="items"
            :data-component="Item"
            :estimate-size="80"
            class="list"
        />
        <div v-if="loading" class="loading">加载中...</div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import BScroll from "better-scroll";
import PullDown from "better-scroll";
import PullUp from "better-scroll";
import VirtualList from "vue3-virtual-scroll-list";

import Item from "./Item.vue";

BScroll.use(PullDown);
BScroll.use(PullUp);

const wrapper = ref(null);
const bs = ref(null);
const items = ref(generateItems(50));
const loading = ref(false);

function generateItems(count) {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        text: `第 ${i + 1} 条数据`,
    }));
}

onMounted(() => {
    bs.value = new BScroll(wrapper.value, {
        scrollY: true,
        probeType: 3,
        bounceTime: 600,
        pullDownRefresh: { threshold: 70, stop: 50 },
        pullUpLoad: { threshold: -50 },
        momentum: true,
    });

    bs.value.on("pullingDown", async () => {
        console.log("下拉刷新");
        await new Promise((r) => setTimeout(r, 1000));
        items.value = generateItems(50); // 重置数据
        bs.value.finishPullDown();
        bs.value.refresh();
    });

    bs.value.on("pullingUp", async () => {
        console.log("上拉加载");
        loading.value = true;
        await new Promise((r) => setTimeout(r, 1000));
        const more = generateItems(20).map((it) => ({ ...it, id: items.value.length + it.id }));
        items.value.push(...more);
        loading.value = false;
        bs.value.finishPullUp();
        bs.value.refresh();
    });
});

onBeforeUnmount(() => {
    bs.value?.destroy();
});
</script>

<style scoped>
.scroll-wrapper {
    position: relative;
    height: 100vh;
    overflow: hidden;
    background: #fafafa;
}
.list {
    padding: 10px;
}
.loading {
    text-align: center;
    padding: 12px;
    color: #888;
}
</style>
