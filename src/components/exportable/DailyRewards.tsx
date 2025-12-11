import React from 'react';

export interface DailyRewardsProps {
    /** 标题文字 */
    title?: string;
    /** 奖励项目列表 */
    items?: Array<{
        name: string;
        color?: string;
    }>;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 卡片背景颜色 */
    cardBackgroundColor?: string;
}

/**
 * 本日奖励组件
 * 用于展示每日奖励物品
 */
export default function DailyRewards({
    title = 'Rewards for today',
    items = [
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
    ],
    backgroundColor = '#313131',
    cardBackgroundColor = '#515151',
}: DailyRewardsProps) {
    return (
        <div
            style={{
                width: 250,
                height: 321.7,
                paddingTop: 12,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
                backgroundColor: backgroundColor,
                borderRadius: 12,
                // 用 border 替代 outline（Satori 不支持 outline）
                border: '1px solid white',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
                display: 'flex',
            }}
        >
            {/* 标题 */}
            <div
                style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 24,
                    fontFamily: 'DIN Pro',
                    fontWeight: '700',
                    wordBreak: 'break-word', // 修正：wordWrap -> wordBreak
                }}
            >
                {title}
            </div>

            {/* 奖励物品网格 */}
            <div
                style={{
                    width: 230.52,
                    height: 254,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'center',
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            width: 110,
                            height: 120,
                            paddingTop: 12,
                            paddingBottom: 4,
                            paddingLeft: 6,
                            paddingRight: 6,
                            backgroundColor: cardBackgroundColor, // 修正：background -> backgroundColor
                            borderRadius: 12.51,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 4,
                            display: 'flex',
                        }}
                    >
                        {/* 物品图标/颜色块 */}
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                opacity: 0.8,
                                backgroundColor: item.color || '#10DCA9', // 修正：background -> backgroundColor
                                borderRadius: 8,
                            }}
                        />

                        {/* 物品名称 */}
                        <div
                            style={{
                                alignSelf: 'stretch',
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 16,
                                fontFamily: 'DIN Pro',
                                fontWeight: '700',
                                wordBreak: 'break-word', // 修正：wordWrap -> wordBreak
                            }}
                        >
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
