import { supportedBlendModes } from '@/types/blend';
import crypto from 'crypto';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import sharp from 'sharp';
import { IComponent, IImage, IText, Layer, MergeConfig } from '../types/image';
import { FetchFunction, getFetch } from '../utils/runtime';
import { withBlobCache, withCache } from './Cache';
import { fontManager } from './FontManager';
import { textMeasurement } from './TextMeasurement';
import { ComponentRenderer } from './ComponentRenderer';

// 设置字体配置
const setupFontConfig = () => {
  try {
    const fontsDir = resolve(process.cwd(), 'fonts');
    const fontConfigPath = resolve(fontsDir, 'fonts.conf');

    // 动态生成 fonts.conf 文件内容
    const fontConfigContent = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}/</dir>
  <cachedir>/tmp/fonts-cache/</cachedir>
  <config></config>
</fontconfig>`;

    // 写入字体配置文件
    writeFileSync(fontConfigPath, fontConfigContent, 'utf8');

    // 设置环境变量，指向实际的 fonts 目录
    process.env.FONTCONFIG_PATH = fontsDir;
    process.env.FONTCONFIG_FILE = fontConfigPath;
  } catch (error) {
    console.warn('Failed to setup font config:', error);
  }
};

// 初始化字体配置
setupFontConfig();

export class ImageMerger {
  private readonly config: MergeConfig;
  private fetchFn: FetchFunction | null = null;
  private componentRenderer: ComponentRenderer;

  constructor(config: MergeConfig) {
    this.config = config;
    this.componentRenderer = new ComponentRenderer();
  }

  private async initFetch(): Promise<FetchFunction> {
    if (!this.fetchFn) {
      this.fetchFn = await getFetch();
    }
    return this.fetchFn;
  }

  private async getOriginalImageBuffer(url: string): Promise<Buffer> {
    const fetch = await this.initFetch();
    const cacheKey = `image/${crypto
      .createHash('sha1')
      .update(url)
      .digest('hex')}.png`;

    return withBlobCache(cacheKey, async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    });
  }

  public async merge(): Promise<Buffer> {
    try {
      const size = this.config.size ?? 1;

      // 解析图层（支持 layers 或 images 参数）
      const layers = this.parseLayers();

      // 处理所有图层
      const layerOperations = (
        await Promise.all(
          layers.map(async (layer, index) => {
            try {
              return await withCache(
                `layer-${index}-${JSON.stringify(layer)}`,
                () => this.processLayer(layer),
              );
            } catch (error) {
              console.error(`Failed to process layer ${index}:`, error);
              return null;
            }
          }),
        )
      ).filter(Boolean); // 过滤掉为 null 的项

      // 合并所有图层
      let result = await sharp({
        create: {
          width: Math.max(
            this.config.w,
            ...layerOperations.map((op) => op?.width || 0),
          ),
          height: Math.max(
            this.config.h,
            ...layerOperations.map((op) => op?.height || 0),
          ),
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(layerOperations as any)
        .png()
        .toBuffer();

      result = await sharp(result)
        .extract({
          left: 0,
          top: 0,
          width: this.config.w,
          height: this.config.h,
        })
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

  /**
   * 解析图层（优先使用 layers，否则使用 images）
   */
  private parseLayers(): Layer[] {
    // 优先使用 layers 参数
    if (this.config.layers && this.config.layers.length > 0) {
      return this.normalizeLayers(this.config.layers);
    }

    // 向前兼容：使用 images 参数
    if (this.config.images && this.config.images.length > 0) {
      return this.normalizeLayers(this.config.images);
    }

    return [];
  }

  /**
   * 标准化图层（为没有 type 的图层添加默认值）
   * 规则：没有 type 字段就默认为 'image'
   */
  private normalizeLayers(layers: Layer[]): Layer[] {
    return layers.map((layer) => {
      if (!layer.type) {
        return { ...layer, type: 'image' as const };
      }
      return layer;
    });
  }

  /**
   * 处理单个图层
   */
  private async processLayer(layer: Layer) {
    switch (layer.type) {
      case 'image':
        return this.processImage(layer as IImage);
      case 'text':
        return this.processText(layer as IText);
      case 'component':
        return this.processComponent(layer as IComponent);
      default:
        console.warn(`Unknown layer type: ${(layer as any).type}`);
        return null;
    }
  }

  /**
   * 处理组件图层
   */
  private async processComponent(component: IComponent) {
    try {
      console.log(`[ImageMerger] Processing component with scale: ${component.scale}`);
      
      // 1. 渲染组件为 PNG Buffer
      const componentBuffer = await this.componentRenderer.render(
        component.name,
        component.props,
        {
          width: component.width,
          height: component.height,
          scale: component.scale,
        },
      );

      // 2. 获取图片元数据
      const metadata = await sharp(componentBuffer).metadata();
      const width = metadata.width || component.width || 300;
      const height = metadata.height || component.height || 200;

      // 3. 添加调试边框（如果开启）
      let processedBuffer = componentBuffer;
      if (this.config.debug) {
        processedBuffer = await sharp(componentBuffer)
          .composite([
            {
              input: Buffer.from(
                `<svg width="${width}" height="${height}">
                  <rect x="0" y="0" width="${width}" height="${height}"
                    style="fill:none;stroke:blue;stroke-width:3;stroke-dasharray:5,5;" />
                  <text x="5" y="15" style="fill:blue;font-size:12px;font-family:Arial;">Component: ${component.name}</text>
                </svg>`,
              ),
              left: 0,
              top: 0,
            },
          ])
          .toBuffer();
      }

      // 4. 构建合成选项
      const options: any = {
        input: processedBuffer,
        width,
        height,
        left: component.position[0],
        top: component.position[1],
      };

      if (component.blend && supportedBlendModes.includes(component.blend)) {
        options.blend = component.blend;
      }

      return options;
    } catch (error) {
      console.error(`Failed to process component "${component.name}":`, error);
      return null;
    }
  }

  private async processImage(img: IImage) {
    try {
      const originalBuffer = await this.getOriginalImageBuffer(img.url);

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
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      // --- Chroma Keying on the resized image ---
      if (img.chromaThreshold && img.chromaTolerance) {
        const { data, info } = await sharp(processedImage)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

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
        if (dominantColor && maxCount / totalPixels > img.chromaThreshold) {
          const [r, g, b] = dominantColor.split(',').map(Number);
          // --- Optimization 2: Use squared distance to avoid Math.sqrt ---
          const toleranceSquared = Math.pow(img.chromaTolerance * 441.67, 2);

          for (let i = 0; i < data.length; i += 4) {
            const pr = data[i];
            const pg = data[i + 1];
            const pb = data[i + 2];
            const distanceSquared =
              Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2);
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
            height: Math.max(0, height - top - bottom),
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
                                      </svg>`,
              ),
              left: 0,
              top: 0,
            },
          ])
          .toBuffer();
      }

      const options: any = {
        input: processedImage,
        width: processedShapeImage.width,
        height: processedShapeImage.height,
        left: offsetLeft,
        top: offsetTop,
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
  }

  private async processText(text: IText) {
    try {
      // 设置默认值，支持简化属性
      const fontSize = text.fontSize || 16;
      const color = text.color || '#000000';
      const fontFamily =
        text.fontFamily || 'Noto Sans SC, Microsoft YaHei, Arial, sans-serif';
      const fontWeight = text.bold ? 'bold' : text.fontWeight || 'normal';
      const fontStyle = text.italic ? 'italic' : text.fontStyle || 'normal';
      const textDecoration = text.textDecoration || 'none';
      const textAlign = text.textAlign || 'left';
      const lineHeight = text.lineHeight || 1.2;
      const strokeColor = text.strokeColor;
      const strokeWidth = text.strokeWidth || 0;

      // 使用精确的文字测量进行换行
      // 如果有 maxWidth，使用智能换行；否则只按 \n 分割
      const lines = await textMeasurement.wrapText(
        text.text,
        text.maxWidth || 0,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
      );

      // 精确测量每行文字的宽度
      const lineWidths = await textMeasurement.measureLines(
        lines,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
      );

      // 计算文字区域尺寸
      const lineHeightPx = fontSize * lineHeight;
      const textHeight = lines.length * lineHeightPx;

      // 计算实际需要的宽度，考虑描边
      const maxLineWidth = Math.max(...lineWidths);
      const padding = strokeWidth > 0 ? strokeWidth * 2 : 0;
      const textWidth = text.maxWidth || maxLineWidth + padding;

      // 生成 SVG 内容
      const svgContent = await this.generateTextSVG({
        lines,
        lineWidths,
        textWidth,
        textHeight,
        fontSize,
        lineHeightPx,
        fontFamily,
        fontWeight,
        fontStyle,
        textDecoration,
        textAlign,
        color,
        strokeColor,
        strokeWidth,
      });

      // 将 SVG 转换为 PNG
      const textBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

      // 根据对齐方式调整 SVG 的放置位置
      let leftOffset = text.position[0];

      if (textAlign === 'center') {
        // 居中对齐：向左偏移一半宽度
        leftOffset -= textWidth / 2;
      } else if (textAlign === 'right') {
        // 右对齐：向左偏移整个宽度
        leftOffset -= textWidth;
      }
      // 左对齐：不需要偏移，直接使用 position[0]

      const options: any = {
        input: textBuffer,
        width: Math.ceil(textWidth),
        height: Math.ceil(textHeight),
        left: Math.round(leftOffset),
        top: text.position[1],
      };

      if (text.blend && supportedBlendModes.includes(text.blend)) {
        options.blend = text.blend;
      }

      return options;
    } catch (e) {
      console.error(`Failed to process text "${text.text}":`, e);
      return null;
    }
  }

  /**
   * 生成文字 SVG
   */
  private async generateTextSVG(params: {
    lines: string[];
    lineWidths: number[];
    textWidth: number;
    textHeight: number;
    fontSize: number;
    lineHeightPx: number;
    fontFamily: string;
    fontWeight: string | number;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
    color: string;
    strokeColor?: string;
    strokeWidth: number;
  }): Promise<string> {
    const {
      lines,
      lineWidths,
      textWidth,
      textHeight,
      fontSize,
      lineHeightPx,
      fontFamily,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      color,
      strokeColor,
      strokeWidth,
    } = params;

    // 生成字体 @font-face 规则
    const fontFaces = this.generateFontFaces(fontFamily, fontWeight, fontStyle);

    // 处理字体族名称，为每个字体添加引号
    const quotedFontFamily = fontFamily
      .split(',')
      .map((f) => {
        const trimmed = f.trim().replace(/['"]/g, '');
        return `'${trimmed}'`;
      })
      .join(', ');

    // 计算内边距（用于描边）
    const padding = strokeWidth > 0 ? strokeWidth : 0;

    // 构建 SVG，添加 viewBox 确保内容不被裁剪
    let svgContent = `<svg width="${Math.ceil(textWidth)}" height="${Math.ceil(textHeight)}" xmlns="http://www.w3.org/2000/svg">`;

    // 添加字体和样式定义
    svgContent += `<defs><style>
      ${fontFaces}
      .text-style {
        font-family: ${quotedFontFamily};
        font-size: ${fontSize}px;
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        text-decoration: ${textDecoration};
        fill: ${color};
        ${strokeColor && strokeWidth > 0 ? `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; paint-order: stroke fill;` : ''}
      }
    </style></defs>`;

    // 添加文字行，使用精确的宽度进行对齐
    lines.forEach((line, index) => {
      const y = (index + 1) * lineHeightPx - (lineHeightPx - fontSize) / 2;
      let x = padding;

      // 根据对齐方式计算 x 坐标
      if (textAlign === 'center') {
        x = textWidth / 2;
      } else if (textAlign === 'right') {
        x = textWidth - padding;
      }

      const textAnchor =
        textAlign === 'center'
          ? 'middle'
          : textAlign === 'right'
            ? 'end'
            : 'start';
      svgContent += `<text x="${x}" y="${y}" class="text-style" text-anchor="${textAnchor}">${this.escapeXml(line)}</text>`;
    });

    svgContent += '</svg>';
    return svgContent;
  }

  /**
   * 生成字体 @font-face 规则
   */
  private generateFontFaces(
    fontFamily: string,
    fontWeight: string | number,
    fontStyle: string,
  ): string {
    const weight =
      typeof fontWeight === 'string' && fontWeight === 'bold'
        ? 700
        : typeof fontWeight === 'number'
          ? fontWeight
          : 400;

    // 解析字体族，获取所有可能的字体
    const fontFamilies = fontFamily
      .split(',')
      .map((f) => f.trim().replace(/['"]/g, ''));
    const fontFaces: string[] = [];

    for (const family of fontFamilies) {
      const font = fontManager.getFont(family, weight, fontStyle);
      if (font) {
        const fontFace = fontManager.generateFontFace(font);
        if (fontFace) {
          fontFaces.push(fontFace);
        }
      }
    }

    return fontFaces.join('\n');
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
