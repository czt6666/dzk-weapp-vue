<template>
    <div style="height: 600px">
        <SmartScrollList :fetchData="fetchData" :pageSize="10">
            <template #item="{ item }">
                <div>
                    <!-- 自定义项渲染 -->
                    我是第 {{ item }} 条
                </div>
            </template>
        </SmartScrollList>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";

// 生成数据
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
