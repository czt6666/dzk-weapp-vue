import service from "./index";

export function getNewsList(params: { page: number; pageSize: number }) {
    return service.get("/village/news/list", { params });
}

export function getNewsItem(params: { id: number }) {
    return service.get("/village/news/detail", { params });
}
