import service from "./index";

export function createCollect(data: { restaurantId: number }) {
    return service.post("/admin/ecadmin/collect/create", data);
}
