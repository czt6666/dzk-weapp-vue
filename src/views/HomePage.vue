<template>
    <div class="home">
        <h1>我是首页</h1>

        <div class="btns">
            <button @click="goNewsList">去新闻列表</button>
            <button @click="goHotelList">去民宿列表</button>
            <button @click="goShopList">去商品列表</button>
            <button @click="goFoodOrder">去美食订单</button>
            <button @click="goLogin">去登录</button>
        </div>
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

function goFoodOrder() {
    router.push("/restaurant");
}

function goLogin() {
    router.push("/login");
}
</script>
<style lang="scss" scoped>
.home {
    h1 {
        font-size: 125px;
    }

    .btns {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
    }
}
</style>
