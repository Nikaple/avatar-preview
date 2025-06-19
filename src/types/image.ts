export interface ImageConfig {
    url: string;
    position: [number, number];
    width: number;
}

export interface MergeConfig {
    w: number;
    h: number;
    images: ImageConfig[];
}
