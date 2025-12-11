import React from 'react';

export interface LiveBadgeProps {
  /** 直播状态文字 */
  text?: string;
  /** 观看人数 */
  viewers?: number;
  /** 徽章颜色 */
  color?: string;
  /** 是否显示动画效果 */
  animated?: boolean;
}

/**
 * 直播徽章组件
 * 用于显示直播状态和观看人数
 */
export default function LiveBadge({
  text = 'LIVE',
  viewers,
  color = '#FF4458',
  animated = true,
}: LiveBadgeProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* LIVE 标签 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: color,
          borderRadius: 12,
          position: 'relative',
        }}
      >
        {/* 动画圆点 */}
        {animated && (
          <div
            style={{
              width: 6,
              height: 6,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
          />
        )}

        {/* LIVE 文字 */}
        <div
          style={{
            color: 'white',
            fontSize: 14,
            fontFamily: 'DIN Pro',
            fontWeight: '700',
            letterSpacing: '0.5px',
          }}
        >
          {text}
        </div>
      </div>

      {/* 观看人数 */}
      {viewers !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'white',
            fontSize: 14,
            fontFamily: 'DIN Pro',
            fontWeight: '500',
          }}
        >
          <span style={{ fontSize: 16 }}>👁️</span>
          <span>{formatViewers(viewers)}</span>
        </div>
      )}
    </div>
  );
}

/**
 * 格式化观看人数
 */
function formatViewers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
