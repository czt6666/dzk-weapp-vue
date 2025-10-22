<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>
        <div class="news-list">
            <SmartScrollList ref="listRef" :fetchData="fetchData" :pageSize="10">
                <template #item="{ itemData }">
                    <NewsListItem :info="itemData" />
                </template>
            </SmartScrollList>
        </div>
    </div>
</template>
<script lang="ts" setup name="NewsList">
import NewsListItem from "@/components/news/NewsListItem.vue";

function generateData(page: number, pageSize: number) {
    const list = [];
    const start = (page - 1) * pageSize;

    for (let i = 0; i < pageSize; i++) {
        const id = start + i + 1;
        list.push({
            id,
            title: `这是第 ${id} 条新闻标题`,
            date: `2024-08-${((id % 30) + 1).toString().padStart(2, "0")}`,
            views: 1000 + id * 3,
            likes: Math.floor(Math.random() * 100),
            image: `https://picsum.photos/seed/${id}/200/120`,
        });
    }

    return list;
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
}
</style>
