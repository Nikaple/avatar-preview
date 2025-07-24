import { BlendMode } from './blend';

export interface ImageOptions {
  url: string;
  position?: [number, number];
  clip?: [number, number, number, number];
  width?: number;
  height?: number;
  blend?: BlendMode;
}


export interface MergeConfig {
    w: number;
    h: number;
    debug?: boolean;
    images: ImageConfig[];
    size?: number; // 新增，缩放倍数，默认为1
}
