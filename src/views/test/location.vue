<template>
    <div class="geo-page">
        <h2>当前位置信息</h2>

        <div>
            <button class="btn" @click="getLocation">获取当前位置</button>
        </div>

        <div v-if="loading">定位中...</div>

        <div v-if="error" style="color: red">{{ error }}</div>

        <div v-if="location">
            <p>纬度：{{ location.lat }}</p>
            <p>经度：{{ location.lng }}</p>
        </div>
    </div>
</template>

<script setup name="location">
import { ref } from "vue";

const loading = ref(false);
const error = ref("");
const location = ref(null);

function getLocation() {
    loading.value = true;
    error.value = "";
    location.value = null;

    if (!navigator.geolocation) {
        error.value = "当前浏览器不支持地理定位";
        loading.value = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            console.log(pos);

            loading.value = false;
            const { latitude, longitude } = pos.coords;
            location.value = { lat: latitude, lng: longitude };
        },
        (err) => {
            loading.value = false;
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    error.value = "用户拒绝了定位权限";
                    break;
                case err.POSITION_UNAVAILABLE:
                    error.value = "位置信息不可用";
                    break;
                case err.TIMEOUT:
                    error.value = "获取位置超时";
                    break;
                default:
                    error.value = "未知错误";
            }
        },
    );
}
</script>

<style scoped>
.geo-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 16px;
}
.btn {
    padding: 6px 14px;
    background: #409eff;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}
.btn:hover {
    background: #66b1ff;
}
</style>
