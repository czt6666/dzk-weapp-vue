<template>
    <div v-if="visible" class="el-image-viewer__wrapper" @click.self="close">
        <div class="el-image-viewer__mask"></div>
        <div class="el-image-viewer__canvas">
            <img :src="currentImageUrl" :alt="`图片 ${currentIndex + 1}`" />
        </div>
        <span class="el-image-viewer__index" v-if="imageUrls.length > 1">
            {{ currentIndex + 1 }} / {{ imageUrls.length }}
        </span>
        <button v-if="imageUrls.length > 1" class="el-image-viewer__prev" @click.stop="prevImage">
            ‹
        </button>
        <button v-if="imageUrls.length > 1" class="el-image-viewer__next" @click.stop="nextImage">
            ›
        </button>
        <span class="el-image-viewer__close" @click.stop="close">×</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
    imageUrls: string[];
    initialIndex?: number;
    modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    initialIndex: 0,
    modelValue: false,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const currentIndex = ref(props.initialIndex);

const currentImageUrl = computed(() => {
    return props.imageUrls[currentIndex.value] || "";
});

watch(
    () => props.initialIndex,
    (newIndex) => {
        currentIndex.value = newIndex;
    },
);

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            currentIndex.value = props.initialIndex;
        }
    },
);

function prevImage() {
    currentIndex.value = (currentIndex.value - 1 + props.imageUrls.length) % props.imageUrls.length;
}

function nextImage() {
    currentIndex.value = (currentIndex.value + 1) % props.imageUrls.length;
}

function close() {
    visible.value = false;
}

// 暴露方法供外部调用
defineExpose({
    open: (index?: number) => {
        if (index !== undefined) {
            currentIndex.value = index;
        }
        visible.value = true;
    },
    close,
});
</script>

<style lang="scss" scoped>
.el-image-viewer__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
}

.el-image-viewer__mask {
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.el-image-viewer__canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
    }
}

.el-image-viewer__index {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 4px 12px;
    border-radius: 12px;
}

.el-image-viewer__prev,
.el-image-viewer__next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
        background-color: rgba(0, 0, 0, 0.9);
    }
}

.el-image-viewer__prev {
    left: 20px;
}

.el-image-viewer__next {
    right: 20px;
}

.el-image-viewer__close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
        background-color: rgba(0, 0, 0, 0.9);
    }
}
</style>
