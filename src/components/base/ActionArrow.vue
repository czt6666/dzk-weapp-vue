<template>
    <svg
        class="action-arrow"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>

<script setup lang="ts">
// 可操作的点击事件箭头图标组件
</script>

<style lang="scss" scoped>
.action-arrow {
    width: 14px;
    height: 14px;
    color: #999;
    flex-shrink: 0;
    margin-left: 4px;
    margin-top: 2px;
    transition: transform 0.2s ease;
}
</style>

