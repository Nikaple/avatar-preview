import { supportedBlendModes } from '@/types/blend';
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

            // 下载并处理所有图片
            const compositeOperations = (await Promise.all(
                this.config.images
                    .filter(img => img.url && img.url.trim() !== '') // 过滤掉空 URL
                    .map(async (img) => {
                        try {
                            const response = await fetch(img.url);
                            if (!response.ok) {
                                return null; // Skip image on fetch failure
                            }
                            const originalBuffer = Buffer.from(await response.arrayBuffer());

                            // --- Optimization 1: Resize before processing ---
                            const metadata = await sharp(originalBuffer).metadata();
                            const originalAspectRatio = metadata.width! / metadata.height!;
                            const resizeWidth = img.width;
                            const resizeHeight = Math.floor(resizeWidth / originalAspectRatio);

                            let processedImage = await sharp(originalBuffer)
                                .resize({
                                    width: resizeWidth,
                                    height: resizeHeight,
                                    fit: 'contain',
                                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                                })
                                .toBuffer();

                            // --- Chroma Keying on the resized image ---
                            if (img.chromaThreshold && img.chromaTolerance) {
                                const { data, info } = await sharp(processedImage).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

                                const colorCounts = new Map<string, number>();
                                for (let i = 0; i < data.length; i += 4) {
                                    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
                                    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
                                }

                                let dominantColor: string | null = null;
                                let maxCount = 0;
                                for (const [color, count] of colorCounts.entries()) {
                                    if (count > maxCount) {
                                        dominantColor = color;
                                        maxCount = count;
                                    }
                                }

                                const totalPixels = info.width * info.height;
                                if (dominantColor && (maxCount / totalPixels) > img.chromaThreshold) {
                                    const [r, g, b] = dominantColor.split(',').map(Number);
                                    // --- Optimization 2: Use squared distance to avoid Math.sqrt ---
                                    const toleranceSquared = Math.pow(img.chromaTolerance * 441.67, 2); // 441.67 is approx. sqrt(255^2 * 3)

                                    for (let i = 0; i < data.length; i += 4) {
                                        const pr = data[i];
                                        const pg = data[i + 1];
                                        const pb = data[i + 2];
                                        const distanceSquared = Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2);
                                        if (distanceSquared < toleranceSquared) {
                                            data[i + 3] = 0; // Set alpha to transparent
                                        }
                                    }
                                    processedImage = await sharp(data, { raw: info }).png().toBuffer();
                                }
                            }

                            let offsetLeft = img.position[0];
                            let offsetTop = img.position[1];

                            // --- Clipping after all other processing ---
                            if (img.clip && img.clip.length === 4) {
                                const [top, right, bottom, left] = img.clip;
                                const meta = await sharp(processedImage).metadata();
                                const width = meta.width ?? 0;
                                const height = meta.height ?? 0;
                                processedImage = await sharp(processedImage)
                                    .extract({
                                        left: left,
                                        top: top,
                                        width: Math.max(0, width - left - right),
                                        height: Math.max(0, height - top - bottom)
                                    })
                                    .toBuffer();
                                offsetLeft += left;
                                offsetTop += top;
                            }

                            const processedShapeImage = await sharp(processedImage).metadata();
                            if (this.config.debug) {
                                processedImage = await sharp(processedImage)
                                    .composite([
                                        {
                                            input: Buffer.from(
                                                `<svg width="${processedShapeImage.width}" height="${processedShapeImage.height}">
                                                    <rect x="0" y="0" width="${processedShapeImage.width}" height="${processedShapeImage.height}"
                                                      style="fill:none;stroke:red;stroke-width:5;" />
                                                </svg>`),
                                            left: 0,
                                            top: 0
                                        }
                                    ])
                                    .toBuffer()
                            }

                            const options: any = {
                                input: processedImage,
                                width: processedShapeImage.width,
                                height: processedShapeImage.height,
                                left: offsetLeft,
                                top: offsetTop
                            };

                            if (img.blend && supportedBlendModes.includes(img.blend)) {
                                options.blend = img.blend;
                            }

                            return options;
                        } catch (e) {
                            // Log the error for debugging
                            console.error(`Failed to process image ${img.url}:`, e);
                            return null;
                        }
                    })
            )).filter(Boolean) ; // 过滤掉为 null 的项，并断言类型

            // 合并所有图片
            let result = await sharp({
                    create: {
                        width: Math.max(this.config.w, ...compositeOperations.map(op => op?.width || 0)),
                        height: Math.max(this.config.h, ...compositeOperations.map(op => op?.height || 0)),
                        channels: 4,
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    }
                })
                .composite(compositeOperations as any)
                .png()
                .toBuffer();
            
            result = await sharp(result)
                .extract({
                    left: 0,
                    top: 0,
                    width: this.config.w,
                    height: this.config.h
                })
                .toBuffer()

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
