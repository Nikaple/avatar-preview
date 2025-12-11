import React from 'react';

export interface LiveQuestionRewardProps {
  /** 标题文字 */
  title?: string;
  /** 奖励名称 */
  rewardName?: string;
  /** 奖励颜色 */
  rewardColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 卡片背景颜色 */
  cardBackgroundColor?: string;
}

/**
 * 问答奖励组件
 * 用于展示问答活动的奖励内容
 */
export default function LiveQuestionReward({
  title = '5 Fans Each',
  rewardName = '60 UC',
  rewardColor = '#10DCA9',
  backgroundColor = '#313131',
  cardBackgroundColor = '#515151',
}: LiveQuestionRewardProps) {
  return (
    <div
      style={{
        width: 224,
        padding: '12px 12px 16px 12px',
        backgroundColor,
        borderRadius: 12,
        border: '1px solid white',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        display: 'flex',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          alignSelf: 'stretch',
          textAlign: 'center',
          color: 'white',
          fontSize: 24,
          fontFamily: 'DIN Pro',
          fontWeight: '700',
          wordBreak: 'break-word',
        }}
      >
        {title}
      </div>

      {/* 奖励卡片 */}
      <div
        style={{
          alignSelf: 'stretch',
          padding: '12px 12px 8px 12px',
          backgroundColor: cardBackgroundColor,
          borderRadius: 12.51,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          display: 'flex',
        }}
      >
        {/* 奖励图标/颜色块 */}
        <div
          style={{
            alignSelf: 'stretch',
            height: 100,
            opacity: 0.8,
            backgroundColor: rewardColor,
            borderRadius: 8,
          }}
        />

        {/* 奖励名称 */}
        <div
          style={{
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'white',
            fontSize: 24,
            fontFamily: 'DIN Pro',
            fontWeight: '700',
            wordBreak: 'break-word',
          }}
        >
          {rewardName}
        </div>
      </div>
    </div>
  );
}
