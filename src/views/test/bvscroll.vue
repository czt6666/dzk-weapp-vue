<template>
    <div class="page">
        <!-- 加载动画 -->
        <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
            加载中...
        </div>

        <!-- 滚动容器 -->
        <div class="scroll-wrapper" ref="scrollWrapper" v-show="!loading">
            <div class="scroll-content">
                <!-- 下拉刷新提示 -->
                <div class="pull-down-tip">{{ pullDownStatus }}</div>

                <!-- 列表内容 -->
                <div v-for="item in items" :key="item.id" class="scroll-item">
                    {{ item.text }}
                </div>

                <!-- 上拉加载提示 -->
                <div class="pull-up-tip">{{ pullUpStatus }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BScroll from "better-scroll";

// 引入模拟数据函数
const generateItems = (start = 0, count = 20) =>
    Array.from({ length: count }, (_, i) => ({
        id: start + i + 1,
        text: `列表项 ${start + i + 1}`,
    }));

const scrollWrapper = ref(null);
const items = ref([]);
const loading = ref(true);

let scroll = null;
const pullDownStatus = ref("下拉刷新");
const pullUpStatus = ref("上拉加载");

const pageSize = 20;
let currentPage = 0;

// 模拟延时加载数据
const fetchData = (page, size) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateItems(page * size, size));
        }, 1000);
    });
};

// 下拉刷新
const handlePullDown = async () => {
    pullDownStatus.value = "刷新中...";
    const newData = await fetchData(0, pageSize);
    items.value = newData;
    currentPage = 1;
    scroll.finishPullDown();
    scroll.refresh();
    pullDownStatus.value = "下拉刷新";
};

// 上拉加载
const handlePullUp = async () => {
    pullUpStatus.value = "加载中...";
    const newData = await fetchData(currentPage, pageSize);
    if (newData.length === 0) {
        pullUpStatus.value = "没有更多数据";
    } else {
        items.value = [...items.value, ...newData];
        currentPage++;
        pullUpStatus.value = "上拉加载";
    }
    scroll.finishPullUp();
    scroll.refresh();
};

onMounted(async () => {
    // 初次加载数据
    items.value = await fetchData(currentPage, pageSize);
    currentPage++;
    loading.value = false;

    // 初始化 BetterScroll
    scroll = new BScroll(scrollWrapper.value, {
        scrollY: true,
        click: true,
        bounce: true,
        bounceTime: 800,
        probeType: 3,
        momentum: true,
        // pullDownRefresh: {
        //     threshold: 50,
        //     stop: 20,
        // },
        // pullUpLoad: {
        //     threshold: -50,
        // },
    });

    // scroll.on("pullingDown", handlePullDown);
    // scroll.on("pullingUp", handlePullUp);
});

onUnmounted(() => {
    if (scroll) scroll.destroy();
});
</script>

<style scoped>
.page {
    position: relative;
    height: 100%;
    font-family: Arial, sans-serif;
}

/* loading动画 */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #eee;
    border-top-color: #42b983;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 滚动容器 */
.scroll-wrapper {
    height: 100%;
    overflow-y: auto;
    background: #f5f5f5;
}

.scroll-content {
    min-height: 100%;
}

/* 下拉/上拉提示 */
.pull-down-tip,
.pull-up-tip {
    text-align: center;
    padding: 10px 0;
    color: #888;
    font-size: 14px;
}

/* 列表项 */
.scroll-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    background: white;
}
</style>
