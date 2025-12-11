'use client';

import { useState } from 'react';

export default function TestTextPage() {
  const [imageUrl, setImageUrl] = useState('');

  const generateTestImage = () => {
    const config = {
      w: 800,
      h: 600,
      images: [
        {
          url: 'https://placehold.co/800x600/e0e0e0/333333?text=Background',
          position: [0, 0],
          width: 800,
        },
      ],
      texts: [
        {
          text: '文字渲染测试',
          position: [50, 50],
          fontSize: 48,
          color: '#ff0000',
          bold: true,
          fontFamily: 'Noto Sans SC, Microsoft YaHei, Arial, sans-serif',
        },
        {
          text: 'Hello World - English Text',
          position: [50, 120],
          fontSize: 32,
          color: '#0066cc',
          italic: true,
          fontFamily: 'DIN Pro, Microsoft YaHei, Arial, sans-serif',
        },
        {
          text: '这是一段较长的中文文字，用来测试自动换行功能。当文字超过指定宽度时，应该会自动换行显示。',
          position: [50, 200],
          fontSize: 18,
          color: '#333333',
          maxWidth: 600,
          lineHeight: 1.5,
        },
        {
          text: '描边文字效果',
          position: [50, 350],
          fontSize: 36,
          color: '#ffffff',
          bold: true,
          strokeColor: '#000000',
          strokeWidth: 2,
        },
        {
          text: '右对齐文字',
          position: [750, 450],
          fontSize: 24,
          color: '#ff6600',
          textAlign: 'right',
          italic: true,
        },
      ],
    };

    const params = new URLSearchParams({
      w: config.w.toString(),
      h: config.h.toString(),
      images: JSON.stringify(config.images),
      texts: JSON.stringify(config.texts),
    });

    const url = `/api/merge?${params.toString()}`;
    setImageUrl(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>文字渲染功能测试</h1>

      <button
        onClick={generateTestImage}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        生成测试图片
      </button>

      {imageUrl && (
        <div>
          <h2>生成的图片：</h2>
          <img
            src={imageUrl}
            alt="Generated image with text"
            style={{
              maxWidth: '100%',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <p>
            <strong>API URL:</strong>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </p>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>功能特性：</h2>
        <ul>
          <li>✅ 支持中文和英文文字渲染</li>
          <li>✅ 支持 bold 和 italic 简化属性</li>
          <li>✅ 支持字体大小、颜色设置</li>
          <li>✅ 支持文字描边效果</li>
          <li>✅ 支持文字对齐（左、中、右）</li>
          <li>✅ 支持自动换行</li>
          <li>✅ 支持与图片混合渲染</li>
          <li>✅ 多字体管理系统</li>
          <li>✅ Base64 字体嵌入</li>
        </ul>
        <p style={{ marginTop: '15px', color: '#666' }}>
          💡 查看更多测试用例：
          <a href="/test-fonts" style={{ color: '#0066cc' }}>
            多字体渲染测试页面
          </a>
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>使用示例：</h2>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto',
          }}
        >
          {`// 基本文字渲染
const config = {
  w: 800,
  h: 600,
  images: [],
  texts: [
    {
      text: "Hello World",
      position: [100, 100],
      fontSize: 32,
      color: "#ff0000",
      bold: true  // 简化属性
    },
    {
      text: "副标题文字",
      position: [100, 150],
      fontSize: 18,
      color: "#666666",
      italic: true  // 简化属性
    }
  ]
};`}
        </pre>
      </div>
    </div>
  );
}
