<template>
    <div v-if="visible" class="phone-modal-overlay" @click="close">
        <div class="phone-modal" @click.stop>
            <div class="phone-modal-header">
                <h3>电话号码</h3>
                <button class="phone-close-btn" @click="close">✕</button>
            </div>
            <div class="phone-modal-body">
                <div class="phone-number">{{ phone }}</div>
                <p class="phone-tip">请选择操作方式</p>
            </div>
            <div class="phone-modal-footer">
                <button class="phone-btn-call" @click="handleCall" v-if="isPhoneSupported()">
                    📞 拨打
                </button>
                <button class="phone-btn-copy" @click="handleCopy">📋 复制电话</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { copyToClipboard, callPhone, isPhoneSupported } from "@/utils";

interface Props {
    modelValue: boolean;
    phone: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const close = () => {
    visible.value = false;
};

const handleCall = () => {
    if (props.phone) {
        if (!isPhoneSupported()) {
            ElMessage.warning("当前设备不支持直接拨打电话");
            return;
        }
        callPhone(props.phone);
        close();
    }
};

const handleCopy = async () => {
    if (props.phone) {
        const success = await copyToClipboard(props.phone);
        if (success) {
            ElMessage.success(`电话号码 ${props.phone} 已复制到剪贴板`);
        } else {
            ElMessage.error("复制失败，请手动复制");
        }
        close();
    }
};
</script>

<style lang="scss" scoped>
.phone-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    animation: fadeIn 0.3s ease;
}

.phone-modal {
    background: white;
    border-radius: 12px;
    width: 85%;
    max-width: 400px;
    overflow: hidden;
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;

    .phone-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;

        h3 {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }

        .phone-close-btn {
            width: 24px;
            height: 24px;
            border: none;
            background: #f5f5f5;
            border-radius: 50%;
            font-size: 16px;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;

            &:active {
                background: #e8e8e8;
            }
        }
    }

    .phone-modal-body {
        padding: 16px;
        text-align: center;
        flex-shrink: 0;

        .phone-number {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 6px;
        }

        .phone-tip {
            font-size: 13px;
            color: #666;
            margin: 0;
        }
    }

    .phone-modal-footer {
        padding: 12px 16px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 12px;
        flex-shrink: 0;
        margin-top: auto;

        button {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            border: none;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .phone-btn-call {
            background: #ff6b35;
            color: white;

            &:active {
                background: #e55a2b;
            }
        }

        .phone-btn-copy {
            background: #f5f5f5;
            color: #333;

            &:active {
                background: #e8e8e8;
            }
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>

