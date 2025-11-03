import service from "./index";
export interface ApiResponse {
    info: any;
    msg: string;
    code: string;
}

export function getNewsList(params: { page: number; pageSize: number }): Promise<ApiResponse> {
    return service.get("/village/news/list", { params });
}

export function getNewsItem(params: { id: number }): Promise<ApiResponse> {
    return service.get("/village/news/detail", { params });
}
