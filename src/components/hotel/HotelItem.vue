<template>
    <div class="item-card" @click="$emit('click')">
        <div class="image-wrapper">
            <img :src="info.image" alt="img" loading="lazy" />
        </div>
        <div class="info">
            <h3 class="title">{{ info.title }}</h3>
            <p class="desc">{{ info.desc }}</p>
            <div class="bottom">
                <span>👁️ {{ info.views }}</span>
                <span>❤️ {{ info.likes }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ info: any }>();
</script>

<style scoped lang="scss">
.item-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-3px);
    }

    .image-wrapper {
        width: 100%;
        img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
        }
    }

    .info {
        padding: 8px 10px;

        .title {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .desc {
            font-size: 13px;
            color: #666;
            margin-bottom: 6px;
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
