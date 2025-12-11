import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * 字体配置接口
 */
export interface FontConfig {
  /** 字体名称 */
  name: string;
  /** 字体文件路径（相对于 fonts 目录） */
  path: string;
  /** 字体格式 (ttf, otf, woff, woff2) */
  format: 'truetype' | 'opentype' | 'woff' | 'woff2';
  /** 字体粗细 */
  weight?: number | string;
  /** 字体样式 */
  style?: 'normal' | 'italic' | 'oblique';
  /** 字体别名 */
  aliases?: string[];
}

/**
 * 字体管理器
 * 负责注册、管理和提供字体资源
 */
export class FontManager {
  private static instance: FontManager;
  private fonts: Map<string, FontConfig> = new Map();
  private fontsDir: string;
  private fontDataCache: Map<string, string> = new Map();

  private constructor() {
    this.fontsDir = resolve(process.cwd(), 'fonts');
    this.registerDefaultFonts();
  }

  /**
   * 获取 FontManager 单例
   */
  public static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  /**
   * 注册默认字体
   *
   * 添加新字体只需要：
   * 1. 将字体文件放到 fonts 文件夹
   * 2. 在下面添加一项配置
   */
  private registerDefaultFonts() {
    // 注册 Noto Sans SC（中文字体）
    this.registerFont({
      name: 'Noto Sans SC',
      path: 'NotoSansSC-Regular.ttf',
      format: 'truetype',
      weight: 400,
      style: 'normal',
      aliases: ['NotoSansSC', 'noto-sans-sc'],
    });

    // 注册 DIN Pro（英文字体）
    this.registerFont({
      name: 'DIN Pro',
      path: 'dinpro_bold.otf',
      format: 'opentype',
      weight: 700,
      style: 'normal',
      aliases: ['DINPro', 'din-pro', 'DIN'],
    });
  }

  /**
   * 注册字体
   */
  public registerFont(config: FontConfig): void {
    // 注册完整键（包含 weight 和 style）
    const fullKey = this.getFontKey(config.name, config.weight, config.style);
    this.fonts.set(fullKey, config);

    // 注册基础键（不包含 weight 和 style，用于回退）
    const baseKey = this.getFontKey(config.name);
    if (!this.fonts.has(baseKey)) {
      this.fonts.set(baseKey, config);
    }

    // 注册别名
    if (config.aliases) {
      config.aliases.forEach((alias) => {
        const aliasFullKey = this.getFontKey(
          alias,
          config.weight,
          config.style,
        );
        this.fonts.set(aliasFullKey, config);

        const aliasBaseKey = this.getFontKey(alias);
        if (!this.fonts.has(aliasBaseKey)) {
          this.fonts.set(aliasBaseKey, config);
        }
      });
    }
  }

  /**
   * 获取字体配置
   */
  public getFont(
    fontFamily: string,
    weight?: number | string,
    style?: string,
  ): FontConfig | undefined {
    // 尝试精确匹配
    const exactKey = this.getFontKey(fontFamily, weight, style);
    if (this.fonts.has(exactKey)) {
      return this.fonts.get(exactKey);
    }

    // 尝试只匹配字体名称
    const nameKey = this.getFontKey(fontFamily);
    if (this.fonts.has(nameKey)) {
      return this.fonts.get(nameKey);
    }

    // 尝试匹配字体族中的第一个字体
    const familyName = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
    const familyKey = this.getFontKey(familyName, weight, style);
    if (this.fonts.has(familyKey)) {
      return this.fonts.get(familyKey);
    }

    return undefined;
  }

  /**
   * 获取所有注册的字体
   */
  public getAllFonts(): FontConfig[] {
    const uniqueFonts = new Map<string, FontConfig>();
    this.fonts.forEach((config) => {
      const key = `${config.name}-${config.path}`;
      if (!uniqueFonts.has(key)) {
        uniqueFonts.set(key, config);
      }
    });
    return Array.from(uniqueFonts.values());
  }

  /**
   * 获取字体的 Base64 数据
   */
  public getFontData(fontPath: string): string {
    if (this.fontDataCache.has(fontPath)) {
      return this.fontDataCache.get(fontPath)!;
    }

    try {
      const fullPath = resolve(this.fontsDir, fontPath);
      const buffer = readFileSync(fullPath);
      const base64 = buffer.toString('base64');
      this.fontDataCache.set(fontPath, base64);
      return base64;
    } catch (error) {
      console.error(`Failed to read font file: ${fontPath}`, error);
      return '';
    }
  }

  /**
   * 获取字体的 ArrayBuffer 数据（用于 Satori）
   */
  public async getFontArrayBuffer(fontPath: string): Promise<ArrayBuffer> {
    const fs = await import('fs/promises');
    const fullPath = resolve(this.fontsDir, fontPath);
    const buffer = await fs.readFile(fullPath);
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;
  }

  /**
   * 生成 @font-face CSS 规则
   */
  public generateFontFace(config: FontConfig): string {
    const base64Data = this.getFontData(config.path);
    if (!base64Data) {
      return '';
    }

    const mimeType = this.getMimeType(config.format);
    const weight = config.weight || 400;
    const style = config.style || 'normal';

    // 获取正确的 format 值
    const formatValue = this.getFormatValue(config.format);

    return `
      @font-face {
        font-family: '${config.name}';
        src: url('data:${mimeType};charset=utf-8;base64,${base64Data}') format('${formatValue}');
        font-weight: ${weight};
        font-style: ${style};
        font-display: block;
      }
    `;
  }

  /**
   * 获取 CSS format() 函数的值
   */
  private getFormatValue(format: string): string {
    const formatValues: Record<string, string> = {
      truetype: 'truetype',
      opentype: 'opentype',
      woff: 'woff',
      woff2: 'woff2',
    };
    return formatValues[format] || 'truetype';
  }

  /**
   * 生成所有字体的 @font-face CSS 规则
   */
  public generateAllFontFaces(): string {
    const fonts = this.getAllFonts();
    return fonts.map((font) => this.generateFontFace(font)).join('\n');
  }

  /**
   * 解析字体族字符串，返回可用的字体配置
   */
  public parseFontFamily(
    fontFamily: string,
    weight?: number | string,
    style?: string,
  ): FontConfig[] {
    const families = fontFamily
      .split(',')
      .map((f) => f.trim().replace(/['"]/g, ''));
    const configs: FontConfig[] = [];

    for (const family of families) {
      const config = this.getFont(family, weight, style);
      if (config) {
        configs.push(config);
      }
    }

    return configs;
  }

  /**
   * 获取字体键
   */
  private getFontKey(
    name: string,
    weight?: number | string,
    style?: string,
  ): string {
    const normalizedName = name.toLowerCase().trim();
    if (weight !== undefined && style !== undefined) {
      return `${normalizedName}-${weight}-${style}`;
    }
    return normalizedName;
  }

  /**
   * 获取字体格式对应的 MIME 类型
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      truetype: 'font/ttf',
      opentype: 'font/otf',
      woff: 'font/woff',
      woff2: 'font/woff2',
    };
    return mimeTypes[format] || 'font/ttf';
  }
}

/**
 * 导出单例实例
 */
export const fontManager = FontManager.getInstance();
