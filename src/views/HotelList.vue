<template>
    <div class="page">
        <div class="banner">
            <img src="@/assets/banner/qiufen.jpg" alt="banner" />
        </div>

        <!-- 排序按钮 -->
        <div class="sort-dropdown">
            <el-dropdown trigger="click" @command="handleSortChange">
                <span class="el-dropdown-link">
                    排序
                    <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="latest">最新</el-dropdown-item>
                        <el-dropdown-item command="hot">最热</el-dropdown-item>
                        <el-dropdown-item command="recommend">推荐</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <!-- 瀑布流容器 -->
        <div class="waterfall-list">
            <SmartScrollList ref="listRef" :onRefresh="onRefresh" :onLoadMore="onLoadMore">
                <div class="columns">
                    <div class="column" v-for="(col, i) in columns" :key="i">
                        <WaterfallItem
                            v-for="item in col"
                            :key="item.id"
                            :info="item"
                            @click="goDetail(item.id)"
                        />
                    </div>
                </div>
            </SmartScrollList>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";
import WaterfallItem from "@/components/hotel/HotelItem.vue";

const router = useRouter();
const currentSort = ref("latest");

let page = 1;
const pageSize = 10;

// 原始数据 + 分两列
const list = ref<any[]>([]);
const columns = ref<any[][]>([[], []]);

// 模拟异步加载数据
async function generateData(page: number, pageSize: number) {
    await new Promise((r) => setTimeout(r, 800));
    const list: any[] = [];
    const start = (page - 1) * pageSize;

    for (let i = 0; i < pageSize; i++) {
        const id = start + i + 1;
        list.push({
            id,
            title: `第 ${id} 条 ${currentSort.value} 数据`,
            desc: "环境优美，舒适安静~",
            views: 2000 + id,
            likes: Math.floor(Math.random() * 100),
            image: `https://picsum.photos/seed/${id}/300/${200 + (id % 100)}`, // 高度随机
        });
    }

    return list;
}

async function onRefresh() {
    page = 1;
    list.value = await generateData(page, pageSize);
    splitToColumns(list.value);
}

async function onLoadMore() {
    page++;
    const newList = await generateData(page, pageSize);
    list.value.push(...newList);
    splitToColumns(list.value);
}

function splitToColumns(items: any[]) {
    const left: any[] = [];
    const right: any[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    items.forEach((item) => {
        const estHeight = item.image.includes("/300/") ? Number(item.image.split("/300/")[1]) : 200;
        if (leftHeight <= rightHeight) {
            left.push(item);
            leftHeight += estHeight;
        } else {
            right.push(item);
            rightHeight += estHeight;
        }
    });

    columns.value = [left, right];
}

// /**
//  * 根据真实图片高度计算瀑布流布局
//  * @param items  图片列表
//  */
// async function splitToColumns(items: any[]) {
//     const left: any[] = [];
//     const right: any[] = [];
//     let leftHeight = 0;
//     let rightHeight = 0;

//     // 等待所有图片加载完毕后再计算布局
//     const withHeights = await Promise.all(
//         items.map(async (item) => {
//             try {
//                 const height = await getImageHeight(item.image);
//                 console.log(item, height);

//                 return { ...item, _height: height };
//             } catch {
//                 return { ...item, _height: 100 }; // 加载失败默认高度
//             }
//         }),
//     );

//     // 分配到两列
//     withHeights.forEach((item) => {
//         if (leftHeight <= rightHeight) {
//             left.push(item);
//             leftHeight += item._height;
//         } else {
//             right.push(item);
//             rightHeight += item._height;
//         }
//     });

//     columns.value = [left, right];
// }

// /**
//  * 异步获取图片实际高度
//  * @param url 图片链接
//  * @returns 图片高度（像素）
//  */
// function getImageHeight(url: string): Promise<number> {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         let resolved = false;

//         img.onload = () => {
//             if (!resolved) {
//                 resolved = true;
//                 resolve(img.height);
//             }
//         };

//         img.onerror = () => {
//             if (!resolved) {
//                 resolved = true;
//                 reject(new Error("图片加载失败"));
//             }
//         };

//         // 超时处理（防止网络太慢卡死）
//         setTimeout(() => {
//             if (!resolved) {
//                 resolved = true;
//                 reject(new Error("图片加载超时"));
//             }
//         }, 5000);

//         img.src = url;
//     });
// }

function goDetail(id: number) {
    router.push(`/detail/${id}`);
}

function handleSortChange(command: string) {
    currentSort.value = command;
    ElMessage.success(`已切换排序：${getSortName(command)}`);
    onRefresh();
}

function getSortName(type: string) {
    switch (type) {
        case "latest":
            return "最新";
        case "hot":
            return "最热";
        case "recommend":
            return "推荐";
        default:
            return "未知";
    }
}

onRefresh();
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
.sort-dropdown {
    height: 40px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
}
.waterfall-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;

    .columns {
        display: flex;
        gap: 12px;

        .column {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
}
</style>
