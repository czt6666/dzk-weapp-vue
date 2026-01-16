<template>
    <div class="map-page">
        <div class="map-container">
            <MapMark
                :marks="[
                    {
                        lng: Number(route.query.lng),
                        lat: Number(route.query.lat),
                        name: (route.query.name as string) || '',
                        address: (route.query.address as string) || '',
                        phone: (route.query.phone as string) || '',
                    },
                ]"
                :show-my-location="true"
                :auto-fit-view="true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import MapMark from "@/components/base/MapMark.vue";

const route = useRoute();
</script>

<style lang="scss" scoped>
.map-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .map-container {
        flex: 1;
        width: 100%;
        height: 100%;
    }
}
</style>
