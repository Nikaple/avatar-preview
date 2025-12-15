import { BlendMode } from './blend';

// ============================================
// 基础图层接口
// ============================================

interface BaseLayer {
  /** 图层类型 */
  type?: 'image' | 'text' | 'component';

  /** 图层位置 [x, y] */
  position: [number, number];

  /** 混合模式（可选） */
  blend?: BlendMode;
}

// ============================================
// 图片图层
// ============================================

export interface IImage extends BaseLayer {
  type?: 'image'; // 默认值，可省略

  /** The URL of the image to be processed. */
  url: string;

  /** The desired width to resize the image to before compositing. */
  width: number;

  /** The desired height to resize the image to. Aspect ratio is maintained based on width. */
  height?: number;

  /** An array defining the pixels to clip from the [top, right, bottom, left] edges. */
  clip?: [number, number, number, number];

  /** The percentage (0-1) of a single color that must be exceeded to trigger removal. */
  chromaThreshold?: number;

  /** The tolerance (0-1) for color matching. Higher values remove a wider range of shades. */
  chromaTolerance?: number;
}

// ============================================
// 文字图层
// ============================================

export interface IText extends BaseLayer {
  type: 'text';

  /** The text content to render. */
  text: string;

  /** Font size in pixels. */
  fontSize: number;

  /** Font color in hex format (e.g., '#000000') or CSS color name. */
  color?: string;

  /** Font family name. */
  fontFamily?: string;

  /** Font weight (normal, bold, 100-900). */
  fontWeight?: string | number;

  /** Font style (normal, italic, oblique). */
  fontStyle?: string;

  /** Shorthand for fontWeight: 'bold'. */
  bold?: boolean;

  /** Shorthand for fontStyle: 'italic'. */
  italic?: boolean;

  /** Text decoration (none, underline, line-through). */
  textDecoration?: string;

  /** Text alignment (left, center, right). */
  textAlign?: string;

  /** Maximum width for text wrapping. */
  maxWidth?: number;

  /** Line height multiplier. */
  lineHeight?: number;

  /** Text stroke color. */
  strokeColor?: string;

  /** Text stroke width. */
  strokeWidth?: number;
}

// ============================================
// 组件图层
// ============================================

export interface IComponent extends BaseLayer {
  type: 'component';

  /** 组件名称（必须在注册表中预定义） */
  name: string;

  /** 组件 props */
  props: Record<string, any>;

  /** 组件宽度（可选） */
  width?: number;

  /** 组件高度（可选） */
  height?: number;

  /** 缩放比例（可选，默认 1） */
  scale?: number;
}

// ============================================
// 联合类型
// ============================================

export type Layer = IImage | IText | IComponent;

// ============================================
// 背景配置
// ============================================

export type BackgroundConfig =
  | { type: 'solid'; color: string } // 纯色背景
  | { type: 'gradient'; gradient: string } // CSS 渐变
  | { type: 'checkerboard'; size?: number; color1?: string; color2?: string } // 棋盘格
  | { type: 'image'; url: string; fit?: 'cover' | 'contain' | 'fill' }; // 自定义图片

// ============================================
// 合并配置
// ============================================

export interface MergeConfig {
  /** 画布宽度 */
  w: number;

  /** 画布高度 */
  h: number;

  /** 图层数组（推荐使用，语义清晰） */
  layers?: Layer[];

  /** 图层数组（向前兼容，功能与 layers 相同） */
  images?: Layer[];

  /** 输出缩放比例 */
  size?: number;

  /** 调试模式 */
  debug?: boolean;

  /** 背景配置 */
  background?: BackgroundConfig;
}

// ============================================
// 向前兼容的类型别名（已废弃，但保留以避免破坏现有代码）
// ============================================

/** @deprecated 使用 IImage 代替 */
export type ImageSource = IImage;

/** @deprecated 使用 IText 代替 */
export type TextSource = IText;
