<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="hotel-detail">
        <!-- 顶部封面 -->
        <div class="cover-wrapper">
            <Carousel
                :images="info.coverImage.map((i: string) => imgUrl(i))"
                :height="300"
                fit="contain"
                :is-preview="true"
            />
            <div class="title-bar">
                <div class="title">{{ info.homestayName }}</div>
            </div>
        </div>

        <!-- 主体内容 -->
        <div class="content">
            <h1 class="hotel-name">{{ info.homestayName }}</h1>
            <div class="meta">
                <span class="star">⭐ {{ info.starLevel }} 星</span>
                <span
                    v-if="info.longitude && info.latitude"
                    class="address address-clickable"
                    @click="goToMap"
                >
                    {{ info.address }}
                    <ActionArrow />
                </span>
                <span v-else class="address">{{ info.address }}</span>
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
            <!-- 联系房东按钮 -->
            <button class="btn-call" @click="callPhone(info.contactPhone)">📞 联系房东</button>
            <!-- 小程序预定按钮：只有当 miniProgramPath 和 miniProgramAppid 都存在时显示 -->
            <button v-if="hasMiniProgram" class="btn-book" @click="handleJumpToMiniProgram">
                🏨 小程序预定
            </button>
        </div>
    </div>
</template>

<script setup lang="ts" name="HotelInfo">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getHotelItem } from "@/apis/hotel";
import { imgUrl } from "@/utils/index";
import { showPhoneModal } from "@/utils/phoneModal";
import { jumpToMiniProgram } from "@/utils/purchase";
import ActionArrow from "@/components/base/ActionArrow.vue";
import Carousel from "@/components/base/Carousel.vue";

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

// 封面图片预览列表
const coverPreviewList = computed(() => {
    if (!info.value.coverImage) return [];
    return [imgUrl(info.value.coverImage)];
});

// 判断是否有小程序跳转信息
const hasMiniProgram = computed(() => {
    return !!info.value.miniProgramAppid && !!info.value.miniProgramPath;
});

// 跳转到微信小程序
function handleJumpToMiniProgram() {
    jumpToMiniProgram(
        info.value.miniProgramAppid || "",
        info.value.miniProgramPath || "",
        "民宿信息错误，跳转失败",
    );
}

// 处理联系房东
function callPhone(phone: string) {
    if (phone) {
        showPhoneModal(phone);
    }
}

// 跳转到地图页面
function goToMap() {
    if (info.value.longitude && info.value.latitude) {
        router.push({
            name: "Map",
            query: {
                lng: info.value.longitude.toString(),
                lat: info.value.latitude.toString(),
                name: info.value.homestayName,
                address: info.value.address,
                phone: info.value.contactPhone || "",
                type: "hotel",
            },
        });
    }
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
@use "sass:color";

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
            cursor: pointer;
            transition: transform 0.2s ease;

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
        margin: $spacing-md;
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

            .address {
                &.address-clickable {
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: color 0.2s;
                    border-radius: 4px;
                    padding: 4px 8px;
                    margin: -4px -8px;

                    &:active {
                        background-color: #f5f5f5;
                        color: $color-green-primary;
                    }
                }
            }
        }

        .desc {
            font-size: 15px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 16px;
            white-space: pre-wrap;
            word-break: break-word;
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
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        gap: $spacing-md;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        padding: $spacing-lg;

        .btn-book {
            flex: 1;
            background: $color-green-primary;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: $radius-small;
            padding: $spacing-md 0;
            cursor: pointer;
            transition: $transition-base;

            &:active {
                background: color.adjust($color-green-primary, $lightness: -10%);
                transform: scale(0.98);
            }
        }

        .btn-call {
            flex: 1;
            background: #fff;
            color: $color-green-primary;
            font-size: 16px;
            font-weight: 600;
            border: 1px solid $color-green-primary;
            border-radius: $radius-small;
            padding: $spacing-md 0;
            cursor: pointer;
            transition: $transition-base;

            &:active {
                background: color.adjust($color-green-primary, $alpha: -0.9);
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
