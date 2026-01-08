import service from "./index";

// 研学方案分页查询
export function getStudyPlanList(params: { page: number; pageSize: number; planName?: string }) {
    return service.get("/study/tour/plan/page", { params });
}

// 研学活动分页查询
export function getStudyActivityList(params: {
    pageNum: number;
    pageSize: number;
    activityName?: string;
}) {
    return service.get("/study/activity/page", { params });
}

// 研学方案详情
export function getStudyPlanDetail(id: number) {
    return service.get(`/study/tour/plan/get/${id}`);
}

// 研学活动详情
export function getStudyActivityDetail(id: number) {
    return service.get(`/study/activity/${id}`);
}

// 研学方案接口
export interface IStudyPlan {
    id: number;
    planName: string;
    baseId: number;
    route: string;
    briefIntro: string | null;
    details: string | null;
    suitableCrowd: string;
    duration: string;
    status: number;
    createTime: string;
    updateTime: string;
    collectNumber: number | null;
    isCollect?: boolean; // 是否已收藏
}

// 研学活动接口
export interface IStudyActivity {
    id: number;
    activityName: string;
    planId: number;
    applyStartDate: string;
    applyEndDate: string;
    activityStartDate: string;
    activityEndDate: string;
    price: number;
    recruitNum: number;
    registeredNum: number;
    status: number;
    remark: string;
    createTime: string;
    updateTime: string;
    collectNumber: number;
    isCollect?: boolean; // 是否已收藏
}

// 研学活动分页响应
export interface IStudyActivityPageResponse {
    total: number;
    list: IStudyActivity[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}
