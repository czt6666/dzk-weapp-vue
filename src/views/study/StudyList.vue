<template>
    <div class="page">
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
import { ref, onMounted } from "vue";
import StudyPlanListItem from "@/components/listitem/StudyPlanListItem.vue";
import StudyActivityListItem from "@/components/listitem/StudyActivityListItem.vue";
import SmartScrollList from "@/components/base/SmartScrollList.vue";
import SearchInput from "@/components/input/SearchInput.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getStudyPlanList, getStudyActivityList } from "@/apis/study";
import { debounce } from "@/utils/index";
import { createFavoriteToggle } from "@/utils/favorite";

const router = useRouter();

// Tab状态 - 从sessionStorage恢复或使用默认值
const STORAGE_KEY = "study_list_active_tab";
const getStoredTab = (): "plan" | "activity" => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return (stored === "plan" || stored === "activity") ? stored : "plan";
};

const activeTab = ref<"plan" | "activity">(getStoredTab());

// 保存tab状态到sessionStorage
const saveTabState = (tab: "plan" | "activity") => {
    sessionStorage.setItem(STORAGE_KEY, tab);
};

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
    saveTabState(tab);
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
    router.push({ name: "StudyPlanInfo", params: { id } });
}

// 跳转到活动详情
function goActivityDetail(id: number) {
    router.push({ name: "StudyActivityInfo", params: { id } });
}

// 使用生成器创建收藏切换函数
const togglePlanFavorite = createFavoriteToggle("study_plan", planList);
const toggleActivityFavorite = createFavoriteToggle("study_activity", activityList);
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: $bg-gradient-main;

    .tabs {
        display: flex;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: 0 $spacing-md;
        box-shadow: $shadow-sm;

        .tab-item {
            flex: 1;
            text-align: center;
            padding: $spacing-md 0;
            font-size: 16px;
            font-weight: 500;
            color: $text-secondary;
            cursor: pointer;
            position: relative;
            transition: $transition-base;

            &:hover {
                color: $color-green-primary;
            }

            &.active {
                color: $color-green-primary;
                font-weight: 600;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: $color-green-primary;
                }
            }
        }
    }

    .toolbar {
        flex-shrink: 0;
        padding: $spacing-sm $spacing-md;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
    }

    .list {
        flex: 1;
        min-height: 0;
        padding: $spacing-sm 0 0;

        .scroll-list {
            display: flex;
            flex-direction: column;
            gap: $spacing-sm;
        }
    }
}
</style>
