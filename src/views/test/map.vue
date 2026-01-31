// ParentComponent.vue
<template>
    <div class="parent-container">
        <div class="controls">
            <h2>🍽️ 美食商家地图</h2>
            <div class="control-buttons">
                <button @click="switchRestaurant(0)" :class="{ active: currentIndex === 0 }">
                    川菜馆
                </button>
                <button @click="switchRestaurant(1)" :class="{ active: currentIndex === 1 }">
                    日料店
                </button>
                <button @click="switchRestaurant(2)" :class="{ active: currentIndex === 2 }">
                    烧烤店
                </button>
                <button @click="showAllRestaurants" :class="{ active: currentIndex === -1 }">
                    显示全部
                </button>
            </div>
            <label class="checkbox-label">
                <input type="checkbox" v-model="showMyLocation" />
                显示我的位置
            </label>
        </div>

        <MapComponent
            :restaurants="displayedRestaurants"
            :show-my-location="showMyLocation"
            :auto-fit-view="true"
        />
    </div>
</template>

<script setup lang="ts" name="map">
import { ref, computed } from "vue";
import MapComponent, { type MapMarker } from "../../components/base/MapMark.vue";

const showMyLocation = ref(false);
const currentIndex = ref(-1); // -1 表示显示全部

// 美食商家数据
const allRestaurants = ref<MapMarker[]>([
    {
        id: 1,
        lng: 116.404,
        lat: 39.915,
        name: "川渝小厨",
        address: "北京市东城区王府井大街138号",
        phone: "010-12345678",
        category: "川菜",
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400",
    },
    {
        id: 2,
        lng: 116.42,
        lat: 39.91,
        name: "寿司之家",
        address: "北京市朝阳区建国门外大街1号",
        phone: "010-23456789",
        category: "日料",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    },
    {
        id: 3,
        lng: 116.39,
        lat: 39.92,
        name: "老北京烧烤",
        address: "北京市西城区西单北大街120号",
        phone: "010-34567890",
        category: "烧烤",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    },
    {
        id: 4,
        lng: 116.41,
        lat: 39.905,
        name: "辣妹子火锅",
        address: "北京市东城区东单北大街88号",
        phone: "010-45678901",
        category: "火锅",
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400",
    },
    {
        id: 5,
        lng: 116.425,
        lat: 39.918,
        name: "粤式茶餐厅",
        address: "北京市朝阳区光华路SOHO2期",
        phone: "010-56789012",
        category: "粤菜",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
    },
]);

// 根据当前选择显示对应的商家
const displayedRestaurants = computed(() => {
    if (currentIndex.value === -1) {
        return allRestaurants.value;
    }
    return [allRestaurants.value[currentIndex.value]];
});

// 切换显示指定商家
const switchRestaurant = (index: number) => {
    currentIndex.value = index;
};

// 显示所有商家
const showAllRestaurants = () => {
    currentIndex.value = -1;
};
</script>

<style lang="scss" scoped>
.parent-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f0f2f5;

    .controls {
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
        }

        .control-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
            flex-wrap: wrap;

            button {
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s;
                backdrop-filter: blur(10px);

                &:hover {
                    background: rgba(255, 255, 255, 0.3);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                }

                &.active {
                    background: white;
                    color: #667eea;
                    border-color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                &:active {
                    transform: translateY(0);
                }
            }
        }

        .checkbox-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
            font-size: 14px;

            input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: white;
            }
        }
    }

    // 地图容器占据剩余空间
    > div:last-child {
        flex: 1;
        overflow: hidden;
    }
}
</style>
