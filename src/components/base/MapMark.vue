// MapComponent.vue
<template>
    <div class="map-container">
        <div id="amap" class="map"></div>
        <div v-if="showMyLocation && !myLocationLoading" class="location-btn" @click="locateMe">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                    fill="currentColor"
                    d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// 定义商家标记的类型
export interface MapMarker {
    lng: number; // 经度
    lat: number; // 纬度
    name: string; // 商家名称
    address: string; // 商家地址
    phone?: string; // 联系电话
    category?: string; // 美食类别
    image?: string; // 商家图片
}

// 定义组件props
interface Props {
    marks?: MapMarker[];
    showMyLocation?: boolean; // 是否显示我的位置
    autoFitView?: boolean; // 是否自动调整视野
}

const props = withDefaults(defineProps<Props>(), {
    marks: () => [],
    showMyLocation: false,
    autoFitView: true,
});

const map = ref<any>(null);
const restaurantMarkers = ref<any[]>([]);
const myLocationMarker = ref<any>(null);
const myLocationLoading = ref(false);

// 初始化地图
const initMap = () => {
    // 创建地图实例
    map.value = new (window as any).AMap.Map("amap", {
        zoom: 15,
        resizeEnable: true,
        scrollWheel: true, // 开启鼠标滚轮缩放
    });
};

// 添加商家标记
const addMapMarkers = () => {
    // 清除旧标记
    restaurantMarkers.value.forEach((marker) => {
        map.value.remove(marker);
    });
    restaurantMarkers.value = [];

    // 添加商家标记
    props.marks.forEach((restaurant) => {
        // 创建自定义标记图标
        const markerContent = `
      <div class="restaurant-marker">
        <div class="marker-icon">🍴</div>
      </div>
    `;

        const marker = new (window as any).AMap.Marker({
            position: new (window as any).AMap.LngLat(restaurant.lng, restaurant.lat),
            content: markerContent,
            offset: new (window as any).AMap.Pixel(-15, -15),
            map: map.value,
        });

        // 创建信息窗体
        const infoContent = `
      <div class="restaurant-info">
        ${restaurant.image ? `<img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image" />` : ""}
        <h3 class="restaurant-name">${restaurant.name}</h3>
        <p class="restaurant-address">📍 ${restaurant.address}</p>
        ${restaurant.phone ? `<p class="restaurant-phone">📞 ${restaurant.phone}</p>` : ""}
        ${restaurant.category ? `<p class="restaurant-category">🏷️ ${restaurant.category}</p>` : ""}
      </div>
    `;

        const infoWindow = new (window as any).AMap.InfoWindow({
            content: infoContent,
            offset: new (window as any).AMap.Pixel(0, -30),
        });

        // 点击标记显示信息
        marker.on("click", () => {
            infoWindow.open(map.value, marker.getPosition());
        });

        restaurantMarkers.value.push(marker);
    });

    // 自动调整视野以显示所有商家
    if (props.autoFitView && props.marks.length > 0) {
        if (props.marks.length === 1) {
            // 只有一个商家时，居中并设置合适的缩放级别
            const restaurant = props.marks[0] as MapMarker;
            map.value.setZoomAndCenter(16, [restaurant.lng, restaurant.lat]);
        } else {
            // 多个商家时，自动适应所有标记
            map.value.setFitView();
        }
    }
};

// 定位到我的位置
const locateMe = () => {
    myLocationLoading.value = true;

    (window as any).AMap.plugin("AMap.Geolocation", () => {
        const geolocation = new (window as any).AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
        });

        geolocation.getCurrentPosition((status: string, result: any) => {
            myLocationLoading.value = false;

            if (status === "complete") {
                const position = result.position;

                // 移除旧的位置标记
                if (myLocationMarker.value) {
                    map.value.remove(myLocationMarker.value);
                }

                // 创建我的位置标记
                const myMarkerContent = `
          <div class="my-location-marker">
            <div class="location-dot"></div>
            <div class="location-ring"></div>
          </div>
        `;

                myLocationMarker.value = new (window as any).AMap.Marker({
                    position: [position.lng, position.lat],
                    content: myMarkerContent,
                    offset: new (window as any).AMap.Pixel(-10, -10),
                    map: map.value,
                });

                // 移动地图到当前位置
                map.value.setZoomAndCenter(15, [position.lng, position.lat]);
            } else {
                console.error("定位失败:", result);
                alert("定位失败，请检查是否允许浏览器获取位置信息");
            }
        });
    });
};

// 加载高德地图API
const loadAMapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any).AMap) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        // 请替换为你自己的高德地图API Key
        script.src =
            "https://webapi.amap.com/maps?v=2.0&key=a85fd4e059de8095a430b5bffdc7d6a3&plugin=AMap.Geolocation";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("高德地图加载失败"));
        document.head.appendChild(script);
    });
};

// 监听商家列表变化
watch(
    () => props.marks,
    () => {
        if (map.value) {
            addMapMarkers();
        }
    },
    { deep: true },
);

onMounted(async () => {
    try {
        await loadAMapScript();
        initMap();
        addMapMarkers();

        // 如果开启了显示我的位置，自动定位
        if (props.showMyLocation) {
            setTimeout(() => locateMe(), 500);
        }
    } catch (error) {
        console.error("地图初始化失败:", error);
    }
});
</script>

<style lang="scss" scoped>
.map-container {
    width: 100%;
    height: 100%;
    position: relative;

    .map {
        width: 100%;
        height: 100%;
    }

    .location-btn {
        position: absolute;
        bottom: 30px;
        right: 20px;
        width: 44px;
        height: 44px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        z-index: 10;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }

        svg {
            color: #1890ff;
        }
    }
}

// 商家标记样式
:deep(.restaurant-marker) {
    .marker-icon {
        width: 30px;
        height: 30px;
        background: #ff6b6b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.2);
        }
    }
}

// 我的位置标记样式
:deep(.my-location-marker) {
    position: relative;
    width: 20px;
    height: 20px;

    .location-dot {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #1890ff;
        border: 2px solid #fff;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
    }

    .location-ring {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid #1890ff;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s infinite;
        z-index: 1;
    }

    @keyframes pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
}

// 商家信息窗体样式
:deep(.restaurant-info) {
    min-width: 260px;
    padding: 12px;

    .restaurant-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    .restaurant-name {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
    }

    .restaurant-address,
    .restaurant-phone,
    .restaurant-category {
        margin: 6px 0;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
    }

    .restaurant-address {
        color: #888;
    }

    .restaurant-category {
        display: inline-block;
        padding: 4px 12px;
        background: #fff7e6;
        color: #fa8c16;
        border-radius: 12px;
        font-size: 12px;
        margin-top: 8px;
    }
}
</style>
