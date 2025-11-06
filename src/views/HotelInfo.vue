<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="hotel-detail">
        <!-- 顶部封面 -->
        <div class="cover-wrapper">
            <img class="cover" :src="imgUrl(info.coverImage)" alt="封面" />
            <div class="title-bar">
                <div class="back" @click="router.back()">←</div>
                <div class="title">{{ info.homestayName }}</div>
            </div>
        </div>

        <!-- 主体内容 -->
        <div class="content">
            <h1 class="hotel-name">{{ info.homestayName }}</h1>
            <div class="meta">
                <span class="star">⭐ {{ info.starLevel }} 星</span>
                <span class="address">{{ info.address }}</span>
            </div>

            <div class="desc">{{ info.description }}</div>

            <div class="info-section">
                <h2>民宿信息</h2>
                <ul class="info-list">
                    <li><strong>房间数：</strong>{{ info.roomCount }}</li>
                    <li><strong>床位数：</strong>{{ info.bedCount }}</li>
                    <li><strong>最大容量：</strong>{{ info.maxCapacity }}人</li>
                    <li><strong>联系人：</strong>{{ info.contactName }}</li>
                    <li><strong>联系电话：</strong>{{ info.contactPhone }}</li>
                </ul>
            </div>

            <div class="time">发布日期：{{ publishDate }}</div>
        </div>

        <!-- 底部按钮 -->
        <div class="bottom-bar">
            <button class="btn-call" @click="callPhone(info.contactPhone)">📞 联系房东</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getHotelItem } from "@/apis/hotel";
import { imgUrl } from "@/utils/index";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const info = ref<any>({});
const loading = ref(true);

const publishDate = computed(() => {
    if (!info.value.createTime) return "";
    const date = new Date(info.value.createTime);
    return date.toLocaleDateString();
});

function callPhone(phone: string) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
}

onMounted(async () => {
    try {
        const res = await getHotelItem(id);

        if (!res.data) return ElMessage.error("民宿获取失败");
        info.value = res.data;
    } catch {
        ElMessage.error("民宿获取失败");
    }

    loading.value = false;
});
</script>

<style lang="scss" scoped>
.hotel-detail {
    font-family: "PingFang SC", sans-serif;
    color: #333;
    background: #fff;
    min-height: 100vh;

    .cover-wrapper {
        position: relative;

        .cover {
            width: 100%;
            height: 220px;
            object-fit: cover;
        }

        .title-bar {
            position: absolute;
            top: 10px;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            padding: 0 12px;
            color: #fff;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);

            .back {
                font-size: 20px;
                cursor: pointer;
                margin-right: 8px;
            }
            .title {
                font-size: 18px;
                font-weight: bold;
                flex: 1;
                text-align: center;
            }
        }
    }

    .content {
        padding: 16px;

        .hotel-name {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .meta {
            font-size: 14px;
            color: #888;
            margin-bottom: 10px;

            .star {
                color: #ff9900;
                margin-right: 10px;
            }
        }

        .desc {
            font-size: 15px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 16px;
        }

        .info-section {
            margin-bottom: 20px;

            h2 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .info-list {
                list-style: none;
                padding: 0;

                li {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.8;
                }
            }
        }

        .time {
            font-size: 12px;
            color: #aaa;
            text-align: right;
        }
    }

    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        padding: 12px;

        .btn-call {
            width: 100%;
            background: #ff6b00;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 0;
            cursor: pointer;
        }
    }

    .loading {
        text-align: center;
        padding: 100px 0;
        color: #888;
    }
}
</style>
