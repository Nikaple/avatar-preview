import React from 'react';

/**
 * 注册的组件配置
 */
export interface RegisteredComponent {
  /** 组件名称（唯一标识） */
  name: string;

  /** React 组件 */
  component: React.ComponentType<any>;

  /** 组件描述 */
  description?: string;

  /** 默认 props */
  defaultProps?: Record<string, any>;

  /** Props 验证 schema（可选） */
  propsSchema?: any;

  /** 默认宽度 */
  defaultWidth?: number;

  /** 默认高度 */
  defaultHeight?: number;
}

/**
 * Satori 字体配置
 */
export interface SatoriFont {
  name: string;
  data: ArrayBuffer;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style?: 'normal' | 'italic';
}
