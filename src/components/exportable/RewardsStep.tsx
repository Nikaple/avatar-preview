import React from 'react';

export interface RewardsStepItem {
  /** 充值金额 */
  amount: string;
  /** 奖励名称 */
  name: string;
  /** 奖励颜色 */
  color?: string;
}

export interface RewardsStepProps {
  /** 奖励项目列表 */
  items?: RewardsStepItem[];
  /** 背景颜色 */
  backgroundColor?: string;
  /** 卡片背景颜色 */
  cardBackgroundColor?: string;
  /** 进度线颜色 */
  progressLineColor?: string;
  /** 进度点颜色 */
  progressDotColor?: string;
  /** 进度点边框颜色 */
  progressDotBorderColor?: string;
}

/**
 * 累充活动组件
 * 用于展示累计充值活动的奖励阶梯
 */
export default function RewardsStep({
  items = [
    { amount: '60UC', name: 'Item', color: '#10DCA9' },
    { amount: '300UC', name: 'Item', color: '#10DCA9' },
    { amount: '600UC', name: 'Item', color: '#10DCA9' },
    { amount: '1500UC', name: 'Item', color: '#10DCA9' },
    { amount: '3000UC', name: 'Item', color: '#10DCA9' },
    { amount: '6000UC', name: 'Item', color: '#10DCA9' },
    { amount: '12000UC', name: 'Item', color: '#10DCA9' },
  ],
  backgroundColor = '#313131',
  cardBackgroundColor = '#515151',
  progressLineColor = '#5C5C5C',
  progressDotColor = '#5C5C5C',
  progressDotBorderColor = '#838383',
}: RewardsStepProps) {
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

      {/* 奖励卡片列表 */}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            flex: '1 1 0',
            padding: '8px 12px 12px 12px',
            backgroundColor: cardBackgroundColor,
            borderRadius: 12,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* 进度点 */}
          <div
            style={{
              width: 12,
              height: 12,
              left: 'calc(50% - 6px)',
              top: -69,
              position: 'absolute',
              backgroundColor: progressDotColor,
              border: `2px solid ${progressDotBorderColor}`,
              borderRadius: '50%',
            }}
          />

          {/* 充值金额 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -47,
              transform: 'translateX(-50%)',
              textAlign: 'center',
              color: 'white',
              fontSize: 24,
              fontFamily: 'DIN Pro',
              fontWeight: '700',
              lineHeight: '24px',
              wordBreak: 'break-word',
              whiteSpace: 'nowrap',
            }}
          >
            {item.amount}
          </div>

          {/* 奖励图标/颜色块 */}
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

          {/* 奖励名称 */}
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
            }}
          >
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
}
