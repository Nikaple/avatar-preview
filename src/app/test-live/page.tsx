'use client';

import JSON5 from '@/utils/json5';
import { useCallback, useEffect, useState } from 'react';
import { DailyRewards } from '@/components/exportable';

export default function TestLivePage() {
    const [w, setW] = useState('500');
    const [h, setH] = useState('644');
    const [scale, setScale] = useState('2');
    const [debug, setDebug] = useState(false);

    const [layers, setLayers] = useState(`[
  {
    type: 'component',
    name: 'DailyRewards',
    position: [0, 0],
    scale: 2,
    props: {
      title: 'Rewards for today',
      items: [
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' },
        { name: 'Item name', color: '#10DCA9' }
      ]
    }
  }
]`);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePreview = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPreviewImage(null);

        try {
            // 解析 layers 并注入组件的 width/height
            const parsedLayers = JSON5.parse(layers);
            const updatedLayers = parsedLayers.map((layer: any) => {
                if (layer.type === 'component') {
                    return {
                        width: parseInt(w),
                        height: parseInt(h),
                        ...layer,
                    };
                }
                return layer;
            });

            // 画布大小等于组件大小
            const params = new URLSearchParams();
            params.append('w', w);
            params.append('h', h);
            params.append('layers', JSON.stringify(updatedLayers));
            if (scale) params.append('scale', scale);
            if (debug) params.append('debug', 'true');

            const response = await fetch(`/api/merge?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setPreviewImage(imageUrl);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [w, h, layers, scale, debug]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (w && h && layers) {
                try {
                    JSON5.parse(layers);
                    generatePreview();
                } catch (error) {
                    setError('Invalid JSON format.');
                }
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [w, h, layers, scale, debug, generatePreview]);

    // 解析 layers 获取组件 props
    const componentProps = (() => {
        try {
            const parsedLayers = JSON5.parse(layers);
            const componentLayer = parsedLayers.find(
                (layer: any) => layer.type === 'component',
            );
            return componentLayer?.props || {};
        } catch {
            return {};
        }
    })();

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#f9fafb',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            {/* Header */}
            <header
                style={{
                    padding: '16px 32px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#fff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                }}
            >
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                    本日奖励组件测试
                </h1>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>宽度:</label>
                        <input
                            type="number"
                            value={w}
                            onChange={(e) => setW(e.target.value)}
                            style={{
                                width: '70px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>高度:</label>
                        <input
                            type="number"
                            value={h}
                            onChange={(e) => setH(e.target.value)}
                            style={{
                                width: '70px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
                            精度:
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                            style={{
                                width: '60px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={debug}
                            onChange={(e) => setDebug(e.target.checked)}
                            style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ color: '#6b7280' }}>Debug</span>
                    </label>
                </div>
            </header>

            <main style={{ padding: '32px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '400px 1fr 600px',
                        gap: '1px',
                        backgroundColor: '#e5e7eb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}
                >
                    {/* 左侧：配置 */}
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: '#fff',
                            overflowY: 'auto',
                            maxHeight: '800px',
                        }}
                    >
                        <h3
                            style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                marginTop: 0,
                                marginBottom: '20px',
                            }}
                        >
                            图层配置 (JSON5)
                        </h3>
                        <textarea
                            rows={30}
                            value={layers}
                            onChange={(e) => setLayers(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontFamily: 'Monaco, Consolas, monospace',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    {/* 中间：预览 */}
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: '#f9fafb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                minHeight: '400px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            {isLoading && <p style={{ color: '#9ca3af' }}>加载中...</p>}
                            {error && (
                                <div
                                    style={{
                                        padding: '16px',
                                        backgroundColor: '#fef2f2',
                                        color: '#dc2626',
                                        borderRadius: '6px',
                                        maxWidth: '90%',
                                    }}
                                >
                                    <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>
                                        错误:
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            wordBreak: 'break-all',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {error}
                                    </p>
                                </div>
                            )}
                            {previewImage && !error && (
                                <img
                                    src={previewImage}
                                    alt="Component Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            )}
                            {!isLoading && !error && !previewImage && (
                                <p style={{ color: '#d1d5db' }}>预览将显示在这里</p>
                            )}
                        </div>
                    </div>

                    {/* 右侧：React 组件预览 */}
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: '#f9fafb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                minHeight: '700px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px',
                            }}
                        >
                            <div>
                                <DailyRewards
                                    title={componentProps.title || 'Rewards for today'}
                                    items={
                                        componentProps.items || [
                                            { name: 'Item name', color: '#10DCA9' },
                                            { name: 'Item name', color: '#10DCA9' },
                                            { name: 'Item name', color: '#10DCA9' },
                                            { name: 'Item name', color: '#10DCA9' },
                                        ]
                                    }
                                    backgroundColor={componentProps.backgroundColor}
                                    cardBackgroundColor={componentProps.cardBackgroundColor}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
