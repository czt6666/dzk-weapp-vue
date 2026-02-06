import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SIZE = 100 * 1024; // 100KB
// 图片目录路径（相对于项目根目录）
const SWIPER_DIR = path.join(__dirname, "src/assets/swiper");

// 支持的图片格式
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// 递归获取所有图片文件
function getAllImageFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllImageFiles(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

// 压缩图片
async function compressImage(filePath) {
    let tempFilePath = null;
    try {
        const stats = fs.statSync(filePath);
        const originalSize = stats.size;

        // 如果文件已经小于 100KB，跳过
        if (originalSize <= MAX_SIZE) {
            console.log(`✓ ${path.relative(SWIPER_DIR, filePath)} (${(originalSize / 1024).toFixed(2)}KB) - 已满足要求`);
            return { success: true, skipped: true, originalSize, finalSize: originalSize };
        }

        console.log(`压缩中: ${path.relative(SWIPER_DIR, filePath)} (${(originalSize / 1024).toFixed(2)}KB)`);

        const ext = path.extname(filePath).toLowerCase();
        let quality = 85; // 初始质量
        let finalSize = originalSize;
        let attempts = 0;
        const maxAttempts = 10;

        // 创建临时文件路径
        tempFilePath = filePath + ".tmp";

        // 读取图片信息
        const imageBuffer = fs.readFileSync(filePath);
        const metadata = await sharp(imageBuffer).metadata();
        const isPng = ext === ".png";

        // 如果文件太大，先调整尺寸
        let width = metadata.width;
        let height = metadata.height;
        const maxDimension = 2000; // 最大尺寸

        if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        // 尝试不同的质量值，直到文件大小满足要求
        while (finalSize > MAX_SIZE && attempts < maxAttempts) {
            let sharpInstance = sharp(imageBuffer).resize(width, height, {
                fit: "inside",
                withoutEnlargement: true,
            });

            if (isPng) {
                // PNG 压缩选项
                sharpInstance = sharpInstance.png({
                    quality: quality,
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                });
            } else {
                // JPEG 压缩选项
                sharpInstance = sharpInstance.jpeg({
                    quality: quality,
                    mozjpeg: true,
                });
            }

            const buffer = await sharpInstance.toBuffer();
            finalSize = buffer.length;

            if (finalSize > MAX_SIZE) {
                quality -= 5;
                attempts++;
            } else {
                // 先写入临时文件
                fs.writeFileSync(tempFilePath, buffer);
                // 删除原文件
                fs.unlinkSync(filePath);
                // 重命名临时文件为原文件名
                fs.renameSync(tempFilePath, filePath);
                tempFilePath = null;

                const saved = (finalSize / 1024).toFixed(2);
                const savedPercent = (((originalSize - finalSize) / originalSize) * 100).toFixed(1);
                console.log(
                    `✓ ${path.relative(SWIPER_DIR, filePath)}: ${(originalSize / 1024).toFixed(2)}KB → ${saved}KB (节省 ${savedPercent}%)`
                );
                return { success: true, skipped: false, originalSize, finalSize };
            }
        }

        // 如果还是太大，使用更激进的压缩
        if (finalSize > MAX_SIZE) {
            // 进一步缩小尺寸
            width = Math.round(width * 0.8);
            height = Math.round(height * 0.8);
            quality = 70;

            let sharpInstance = sharp(imageBuffer).resize(width, height, {
                fit: "inside",
                withoutEnlargement: true,
            });

            if (isPng) {
                sharpInstance = sharpInstance.png({
                    quality: quality,
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                });
            } else {
                sharpInstance = sharpInstance.jpeg({
                    quality: quality,
                    mozjpeg: true,
                });
            }

            const buffer = await sharpInstance.toBuffer();
            finalSize = buffer.length;

            // 先写入临时文件
            fs.writeFileSync(tempFilePath, buffer);
            // 删除原文件
            fs.unlinkSync(filePath);
            // 重命名临时文件为原文件名
            fs.renameSync(tempFilePath, filePath);
            tempFilePath = null;

            const saved = (finalSize / 1024).toFixed(2);
            const savedPercent = (((originalSize - finalSize) / originalSize) * 100).toFixed(1);
            console.log(
                `✓ ${path.relative(SWIPER_DIR, filePath)}: ${(originalSize / 1024).toFixed(2)}KB → ${saved}KB (节省 ${savedPercent}%)`
            );
        }

        return { success: true, skipped: false, originalSize, finalSize };
    } catch (error) {
        // 清理临时文件
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (e) {
                // 忽略清理错误
            }
        }
        console.error(`✗ 压缩失败: ${path.relative(SWIPER_DIR, filePath)}`, error.message);
        return { success: false, error: error.message };
    }
}

// 主函数
async function main() {
    console.log("开始压缩图片...\n");
    console.log(`目标目录: ${SWIPER_DIR}`);
    console.log(`目标大小: < 100KB\n`);

    if (!fs.existsSync(SWIPER_DIR)) {
        console.error(`错误: 目录不存在 ${SWIPER_DIR}`);
        process.exit(1);
    }

    const imageFiles = getAllImageFiles(SWIPER_DIR);
    console.log(`找到 ${imageFiles.length} 个图片文件\n`);

    if (imageFiles.length === 0) {
        console.log("没有找到图片文件");
        return;
    }

    const results = {
        total: imageFiles.length,
        success: 0,
        skipped: 0,
        failed: 0,
        totalOriginalSize: 0,
        totalFinalSize: 0,
    };

    for (const filePath of imageFiles) {
        const result = await compressImage(filePath);
        if (result.success) {
            if (result.skipped) {
                results.skipped++;
            } else {
                results.success++;
            }
            results.totalOriginalSize += result.originalSize;
            results.totalFinalSize += result.finalSize;
        } else {
            results.failed++;
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log("压缩完成！");
    console.log("=".repeat(50));
    console.log(`总计: ${results.total} 个文件`);
    console.log(`成功压缩: ${results.success} 个`);
    console.log(`已满足要求: ${results.skipped} 个`);
    console.log(`失败: ${results.failed} 个`);
    console.log(
        `总大小: ${(results.totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(results.totalFinalSize / 1024 / 1024).toFixed(2)}MB`
    );
    console.log(
        `节省: ${((results.totalOriginalSize - results.totalFinalSize) / 1024 / 1024).toFixed(2)}MB (${(((results.totalOriginalSize - results.totalFinalSize) / results.totalOriginalSize) * 100).toFixed(1)}%)`
    );
}

main().catch((error) => {
    console.error("发生错误:", error);
    process.exit(1);
});

