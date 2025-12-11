import { BlendMode } from './blend';

export interface ImageSource {
  /** The URL of the image to be processed. */
  url: string;
  /** The [x, y] coordinates for the top-left corner of the image when compositing. */
  position: [number, number];
  /** The desired width to resize the image to before compositing. */
  width: number;
  /** An array defining the pixels to clip from the [top, right, bottom, left] edges. */
  clip?: [number, number, number, number];
  /** The desired height to resize the image to. Aspect ratio is maintained based on width. */
  height?: number;
  /** The blend mode to use when compositing the image. */
  blend?: BlendMode;
  /** The percentage (0-1) of a single color that must be exceeded to trigger removal. */
  chromaThreshold?: number;
  /** The tolerance (0-1) for color matching. Higher values remove a wider range of shades. */
  chromaTolerance?: number;
}

export interface TextSource {
  /** The text content to render. */
  text: string;
  /** The [x, y] coordinates for the top-left corner of the text when compositing. */
  position: [number, number];
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
  /** The blend mode to use when compositing the text. */
  blend?: BlendMode;
  /** Text stroke color. */
  strokeColor?: string;
  /** Text stroke width. */
  strokeWidth?: number;
}

export interface MergeConfig {
  w: number;
  h: number;
  debug?: boolean;
  images: ImageSource[];
  texts?: TextSource[];
  size?: number; // 新增，缩放倍数，默认为1
}
