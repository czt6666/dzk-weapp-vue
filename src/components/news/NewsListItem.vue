<template>
    <div class="news-item">
        <div class="news-content">
            <h3 class="news-title">{{ info.title }}</h3>
            <div class="news-meta">
                <span class="date">{{ info.date }}</span>
                <span class="views"> <i class="iconfont">&#128065;</i> {{ info.views }} </span>
                <span class="likes"> <i class="iconfont">&#128077;</i> {{ info.likes }} </span>
            </div>
        </div>
        <div class="news-image">
            <img :src="info.image" alt="新闻图片" />
        </div>
    </div>
</template>

<script lang="ts" setup>
interface INewsListItem {
    title: string;
    date: string;
    views: number;
    likes: number;
    image: string;
}

const props = defineProps<{ info: INewsListItem }>();
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
            width: 120px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
    }
}
</style>
