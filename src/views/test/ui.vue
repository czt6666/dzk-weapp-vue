<template>
    <div class="ui-test-container">
        <!-- 1. Banner区域 -->
        <section class="banner-section">
            <div class="banner-bg">
                <img
                    src="https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="乡村红色景点"
                    class="banner-img"
                />
                <div class="banner-overlay"></div>
                <div class="banner-content">
                    <h1 class="banner-title">走红色之路，看乡村新颜</h1>
                    <p class="banner-subtitle">重温革命历史，体验乡村风情</p>
                </div>
            </div>
        </section>

        <!-- 2. 文字样式测试 -->
        <section class="test-section">
            <h2 class="section-title">文字样式测试</h2>
            <div class="text-test">
                <div class="text-item">
                    <h3 class="text-h1">H1标题 - 思源黑体 Bold</h3>
                    <p class="text-desc">字号：32px | 颜色：主色</p>
                </div>
                <div class="text-item">
                    <h4 class="text-h2">H2标题 - 思源黑体 SemiBold</h4>
                    <p class="text-desc">字号：24px | 颜色：深灰</p>
                </div>
                <div class="text-item">
                    <p class="text-body">正文文字 - 思源黑体 Regular</p>
                    <p class="text-desc">字号：16px | 颜色：中灰</p>
                </div>
                <div class="text-item">
                    <p class="text-caption">辅助文字 - 思源黑体 Light</p>
                    <p class="text-desc">字号：14px | 颜色：浅灰</p>
                </div>
            </div>
        </section>

        <!-- 3. 按钮测试 -->
        <section class="test-section">
            <h2 class="section-title">按钮样式测试</h2>
            <div class="button-test">
                <el-button type="primary">主按钮（红色）</el-button>
                <el-button type="success">成功按钮（绿色）</el-button>
                <el-button type="warning">警告按钮（橙色）</el-button>
                <el-button type="info">信息按钮</el-button>
                <el-button type="danger">危险按钮</el-button>
                <el-button plain>朴素按钮</el-button>
                <el-button round>圆角按钮</el-button>
                <el-button circle
                    ><el-icon><Plus /></el-icon
                ></el-button>
            </div>
        </section>

        <!-- 4. 图标测试 -->
        <section class="test-section">
            <h2 class="section-title">图标样式测试</h2>
            <div class="icon-test">
                <div class="icon-item">
                    <el-icon class="icon-primary"><StarFilled /></el-icon>
                    <span>主色图标</span>
                </div>
                <div class="icon-item">
                    <el-icon class="icon-success"><CircleCheckFilled /></el-icon>
                    <span>成功图标</span>
                </div>
                <div class="icon-item">
                    <el-icon class="icon-warning"><WarningFilled /></el-icon>
                    <span>警告图标</span>
                </div>
                <div class="icon-item">
                    <el-icon class="icon-large"><MapLocation /></el-icon>
                    <span>大尺寸图标</span>
                </div>
            </div>
        </section>

        <!-- 5. 表单组件测试 -->
        <section class="test-section">
            <h2 class="section-title">表单组件测试</h2>
            <div class="form-test">
                <el-card shadow="hover">
                    <el-form label-width="100px">
                        <el-form-item label="输入框">
                            <el-input placeholder="请输入内容" v-model="inputValue" />
                        </el-form-item>
                        <el-form-item label="带图标的输入框">
                            <el-input placeholder="请输入搜索内容" v-model="searchValue">
                                <template #prefix>
                                    <el-icon><Search /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="下拉选择">
                            <el-select v-model="selectValue" placeholder="请选择乡村景点">
                                <el-option label="红色纪念馆" value="1" />
                                <el-option label="古村落遗址" value="2" />
                                <el-option label="乡村民宿" value="3" />
                                <el-option label="特色农场" value="4" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="多选下拉">
                            <el-select
                                v-model="multipleValue"
                                multiple
                                placeholder="请选择活动类型"
                            >
                                <el-option label="红色研学" value="1" />
                                <el-option label="乡村采摘" value="2" />
                                <el-option label="民俗体验" value="3" />
                                <el-option label="户外露营" value="4" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </section>

        <!-- 6. 背景色测试 -->
        <section class="test-section">
            <h2 class="section-title">背景色测试</h2>
            <div class="bg-test">
                <div class="bg-item bg-primary">
                    <span>主色：#C41E3A</span>
                </div>
                <div class="bg-item bg-success">
                    <span>辅助色：#4A7C59</span>
                </div>
                <div class="bg-item bg-warning">
                    <span>点缀色：#FF8C00</span>
                </div>
                <div class="bg-item bg-bg">
                    <span>背景色：#F5F5DC</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import {
    Plus,
    StarFilled,
    CircleCheckFilled,
    WarningFilled,
    MapLocation,
    Search,
} from "@element-plus/icons-vue";

// 表单数据
const inputValue = ref("");
const searchValue = ref("");
const selectValue = ref("");
const multipleValue = ref([]);
</script>

<style scoped lang="scss">
.ui-test-container {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    overflow: scroll;
}

// Banner样式
.banner-section {
    margin-bottom: 40px;

    .banner-bg {
        position: relative;
        width: 100%;
        height: 300px;
        border-radius: 16px;
        overflow: hidden;

        .banner-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .banner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                135deg,
                rgba(196, 30, 58, 0.7) 0%,
                rgba(74, 124, 89, 0.5) 100%
            );
        }

        .banner-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;

            .banner-title {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 12px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .banner-subtitle {
                font-size: 18px;
                opacity: 0.9;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
        }
    }
}

// 通用section样式
.test-section {
    margin-bottom: 40px;

    .section-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-color-primary);
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--el-color-primary-light-8);
    }
}

// 文字测试样式
.text-test {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    .text-item {
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .text-h1 {
            font-size: 32px;
            font-weight: bold;
            color: var(--el-color-primary);
            margin-bottom: 8px;
        }

        .text-h2 {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 8px;
        }

        .text-body {
            font-size: 16px;
            color: var(--el-text-color-regular);
            margin-bottom: 8px;
        }

        .text-caption {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            margin-bottom: 8px;
        }

        .text-desc {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin: 0;
        }
    }
}

// 按钮测试样式
.button-test {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .el-button {
        margin-bottom: 10px;
    }
}

// 图标测试样式
.icon-test {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;

    .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .el-icon {
            font-size: 32px;

            &.icon-primary {
                color: var(--el-color-primary);
            }

            &.icon-success {
                color: var(--el-color-success);
            }

            &.icon-warning {
                color: var(--el-color-warning);
            }

            &.icon-large {
                font-size: 48px;
                color: var(--el-color-primary);
            }
        }

        span {
            font-size: 14px;
            color: var(--el-text-color-regular);
        }
    }
}

// 表单测试样式
.form-test {
    .el-card {
        padding: 20px;
    }

    .el-form-item {
        margin-bottom: 20px;
    }
}

// 背景色测试样式
.bg-test {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;

    .bg-item {
        height: 100px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        padding: 0 10px;

        &.bg-primary {
            background-color: var(--el-color-primary);
        }

        &.bg-success {
            background-color: var(--el-color-success);
        }

        &.bg-warning {
            background-color: var(--el-color-warning);
        }

        &.bg-bg {
            background-color: var(--el-bg-color);
            color: var(--el-text-color-primary);
            border: 1px solid var(--el-border-color);
        }
    }
}

// 移动端适配
@media (max-width: 768px) {
    .banner-section .banner-bg {
        height: 200px;

        .banner-content .banner-title {
            font-size: 24px;
        }

        .banner-content .banner-subtitle {
            font-size: 14px;
        }
    }

    .text-test {
        grid-template-columns: 1fr;
    }

    .bg-test {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
