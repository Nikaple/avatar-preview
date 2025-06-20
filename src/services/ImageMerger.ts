import sharp from 'sharp';
import { MergeConfig } from '../types/image';
import { FetchFunction, getFetch } from '../utils/runtime';

export class ImageMerger {
    private readonly config: MergeConfig;
    private fetchFn: FetchFunction | null = null;

    constructor(config: MergeConfig) {
        this.config = config;
    }

    private async initFetch(): Promise<FetchFunction> {
        if (!this.fetchFn) {
            this.fetchFn = await getFetch();
        }
        return this.fetchFn;
    }

    public async merge(): Promise<Buffer> {
        try {
            const fetch = await this.initFetch();
            const size = this.config.size ?? 1;
            // 创建一个透明背景的画布
            const canvas = await sharp({
                create: {
                    width: this.config.w,
                    height: this.config.h,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }
            });

            // 下载并处理所有图片
            const compositeOperations = (await Promise.all(
                this.config.images
                    .filter(img => img.url && img.url.trim() !== '') // 过滤掉空 URL
                    .map(async (img) => {
                        try {
                            const response = await fetch(img.url);
                            if (!response.ok) {
                                // 拉取失败，跳过该图片
                                return null;
                            }
                            let buffer: Buffer<ArrayBufferLike> = Buffer.from(await response.arrayBuffer());
                            buffer = Buffer.from(buffer);
                            // 获取原始图片的元数据
                            const metadata = await sharp(buffer).metadata();
                            const originalAspectRatio = metadata.width! / metadata.height!;
                            // 计算调整后的高度，保持纵横比
                            const resizeWidth = img.width;
                            const resizeHeight = Math.floor(resizeWidth / originalAspectRatio);
                            // 先resize
                            let processedImage = await sharp(buffer)
                                .resize({
                                    width: resizeWidth,
                                    height: resizeHeight,
                                    fit: 'contain',
                                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                                })
                                .toBuffer();
                            let offsetLeft = img.position[0];
                            let offsetTop = img.position[1];
                            // 再clip（只在resize后切除，不影响缩放和位置）
                            if (img.clip && img.clip.length === 4) {
                                const [top, right, bottom, left] = img.clip;
                                const meta = await sharp(processedImage).metadata();
                                const width = meta.width ?? 0;
                                const height = meta.height ?? 0;
                                processedImage = await sharp(processedImage)
                                    .extract({
                                        left: left,
                                        top: top,
                                        width: Math.min(width - left - right, width),
                                        height: Math.min(height - top - bottom, height)
                                    })
                                    .toBuffer();
                                offsetLeft += left;
                                offsetTop += top;
                            }
                            const processedShapeImage = await sharp(processedImage).metadata();
                            return {
                                input: processedImage,
                                width: processedShapeImage.width,
                                height: processedShapeImage.height,
                                left: img.position[0],
                                top: img.position[1]
                            };
                        } catch (e) {
                            // 拉取或处理失败，跳过该图片
                            return null;
                        }
                    })
            )).filter(Boolean) as sharp.OverlayOptions[]; // 过滤掉为 null 的项，并断言类型

            // 合并所有图片
            let result = await canvas
                .composite(compositeOperations)
                .png()
                .toBuffer();

            // 如果 size !== 1，则整体缩放
            if (size !== 1) {
                const scaledWidth = Math.floor(this.config.w * size);
                const scaledHeight = Math.floor(this.config.h * size);
                result = await sharp(result)
                    .resize({ width: scaledWidth, height: scaledHeight })
                    .png()
                    .toBuffer();
            }

            return result;
        } catch (error) {
            console.error('Error merging images:', error);
            throw error;
        }
    }
}
