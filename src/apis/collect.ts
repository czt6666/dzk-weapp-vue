import service from "./index";

export function createCollect(data: ICollect) {
    return service.post("/admin/ecadmin/collect/create", data);
}

export function deleteCollect(data: ICollect) {
    return service.delete("/admin/ecadmin/collect/delete", { data });
}

export interface ICollect {
    userId: number;
    targetId: number;
    targetType: string;
}
