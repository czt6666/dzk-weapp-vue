<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="hotel-detail">
        <!-- 顶部封面 -->
        <div class="cover-wrapper">
            <el-image class="cover" :src="imgUrl(info.coverImage)" alt="封面" fit="cover" />
            <div class="title-bar">
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

            <div class="map-wrapper" v-if="info.longitude && info.latitude">
                <MapMark
                    :marks="[
                        {
                            lng: info.longitude,
                            lat: info.latitude,
                            name: info.homestayName,
                            address: info.address,
                        },
                    ]"
                    :showMyLocation="true"
                    :autoFitView="true"
                />
            </div>

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
import MapMark from "@/components/base/MapMark.vue";

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
@use "@/styles/variables.scss" as *;

.hotel-detail {
    font-family: "PingFang SC", sans-serif;
    height: 100%;
    overflow-y: auto;
    color: $text-primary;
    background: $bg-gradient-main;

    .cover-wrapper {
        position: relative;

        :deep(.cover) {
            width: 100%;
            height: 220px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
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

            .title {
                font-size: 18px;
                font-weight: bold;
                flex: 1;
                text-align: center;
            }
        }
    }

    .content {
        padding: $spacing-md;
        background: rgba(255, 255, 255, 0.6);
        margin: $spacing-sm;
        margin-bottom: 80px;
        border-radius: $radius-large;
        backdrop-filter: blur(10px);

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

        .map-wrapper {
            width: 100%;
            height: 220px;
            margin-bottom: $spacing-lg;
            border-radius: $radius-medium;
            overflow: hidden;
            box-shadow: $shadow-lg;
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        padding: $spacing-md;

        .btn-call {
            width: 100%;
            background: $color-green-primary;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: $radius-small;
            padding: $spacing-md 0;
            cursor: pointer;
            transition: $transition-base;

            &:hover {
                background: darken($color-green-primary, 10%);
            }

            &:active {
                transform: scale(0.98);
            }
        }
    }

    .loading {
        text-align: center;
        padding: $spacing-xxl 0;
        color: #888;
    }
}
</style>
