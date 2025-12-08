<template>
    <div class="news-item">
        <div class="news-content">
            <h3 class="news-title">{{ info.title }}</h3>
            <div class="news-meta">
                <!-- <span class="date">{{ info.date }}</span> -->
                <span class="views"> <i class="iconfont"></i> {{ publishTime }} </span>
                <span class="likes"> <i class="iconfont"></i> {{ info.themeName }} </span>
            </div>
        </div>
        <div class="news-image">
            <img :src="imgUrl(props.info.imageUrl)" alt="新闻图片" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { imgUrl } from "@/utils";

interface INewsListItem {
    author: string;
    content: string;
    createTime: string;
    id: number;
    imageUrl: string;
    publishStatus: number;
    themeName: string;
    title: string;
    villageName: string;
}

const props = defineProps<{ info: INewsListItem }>();

const publishTime = computed(() => {
    const date = new Date(props.info.createTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
    const day = String(date.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;
    return formatted;
});
</script>

<style lang="scss" scoped>
.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition:
        transform 0.2s,
        box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .news-content {
        flex: 1;
        margin-right: 16px;

        .news-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .news-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: #888;

            .iconfont {
                margin-right: 4px;
                font-size: 14px;
            }
        }
    }

    .news-image {
        flex-shrink: 0;

        img {
            display: block;
            width: 120px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
    }
}
</style>
