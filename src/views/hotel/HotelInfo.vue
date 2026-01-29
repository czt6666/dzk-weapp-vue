<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="hotel-detail">
        <!-- 顶部封面 -->
        <div class="cover-wrapper">
            <el-image
                class="cover"
                :src="imgUrl(info.coverImage)"
                :preview-src-list="coverPreviewList"
                :preview-teleported="true"
                alt="封面"
                fit="cover"
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
            <button class="btn-call" @click="callPhone(info.contactPhone)">📞 联系房东</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getHotelItem } from "@/apis/hotel";
import { imgUrl } from "@/utils/index";
import ActionArrow from "@/components/base/ActionArrow.vue";

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

// 检测设备是否支持打电话
function isPhoneSupported(): boolean {
    // 检测是否为移动设备
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
    );
    return isMobile;
}

// 复制电话号码到剪贴板
async function copyPhone(phone: string) {
    try {
        await navigator.clipboard.writeText(phone);
        ElMessage.success(`电话号码 ${phone} 已复制到剪贴板`);
    } catch (err) {
        // 降级方案：使用传统方法
        const textArea = document.createElement("textarea");
        textArea.value = phone;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            ElMessage.success(`电话号码 ${phone} 已复制到剪贴板`);
        } catch (e) {
            ElMessage.error("复制失败，请手动复制");
        }
        document.body.removeChild(textArea);
    }
}

// 处理联系房东
async function callPhone(phone: string) {
    if (!phone) {
        ElMessage.warning("电话号码为空");
        return;
    }

    // 检测是否支持打电话
    if (isPhoneSupported()) {
        // 支持打电话，显示确认弹窗
        try {
            await ElMessageBox.confirm(
                `确定要拨打 ${phone} 吗？`,
                "联系房东",
                {
                    confirmButtonText: "拨打",
                    cancelButtonText: "取消",
                    type: "info",
                },
            );
            // 用户确认后拨打电话
            window.location.href = `tel:${phone}`;
        } catch {
            // 用户取消操作
        }
    } else {
        // 不支持打电话，提供复制功能
        try {
            await ElMessageBox.confirm(
                `当前设备不支持直接拨打电话，是否复制电话号码 ${phone}？`,
                "联系房东",
                {
                    confirmButtonText: "复制",
                    cancelButtonText: "取消",
                    type: "info",
                },
            );
            // 用户确认后复制电话号码
            await copyPhone(phone);
        } catch {
            // 用户取消操作
        }
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

            &:active {
                background: color.adjust($color-green-primary, $lightness: -10%);
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
