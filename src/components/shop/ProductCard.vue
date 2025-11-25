<template>
    <article class="product-card" @click="openDetail">
        <div class="thumb">
            <img :src="imgUrl(firstImage)" alt="预览" />
            <span v-if="item.status !== 1" class="status" :class="item.status"> 已下架 </span>
        </div>

        <div class="meta">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.description }}</p>

            <div class="foot">
                <button class="btn detail" @click.stop="openDetail">查看详情</button>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/views/shop/types";
import { imgUrl } from "@/utils";

const props = defineProps<{ item: Product }>();
const emit = defineEmits(["open"]);

const placeholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f4efe3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b5a688">无图</text></svg>';

const firstImage = computed(() => {
    const imgs = props.item.previewImages ?? [];
    if (imgs.length > 0) return imgs[0];
    if ((props.item as any).cover) return (props.item as any).cover;
    return placeholder;
});

function openDetail() {
    emit("open", props.item);
}
</script>

<style scoped lang="scss">
.product-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
}
.thumb {
    position: relative;
    height: 170px;
    background: #f8f5ee;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .status {
        position: absolute;
        left: 10px;
        bottom: 10px;
        padding: 6px 8px;
        border-radius: 6px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
    }
}
.status.on {
    background: #7fb069;
}
.status.off {
    background: #a8a8a8;
}

.meta {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .title {
        font-size: 16px;
        font-weight: 600;
        color: #2f2a1f;
    }
    .desc {
        font-size: 13px;
        color: #6f5e44;
        line-height: 1.4;
        overflow: hidden;
    }
    .specs {
        margin-top: 6px;
    }
    .spec {
        display: inline-block;
        margin-right: 8px;
        font-size: 13px;
        color: #4a473d;
    }

    .foot {
        margin-top: auto;
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        gap: 8px;
    }

    .btn {
        flex: 1;
        border: none;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 13px;
        cursor: pointer;
        transition: 0.2s ease;
        &.cart {
            background: #7fb069;
            color: #fff;
            &:hover {
                background: #6a945c;
            }
        }
        &.detail {
            background: #ece8de;
            color: #333;
            &:hover {
                background: #ddd5c5;
            }
        }
    }
}
</style>
