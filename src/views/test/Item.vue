<template>
    <div class="item">
        {{ source.text }}
    </div>
</template>

<script setup>
defineProps({ source: Object });
</script>

<style scoped>
.item {
    background: #fff;
    margin-bottom: 8px;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
