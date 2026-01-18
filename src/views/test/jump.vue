<template>
    <div class="jump-page">
        <div class="card">
            <h2>小程序跳转测试</h2>
            <p class="desc">通过 wx.miniProgram.navigateTo 跳转到其他小程序页面</p>
        </div>

        <div class="card">
            <h3>跳转入口</h3>
            <div class="btn-group">
                <button
                    class="btn"
                    @click="
                        jumpToJump({
                            appId: 'wx4b74228baa15489a',
                            path: 'lib/item/dist/pages/index/index?itemId=7222949299',
                        })
                    "
                >
                    跳转微店
                </button>
                <button
                    class="btn"
                    @click="
                        jumpToJump({
                            appId: 'wx6a9b201c2a4c031f',
                            path: 'pages/goods/detail/index?goods_id=57',
                        })
                    "
                >
                    跳转微信小店
                </button>
                <button
                    class="btn"
                    @click="jumpToStore({ storeId: 'wx4b74228baa15489a', productId: '7269616634' })"
                >
                    跳转微店商品详情
                </button>
            </div>
            <a
                href="https://wxaurl.cn/UBWlalv7x4h"
                target="_blank"
                rel="noopener noreferrer"
                class="link"
            >
                跳转微店商品详情（外链）
            </a>
        </div>
    </div>
</template>

<script lang="ts" setup name="jump">
const wxObj = typeof window !== "undefined" ? (window as any).wx : undefined;

function jumpToJump(options: { appId: string; path: string }) {
    const { appId, path } = options;
    const encodedPath = encodeURIComponent(path);
    const query = `appId=${appId}&path=${encodedPath}`;

    if (!wxObj || !wxObj.miniProgram) {
        console.warn("jumpToJump: 非小程序 web-view 环境，wx.miniProgram 不可用");
        return;
    }

    wxObj.miniProgram.navigateTo({
        url: `/pages/jump/jump?${query}`,
        success() {
            console.log("跳转到 jump 页面成功");
        },
        fail(err) {
            console.error("跳转失败", err);
        },
    });
}

function jumpToStore(options: { storeId: string; productId: string }) {
    const { storeId, productId } = options;
    const encodedProductId = encodeURIComponent(productId);
    const query = `appId=${storeId}&productId=${encodedProductId}`;

    if (!wxObj || !wxObj.miniProgram) {
        console.warn("jumpToStore: 非小程序 web-view 环境，wx.miniProgram 不可用");
        return;
    }

    wxObj.miniProgram.navigateTo({
        url: `/pages/store/store?${query}`,
        success() {
            console.log("跳转到 store 页面成功");
        },
        fail(err) {
            console.error("跳转失败", err);
        },
    });
}
</script>

<style lang="scss" scoped>
.jump-page {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;

    .card {
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        h2 {
            margin: 0 0 8px 0;
            font-size: 20px;
            color: #333;
        }

        h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #666;
        }

        .desc {
            margin: 0;
            font-size: 14px;
            color: #999;
        }

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 12px;
        }

        .btn {
            padding: 10px 16px;
            background: #07c160;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;

            &:hover {
                background: #06ad56;
            }
        }

        .link {
            color: #576b95;
            font-size: 14px;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
