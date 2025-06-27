export interface ImageConfig {
    url: string;
    position: [number, number];
    width: number;
    clip?: [number, number, number, number]; // 新增，裁切像素值 [top, right, bottom, left]
}

export interface MergeConfig {
    w: number;
    h: number;
    debug?: boolean;
    images: ImageConfig[];
    size?: number; // 新增，缩放倍数，默认为1
}
