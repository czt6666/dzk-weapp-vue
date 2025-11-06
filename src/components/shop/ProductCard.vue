<template>
    <article class="product-card" @click="onClick">
        <div class="thumb">
            <img :src="firstImage" alt="预览" />
            <span class="status" :class="item.status">
                {{ item.status === "on" ? "已上架" : "已下架" }}
            </span>
        </div>

        <div class="meta">
            <h3 class="title" :title="item.title">{{ item.title }}</h3>
            <p class="desc" :title="item.desc">{{ item.desc }}</p>

            <div class="specs" v-if="item.specs?.length">
                <span v-for="(s, idx) in item.specs" :key="idx" class="spec">
                    {{ s.name }} · ¥{{ s.price.toFixed(2) }}
                </span>
            </div>

            <div class="foot">
                <a
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="buy-link"
                    @click.stop
                >
                    购买链接
                </a>
                <button class="btn" @click.stop="openDetail">详情</button>
            </div>
        </div>
    </article>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { Product } from "@/views/shop/types";

export default defineComponent({
    name: "ProductCard",
    props: {
        item: {
            type: Object as () => Product,
            required: true,
        },
    },
    emits: ["open"],
    setup(props, { emit }) {
        /** SVG占位图（防止无图报错） **/
        const placeholder =
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f4efe3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b5a688">无图</text></svg>';

        /** 优雅处理图片预览：优先使用 item.preview，其次使用 item.cover，最后用占位图 **/
        const firstImage = computed(() => {
            const imgs = props.item.preview ?? [];
            if (imgs.length > 0) return imgs[0];
            if ((props.item as any).cover) return (props.item as any).cover;
            return placeholder;
        });

        /** 打开详情（冒泡给父组件） **/
        function openDetail() {
            emit("open", props.item);
        }

        /** 整卡点击打开详情 **/
        function onClick() {
            openDetail();
        }

        return { placeholder, openDetail, onClick, firstImage };
    },
});
</script>

<style lang="scss" scoped>
.product-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

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
        transition: transform 0.3s ease;
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
    &:hover img {
        transform: scale(1.03);
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
        margin: 0 0 6px;
        color: #2f2a1f;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .desc {
        font-size: 13px;
        color: #6f5e44;
        line-height: 1.4;
        height: 36px;
        overflow: hidden;
    }

    .specs {
        margin-top: 8px;
    }
    .spec {
        display: inline-block;
        margin-right: 8px;
        font-size: 13px;
        color: #4a473d;
    }

    .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 8px;
    }

    .buy-link {
        font-size: 13px;
        color: #7fb069;
        text-decoration: underline;
        &:hover {
            color: #668d57;
        }
    }

    .btn {
        padding: 6px 10px;
        border-radius: 8px;
        border: none;
        background: #8aa64b;
        color: #fff;
        cursor: pointer;
        transition: background 0.2s ease;
        font-size: 13px;

        &:hover {
            background: #79913e;
        }
    }
}
</style>
