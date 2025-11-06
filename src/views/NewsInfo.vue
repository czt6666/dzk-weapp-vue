<template>
    <div class="news-info">
        <el-page-header @back="router.back()" content="新闻详情" />

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="content">
            <h2>{{ info.title }}</h2>
            <p class="meta">发布日期：{{ publishDate }}　浏览量：{{ info.views }}</p>
            <!-- <img :src="imgUrl(info.imageUrl)" alt="封面" class="cover" /> -->
            <div class="body" v-html="transHtml(info.content)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNewsItem } from "@/apis/news";
import { imgUrl } from "@/utils/index";
import { transHtml } from "@/utils/transHtml";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const info = ref<any>({});
const loading = ref(true);

async function fetchNewsDetail(id: number) {
    try {
        const params = route.params;
        const id = Number(params.id);
        if (!id) return console.error("id未传入");

        const res = await getNewsItem({ id });
        if (!res.data) {
            return ElMessage.error("新闻获取失败");
        }
        return res.data;
    } catch {
        return ElMessage.error("新闻获取失败");
    }
}

const publishDate = computed(() => {
    if (!info.value.date) {
        return "";
    }
    const date = new Date(info.value.createTime);
    return date.toLocaleDateString();
});

onMounted(async () => {
    info.value = await fetchNewsDetail(id);
    loading.value = false;
});
</script>

<style lang="scss" scoped>
// @use "../styles/htmlNews.scss";

.news-info {
    padding: 20px;
}
.loading {
    text-align: center;
    padding: 40px 0;
    color: #666;
}
.content {
    .new-title {
        font-size: 20px;
    }
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
    //
}
</style>
