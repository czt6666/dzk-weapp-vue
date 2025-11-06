<template>
    <div class="">
        HomePage

        <button @click="goNewsList">去新闻列表</button>
        <button @click="goHotelList">去民宿列表</button>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goNewsList() {
    router.push("/news");
}

function goHotelList() {
    router.push("/hotels");
}
</script>
<style lang="scss" scoped></style>
