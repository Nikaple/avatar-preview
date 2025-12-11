import opentype from 'opentype.js';
import { resolve } from 'path';
import { fontManager } from './FontManager';

/**
 * 文字测量缓存
 */
interface MeasurementCache {
  [key: string]: number;
}

/**
 * 文字测量服务
 * 使用 opentype.js 精确测量文字宽度
 */
export class TextMeasurement {
  private static instance: TextMeasurement;
  private fontCache: Map<string, opentype.Font> = new Map();
  private measurementCache: MeasurementCache = {};
  private fontsDir: string;

  private constructor() {
    this.fontsDir = resolve(process.cwd(), 'fonts');
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): TextMeasurement {
    if (!TextMeasurement.instance) {
      TextMeasurement.instance = new TextMeasurement();
    }
    return TextMeasurement.instance;
  }

  /**
   * 加载字体文件
   */
  private async loadFont(fontPath: string): Promise<opentype.Font> {
    if (this.fontCache.has(fontPath)) {
      return this.fontCache.get(fontPath)!;
    }

    try {
      const fullPath = resolve(this.fontsDir, fontPath);
      const font = await opentype.load(fullPath);
      this.fontCache.set(fontPath, font);
      return font;
    } catch (error) {
      throw new Error(`Failed to load font: ${fontPath} - ${error}`);
    }
  }

  /**
   * 精确测量文字宽度
   * @param text 要测量的文字
   * @param fontSize 字体大小（像素）
   * @param fontFamily 字体族
   * @param fontWeight 字体粗细
   * @param fontStyle 字体样式
   * @returns 文字宽度（像素）
   * @throws Error 如果无法加载字体
   */
  public async measureText(
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight: string | number = 400,
    fontStyle: string = 'normal',
  ): Promise<number> {
    // 生成缓存键
    const cacheKey = `${text}|${fontSize}|${fontFamily}|${fontWeight}|${fontStyle}`;
    if (this.measurementCache[cacheKey] !== undefined) {
      return this.measurementCache[cacheKey];
    }

    // 解析字体权重
    const weight = typeof fontWeight === 'string' && fontWeight === 'bold' ? 700 : 
                   typeof fontWeight === 'number' ? fontWeight : 400;

    // 获取字体配置
    const fontFamilies = fontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''));
    
    let lastError: Error | null = null;
    
    for (const family of fontFamilies) {
      const fontConfig = fontManager.getFont(family, weight, fontStyle);
      
      if (fontConfig) {
        try {
          const font = await this.loadFont(fontConfig.path);
          const width = this.calculateTextWidth(font, text, fontSize);
          this.measurementCache[cacheKey] = width;
          return width;
        } catch (error) {
          lastError = error as Error;
          console.warn(`Failed to load font ${family} (${fontConfig.path}): ${error}`);
          continue;
        }
      }
    }

    // 如果所有字体都失败，抛出错误
    throw new Error(
      `Failed to measure text: No valid font found for "${fontFamily}". ` +
      `Last error: ${lastError?.message || 'Font not registered'}`
    );
  }

  /**
   * 使用 opentype.js 计算文字宽度
   */
  private calculateTextWidth(font: opentype.Font, text: string, fontSize: number): number {
    const scale = fontSize / font.unitsPerEm;
    let width = 0;

    for (let i = 0; i < text.length; i++) {
      const glyph = font.charToGlyph(text[i]);
      
      if (glyph.advanceWidth) {
        width += glyph.advanceWidth * scale;
      }

      // 添加字距调整（kerning）
      if (i < text.length - 1) {
        const nextGlyph = font.charToGlyph(text[i + 1]);
        const kerningValue = font.getKerningValue(glyph, nextGlyph);
        width += kerningValue * scale;
      }
    }

    return width;
  }

  /**
   * 测量多行文字的宽度
   */
  public async measureLines(
    lines: string[],
    fontSize: number,
    fontFamily: string,
    fontWeight: string | number = 400,
    fontStyle: string = 'normal',
  ): Promise<number[]> {
    return Promise.all(
      lines.map(line => this.measureText(line, fontSize, fontFamily, fontWeight, fontStyle))
    );
  }

  /**
   * 智能换行
   * @param text 原始文字
   * @param maxWidth 最大宽度
   * @param fontSize 字体大小
   * @param fontFamily 字体族
   * @param fontWeight 字体粗细
   * @param fontStyle 字体样式
   * @returns 换行后的文字数组
   */
  public async wrapText(
    text: string,
    maxWidth: number,
    fontSize: number,
    fontFamily: string,
    fontWeight: string | number = 400,
    fontStyle: string = 'normal',
  ): Promise<string[]> {
    if (!maxWidth) {
      // 如果没有最大宽度限制，只按手动换行符分割
      return text.split('\n');
    }

    const lines: string[] = [];
    
    // 首先按手动换行符分割
    const paragraphs = text.split('\n');
    
    // 对每个段落进行自动换行
    for (const paragraph of paragraphs) {
      if (paragraph === '') {
        // 保留空行
        lines.push('');
        continue;
      }
      
      let currentLine = '';

      for (let i = 0; i < paragraph.length; i++) {
        const char = paragraph[i];
        const testLine = currentLine + char;
        const width = await this.measureText(testLine, fontSize, fontFamily, fontWeight, fontStyle);

        if (width > maxWidth && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines.length > 0 ? lines : [text];
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.measurementCache = {};
  }

  /**
   * 清除字体缓存
   */
  public clearFontCache(): void {
    this.fontCache.clear();
  }
}

/**
 * 导出单例实例
 */
export const textMeasurement = TextMeasurement.getInstance();
