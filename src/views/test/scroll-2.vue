<template>
    <div class="container">
        <InertiaScroll class="content">
            <div class="card-list">
                <div v-for="n in 30" :key="n" class="card">Card {{ n }}</div>
            </div>
        </InertiaScroll>
    </div>
</template>

<script setup>
import InertiaScroll from "@/components/InertiaScroll.vue";

const page = ref("home");
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
