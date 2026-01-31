<template>
    <div class="swiper-container">
        <swiper :modules="[Pagination]" pagination class="mySwiper">
            <swiper-slide v-for="i in 5" :key="i" class="slide">
                <h2>页面 {{ i }}</h2>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup name="SwiperDemo">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
</script>

<style scoped>
.swiper-container {
    width: 100vw;
    height: 100vh;
}
.slide {
    display: flex;
    height: 200px;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    background: linear-gradient(135deg, #74abe2, #5563de);
    color: white;
}
</style>
