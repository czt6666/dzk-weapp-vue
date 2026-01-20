<template>
    <div class="map-page">
        <div class="map-container">
            <MapMark
                :marks="mapMarks"
                :auto-fit-view="true"
                :show-my-location="true"
                :show-route="showRoute"
                :route-points="routePoints"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import MapMark, {
    type MapMarker,
    type MarkerType,
    type RoutePoints,
} from "@/components/base/MapMark.vue";

const route = useRoute();

// 判断是否显示路线
const showRoute = computed(() => {
    return route.query.showRoute === "true";
});

// 路线点信息
const routePoints = computed((): RoutePoints | null => {
    if (!showRoute.value) return null;

    return {
        origin: {
            lng: Number(route.query.originLng),
            lat: Number(route.query.originLat),
            address: (route.query.originAddress as string) || "",
        },
        dest: {
            lng: Number(route.query.destLng),
            lat: Number(route.query.destLat),
            address: (route.query.destAddress as string) || "",
        },
        routeName: (route.query.routeName as string) || "路线",
    };
});

// 地图标记点
const mapMarks = computed((): MapMarker[] => {
    if (showRoute.value && routePoints.value) {
        return [
            {
                lng: routePoints.value.origin.lng,
                lat: routePoints.value.origin.lat,
                name: "出发地",
                address: routePoints.value.origin.address,
                type: "start",
            },
            {
                lng: routePoints.value.dest.lng,
                lat: routePoints.value.dest.lat,
                name: "目的地",
                address: routePoints.value.dest.address,
                type: "end",
            },
        ];
    } else {
        // 普通模式，显示单个标记点
        return [
            {
                lng: Number(route.query.lng),
                lat: Number(route.query.lat),
                name: (route.query.name as string) || "",
                address: (route.query.address as string) || "",
                phone: (route.query.phone as string) || "",
                type: (route.query.type as string as MarkerType) || "restaurant",
            },
        ];
    }
});
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
