<template>
    <div class="page">
        <div class="banner">
            <HolidayCarousel />
        </div>

        <!-- Tab栏 -->
        <div class="tabs">
            <div
                class="tab-item"
                :class="{ active: activeTab === 'plan' }"
                @click="switchTab('plan')"
            >
                研学方案
            </div>
            <div
                class="tab-item"
                :class="{ active: activeTab === 'activity' }"
                @click="switchTab('activity')"
            >
                研学活动
            </div>
        </div>

        <div class="toolbar">
            <SearchInput
                v-model="keyword"
                :placeholder="activeTab === 'plan' ? '搜索方案名称...' : '搜索活动名称...'"
                @handleSearch="handleSearch"
                @handleReset="handleReset"
            />
        </div>

        <div class="list">
            <SmartScrollList :onRefresh="onRefresh" :onLoadMore="debounce(onLoadMore)">
                <ul class="scroll-list">
                    <!-- 研学方案列表 -->
                    <template v-if="activeTab === 'plan'">
                        <li v-for="item in planList" :key="item.id" class="scroll-list-item">
                            <StudyPlanListItem
                                :info="item"
                                @click="goPlanDetail(item.id)"
                                @favorite="togglePlanFavorite(item.id, $event)"
                            />
                        </li>
                    </template>

                    <!-- 研学活动列表 -->
                    <template v-else>
                        <li v-for="item in activityList" :key="item.id" class="scroll-list-item">
                            <StudyActivityListItem
                                :info="item"
                                @click="goActivityDetail(item.id)"
                                @favorite="toggleActivityFavorite(item.id, $event)"
                            />
                        </li>
                    </template>
                </ul>
            </SmartScrollList>
        </div>
    </div>
</template>

<script lang="ts" setup name="StudyList">
import { ref } from "vue";
import HolidayCarousel from "@/components/HolidayCarousel.vue";
import StudyPlanListItem from "@/components/listitem/StudyPlanListItem.vue";
import StudyActivityListItem from "@/components/listitem/StudyActivityListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import SearchInput from "@/components/input/SearchInput.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getStudyPlanList, getStudyActivityList } from "@/apis/study";
import { debounce } from "@/utils/index";
import { createCollect, deleteCollect } from "@/apis/collect";

const router = useRouter();

// Tab状态
const activeTab = ref<"plan" | "activity">("plan");

// 研学方案相关
let planPage = 1;
const planPageSize = 10;
const planList = ref<any[]>([]);

// 研学活动相关
let activityPage = 1;
const activityPageSize = 10;
const activityList = ref<any[]>([]);

// 搜索关键词
const keyword = ref("");

// 切换Tab
function switchTab(tab: "plan" | "activity") {
    activeTab.value = tab;
    keyword.value = "";
    onRefresh();
}

// 获取研学方案数据
async function fetchPlanData(page: number, pageSize: number, keyword?: string) {
    try {
        const res = await getStudyPlanList({
            page,
            pageSize,
            planName: keyword,
        });
        if (planList.value.length + res.data.records.length > res.data.totalCount) {
            return [];
        }
        const resList = res?.data?.records || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取研学方案列表失败");
        console.error(err);
        return [];
    }
}

// 获取研学活动数据
async function fetchActivityData(pageNum: number, pageSize: number, keyword?: string) {
    try {
        const res = await getStudyActivityList({
            pageNum,
            pageSize,
            activityName: keyword,
        });
        const resList = res?.data?.list || [];
        return resList;
    } catch (err: any) {
        ElMessage.error(err.msg || "获取研学活动列表失败");
        console.error(err);
        return [];
    }
}

// 搜索
async function handleSearch() {
    if (!keyword.value.trim()) {
        ElMessage.warning("请输入搜索关键词");
        return;
    }
    onRefresh();
}

// 重置搜索
async function handleReset() {
    keyword.value = "";
    onRefresh();
}

// 刷新列表
async function onRefresh() {
    if (activeTab.value === "plan") {
        planPage = 1;
        planList.value = [];
        planList.value = await fetchPlanData(planPage, planPageSize, keyword.value);
    } else {
        activityPage = 1;
        activityList.value = [];
        activityList.value = await fetchActivityData(activityPage, activityPageSize, keyword.value);
    }
}

// 加载更多
async function onLoadMore() {
    if (activeTab.value === "plan") {
        planPage++;
        const newList = await fetchPlanData(planPage, planPageSize, keyword.value);
        if (!newList.length) {
            ElMessage.success("没有更多数据了");
            planPage--;
            return;
        }
        planList.value.push(...newList);
    } else {
        activityPage++;
        const newList = await fetchActivityData(activityPage, activityPageSize, keyword.value);
        if (!newList.length) {
            ElMessage.success("没有更多数据了");
            activityPage--;
            return;
        }
        activityList.value.push(...newList);
    }
}

// 跳转到方案详情
function goPlanDetail(id: number) {
    // TODO: 添加路由
    console.log("跳转到方案详情", id);
}

// 跳转到活动详情
function goActivityDetail(id: number) {
    // TODO: 添加路由
    console.log("跳转到活动详情", id);
}

// 切换方案收藏
async function togglePlanFavorite(id: number, isFavorite: boolean) {
    if (isFavorite) {
        createCollect({ userId: 10, targetId: id, targetType: "study_plan" });
    } else {
        deleteCollect({ userId: 10, targetId: id, targetType: "study_plan" });
    }
}

// 切换活动收藏
async function toggleActivityFavorite(id: number, isFavorite: boolean) {
    if (isFavorite) {
        createCollect({ userId: 10, targetId: id, targetType: "study_activity" });
    } else {
        deleteCollect({ userId: 10, targetId: id, targetType: "study_activity" });
    }
}
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .banner {
        width: 100%;
    }

    .tabs {
        display: flex;
        background: #fff;
        border-bottom: 1px solid #e5e7eb;
        padding: 0 12px;

        .tab-item {
            flex: 1;
            text-align: center;
            padding: 12px 0;
            font-size: 16px;
            font-weight: 500;
            color: #6b7280;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;

            &:hover {
                color: #2563eb;
            }

            &.active {
                color: #2563eb;
                font-weight: 600;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #2563eb;
                }
            }
        }
    }

    .toolbar {
        padding: 8px 12px;
    }

    .list {
        flex: 1;
        height: 500px;

        .scroll-list-item {
            margin-bottom: 8px;
        }
    }
}
</style>
