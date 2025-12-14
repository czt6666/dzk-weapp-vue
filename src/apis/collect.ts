import service from "./index";

export function createCollect(data: Collect) {
    return service.post("/admin/ecadmin/collect/create", data);
}

export function deleteCollect(data: Collect) {
    return service.delete("/admin/ecadmin/collect/delete", { data });
}

export interface Collect {
    userId: number;
    targetId: number;
    targetType: string;
}
