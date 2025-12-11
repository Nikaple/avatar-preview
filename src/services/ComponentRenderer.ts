import satori from 'satori';
import sharp from 'sharp';
import { ComponentRegistry } from './ComponentRegistry';
import { FontManager } from './FontManager';
import { SatoriFont } from '@/types/component';
import React from 'react';

/**
 * 组件渲染选项
 */
export interface RenderOptions {
  /** 组件宽度 */
  width?: number;
  /** 组件高度 */
  height?: number;
  /** 缩放比例 */
  scale?: number;
}

/**
 * React 组件渲染器
 * 使用 Satori 将 React 组件渲染为 PNG 图片
 */
export class ComponentRenderer {
  private registry: ComponentRegistry;
  private fontManager: FontManager;
  private fontsCache: SatoriFont[] | null = null;

  constructor() {
    this.registry = ComponentRegistry.getInstance();
    this.fontManager = FontManager.getInstance();
  }

  /**
   * 渲染组件为 PNG Buffer
   * @param componentName 组件名称
   * @param props 组件 props
   * @param options 渲染选项
   * @returns PNG 图片 Buffer
   */
  public async render(
    componentName: string,
    props: Record<string, any>,
    options: RenderOptions = {},
  ): Promise<Buffer> {
    const startTime = Date.now();

    // 1. 获取组件配置
    const componentConfig = this.registry.get(componentName);
    if (!componentConfig) {
      throw new Error(
        `Component "${componentName}" not found in registry. Available components: ${this.registry
          .list()
          .map((c) => c.name)
          .join(', ')}`,
      );
    }

    // 2. 合并 props（默认 props + 用户 props）
    const mergedProps = {
      ...componentConfig.defaultProps,
      ...props,
    };

    // 3. 确定尺寸
    const width = options.width || componentConfig.defaultWidth || 300;
    const height = options.height || componentConfig.defaultHeight || 200;
    const scale = options.scale !== undefined ? options.scale : 1;

    console.log(`[ComponentRenderer] Rendering ${componentName} with width=${width}, height=${height}, scale=${scale}`);

    // 4. 加载字体
    const fonts = await this.loadFonts();

    // 5. 创建 React 元素
    const componentElement = React.createElement(
      componentConfig.component,
      mergedProps,
    );

    // 6. 如果 scale !== 1，用 div 容器包裹并应用 CSS transform scale
    // 注意：容器不设置固定尺寸，让它自适应内容，避免灰色背景
    const element =
      scale !== 1
        ? React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              },
            },
            componentElement,
          )
        : componentElement;

    // 计算实际渲染尺寸（容器尺寸需要考虑缩放）
    const renderWidth = Math.round(width * scale);
    const renderHeight = Math.round(height * scale);

    console.log(`[ComponentRenderer] Satori container size: ${renderWidth}x${renderHeight}`);

    try {
      // 7. 使用 Satori 渲染为 SVG（使用缩放后的尺寸作为容器）
      const svg = await satori(element, {
        width: renderWidth,
        height: renderHeight,
        fonts,
      });

      // 8. 将 SVG 转换为 PNG
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

      const renderTime = Date.now() - startTime;
      console.log(
        `[ComponentRenderer] Rendered "${componentName}" in ${renderTime}ms (scale: ${scale}, output: ${renderWidth}x${renderHeight})`,
      );

      return pngBuffer;
    } catch (error) {
      console.error(
        `[ComponentRenderer] Failed to render component "${componentName}":`,
        error,
      );
      throw new Error(
        `Failed to render component "${componentName}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * 加载字体（从 FontManager 自动加载所有注册的字体）
   * @returns Satori 字体配置数组
   */
  private async loadFonts(): Promise<SatoriFont[]> {
    // 使用缓存避免重复加载
    if (this.fontsCache) {
      return this.fontsCache;
    }

    try {
      // 从 FontManager 获取所有注册的字体
      const allFonts = this.fontManager.getAllFonts();
      const fonts: SatoriFont[] = [];

      // 加载每个字体
      for (const fontConfig of allFonts) {
        try {
          const arrayBuffer = await this.fontManager.getFontArrayBuffer(
            fontConfig.path,
          );

          // 确保 weight 是有效的字体粗细值
          let weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 = 400;
          if (typeof fontConfig.weight === 'number') {
            const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
            weight = validWeights.includes(fontConfig.weight)
              ? (fontConfig.weight as any)
              : 400;
          }

          // 确保 style 是有效的字体样式值（Satori 只支持 normal 和 italic）
          const style: 'normal' | 'italic' =
            fontConfig.style === 'italic' ? 'italic' : 'normal';

          fonts.push({
            name: fontConfig.name,
            data: arrayBuffer,
            weight,
            style,
          });
        } catch (error) {
          console.warn(
            `[ComponentRenderer] Failed to load font "${fontConfig.name}":`,
            error,
          );
        }
      }

      // 如果没有加载到任何字体，使用系统默认字体
      if (fonts.length === 0) {
        console.warn(
          '[ComponentRenderer] No fonts loaded, Satori will use fallback fonts',
        );
      }

      this.fontsCache = fonts;
      return fonts;
    } catch (error) {
      console.error('[ComponentRenderer] Failed to load fonts:', error);
      return [];
    }
  }

  /**
   * 清除字体缓存（主要用于测试）
   */
  public clearFontCache(): void {
    this.fontsCache = null;
  }
}
