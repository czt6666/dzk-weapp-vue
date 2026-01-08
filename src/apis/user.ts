import service from "./index";

// 发送短信验证码
export function sendSmsCode(data: { phone: string }) {
    // TODO: 根据后端实际接口调整路径
    return service.post("/auth/sms/send", data);
}

// 手机号 + 验证码登录
export function loginBySms(data: { phone: string; code: string }) {
    // TODO: 根据后端实际接口调整路径
    return service.post("/auth/sms/login", data);
}

// 注册接口 - 手机号 + 密码
export function register(data: { username: string; password: string }) {
    return service.post("/admin/ecadmin/auth/register", data);
}

// 用户名登录接口 - 手机号 + 密码
export function loginByUsername(data: { phone: string; password: string }) {
    return service.post("/admin/ecadmin/auth/loginByUsername", data);
}

// 重置密码接口
export function resetPassword(data: { phone: string; password: string }) {
    return service.post("/admin/ecadmin/auth/resetPassword", data);
}
