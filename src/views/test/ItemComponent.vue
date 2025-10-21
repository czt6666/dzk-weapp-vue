<template>
    <div class="list-item">
        <div class="item-content">
            <h3>{{ source.content }}</h3>
            <p class="time">{{ source.timestamp }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    source: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.list-item {
    height: 100px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    background-color: #fff;
}

.item-content {
    width: 100%;
}

.time {
    color: #999;
    font-size: 12px;
    margin-top: 8px;
}
</style>
