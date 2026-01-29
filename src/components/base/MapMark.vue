// MapComponent.vue
<template>
    <div class="map-container">
        <div id="amap" class="map"></div>
        <div
            v-if="showMyLocation && !myLocationLoading"
            class="location-btn"
            @click="locateMe(true)"
        >
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
import { ref, onMounted, watch, nextTick } from "vue";
import { wgs84ToGcj02 } from "@/utils/coord";
import { AMAP_API_KEY } from "@/utils/constence";
import { showPhoneModal } from "@/utils/phoneModal";

// 标记类型
export type MarkerType =
    | "restaurant"
    | "hotel"
    | "shop"
    | "tour"
    | "study"
    | "retirement"
    | "start"
    | "end";

// 定义商家标记的类型
export interface MapMarker {
    lng: number; // 经度
    lat: number; // 纬度
    name: string; // 商家名称
    address: string; // 商家地址
    phone?: string; // 联系电话
    category?: string; // 美食类别
    image?: string; // 商家图片
    type?: MarkerType; // 标记类型
}

// 路线点信息
export interface RoutePoints {
    origin: {
        lng: number;
        lat: number;
        address: string;
    };
    dest: {
        lng: number;
        lat: number;
        address: string;
    };
    routeName: string;
}

// 定义组件props
interface Props {
    marks?: MapMarker[];
    showMyLocation?: boolean; // 是否显示我的位置
    autoFitView?: boolean; // 是否自动调整视野
    showRoute?: boolean; // 是否显示路线
    routePoints?: RoutePoints | null; // 路线点信息
}

const props = withDefaults(defineProps<Props>(), {
    marks: () => [],
    showMyLocation: false,
    autoFitView: true,
    showRoute: false,
    routePoints: null,
});

const map = ref<any>(null);
const restaurantMarkers = ref<any[]>([]);
const myLocationMarker = ref<any>(null);
const myLocationLoading = ref(false);
const routePolyline = ref<any>(null); // 路线折线

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

    // 获取标记图标
    const getMarkerIcon = (marker: MapMarker, index: number): string => {
        const type = marker.type || "restaurant";

        if (props.showRoute) {
            if (type === "start" || index === 0) {
                return "🚩"; // 出发地
            } else if (
                type === "end" ||
                (props.marks.length > 0 && index === props.marks.length - 1)
            ) {
                return "🏁"; // 目的地
            }
        }

        // 根据类型返回不同图标
        const iconMap: Record<MarkerType, string> = {
            restaurant: "🍴",
            hotel: "🏨",
            shop: "🛍️",
            tour: "🗺️",
            study: "📚",
            retirement: "🏥",
            start: "🚩",
            end: "🏁",
        };

        return iconMap[type] || "📍";
    };

    // 获取标记颜色类
    const getMarkerColorClass = (marker: MapMarker, index: number): string => {
        const type = marker.type || "restaurant";

        if (props.showRoute) {
            if (type === "start" || index === 0) {
                return "start-marker";
            } else if (
                type === "end" ||
                (props.marks.length > 0 && index === props.marks.length - 1)
            ) {
                return "end-marker";
            }
        }

        return `${type}-marker`;
    };

    // 添加商家标记
    props.marks.forEach((restaurant, index) => {
        // const [mapLng, mapLat] = wgs84ToGcj02(restaurant.lng, restaurant.lat);
        const [mapLng, mapLat] = [restaurant.lng, restaurant.lat];

        const icon = getMarkerIcon(restaurant, index);
        const colorClass = getMarkerColorClass(restaurant, index);

        // 创建标记内容
        let markerContent = "";
        if (props.showRoute && (colorClass === "start-marker" || colorClass === "end-marker")) {
            markerContent = `
                <div class="route-marker ${colorClass}">
                    <div class="marker-icon">${icon}</div>
                </div>
            `;
        } else {
            markerContent = `
                <div class="restaurant-marker ${colorClass}">
                    <div class="marker-icon">${icon}</div>
                </div>
            `;
        }

        const marker = new (window as any).AMap.Marker({
            position: new (window as any).AMap.LngLat(mapLng, mapLat),
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
        ${restaurant.phone ? `<p class="restaurant-phone phone-clickable" data-phone="${restaurant.phone}">📞 ${restaurant.phone}</p>` : ""}
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
            
            // 等待信息窗体渲染后，添加电话号码点击事件
            nextTick(() => {
                const phoneElement = document.querySelector('.restaurant-phone.phone-clickable');
                if (phoneElement && restaurant.phone) {
                    phoneElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showPhoneModal(restaurant.phone!);
                    });
                    // 添加样式提示可点击
                    (phoneElement as HTMLElement).style.cursor = 'pointer';
                    (phoneElement as HTMLElement).style.color = '#409EFF';
                }
            });
        });

        restaurantMarkers.value.push(marker);
    });

    // 添加标记后，立即设置地图中心点为标记的中心点
    if (restaurantMarkers.value.length > 0 && map.value) {
        if (restaurantMarkers.value.length === 1) {
            // 只有一个标记时，直接居中
            const position = restaurantMarkers.value[0].getPosition();
            map.value.setZoomAndCenter(16, [position.lng, position.lat]);
        } else {
            // 多个标记时，计算中心点
            let sumLng = 0;
            let sumLat = 0;
            restaurantMarkers.value.forEach((marker) => {
                const pos = marker.getPosition();
                sumLng += pos.lng;
                sumLat += pos.lat;
            });
            const centerLng = sumLng / restaurantMarkers.value.length;
            const centerLat = sumLat / restaurantMarkers.value.length;
            map.value.setZoomAndCenter(15, [centerLng, centerLat]);
        }
    }
};

// 生成贝塞尔曲线路径点
const generateBezierPath = (points: number[][]): number[][] => {
    if (points.length < 2) return points;
    if (points.length === 2) {
        // 两点之间生成平滑曲线
        const p1 = points[0];
        const p2 = points[1];
        if (!p1 || !p2 || p1.length < 2 || p2.length < 2) return points;

        const p1x = p1[0]!;
        const p1y = p1[1]!;
        const p2x = p2[0]!;
        const p2y = p2[1]!;

        const midX = (p1x + p2x) / 2;
        const midY = (p1y + p2y) / 2;
        // 计算控制点，使曲线更平滑
        const dx = p2x - p1x;
        const dy = p2y - p1y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const controlOffset = distance * 0.3; // 控制点偏移量

        // 垂直方向偏移，形成曲线
        const controlX = midX;
        const controlY = midY + controlOffset;

        // 生成贝塞尔曲线点
        const bezierPoints: number[][] = [];
        for (let t = 0; t <= 1; t += 0.02) {
            const x = (1 - t) * (1 - t) * p1x + 2 * (1 - t) * t * controlX + t * t * p2x;
            const y = (1 - t) * (1 - t) * p1y + 2 * (1 - t) * t * controlY + t * t * p2y;
            bezierPoints.push([x, y]);
        }
        return bezierPoints;
    }

    // 多个点之间生成平滑曲线
    const smoothPoints: number[][] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if (!p1 || !p2) continue;

        const segment = generateBezierPath([p1, p2]);
        if (i === 0) {
            smoothPoints.push(...segment);
        } else {
            smoothPoints.push(...segment.slice(1)); // 避免重复点
        }
    }
    return smoothPoints;
};

// 绘制路线
const drawRoute = () => {
    if (!props.showRoute || !props.routePoints || !map.value) return;

    // 清除旧路线
    if (routePolyline.value) {
        map.value.remove(routePolyline.value);
        routePolyline.value = null;
    }

    // 构建路径点数组
    const origin = props.routePoints.origin;
    const dest = props.routePoints.dest;
    if (!origin || !dest) return;

    // 使用贝塞尔曲线连接起点和终点
    const pathPoints: number[][] = [
        [origin.lng, origin.lat],
        [dest.lng, dest.lat],
    ];

    const bezierPath = generateBezierPath(pathPoints);

    routePolyline.value = new (window as any).AMap.Polyline({
        path: bezierPath,
        isOutline: true,
        outlineColor: "#ffeeff",
        borderWeight: 3,
        strokeColor: "#c62828", // 使用主题红色
        strokeOpacity: 0.8,
        strokeWeight: 6,
        lineJoin: "round",
        lineCap: "round",
        zIndex: 50,
        map: map.value,
        geodesic: false, // 不使用大地线
    });
};

// 调整视野以同时显示所有标记（包括商家和我的位置）
const fitAllMarkers = () => {
    if (!map.value) return;

    const allMarkers: any[] = [...restaurantMarkers.value];

    // 如果我的位置标记存在，也加入数组
    if (myLocationMarker.value) {
        allMarkers.push(myLocationMarker.value);
    }

    if (allMarkers.length === 0) return;

    if (allMarkers.length === 1) {
        // 只有一个标记时，居中并设置合适的缩放级别
        const position = allMarkers[0].getPosition();
        map.value.setZoomAndCenter(16, [position.lng, position.lat]);
    } else {
        // 多个标记时，自动适应所有标记
        map.value.setFitView(allMarkers, false, [40, 40, 40, 40], 16);
    }
};

// 定位到我的位置
const locateMe = (isClick: boolean = false): Promise<void> => {
    return new Promise((resolve, reject) => {
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
                    const [gcjLng, gcjLat] = wgs84ToGcj02(position.lng, position.lat);

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
                        position: [gcjLng, gcjLat],
                        content: myMarkerContent,
                        offset: new (window as any).AMap.Pixel(-10, -10),
                        map: map.value,
                    });

                    // 如果是点击按钮，只移动到我的位置
                    if (isClick) {
                        map.value.setZoomAndCenter(15, [gcjLng, gcjLat]);
                    } else {
                        // 如果不是点击按钮，且开启了自动适应视野，则自适应所有标记（包括商家和我的位置）
                        if (props.autoFitView) {
                            setTimeout(() => {
                                fitAllMarkers();
                            }, 100);
                        }
                    }

                    resolve();
                } else {
                    console.error("定位失败:", result);
                    const errorMsg = "定位失败，请检查是否允许浏览器获取位置信息";
                    if (isClick) {
                        alert(errorMsg);
                    }
                    reject(new Error(errorMsg));
                }
            });
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

        const plugins = "AMap.Geolocation";
        const script = document.createElement("script");
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_API_KEY}&plugin=${plugins}`;
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

// 监听路线信息变化
watch(
    () => [props.showRoute, props.routePoints],
    () => {
        if (map.value && props.showRoute && props.routePoints) {
            drawRoute();
        }
    },
    { deep: true },
);

onMounted(async () => {
    try {
        await loadAMapScript();
        initMap();
        // 添加标记，此时会自动设置地图中心点为标记的中心点
        addMapMarkers();

        // 如果开启了显示路线，绘制路线
        if (props.showRoute && props.routePoints) {
            setTimeout(() => {
                drawRoute();
            }, 300);
        }

        // 如果开启了显示我的位置，异步获取用户位置
        // 获取到用户位置后会自动进行自适应（在 locateMe 函数中处理）
        if (props.showMyLocation) {
            // 异步获取用户位置，不阻塞地图显示
            locateMe().catch((error) => {
                // 定位失败不影响地图显示，地图已经显示了标记位置
                console.warn("定位失败，继续显示商家位置", error);
            });
        }
    } catch (error) {
        console.error("地图初始化失败:", error);
    }
});
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

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

        &:active {
            transform: scale(0.95);
        }
    }

    // 不同类型标记的颜色
    &.restaurant-marker .marker-icon {
        background: #ff6b6b;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
    }

    &.hotel-marker .marker-icon {
        background: #4a90e2;
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.4);
    }

    &.shop-marker .marker-icon {
        background: #f5a623;
        box-shadow: 0 2px 8px rgba(245, 166, 35, 0.4);
    }

    &.tour-marker .marker-icon {
        background: #50c878;
        box-shadow: 0 2px 8px rgba(80, 200, 120, 0.4);
    }

    &.study-marker .marker-icon {
        background: #9b59b6;
        box-shadow: 0 2px 8px rgba(155, 89, 182, 0.4);
    }

    &.retirement-marker .marker-icon {
        background: #e67e22;
        box-shadow: 0 2px 8px rgba(230, 126, 34, 0.4);
    }
}

// 路线标记样式
:deep(.route-marker) {
    .marker-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

        &:active {
            transform: scale(0.95);
        }
    }

    &.start-marker .marker-icon {
        background: #10b981;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }

    &.end-marker .marker-icon {
        background: #ef4444;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
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
    width: 260px;
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

    .restaurant-phone.phone-clickable {
        cursor: pointer;
        color: #409EFF;
        transition: opacity 0.2s ease;

        &:hover {
            opacity: 0.8;
        }
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
