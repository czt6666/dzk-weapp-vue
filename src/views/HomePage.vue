<template>
    <div class="">
        HomePage

        <button @click="goNewsList">去新闻列表</button>
        <button @click="goHotelList">去民宿列表</button>
        <button @click="goShopList">去商品列表</button>
        <button @click="goLogin">去登录</button>
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

function goShopList() {
    router.push("/shop");
}

function goCart() {
    router.push("/cart");
}

function goLogin() {
    router.push("/login");
}
</script>
<style lang="scss" scoped></style>
