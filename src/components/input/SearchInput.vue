<template>
    <div class="search-bar">
        <div class="search-input">
            <el-icon class="search-icon"><Search style="margin-right: 5px" /></el-icon>
            <input
                v-model="keyword"
                type="text"
                :placeholder="placeholder"
                @keyup.enter="handleSearch"
            />
            <button v-if="keyword" class="clear-btn" @click="handleReset">×</button>
        </div>
        <button class="search-btn" @click="handleSearch">搜索</button>
    </div>
</template>
<script lang="ts" setup name="SearchInput">
import { ref, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "搜索...",
    },
});

const emit = defineEmits(["update:modelValue", "handleSearch", "handleReset"]);

const keyword = ref(props.modelValue);

watch(keyword, (newVal) => {
    emit("update:modelValue", newVal);
});

const handleSearch = () => {
    emit("handleSearch", keyword.value);
};

const handleReset = () => {
    keyword.value = "";
    emit("handleReset");
};
</script>
<style lang="scss" scoped>
.search-bar {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;

    .search-input {
        flex: 1;
        height: 44px;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 28px;
        border: 1px solid #d4d4d4;
        padding: 8px 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08) inset;

        .search-icon {
            width: 2em;

            svg {
                width: 16px;
                height: 16px;
            }
        }

        input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            color: #333;
        }

        .clear-btn {
            border: none;
            background: transparent;
            font-size: 18px;
            line-height: 1;
            color: #bbb;
            cursor: pointer;
        }
    }

    .search-btn {
        height: 44px;
        border: none;
        background: linear-gradient(135deg, #7fb069, #6da757);
        color: #fff;
        border-radius: 24px;
        padding: 8px 20px;
        font-size: 14px;
        cursor: pointer;
        transition: opacity 0.2s;

        &:active {
            opacity: 0.8;
        }
    }
}
</style>
