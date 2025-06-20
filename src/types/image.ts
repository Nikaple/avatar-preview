export interface ImageConfig {
    url: string;
    position: [number, number];
    width: number;
}

export interface MergeConfig {
    w: number;
    h: number;
    images: ImageConfig[];
    size?: number; // 新增，缩放倍数，默认为1
}
