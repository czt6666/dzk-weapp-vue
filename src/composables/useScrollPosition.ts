import {
    onMounted,
    onUnmounted,
    onActivated,
    onDeactivated,
    nextTick,
    watch,
    ref as vueRef,
    type Ref,
} from "vue";
import { throttle } from "@/utils";

/**
 * 滚动位置记忆 Composable
 * 自动保存和恢复页面滚动位置，支持 keep-alive
 *
 * @param scrollRef 滚动容器的 ref
 * @param key 可选的存储键名，用于区分不同页面。默认使用当前路由路径
 *
 * @example
 * ```vue
 * <template>
 *   <div ref="scrollRef">
 *     <!-- 内容 -->
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useScrollPosition } from '@/composables/useScrollPosition';
 *
 * const scrollRef = ref<HTMLElement | null>(null);
 * // 使用默认配置（自动使用路由路径作为 key）
 * useScrollPosition(scrollRef);
 *
 * // 或指定自定义 key
 * useScrollPosition(scrollRef, 'homePage');
 * </script>
 * ```
 */
export function useScrollPosition(scrollRef: Ref<HTMLElement | null>, key?: string) {
    // 最佳实践配置
    const throttleDelay = 200; // 节流延迟 200ms，平衡性能和响应性
    const restoreDelay = 100; // 恢复延迟 100ms，确保 DOM 已渲染
    const useSessionStorage = true; // 使用 sessionStorage，刷新后清除，更适合滚动位置
    const autoListen = true; // 自动监听滚动事件

    // 生成存储键名：使用传入的 key 或自动使用路由路径
    const storageKey = key || `scrollPosition_${window.location.pathname}`;
    const storage = useSessionStorage ? sessionStorage : localStorage;
    const isListenerAdded = vueRef(false);

    // 保存滚动位置（使用节流优化性能）
    const saveScrollPosition = throttle(() => {
        if (scrollRef.value) {
            try {
                storage.setItem(storageKey, String(scrollRef.value.scrollTop));
            } catch (error) {
                console.warn("保存滚动位置失败:", error);
            }
        }
    }, throttleDelay);

    // 恢复滚动位置
    const restoreScrollPosition = () => {
        try {
            const savedPosition = storage.getItem(storageKey);
            if (savedPosition && scrollRef.value) {
                const position = Number(savedPosition);
                if (!isNaN(position) && position >= 0) {
                    nextTick(() => {
                        setTimeout(() => {
                            if (scrollRef.value) {
                                scrollRef.value.scrollTop = position;
                            }
                        }, restoreDelay);
                    });
                }
            }
        } catch (error) {
            console.warn("恢复滚动位置失败:", error);
        }
    };

    // 清除保存的滚动位置
    const clearScrollPosition = () => {
        try {
            storage.removeItem(storageKey);
        } catch (error) {
            console.warn("清除滚动位置失败:", error);
        }
    };

    // 添加滚动事件监听器
    const addScrollListener = () => {
        if (scrollRef.value && autoListen && !isListenerAdded.value) {
            scrollRef.value.addEventListener("scroll", saveScrollPosition, { passive: true });
            isListenerAdded.value = true;
        }
    };

    // 移除滚动事件监听器
    const removeScrollListener = () => {
        if (scrollRef.value && autoListen && isListenerAdded.value) {
            scrollRef.value.removeEventListener("scroll", saveScrollPosition);
            isListenerAdded.value = false;
        }
    };

    // 组件挂载时恢复滚动位置并添加监听
    onMounted(() => {
        restoreScrollPosition();
        // 等待 DOM 更新后再添加监听器
        nextTick(() => {
            addScrollListener();
        });
    });

    // 组件激活时恢复滚动位置并添加监听（用于 keep-alive）
    onActivated(() => {
        restoreScrollPosition();
        nextTick(() => {
            addScrollListener();
        });
    });

    // 组件失活时保存滚动位置并移除监听（用于 keep-alive）
    onDeactivated(() => {
        saveScrollPosition();
        removeScrollListener();
    });

    // 组件卸载时保存滚动位置并移除监听
    onUnmounted(() => {
        saveScrollPosition();
        removeScrollListener();
    });

    // 监听 ref 变化，确保在 ref 更新后添加监听器
    watch(
        scrollRef,
        (newVal, oldVal) => {
            if (oldVal && isListenerAdded.value) {
                removeScrollListener();
            }
            if (newVal && autoListen) {
                nextTick(() => {
                    addScrollListener();
                });
            }
        },
        { immediate: false },
    );

    return {
        saveScrollPosition,
        restoreScrollPosition,
        clearScrollPosition,
    };
}
