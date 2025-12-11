import { ImageMerger } from '@/services/ImageMerger';
import { MergeConfig, TextSource } from '@/types/image';
import JSON5 from '@/utils/json5';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isValidTextSource(text: any): text is TextSource {
  return (
    typeof text?.text === 'string' &&
    Array.isArray(text?.position) &&
    text.position.length === 2 &&
    typeof text.position[0] === 'number' &&
    typeof text.position[1] === 'number' &&
    typeof text?.fontSize === 'number'
  );
}

function isValidMergeConfig(config: any): config is MergeConfig {
  if (!config || typeof config !== 'object') return false;

  // 验证基本参数
  if (typeof config.w !== 'number' || typeof config.h !== 'number')
    return false;
  if (!Array.isArray(config.images)) return false;

  // 验证每个图片配置
  const imagesValid = config.images.every(
    (img: any) =>
      typeof img?.url === 'string' &&
      Array.isArray(img?.position) &&
      img.position.length === 2 &&
      typeof img.position[0] === 'number' &&
      typeof img.position[1] === 'number' &&
      typeof img?.width === 'number',
  );

  // 验证文字配置（如果存在）
  const textsValid = !config.texts || (
    Array.isArray(config.texts) &&
    config.texts.every(isValidTextSource)
  );

  return imagesValid && textsValid;
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    // 解析查询参数，images 和 texts 支持 JSON5
    const config: MergeConfig = {
      w: parseInt(searchParams.get('w') || '0'),
      h: parseInt(searchParams.get('h') || '0'),
      images: JSON5.parse(searchParams.get('images') || '[]'),
      texts: (() => {
        const textsParam = searchParams.get('texts');
        if (!textsParam || textsParam.trim() === '') {
          return undefined;
        }
        try {
          return JSON5.parse(textsParam);
        } catch (error) {
          console.error('Failed to parse texts parameter:', error);
          return undefined;
        }
      })(),
      size: searchParams.has('size')
        ? Number(searchParams.get('size'))
        : undefined,
      debug: searchParams.has('debug') ? true : false,
    };

    // 验证配置
    if (!isValidMergeConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 400 },
      );
    }

    // 合并图片
    const merger = new ImageMerger(config);
    const resultBuffer = await merger.merge();
    console.log(`Merge completed in ${Date.now() - startTime}ms`)

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
