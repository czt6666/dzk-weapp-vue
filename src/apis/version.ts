import service from "./index";

export interface VersionResponse {
    version: string;
}

export function getVersion() {
    return service.get<{ data: VersionResponse }>("/version");
}
