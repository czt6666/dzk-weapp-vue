<template>
    <div class="news-info">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="content">
            <h2 class="news-title">{{ info.title }}</h2>
            <p class="meta">
                发布日期：{{ publishDate || "--" }}　
                <!-- 浏览量：{{ info.views || "--" }} -->
            </p>
            <div class="body" v-html="transHtml(info.content)"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNewsItem } from "@/apis/news";
import { transHtml } from "@/utils/transHtml";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const info = ref<any>({});
const loading = ref(true);

async function fetchNewsDetail() {
    try {
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
    if (!info.value.createTime) {
        return "";
    }
    const date = new Date(info.value.createTime);
    return date.toLocaleDateString();
});

onMounted(async () => {
    info.value = await fetchNewsDetail();
    loading.value = false;
});
</script>

<style lang="scss" scoped>
// @use "../styles/htmlNews.scss";

.news-info {
    height: 100%;
    padding: 20px;
}
.loading {
    text-align: center;
    padding: 40px 0;
    color: #666;
}
.content {
    overflow-y: auto;
    width: 100%;
    height: 100%;

    .news-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: 10px;
    }
}
.cover {
    width: 100%;
    border-radius: 8px;
    margin: 20px 0;
}
.meta {
    text-align: right;
    color: #888;
    font-size: 14px;
    margin-bottom: 10px;
}
:deep(.body) {
    P {
        font-size: 16px;
        text-indent: 2em;
        margin-bottom: 12px;

        > img {
            margin-left: -2em;
        }
    }
    img {
        width: 100%;
    }
}
</style>
