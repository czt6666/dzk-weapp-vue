<template>
    <div class="news-info">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="content">
            <h2 class="news-title">{{ info.title }}</h2>
            <p class="meta">
                发布日期：{{ publishDate || "--" }}
                <!-- 浏览量：{{ info.views || "--" }} -->
            </p>
            <div class="body" ref="bodyRef" v-html="transHtml(info.content)"></div>
        </div>
        <ImageViewer
            v-model="showViewer"
            :image-urls="imageUrls"
            :initial-index="currentImageIndex"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getNewsItem } from "@/apis/news";
import { transHtml } from "@/utils/transHtml";
import ImageViewer from "@/components/base/ImageViewer.vue";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const info = ref<any>({});
const loading = ref(true);
const bodyRef = ref<HTMLElement | null>(null);
const showViewer = ref(false);
const imageUrls = ref<string[]>([]);
const currentImageIndex = ref(0);

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

// 为图片添加点击预览功能
function setupImagePreview() {
    nextTick(() => {
        const bodyEl = document.querySelector(".news-info .body");
        if (!bodyEl) return;

        const images = bodyEl.querySelectorAll("img");
        if (images.length === 0) return;

        const urls: string[] = [];
        images.forEach((img) => {
            // 检查是否已经添加过事件监听器
            if ((img as any).__hasPreviewListener) return;

            const src = img.getAttribute("src");
            if (src && typeof src === "string") {
                urls.push(src);
                img.style.cursor = "pointer";

                const clickHandler = (e: Event) => {
                    e.stopPropagation();
                    const index = urls.indexOf(src);
                    imageUrls.value = urls;
                    currentImageIndex.value = index >= 0 ? index : 0;
                    showViewer.value = true;
                };

                img.addEventListener("click", clickHandler);
                // 标记已添加事件监听器
                (img as any).__hasPreviewListener = true;
                (img as any).__clickHandler = clickHandler;
            }
        });
    });
}

onMounted(async () => {
    info.value = await fetchNewsDetail();
    loading.value = false;
    setupImagePreview();
});

// 监听内容变化，重新设置图片预览
watch(
    () => info.value.content,
    () => {
        setupImagePreview();
    },
);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.news-info {
    height: 100%;
    overflow-y: auto;
    padding: $spacing-md;
    background: $bg-gradient-main;
}

.loading {
    text-align: center;
    padding: $spacing-xl 0;
    color: $text-secondary;
}

.content {
    width: 100%;
    border-radius: 16px;

    .news-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: $spacing-md;
        color: $color-red-primary;
        font-weight: 600;
    }
}

.cover {
    width: 100%;
    border-radius: $radius-small;
    margin: $spacing-xl 0;
}

.meta {
    text-align: right;
    color: $text-tertiary;
    font-size: 14px;
    margin-bottom: $spacing-md;
}

:deep(.body) {
    P {
        font-size: 16px;
        text-indent: 2em;
        margin-bottom: $spacing-md;
        line-height: 1.8;
        color: $text-primary;

        > img {
            margin-left: -2em;
        }
    }
    img {
        width: 100%;
        border-radius: $radius-medium;
        margin: $spacing-md 0;
    }
}
</style>
