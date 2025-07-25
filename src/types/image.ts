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

export interface MergeConfig {
  w: number;
  h: number;
  debug?: boolean;
  images: ImageSource[];
  size?: number; // 新增，缩放倍数，默认为1
}
