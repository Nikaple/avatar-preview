import React from 'react';

export interface RewardsGridProps {
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
 * 奖励网格组件
 */
export default function RewardsGrid({
    title = 'Rewards for today',
    items = [
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
    ],
    backgroundColor = '#313131',
    cardBackgroundColor = '#515151',
}: RewardsGridProps) {
    return (
        <div
            style={{
                width: 250,
                padding: '12px 8px 16px 8px',
                backgroundColor: backgroundColor,
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

            {/* 奖励物品网格 - 使用 flexWrap 实现每行 2 个 */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            width: 110,
                            padding: '12px 16px 4px',
                            backgroundColor: cardBackgroundColor,
                            borderRadius: 12.51,
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            display: 'flex',
                            flexShrink: 0,
                        }}
                    >
                        {/* 物品图标/颜色块 */}
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

                        {/* 物品名称 */}
                        <div
                            style={{
                                alignSelf: 'stretch',
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 16,
                                fontFamily: 'DIN Pro',
                                fontWeight: '700',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
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
