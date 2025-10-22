<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>
        <div class="news-list">
            <SmartScrollList ref="listRef" :fetchData="fetchData" :pageSize="10">
                <template #item="{ item }">
                    <div>
                        <!-- 自定义项渲染 -->
                        我是第 {{ item }} 条
                    </div>
                </template>
            </SmartScrollList>
        </div>
    </div>
</template>
<script lang="ts" setup name="NewsList">
import { ref, reactive } from "vue";

function generateData(page: number, pageSize: number) {
    const BASE = 10;
    const begin = BASE * (page - 1);
    const end = BASE * page;
    const ret: number[] = [];
    for (let i = end; i > begin; i--) ret.unshift(i);
    return ret;
}

async function fetchData(page: number, pageSize: number, type: string) {
    console.log("fetchData", page, pageSize, type);

    await new Promise((r) => setTimeout(r, 800));
    if (type === "refresh") {
        return generateData(page, pageSize);
    } else {
        return generateData(page, pageSize);
    }
}
</script>
<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.banner {
    width: 100%;
    height: 200px;

    > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.news-list {
    flex: 1;
    height: 500px; // ?
    background-color: pink;
}
</style>
