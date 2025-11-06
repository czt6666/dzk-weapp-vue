<template>
    <div class="app-container">
        <transition name="page-fade" mode="out-in">
            <div v-if="page === 'home'" key="home" class="page page-home">
                <button class="open-btn" @click="page = 'list'">打开页面</button>
            </div>

            <div v-else key="list" class="page page-list">
                <button class="back-btn" @click="page = 'home'">返回</button>
                <div class="block"></div>
                112233
                <div class="block"></div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
const page = ref("home");
</script>

<style scoped>
.app-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    background: #f5f5f5;
}

/* === 页面容器 === */
.page {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    will-change: transform, opacity;
}

/* === 动画定义 === */
.page-fade-enter-active,
.page-fade-leave-active {
    transition:
        transform 0.6s cubic-bezier(0.42, 0, 0.58, 1),
        opacity 0.6s cubic-bezier(0.42, 0, 0.58, 1);
}

.page-fade-enter-from {
    transform: scale(0.9);
    opacity: 0;
}
.page-fade-enter-to {
    transform: scale(1);
    opacity: 1;
}

.page-fade-leave-from {
    transform: scale(1);
    opacity: 1;
}
.page-fade-leave-to {
    transform: scale(1.1);
    opacity: 0;
}

/* === 按钮样式 === */
.open-btn,
.back-btn {
    padding: 12px 24px;
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
    transition: transform 0.2s;
}
.open-btn:active,
.back-btn:active {
    transform: scale(0.95);
}

.block {
    height: 100px;
    background-color: lightblue;
}

.content {
    flex: 1;
}

/* === 列表样式 === */
.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: pink;

    .card {
        background: #fff;
        border-radius: 12px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        will-change: transform, opacity;
        transition: transform 0.2s ease;
    }
    .card:active {
        transform: scale(0.97);
    }
}
</style>
