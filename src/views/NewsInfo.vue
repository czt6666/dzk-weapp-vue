<template>
    <div class="news-info">
        <el-page-header @back="router.back()" content="新闻详情" />

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="content">
            <h2>{{ info.title }}</h2>
            <p class="meta">发布日期：{{ info.date }}　浏览量：{{ info.views }}</p>
            <img :src="info.image" alt="封面" class="cover" />
            <p class="body">{{ info.content }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const info = ref<any>({});
const loading = ref(true);

// 模拟请求
async function fetchNewsDetail(id: number) {
    const res = await getNewsList({ page: 1, pageSize: 1, id });
    return {
        id,
        title: `这是第 ${id} 条新闻标题`,
        date: `2024-08-${((id % 30) + 1).toString().padStart(2, "0")}`,
        views: 1000 + id * 3,
        image: `https://picsum.photos/seed/${id}/600/400`,
        content:
            "这是一条模拟的新闻内容，展示新闻的详情内容部分。你可以将这里替换为后端接口返回的真实数据。",
    };
}

onMounted(async () => {
    info.value = await fetchNewsDetail(id);
    loading.value = false;
});
</script>

<style scoped>
.news-info {
    padding: 20px;
}
.loading {
    text-align: center;
    padding: 40px 0;
    color: #666;
}
.cover {
    width: 100%;
    border-radius: 8px;
    margin: 20px 0;
}
.meta {
    color: #888;
    font-size: 14px;
    margin-top: 5px;
}
.body {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
}
</style>
