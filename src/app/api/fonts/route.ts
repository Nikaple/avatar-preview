import { fontManager } from '@/services/FontManager';
import { NextResponse } from 'next/server';

/**
 * GET /api/fonts
 * 获取所有可用的字体列表
 */
export async function GET() {
  try {
    const fonts = fontManager.getAllFonts();
    
    return NextResponse.json({
      success: true,
      fonts: fonts.map(font => ({
        name: font.name,
        weight: font.weight,
        style: font.style,
        format: font.format,
        aliases: font.aliases,
      })),
      count: fonts.length,
    });
  } catch (error) {
    console.error('Error fetching fonts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fonts',
      },
      { status: 500 }
    );
  }
}
