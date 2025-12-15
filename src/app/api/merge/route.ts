import { ImageMerger } from '@/services/ImageMerger';
import '@/services/registerComponents'; // 自动注册组件
import { IComponent, IImage, IText, Layer, MergeConfig } from '@/types/image';
import JSON5 from '@/utils/json5';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * 验证图片图层
 */
function isValidImageLayer(layer: any): layer is IImage {
  return (
    typeof layer?.url === 'string' &&
    Array.isArray(layer?.position) &&
    layer.position.length === 2 &&
    typeof layer.position[0] === 'number' &&
    typeof layer.position[1] === 'number' &&
    typeof layer?.width === 'number'
  );
}

/**
 * 验证文字图层
 */
function isValidTextLayer(layer: any): layer is IText {
  return (
    layer?.type === 'text' &&
    typeof layer?.text === 'string' &&
    Array.isArray(layer?.position) &&
    layer.position.length === 2 &&
    typeof layer.position[0] === 'number' &&
    typeof layer.position[1] === 'number' &&
    typeof layer?.fontSize === 'number'
  );
}

/**
 * 验证组件图层
 */
function isValidComponentLayer(layer: any): layer is IComponent {
  return (
    layer?.type === 'component' &&
    typeof layer?.name === 'string' &&
    typeof layer?.props === 'object' &&
    layer?.props !== null &&
    Array.isArray(layer?.position) &&
    layer.position.length === 2 &&
    typeof layer.position[0] === 'number' &&
    typeof layer.position[1] === 'number'
  );
}

/**
 * 验证单个图层
 */
function isValidLayer(layer: any): layer is Layer {
  if (!layer || typeof layer !== 'object') return false;

  // 检查 type 字段
  const type = layer.type;
  if (type && !['image', 'text', 'component'].includes(type)) {
    return false;
  }

  // 根据 type 或字段判断图层类型并验证
  if (type === 'text' || (!type && 'text' in layer)) {
    return isValidTextLayer({ ...layer, type: 'text' });
  }

  if (type === 'component' || (!type && 'name' in layer && 'props' in layer)) {
    return isValidComponentLayer({ ...layer, type: 'component' });
  }

  // 默认为图片类型
  return isValidImageLayer(layer);
}

/**
 * 验证合并配置
 */
function isValidMergeConfig(config: any): config is MergeConfig {
  if (!config || typeof config !== 'object') return false;

  // 验证基本参数
  if (typeof config.w !== 'number' || typeof config.h !== 'number') {
    return false;
  }

  // 至少需要 layers 或 images 之一
  const hasLayers = Array.isArray(config.layers) && config.layers.length > 0;
  const hasImages = Array.isArray(config.images) && config.images.length > 0;

  if (!hasLayers && !hasImages) {
    return false;
  }

  // 验证图层
  const layersToValidate = config.layers || config.images || [];
  return layersToValidate.every(isValidLayer);
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    // 解析查询参数
    const w = parseInt(searchParams.get('w') || '0');
    const h = parseInt(searchParams.get('h') || '0');
    const size = searchParams.has('size')
      ? Number(searchParams.get('size'))
      : undefined;
    const scale = searchParams.has('scale')
      ? Number(searchParams.get('scale'))
      : undefined;
    const debug = searchParams.has('debug');

    // 解析 background 参数（支持 JSON5）
    let background: any = undefined;
    const backgroundParam = searchParams.get('background');
    if (backgroundParam && backgroundParam.trim() !== '') {
      try {
        background = JSON5.parse(backgroundParam);
        console.log(
          '[API] Parsed background:',
          JSON.stringify(background, null, 2),
        );
      } catch (error) {
        console.error('Failed to parse background parameter:', error);
        return NextResponse.json(
          { error: 'Invalid JSON5 format in background parameter' },
          { status: 400 },
        );
      }
    }

    // 解析 layers 或 images 参数（支持 JSON5）
    let layers: Layer[] | undefined;
    let images: Layer[] | undefined;

    const layersParam = searchParams.get('layers');
    const imagesParam = searchParams.get('images');

    try {
      if (layersParam && layersParam.trim() !== '') {
        layers = JSON5.parse(layersParam);
        console.log('[API] Parsed layers:', JSON.stringify(layers, null, 2));

        // 如果有全局 scale 参数，应用到所有没有 scale 的组件图层
        if (scale !== undefined && layers) {
          layers = layers.map((layer) => {
            if (layer.type === 'component' && layer.scale === undefined) {
              console.log(
                `[API] Applying global scale ${scale} to component ${layer.name}`,
              );
              return { ...layer, scale };
            }
            return layer;
          });
        }

        console.log('[API] Final layers:', JSON.stringify(layers, null, 2));
      }
    } catch (error) {
      console.error('Failed to parse layers parameter:', error);
      return NextResponse.json(
        { error: 'Invalid JSON5 format in layers parameter' },
        { status: 400 },
      );
    }

    try {
      if (imagesParam && imagesParam.trim() !== '') {
        images = JSON5.parse(imagesParam);
      }
    } catch (error) {
      console.error('Failed to parse images parameter:', error);
      return NextResponse.json(
        { error: 'Invalid JSON5 format in images parameter' },
        { status: 400 },
      );
    }

    // 构建配置
    const config: MergeConfig = {
      w,
      h,
      layers,
      images,
      size,
      debug,
      background,
    };

    // 验证配置
    if (!isValidMergeConfig(config)) {
      return NextResponse.json(
        {
          error: 'Invalid configuration',
          details:
            'Please provide valid layers or images parameter with correct format',
        },
        { status: 400 },
      );
    }

    // 合并图片
    const merger = new ImageMerger(config);
    const resultBuffer = await merger.merge();
    console.log(`Merge completed in ${Date.now() - startTime}ms`);

    // 返回处理后的图片
    return new NextResponse(resultBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
