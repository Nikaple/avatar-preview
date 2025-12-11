'use client';

import { useState } from 'react';

export default function TestFontsPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const testCases = [
    {
      name: '基础中文渲染 (Noto Sans SC)',
      config: {
        w: 800,
        h: 200,
        images: [],
        texts: [
          {
            text: "你好世界！这是中文字体测试。",
            position: [50, 80],
            fontSize: 48,
            color: "#2c3e50",
            fontFamily: "Noto Sans SC"
          }
        ]
      }
    },
    {
      name: '英文粗体渲染 (DIN Pro)',
      config: {
        w: 800,
        h: 200,
        images: [],
        texts: [
          {
            text: "BOLD ENGLISH TEXT",
            position: [50, 80],
            fontSize: 56,
            color: "#e74c3c",
            fontFamily: "DIN Pro",
            bold: true
          }
        ]
      }
    },
    {
      name: '中英文混合',
      config: {
        w: 800,
        h: 300,
        images: [],
        texts: [
          {
            text: "Welcome 欢迎",
            position: [50, 80],
            fontSize: 64,
            color: "#3498db",
            fontFamily: "Noto Sans SC, DIN Pro"
          },
          {
            text: "Multi-language Support 多语言支持",
            position: [50, 180],
            fontSize: 32,
            color: "#2ecc71",
            fontFamily: "DIN Pro, Noto Sans SC"
          }
        ]
      }
    },
    {
      name: '描边效果',
      config: {
        w: 800,
        h: 250,
        images: [],
        texts: [
          {
            text: "描边文字效果",
            position: [50, 100],
            fontSize: 72,
            color: "#ffffff",
            fontFamily: "Noto Sans SC",
            bold: true,
            strokeColor: "#e74c3c",
            strokeWidth: 4
          }
        ]
      }
    },
    {
      name: '文字对齐方式',
      config: {
        w: 800,
        h: 300,
        images: [],
        texts: [
          {
            text: "左对齐文字",
            position: [50, 60],
            fontSize: 32,
            color: "#34495e",
            fontFamily: "Noto Sans SC",
            textAlign: "left"
          },
          {
            text: "居中对齐文字",
            position: [400, 130],
            fontSize: 32,
            color: "#16a085",
            fontFamily: "Noto Sans SC",
            textAlign: "center"
          },
          {
            text: "右对齐文字",
            position: [750, 200],
            fontSize: 32,
            color: "#8e44ad",
            fontFamily: "Noto Sans SC",
            textAlign: "right"
          }
        ]
      }
    },
    {
      name: '自动换行',
      config: {
        w: 800,
        h: 400,
        images: [],
        texts: [
          {
            text: "这是一段很长的中文文字，用来测试自动换行功能。当文字超过指定的最大宽度时，系统会自动将文字分成多行显示，确保内容完整可读。",
            position: [50, 50],
            fontSize: 28,
            color: "#2c3e50",
            fontFamily: "Noto Sans SC",
            maxWidth: 700,
            lineHeight: 1.6
          }
        ]
      }
    },
    {
      name: '复杂排版',
      config: {
        w: 1000,
        h: 600,
        images: [
          {
            url: 'https://placehold.co/1000x600/ecf0f1/95a5a6?text=Background',
            position: [0, 0],
            width: 1000
          }
        ],
        texts: [
          {
            text: "多字体渲染系统",
            position: [500, 80],
            fontSize: 56,
            color: "#2c3e50",
            fontFamily: "Noto Sans SC",
            bold: true,
            textAlign: "center",
            strokeColor: "#ffffff",
            strokeWidth: 2
          },
          {
            text: "Multi-Font Rendering System",
            position: [500, 160],
            fontSize: 32,
            color: "#34495e",
            fontFamily: "DIN Pro",
            textAlign: "center"
          },
          {
            text: "✓ 支持中英文混合渲染",
            position: [100, 280],
            fontSize: 24,
            color: "#27ae60",
            fontFamily: "Noto Sans SC"
          },
          {
            text: "✓ 支持多种字体样式",
            position: [100, 330],
            fontSize: 24,
            color: "#27ae60",
            fontFamily: "Noto Sans SC"
          },
          {
            text: "✓ 支持文字描边效果",
            position: [100, 380],
            fontSize: 24,
            color: "#27ae60",
            fontFamily: "Noto Sans SC"
          },
          {
            text: "✓ 支持自动换行和对齐",
            position: [100, 430],
            fontSize: 24,
            color: "#27ae60",
            fontFamily: "Noto Sans SC"
          },
          {
            text: "Powered by Sharp & SVG",
            position: [500, 530],
            fontSize: 18,
            color: "#7f8c8d",
            fontFamily: "DIN Pro",
            textAlign: "center",
            italic: true
          }
        ]
      }
    }
  ];

  const generateImage = async (config: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        w: config.w.toString(),
        h: config.h.toString(),
        images: JSON.stringify(config.images),
        texts: JSON.stringify(config.texts)
      });

      const url = `/api/merge?${params.toString()}`;
      setImageUrl(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成图片失败，请查看控制台');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '10px',
        color: '#2c3e50'
      }}>
        多字体渲染功能测试
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: '#7f8c8d',
        marginBottom: '40px'
      }}>
        测试各种字体渲染场景和效果
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {testCases.map((testCase, index) => (
          <button
            key={index}
            onClick={() => generateImage(testCase.config)}
            disabled={loading}
            style={{
              padding: '20px',
              fontSize: '16px',
              backgroundColor: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              textAlign: 'left',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#2980b9';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#3498db';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {testCase.name}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {testCase.config.w}×{testCase.config.h} | {testCase.config.texts?.length || 0} 文字
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#ecf0f1',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', color: '#7f8c8d' }}>
            正在生成图片...
          </div>
        </div>
      )}

      {imageUrl && !loading && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '20px',
            color: '#2c3e50'
          }}>
            生成的图片：
          </h2>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <img
              src={imageUrl}
              alt="Generated image with text"
              style={{
                maxWidth: '100%',
                display: 'block',
                margin: '0 auto',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#ecf0f1',
            borderRadius: '4px',
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            <strong>API URL:</strong>{' '}
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3498db' }}
            >
              {imageUrl}
            </a>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          color: '#2c3e50'
        }}>
          功能特性
        </h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {[
            '✅ 支持多种字体格式 (TTF, OTF)',
            '✅ 字体自动加载和缓存',
            '✅ 中英文混合渲染',
            '✅ 字体粗细和样式控制',
            '✅ 文字描边效果',
            '✅ 多种对齐方式',
            '✅ 智能自动换行',
            '✅ Base64 字体嵌入'
          ].map((feature, index) => (
            <div 
              key={index}
              style={{
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#2c3e50'
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '30px',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e1e8ed'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          color: '#2c3e50'
        }}>
          使用示例
        </h2>
        <pre style={{
          backgroundColor: '#2c3e50',
          color: '#ecf0f1',
          padding: '20px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
{`// 基本文字渲染
const config = {
  w: 800,
  h: 600,
  images: [],
  texts: [
    {
      text: "你好世界 Hello World",
      position: [100, 100],
      fontSize: 48,
      color: "#2c3e50",
      fontFamily: "Noto Sans SC, DIN Pro",
      bold: true
    }
  ]
};

// 带描边效果
{
  text: "描边文字",
  position: [100, 200],
  fontSize: 64,
  color: "#ffffff",
  fontFamily: "Noto Sans SC",
  strokeColor: "#e74c3c",
  strokeWidth: 3
}

// 自动换行
{
  text: "很长的文字内容...",
  position: [50, 50],
  fontSize: 24,
  maxWidth: 600,
  lineHeight: 1.5
}`}
        </pre>
      </div>
    </div>
  );
}
