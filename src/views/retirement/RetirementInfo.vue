<template>
    <div class="station-detail" v-if="info">
        <!-- 顶部封面 -->
        <div class="header">
            <div class="header-main">
                <h1 class="name">{{ info.name || "暂无名称" }}</h1>
                <span class="status" :class="statusClass">
                    {{ statusText }}
                </span>
            </div>

            <div class="price">
                {{ info.priceRange || "价格面议" }}
            </div>

            <div class="modes">
                <span class="mode" v-for="m in serviceModes" :key="m">{{ m }}</span>
                <span v-if="!serviceModes.length" class="mode">暂无</span>
            </div>
        </div>

        <!-- 机构介绍 -->
        <section class="section">
            <h2 class="title">📝 机构介绍</h2>
            <p v-for="(para, i) in introductionParagraphs" :key="i" class="text introduction-text">
                {{ para }}
            </p>
            <p v-if="!introductionParagraphs.length" class="text introduction-text">暂无介绍</p>
        </section>

        <!-- 地址 -->
        <section class="section">
            <h2 class="title">📍 位置信息</h2>
            <div class="address-info">
                <p class="text"><strong>经营地址：</strong>{{ info.businessAddress || "暂无" }}</p>
                <p
                    class="text"
                    v-if="info.registeredAddress && info.registeredAddress !== info.businessAddress"
                >
                    <strong>注册地址：</strong>{{ info.registeredAddress || "暂无" }}
                </p>
            </div>
        </section>

        <!-- 服务能力 -->
        <section class="section">
            <h2 class="title">🏥 服务能力</h2>
            <div class="facts">
                <div class="fact">
                    <span class="label">床位数量</span>
                    <span class="value"
                        >{{ info.totalBeds ?? "暂无"
                        }}{{ info.totalBeds != null ? " 张" : "" }}</span
                    >
                </div>
                <div class="fact">
                    <span class="label">护理等级</span>
                    <span class="value">{{ info.careLevel || "暂无" }}</span>
                </div>
                <div class="fact">
                    <span class="label">房间配置</span>
                    <span class="value">{{ info.roomConfig || "暂无" }}</span>
                </div>
            </div>
        </section>

        <!-- 联系方式 -->
        <section class="section">
            <h2 class="title">☎️ 联系方式</h2>
            <div class="facts">
                <div class="fact">
                    <span class="label">联系电话</span>
                    <span
                        class="value phone-clickable"
                        @click="handlePhoneClick(info.officialPhone)"
                        v-if="info.officialPhone"
                    >
                        {{ info.officialPhone }}
                    </span>
                    <span class="value" v-else>-</span>
                </div>
                <div class="fact">
                    <span class="label">应急联系人</span>
                    <span class="value">
                        <template v-if="info.emergencyContact || info.emergencyPhone">
                            <span v-if="info.emergencyContact">{{ info.emergencyContact }}</span>
                            <span
                                v-if="info.emergencyPhone"
                                class="phone-clickable"
                                @click="handlePhoneClick(info.emergencyPhone)"
                            >
                                （{{ info.emergencyPhone }}）
                            </span>
                        </template>
                        <span v-else>暂无</span>
                    </span>
                </div>
                <div class="fact">
                    <span class="label">邮箱</span>
                    <span class="value">{{ info.officialEmail || "-" }}</span>
                </div>
            </div>
        </section>

        <!-- 资质 -->
        <section class="section">
            <h2 class="title">📄 机构资质</h2>
            <ul class="licenses">
                <li v-if="info.elderlyLicenseNo">养老许可证：{{ info.elderlyLicenseNo }}</li>
                <li v-if="info.medicalLicenseNo">医疗许可证：{{ info.medicalLicenseNo }}</li>
                <li v-if="info.foodLicenseNo">食品许可证：{{ info.foodLicenseNo }}</li>
                <li v-if="info.fireAcceptanceNo">消防验收：{{ info.fireAcceptanceNo }}</li>
                <li v-if="!hasAnyLicense">暂无</li>
            </ul>
        </section>

        <!-- 环境照片 -->
        <section class="section" v-if="photos.length">
            <h2 class="title">🖼 环境照片</h2>
            <div class="gallery">
                <el-image
                    v-for="(p, idx) in photos"
                    :key="idx"
                    :src="imgUrl(p)"
                    :preview-src-list="previewList"
                    :initial-index="idx"
                    alt="环境照片"
                    fit="cover"
                    :preview-teleported="true"
                    class="gallery-image"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts" name="RetirementInfo">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getRetirementStationDetail, type IRetirementStation } from "@/apis/retirement";
import { imgUrl } from "@/utils";
import { showPhoneModal } from "@/utils/phoneModal";

const route = useRoute();
const info = ref<IRetirementStation>();

async function fetchDetail() {
    try {
        const params = route.params;
        const id = Number(params.id);
        if (!id) return console.error("id未传入");

        const res = await getRetirementStationDetail(id);
        if (!res.data) {
            return ElMessage.error("退休站获取失败");
        }
        return res.data;
    } catch {
        return ElMessage.error("退休站获取失败");
    }
}

onMounted(async () => {
    info.value = await fetchDetail();
});

const statusText = computed(() => (info.value?.businessStatus === 1 ? "正常运营" : "暂停服务"));

const statusClass = computed(() => (info.value?.businessStatus === 1 ? "open" : "close"));

const serviceModes = computed(() => info.value?.serviceMode?.split(",") || []);

const introductionParagraphs = computed(() => {
    const text = info.value?.introduction;
    if (!text) return [];
    return text
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean);
});

const hasAnyLicense = computed(
    () =>
        !!(
            info.value?.elderlyLicenseNo ||
            info.value?.medicalLicenseNo ||
            info.value?.foodLicenseNo ||
            info.value?.fireAcceptanceNo
        ),
);

const photos = computed(() => {
    const photos = info.value?.environmentPhotos;
    if (!photos) return [];
    // environmentPhotos 可能是字符串（逗号分隔）或数组
    if (typeof photos === "string") {
        return photos.split(",").filter(Boolean);
    }
    return Array.isArray(photos) ? photos : [];
});

// 预览图片列表
const previewList = computed(() => {
    return photos.value.map((p: string) => imgUrl(p));
});

// 处理电话号码点击
function handlePhoneClick(phone: string) {
    if (phone) {
        showPhoneModal(phone);
    }
}
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.station-detail {
    height: 100%;
    overflow-y: auto;
    padding: $spacing-md;
    background: $bg-gradient-main;
}

/* 头部 */
.header {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-large;
    padding: $spacing-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-md;

    .header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .name {
        font-size: 22px;
        font-weight: 600;
        color: $color-green-primary;
    }

    .status {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 12px;

        &.open {
            color: $color-green-primary;
            background: $overlay-green-light;
        }

        &.close {
            color: $color-red-primary;
            background: rgba($color-red-primary, 0.1);
        }
    }

    .price {
        margin-top: $spacing-md;
        font-size: 16px;
        color: $color-green-primary;
        font-weight: 500;
    }

    .modes {
        margin-top: 10px;

        .mode {
            display: inline-block;
            margin-right: $spacing-sm;
            margin-top: 6px;
            padding: 4px $spacing-md;
            font-size: 12px;
            color: $color-green-primary;
            background: $overlay-green-light;
            border-radius: $radius-small;
        }
    }
}

/* 区块 */
.section {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: $radius-large;
    padding: $spacing-md;
    margin-bottom: $spacing-sm;
    box-shadow: $shadow-sm;

    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: $spacing-md;
        color: $color-green-primary;
    }

    .text {
        color: #606266;
        line-height: 1.6;
    }

    .introduction-text {
        word-break: break-word;
        text-indent: 2em;
        margin-bottom: $spacing-sm;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .address-info {
        .text {
            margin-bottom: 8px;

            &:last-child {
                margin-bottom: 0;
            }

            strong {
                color: #303133;
                font-weight: 500;
            }
        }
    }
}

.facts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;

    .fact {
        .label {
            display: block;
            font-size: 13px;
            color: #909399;
            margin-bottom: 4px;
        }

        .value {
            font-size: 14px;
            color: #303133;

            &.phone-clickable {
                cursor: pointer;
                color: $color-green-primary;
                transition: opacity 0.2s ease;

                &:active {
                    opacity: 0.7;
                }
            }
        }
    }
}

.licenses {
    padding-left: 20px;
    color: #606266;
    list-style: disc;

    li {
        margin-bottom: 6px;
        line-height: 1.6;
    }
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;

    .gallery-image {
        width: 100%;
        height: 110px;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.2s ease;

        :deep(.el-image__inner) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }
}
</style>
