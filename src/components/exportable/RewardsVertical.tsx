import React from 'react';

export interface RewardsVerticalItem {
    /** 奖励名称 */
    name: string;
    /** 奖励数量 */
    quantity: string;
    /** 奖励颜色 */
    color?: string;
}

export interface RewardsVerticalProps {
    /** 标题文字 */
    title?: string;
    /** 奖励项目列表 */
    items?: RewardsVerticalItem[];
    /** 背景颜色 */
    backgroundColor?: string;
    /** 卡片背景颜色 */
    cardBackgroundColor?: string;
}

/**
 * 本日奖励组件-2宫格
 * 用于展示每日奖励物品（纵向排列，带数量）
 */
export default function RewardsVertical({
    title = 'Rewards for Today',
    items = [
        { name: '60 UC', quantity: 'X15', color: '#10DCA9' },
        { name: '1000 VIP Points', quantity: 'X5', color: '#10DCA9' },
    ],
    backgroundColor = '#313131',
    cardBackgroundColor = '#515151',
}: RewardsVerticalProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ffffff',
                borderRadius: 12,
                background: backgroundColor,
                padding: '20px 12px',
                color: '#ffffff',
                fontFamily: 'DIN Pro',
                fontSize: 24,
                fontWeight: '700',
            }}
        >
            {/* 标题 */}
            <p
                style={{
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: 4,
                }}
            >
                {title}
            </p>

            {/* 奖励列表容器 - 使用 flexWrap 自动换行 */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 11,
                    width: '100%',
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 12,
                            background: cardBackgroundColor,
                            padding: '11px 16px',
                            width: 220,
                        }}
                    >
                        {/* 左侧：图标和名称 */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 4,
                            }}
                        >
                            {/* 图标 */}
                            <div
                                style={{
                                    opacity: 0.8,
                                    borderRadius: 8,
                                    background: item.color || '#10DCA9',
                                    width: 80,
                                    height: 80,
                                    flexShrink: 0,
                                }}
                            />
                            {/* 名称 */}
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: '700',
                                    lineHeight: '21px',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                {item.name}
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 48,
                                    fontWeight: '700',
                                    letterSpacing: '-0.48px',
                                    lineHeight: '48px',
                                }}
                            >
                                {item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
