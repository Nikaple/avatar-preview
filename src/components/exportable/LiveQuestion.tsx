import React from 'react';

export interface LiveQuestionOption {
  /** 选项标签 (A, B, C, etc.) */
  label: string;
  /** 选项值 */
  value: string;
}

export interface LiveQuestionProps {
  /** 提示文字 */
  hint?: string;
  /** 问题文本 */
  question?: string;
  /** 选项列表 */
  options?: LiveQuestionOption[];
  /** 背景颜色 */
  backgroundColor?: string;
  /** 提示框背景颜色 */
  hintBackgroundColor?: string;
}

/**
 * 问答组件
 * 用于展示直播问答活动
 */
export default function LiveQuestion({
  hint = 'Leave your answer and PUBG MOBILE player ID',
  question = '"How many benefits can you enjoy by becoming a Midasbuy and PUBG MOBILE joint VIP?"',
  options = [
    { label: 'A', value: '3' },
    { label: 'B', value: '5' },
    { label: 'C', value: '7' },
  ],
  backgroundColor = '#313131',
  hintBackgroundColor = 'white',
}: LiveQuestionProps) {
  return (
    <div
      style={{
        width: 810,
        padding: '2px 56px 24px 56px',
        backgroundColor,
        borderRadius: 12,
        border: '2px solid white',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        display: 'flex',
      }}
    >
      {/* 提示框 */}
      <div
        style={{
          padding: '6px 12px',
          backgroundColor: hintBackgroundColor,
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
          alignItems: 'center',
          gap: 10,
          display: 'flex',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: '400',
            wordBreak: 'break-word',
          }}
        >
          {hint}
        </div>
      </div>

      {/* 问题文本 */}
      <div
        style={{
          alignSelf: 'stretch',
          textAlign: 'center',
          color: 'white',
          fontSize: 36,
          fontFamily: 'DIN Pro',
          fontWeight: '700',
          wordBreak: 'break-word',
        }}
      >
        {question}
      </div>

      {/* 选项列表 */}
      <div
        style={{
          alignItems: 'center',
          gap: 64,
          display: 'flex',
        }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              alignItems: 'center',
              gap: 5,
              display: 'flex',
            }}
          >
            {/* 选项标签圆圈 */}
            <div
              style={{
                width: 56.57,
                height: 56.57,
                position: 'relative',
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
                {option.label}
              </div>
            </div>

            {/* 选项值 */}
            <div
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 40,
                fontFamily: 'DIN Pro',
                fontWeight: '700',
                wordBreak: 'break-word',
              }}
            >
              {option.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
