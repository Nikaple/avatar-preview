import React from 'react';

export interface LiveTitleProps {
  /** 网站地址 */
  website?: string;
  /** 直播名称 */
  liveName?: string;
  /** 网站背景颜色 */
  websiteBackgroundColor?: string;
}

/**
 * 直播标题组件
 * 用于展示直播的网站和名称信息
 */
export default function LiveTitle({
  website = 'www.midasbuy.com',
  liveName = 'Midasbuy Live Name',
  websiteBackgroundColor = '#5A5A5A',
}: LiveTitleProps) {
  return (
    <div
      style={{
        width: 830,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        display: 'flex',
      }}
    >
      {/* 网站地址 */}
      <div
        style={{
          padding: '8px 24px',
          backgroundColor: websiteBackgroundColor,
          borderRadius: 99,
          alignItems: 'center',
          gap: 8,
          display: 'flex',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 32,
            fontFamily: 'DIN Pro',
            fontWeight: '700',
            wordBreak: 'break-word',
          }}
        >
          {website}
        </div>
      </div>

      {/* 直播名称 */}
      <div
        style={{
          alignSelf: 'stretch',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          display: 'flex',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'white',
            fontSize: 48,
            fontFamily: 'DIN Pro',
            fontWeight: '700',
            wordBreak: 'break-word',
          }}
        >
          {liveName}
        </div>
      </div>
    </div>
  );
}
