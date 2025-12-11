'use client';

import JSON5 from '@/utils/json5';
import { useCallback, useEffect, useState } from 'react';

// 组件1：本日奖励组件（2倍图尺寸）
const Component1Config = {
    name: '本日奖励组件',
    initialTexts: `[
  {
    text: "Rewards for today",
    position: [500, 50],
    fontSize: 96,
    color: "#FFFFFF",
    fontFamily: "DIN Pro",
    fontWeight: "bold",
    textAlign: "center"
  },
  {
    text: "Item name",
    position: [260, 570],
    fontSize: 64,
    color: "#FFFFFF",
    fontFamily: "DIN Pro",
    fontWeight: "bold",
    textAlign: "center"
  },
  {
    text: "Item name",
    position: [740, 570],
    fontSize: 64,
    color: "#FFFFFF",
    fontFamily: "DIN Pro",
    fontWeight: "bold",
    textAlign: "center"
  },
  {
    text: "Item name",
    position: [260, 1100],
    fontSize: 64,
    color: "#FFFFFF",
    fontFamily: "DIN Pro",
    fontWeight: "bold",
    textAlign: "center"
  },
  {
    text: "Item name",
    position: [740, 1100],
    fontSize: 64,
    color: "#FFFFFF",
    fontFamily: "DIN Pro",
    fontWeight: "bold",
    textAlign: "center"
  }
]`,
    initialImages: `[
  {
    url: 'https://pagedoo.pay.qq.com/material/@platform/ab9d1305f7899a2f45f51fdb856f455f.png',
    position: [0, 0],
    width: 1000,
  }
]`,
    defaultWidth: '1000',
    defaultHeight: '1286'
};

// 组件预览器
function ComponentPreview({
    componentConfig,
    w,
    h,
    images,
    texts,
    size,
    debug,
    onImagesChange,
    onTextsChange
}: {
    componentConfig: typeof Component1Config;
    w: string;
    h: string;
    images: string;
    texts: string;
    size: string;
    debug: boolean;
    onImagesChange: (value: string) => void;
    onTextsChange: (value: string) => void;
}) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePreview = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPreviewImage(null);

        try {
            const params = new URLSearchParams();
            params.append('w', w);
            params.append('h', h);
            params.append('images', images);
            params.append('texts', texts);
            if (size) params.append('size', size);
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
    }, [w, h, images, texts, size, debug]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (w && h && images && texts) {
                try {
                    JSON5.parse(images);
                    JSON5.parse(texts);
                    generatePreview();
                } catch (error) {
                    setError('Invalid JSON format.');
                }
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [w, h, images, texts, size, debug, generatePreview]);

    // 解析文本配置用于 React 组件预览
    const parsedTexts = (() => {
        try {
            return JSON5.parse(texts);
        } catch {
            return [];
        }
    })();

    const titleText = parsedTexts[0]?.text || 'Rewards for today';
    const itemTexts = parsedTexts.slice(1, 5).map((t: any) => t?.text || 'Item name');

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr 600px',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            {/* 左侧：配置 */}
            <div style={{
                padding: '24px',
                backgroundColor: '#fff',
                overflowY: 'auto',
                maxHeight: '800px'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
                    组件配置
                </h3>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                        背景图片 (JSON5)
                    </label>
                    <textarea
                        rows={6}
                        value={images}
                        onChange={(e) => onImagesChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontFamily: 'Monaco, Consolas, monospace',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                        文字配置 (JSON5)
                    </label>
                    <textarea
                        rows={20}
                        value={texts}
                        onChange={(e) => onTextsChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontFamily: 'Monaco, Consolas, monospace',
                            resize: 'vertical'
                        }}
                    />
                </div>
            </div>

            {/* 中间：预览 */}
            <div style={{
                padding: '24px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '100%',
                    minHeight: '400px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    {isLoading && (
                        <p style={{ color: '#9ca3af' }}>加载中...</p>
                    )}
                    {error && (
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            borderRadius: '6px',
                            maxWidth: '90%'
                        }}>
                            <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>错误:</p>
                            <p style={{ margin: 0, wordBreak: 'break-all', fontSize: '14px' }}>{error}</p>
                        </div>
                    )}
                    {previewImage && !error && (
                        <img
                            src={previewImage}
                            alt="Component Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    {!isLoading && !error && !previewImage && (
                        <p style={{ color: '#d1d5db' }}>预览将显示在这里</p>
                    )}
                </div>
            </div>

            {/* 右侧：React 组件 */}
            <div style={{
                padding: '24px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '100%',
                    minHeight: '700px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px'
                }}>
                    <div style={{ transform: 'scale(1.6)', transformOrigin: 'center' }}>
                        <div style={{
                            width: "250px",
                            height: "321.70px",
                            paddingTop: "12px",
                            paddingBottom: "16px",
                            paddingLeft: "8px",
                            paddingRight: "8px",
                            background: "#313131",
                            borderRadius: "12px",
                            outline: "1px white solid",
                            outlineOffset: "-1px",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "12px",
                            display: "flex"
                        }}>
                            <div style={{
                                width: "235.88px",
                                height: "27.70px",
                                textAlign: "center",
                                color: "white",
                                fontSize: "24px",
                                fontFamily: "DIN Pro",
                                fontWeight: "700",
                                wordWrap: "break-word"
                            }}>
                                {titleText}
                            </div>
                            <div style={{
                                width: "230.52px",
                                height: "254px",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                display: "flex",
                                flexWrap: "wrap",
                                alignContent: "center"
                            }}>
                                {[0, 1, 2, 3].map((index) => (
                                    <div key={index} style={{
                                        width: "110.79px",
                                        height: "121px",
                                        paddingTop: "12px",
                                        paddingBottom: "4px",
                                        paddingLeft: "6px",
                                        paddingRight: "6px",
                                        background: "#515151",
                                        borderRadius: "12.51px",
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: "4px",
                                        display: "flex"
                                    }}>
                                        <div style={{
                                            width: "80px",
                                            height: "80px",
                                            opacity: "0.80",
                                            background: "#10DCA9",
                                            borderRadius: "8px"
                                        }}></div>
                                        <div style={{
                                            alignSelf: "stretch",
                                            textAlign: "center",
                                            color: "white",
                                            fontSize: "16px",
                                            fontFamily: "DIN Pro",
                                            fontWeight: "700",
                                            wordWrap: "break-word"
                                        }}>
                                            {itemTexts[index] || 'Item name'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TestLivePage() {
    // 通用配置
    const [w, setW] = useState(Component1Config.defaultWidth);
    const [h, setH] = useState(Component1Config.defaultHeight);
    const [size, setSize] = useState('0.5');
    const [debug, setDebug] = useState(false);

    // 组件1配置
    const [component1Images, setComponent1Images] = useState(Component1Config.initialImages);
    const [component1Texts, setComponent1Texts] = useState(Component1Config.initialTexts);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header with inline config */}
            <header style={{
                padding: '16px 32px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px'
            }}>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>直播组件测试</h1>

                {/* 通用配置 - 内联表单 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>w:</label>
                        <input
                            type="number"
                            value={w}
                            onChange={(e) => setW(e.target.value)}
                            style={{
                                width: '70px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>h:</label>
                        <input
                            type="number"
                            value={h}
                            onChange={(e) => setH(e.target.value)}
                            style={{
                                width: '70px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>size:</label>
                        <input
                            type="number"
                            step="0.1"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            style={{
                                width: '60px',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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

                {/* 组件1：本日奖励组件 */}
                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginTop: 0,
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #e5e7eb'
                    }}>
                        {Component1Config.name}
                    </h2>

                    <ComponentPreview
                        componentConfig={Component1Config}
                        w={w}
                        h={h}
                        images={component1Images}
                        texts={component1Texts}
                        size={size}
                        debug={debug}
                        onImagesChange={setComponent1Images}
                        onTextsChange={setComponent1Texts}
                    />
                </section>

                {/* 未来可以在这里添加更多组件 */}
                {/* 
        <section style={{ marginBottom: '32px' }}>
          <h2>组件2</h2>
          <ComponentPreview ... />
        </section>
        */}
            </main>
        </div>
    );
}
