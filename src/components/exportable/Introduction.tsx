import React from 'react';

export interface IntroductionItem {
  /** 业务名称 */
  name: string;
  /** 序号 */
  number: string;
  /** 图标颜色 */
  color?: string;
}

export interface IntroductionProps {
  /** 业务项目列表 */
  items?: IntroductionItem[];
  /** 背景颜色 */
  backgroundColor?: string;
  /** 卡片背景颜色 */
  cardBackgroundColor?: string;
  /** 进度线颜色 */
  progressLineColor?: string;
}

/**
 * 多业务介绍组件
 * 用于展示多个业务的介绍信息
 */
export default function Introduction({
  items = [
    { name: 'PUBG\nMOBILE', number: '1', color: '#10DCA9' },
    { name: 'Honor of\nKings', number: '2', color: '#10DCA9' },
    { name: 'Delta\nForce', number: '3', color: '#10DCA9' },
    { name: 'Age of Empires MOBILE', number: '4', color: '#10DCA9' },
    { name: 'Whiteout Survival', number: '5', color: '#10DCA9' },
  ],
  backgroundColor = '#313131',
  cardBackgroundColor = '#515151',
  progressLineColor = '#5C5C5C',
}: IntroductionProps) {
  return (
    <div
      style={{
        width: 810,
        padding: '24px',
        position: 'relative',
        backgroundColor,
        borderRadius: 12,
        border: '1px solid white',
        alignItems: 'flex-start',
        gap: 16,
        display: 'flex',
      }}
    >
      {/* 进度线 */}
      <div
        style={{
          width: 750,
          height: 4,
          left: 30,
          top: 29,
          position: 'absolute',
          backgroundColor: progressLineColor,
          borderRadius: 2,
        }}
      />

      {/* 业务卡片列表 */}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            flex: '1 1 0',
            alignSelf: 'stretch',
            padding: '12px 12px 24px 12px',
            backgroundColor: cardBackgroundColor,
            borderRadius: 12,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* 业务图标/颜色块 */}
          <div
            style={{
              width: 80,
              height: 80,
              opacity: 0.8,
              backgroundColor: item.color || '#10DCA9',
              borderRadius: 8,
              flexShrink: 0,
            }}
          />

          {/* 业务名称 */}
          <div
            style={{
              alignSelf: 'stretch',
              textAlign: 'center',
              color: 'white',
              fontSize: 20,
              fontFamily: 'DINPro',
              fontWeight: '400',
              lineHeight: '24px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
            }}
          >
            {item.name}
          </div>

          {/* 序号圆圈 */}
          <div
            style={{
              width: 56.57,
              height: 56.57,
              left: 'calc(50% - 28.285px)',
              top: -3.28,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 使用 SVG 绘制圆圈 */}
            <svg
              width="56.57"
              height="56.57"
              viewBox="0 0 57 57"
              style={{ position: 'absolute' }}
            >
              <circle
                cx="28.285"
                cy="28.285"
                r="26.285"
                fill="white"
                stroke="none"
              />
            </svg>
            <div
              style={{
                position: 'relative',
                textAlign: 'center',
                color: '#313131',
                fontSize: 30,
                fontFamily: 'PingFang HK',
                fontWeight: '600',
                lineHeight: '28.33px',
                wordBreak: 'break-word',
              }}
            >
              {item.number}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
