<template>
    <div class="item-card" @click="$emit('click')">
        <div class="image-wrapper">
            <img :src="info.coverImage" alt="img" loading="lazy" />
        </div>
        <div class="info">
            <h3 class="title">{{ info.description }}</h3>
            <p class="desc">{{ info.address }}</p>
            <div class="bottom">
                <span>👁️ {{ info.maxCapacity }}</span>
                <span>❤️ {{ info.starLevel }}</span>
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

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
            max-height: calc(1.4em * 2);
            word-break: break-word;
        }

        .desc {
            font-size: 13px;
            color: #666;
            margin-bottom: 6px;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
            max-height: calc(1.4em * 2);
            word-break: break-word;
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
