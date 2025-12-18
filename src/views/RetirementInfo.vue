<template>
    <div class="station-detail" v-if="info">
        <!-- 顶部封面 -->
        <div class="header">
            <div class="header-main">
                <h1 class="name">{{ info.name }}</h1>
                <span class="status" :class="statusClass">
                    {{ statusText }}
                </span>
            </div>

            <div class="price">
                {{ info.priceRange || "价格面议" }}
            </div>

            <div class="modes">
                <span class="mode" v-for="m in serviceModes" :key="m">
                    {{ m }}
                </span>
            </div>
        </div>

        <!-- 地址 -->
        <section class="section">
            <h2 class="title">📍 位置信息</h2>
            <p class="text">{{ info.businessAddress }}</p>
        </section>

        <!-- 服务能力 -->
        <section class="section">
            <h2 class="title">🏥 服务能力</h2>
            <div class="facts">
                <div class="fact">
                    <span class="label">床位数量</span>
                    <span class="value">{{ info.totalBeds }} 张</span>
                </div>
                <div class="fact">
                    <span class="label">护理等级</span>
                    <span class="value">{{ info.careLevel }}</span>
                </div>
                <div class="fact">
                    <span class="label">房间配置</span>
                    <span class="value">{{ info.roomConfig }}</span>
                </div>
            </div>
        </section>

        <!-- 联系方式 -->
        <section class="section">
            <h2 class="title">☎️ 联系方式</h2>
            <div class="facts">
                <div class="fact">
                    <span class="label">联系电话</span>
                    <span class="value">{{ info.officialPhone }}</span>
                </div>
                <div class="fact">
                    <span class="label">应急联系人</span>
                    <span class="value">
                        {{ info.emergencyContact }}（{{ info.emergencyPhone }}）
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
                <li>养老许可证：{{ info.elderlyLicenseNo }}</li>
                <li v-if="info.medicalLicenseNo">医疗许可证：{{ info.medicalLicenseNo }}</li>
                <li v-if="info.foodLicenseNo">食品许可证：{{ info.foodLicenseNo }}</li>
                <li v-if="info.fireAcceptanceNo">消防验收：{{ info.fireAcceptanceNo }}</li>
            </ul>
        </section>

        <!-- 环境照片 -->
        <section class="section" v-if="photos.length">
            <h2 class="title">🖼 环境照片</h2>
            <div class="gallery">
                <img v-for="p in photos" :key="p" :src="p" alt="环境照片" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getRetirementStationDetail, type IRetirementStation } from "@/apis/retirement";

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

const photos = computed(() =>
    info.value?.environmentPhotos ? info.value.environmentPhotos.split(",") : [],
);
</script>

<style scoped lang="scss">
.station-detail {
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    background: #f7f8fa;
}

/* 头部 */
.header {
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;

    .header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .name {
        font-size: 22px;
        font-weight: 600;
    }

    .status {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 12px;

        &.open {
            color: #67c23a;
            background: #f0f9eb;
        }

        &.close {
            color: #f56c6c;
            background: #fef0f0;
        }
    }

    .price {
        margin-top: 10px;
        font-size: 16px;
        color: #f56c6c;
        font-weight: 500;
    }

    .modes {
        margin-top: 10px;

        .mode {
            display: inline-block;
            margin-right: 8px;
            margin-top: 6px;
            padding: 4px 10px;
            font-size: 12px;
            color: #409eff;
            background: #ecf5ff;
            border-radius: 8px;
        }
    }
}

/* 区块 */
.section {
    background: #fff;
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 14px;

    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
    }

    .text {
        color: #606266;
        line-height: 1.6;
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
        }
    }
}

.licenses {
    padding-left: 16px;
    color: #606266;

    li {
        margin-bottom: 6px;
    }
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;

    img {
        width: 100%;
        height: 110px;
        object-fit: cover;
        border-radius: 10px;
    }
}
</style>
