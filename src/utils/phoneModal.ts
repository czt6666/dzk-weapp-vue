import { createApp, h, ref } from "vue";
import PhoneModal from "@/components/base/PhoneModal.vue";

/**
 * 显示电话号码弹窗
 * @param phone 电话号码
 */
export function showPhoneModal(phone: string) {
    if (!phone) {
        return;
    }

    // 创建临时容器
    const container = document.createElement("div");
    document.body.appendChild(container);

    // 创建应用实例
    const app = createApp({
        setup() {
            const visible = ref(true);

            const close = () => {
                visible.value = false;
                setTimeout(() => {
                    app.unmount();
                    document.body.removeChild(container);
                }, 300);
            };

            return () =>
                h(PhoneModal, {
                    modelValue: visible.value,
                    phone: phone,
                    "onUpdate:modelValue": (value: boolean) => {
                        if (!value) {
                            close();
                        }
                    },
                });
        },
    });

    app.mount(container);
}

