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


