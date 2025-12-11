'use client';

import JSON5 from '@/utils/json5';
import { useCallback, useEffect, useState } from 'react';
import {
    RewardsGrid,
    RewardsVertical,
    RewardsStep,
    LiveQuestion,
    LiveQuestionReward,
    LiveTitle,
    Introduction,
} from '@/components/exportable';

// 统一画布尺寸
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

// 组件测试配置表
const COMPONENT_TESTS = [
    {
        name: 'RewardsGrid',
        component: RewardsGrid,
        defaultLayers: [
            {
                type: 'component',
                name: 'RewardsGrid',
                position: [0, 0],
                width: 250,
                height: 321.7,
                scale: 1,
                props: {
                    title: 'Rewards for today',
                    items: [
                        { name: 'Item name', color: '#10DCA9' },
                        { name: 'Item name', color: '#10DCA9' },
                        { name: 'Item name', color: '#10DCA9' },
                        { name: 'Item name', color: '#10DCA9' },
                    ],
                },
            },
        ],
    },
    {
        name: 'RewardsVertical',
        component: RewardsVertical,
        defaultLayers: [
            {
                type: 'component',
                name: 'RewardsVertical',
                position: [0, 0],
                width: 234,
                height: 254,
                scale: 1,
                props: {
                    title: 'Rewards for Today',
                    items: [
                        { name: '60 UC', quantity: 'X15', color: '#10DCA9' },
                        { name: '1000 VIP Points', quantity: 'X5', color: '#10DCA9' },
                    ],
                },
            },
        ],
    },
    {
        name: 'RewardsStep',
        component: RewardsStep,
        defaultLayers: [
            {
                type: 'component',
                name: 'RewardsStep',
                position: [0, 0],
                width: 250,
                height: 200,
                scale: 1,
                props: {
                    title: 'Cumulative Recharge',
                    steps: [
                        { amount: '100', reward: 'Gift 1', color: '#10DCA9', achieved: true },
                        { amount: '500', reward: 'Gift 2', color: '#FFD700', achieved: true },
                        { amount: '1000', reward: 'Gift 3', color: '#FF6B6B', achieved: false },
                    ],
                },
            },
        ],
    },
    {
        name: 'LiveQuestion',
        component: LiveQuestion,
        defaultLayers: [
            {
                type: 'component',
                name: 'LiveQuestion',
                position: [0, 0],
                width: 300,
                height: 400,
                scale: 1,
                props: {
                    question: 'What is the capital of France?',
                    options: [
                        { text: 'London', isCorrect: false },
                        { text: 'Paris', isCorrect: true },
                        { text: 'Berlin', isCorrect: false },
                        { text: 'Madrid', isCorrect: false },
                    ],
                    timer: 30,
                },
            },
        ],
    },
    {
        name: 'LiveQuestionReward',
        component: LiveQuestionReward,
        defaultLayers: [
            {
                type: 'component',
                name: 'LiveQuestionReward',
                position: [0, 0],
                width: 200,
                height: 60,
                scale: 1,
                props: {
                    rewardText: 'Reward',
                    rewardValue: '100',
                    iconColor: '#FFD700',
                },
            },
        ],
    },
    {
        name: 'LiveTitle',
        component: LiveTitle,
        defaultLayers: [
            {
                type: 'component',
                name: 'LiveTitle',
                position: [0, 0],
                width: 300,
                height: 80,
                scale: 1,
                props: {
                    title: 'Live Stream Title',
                    subtitle: 'Watch and win rewards!',
                },
            },
        ],
    },
    {
        name: 'Introduction',
        component: Introduction,
        defaultLayers: [
            {
                type: 'component',
                name: 'Introduction',
                position: [0, 0],
                width: 400,
                height: 300,
                scale: 1,
                props: {
                    title: 'Our Services',
                    items: [
                        {
                            icon: '🎮',
                            title: 'Gaming',
                            description: 'Best gaming experience',
                        },
                        {
                            icon: '🎵',
                            title: 'Music',
                            description: 'Stream unlimited music',
                        },
                        {
                            icon: '📺',
                            title: 'Video',
                            description: 'Watch HD videos',
                        },
                    ],
                },
            },
        ],
    },
];

export default function TestLivePage() {
    // 从 localStorage 恢复状态
    const [selectedComponent, setSelectedComponent] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-selected-component');
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });

    const currentTest = COMPONENT_TESTS[selectedComponent];

    const [w, setW] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-width');
            return saved || CANVAS_WIDTH.toString();
        }
        return CANVAS_WIDTH.toString();
    });

    const [h, setH] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-height');
            return saved || CANVAS_HEIGHT.toString();
        }
        return CANVAS_HEIGHT.toString();
    });

    const [scale, setScale] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-scale');
            return saved || '2';
        }
        return '2';
    });

    const [debug, setDebug] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-debug');
            return saved === 'true';
        }
        return false;
    });

    const [layersConfig, setLayersConfig] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-layers-config');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return currentTest.defaultLayers;
                }
            }
        }
        return currentTest.defaultLayers;
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // 用于编辑的 JSON5 文本（独立状态）
    const [layersText, setLayersText] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('test-live-layers-config');
            if (saved) {
                try {
                    return JSON5.stringify(JSON.parse(saved), null, 2);
                } catch {
                    return JSON5.stringify(currentTest.defaultLayers, null, 2);
                }
            }
        }
        return JSON5.stringify(currentTest.defaultLayers, null, 2);
    });

    // 保存状态到 localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-selected-component', selectedComponent.toString());
        }
    }, [selectedComponent]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-width', w);
        }
    }, [w]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-height', h);
        }
    }, [h]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-scale', scale);
        }
    }, [scale]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-debug', debug.toString());
        }
    }, [debug]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('test-live-layers-config', JSON.stringify(layersConfig));
        }
    }, [layersConfig]);

    // 切换组件时更新默认值
    useEffect(() => {
        const test = COMPONENT_TESTS[selectedComponent];
        setLayersConfig(test.defaultLayers);
        setLayersText(JSON5.stringify(test.defaultLayers, null, 2));
    }, [selectedComponent]);

    const generatePreview = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPreviewImage(null);

        try {
            // 直接使用 layersConfig，不注入 w/h
            // w/h 只控制画布大小，组件尺寸由 layer 配置中的 width/height 决定
            const params = new URLSearchParams();
            params.append('w', w);
            params.append('h', h);
            params.append('layers', JSON.stringify(layersConfig));
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
    }, [w, h, layersConfig, scale, debug]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (w && h && layersConfig) {
                try {
                    // 验证 layersConfig 是否有效
                    JSON.stringify(layersConfig);
                    generatePreview();
                } catch (err: any) {
                    setError('Invalid configuration: ' + err.message);
                }
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [w, h, layersConfig, scale, debug, generatePreview]);

    // 获取组件 props（直接从配置对象获取）
    const componentProps = layersConfig[0]?.props || {};

    const handleLayersChange = (text: string) => {
        setLayersText(text);
        try {
            const parsed = JSON5.parse(text);
            setLayersConfig(parsed);
            setError(null);
        } catch (err: any) {
            // 只在用户停止输入后才显示错误
            // 这里不立即设置错误，让 useEffect 中的延迟处理
        }
    };

    const CurrentComponent = currentTest.component as any;

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                        组件测试
                    </h1>
                    <select
                        value={selectedComponent}
                        onChange={(e) => setSelectedComponent(Number(e.target.value))}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        {COMPONENT_TESTS.map((test, index) => (
                            <option key={test.name} value={index}>
                                {test.name}
                            </option>
                        ))}
                    </select>
                </div>

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
                            value={layersText}
                            onChange={(e) => handleLayersChange(e.target.value)}
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
                                <CurrentComponent {...componentProps} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
