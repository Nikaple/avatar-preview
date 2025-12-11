import React from 'react';

export interface RewardsCardProps {
  title: string;
  items: Array<{
    name: string;
    icon?: string;
  }>;
  backgroundColor?: string;
}

export default function RewardsCard({
  title,
  items,
  backgroundColor = '#313131',
}: RewardsCardProps) {
  return (
    <div
      style={{
        width: 250,
        height: 321.7,
        paddingTop: 12,
        paddingBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
        background: backgroundColor,
        borderRadius: 12,
        outline: '1px white solid',
        outlineOffset: '-1px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        display: 'flex',
      }}
    >
      <div
        style={{
          width: 235.88,
          height: 27.7,
          textAlign: 'center',
          color: 'white',
          fontSize: 24,
          fontFamily: 'DIN Pro',
          fontWeight: '700',
          wordWrap: 'break-word',
        }}
      >
        {title}
      </div>
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
        {items.slice(0, 4).map((item, index) => (
          <div
            key={index}
            style={{
              width: 110.79,
              height: 121,
              paddingTop: 12,
              paddingBottom: 4,
              paddingLeft: 6,
              paddingRight: 6,
              background: '#515151',
              borderRadius: 12.51,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 4,
              display: 'flex',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                opacity: 0.8,
                background: '#10DCA9',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
              }}
            >
              {item.icon || '🎁'}
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
                fontFamily: 'DIN Pro',
                fontWeight: '700',
                wordWrap: 'break-word',
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
