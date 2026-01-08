import service from "./index";

// 注册接口 - 手机号 + 密码 + 确认密码
export function register(data: { username: string; password: string; confirmPassword: string }) {
    return service.post("/admin/ecadmin/auth/register", data);
}

// 用户名登录接口 - 手机号 + 密码
export function loginByUsername(data: { username: string; password: string }) {
    return service.post("/admin/ecadmin/auth/loginByUsername", data);
}

// 重置密码接口
export function resetPassword(data: { phone: string; password: string }) {
    return service.post("/admin/ecadmin/auth/resetPassword", data);
}
