import service from "./index";

export function createCollect(data: ICollect) {
    return service.post("/admin/ecadmin/collect/create", data);
}

export function deleteCollect(params: ICollect) {
    return service.delete("/admin/ecadmin/collect/delete", { params });
}

export interface ICollect {
    userId: number;
    targetId: number;
    targetType: string;
}
