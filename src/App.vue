<template>
    {{ count }}
    <button @click="count++">增加</button>
</template>

<script setup lang="ts">
const count = ref(0);
console.log(count.value);
</script>

<style scoped></style>
