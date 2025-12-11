'use client';

import { useEffect, useState } from 'react';

interface Font {
  name: string;
  weight: number;
  style: string;
  format: string;
  aliases?: string[];
}

export default function FontsPage() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewText, setPreviewText] = useState('你好世界 Hello World 123');
  const [selectedFont, setSelectedFont] = useState('');

  useEffect(() => {
    fetchFonts();
  }, []);

  const fetchFonts = async () => {
    try {
      const response = await fetch('/api/fonts');
      const data = await response.json();
      
      if (data.success) {
        setFonts(data.fonts);
        if (data.fonts.length > 0) {
          setSelectedFont(data.fonts[0].name);
        }
      } else {
        setError('Failed to load fonts');
      }
    } catch (err) {
      setError('Error fetching fonts: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = (fontName: string) => {
    const config = {
      w: 800,
      h: 200,
      images: [],
      texts: [
        {
          text: previewText,
          position: [50, 100],
          fontSize: 48,
          color: "#2c3e50",
          fontFamily: fontName
        }
      ]
    };

    const params = new URLSearchParams({
      w: config.w.toString(),
      h: config.h.toString(),
      images: JSON.stringify(config.images),
      texts: JSON.stringify(config.texts)
    });

    return `/api/merge?${params.toString()}`;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ fontSize: '18px', color: '#7f8c8d' }}>
          加载字体列表...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ fontSize: '18px', color: '#e74c3c' }}>
          {error}
        </div>
      </div>
    );
  }

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
        字体管理
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: '#7f8c8d',
        marginBottom: '40px'
      }}>
        查看和测试所有可用的字体
      </p>

      {/* 预览文本输入 */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          预览文本：
        </label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #e1e8ed',
            borderRadius: '4px',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
          placeholder="输入要预览的文本..."
        />
      </div>

      {/* 字体统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {fonts.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            可用字体
          </div>
        </div>
        <div style={{
          backgroundColor: '#2ecc71',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {fonts.reduce((sum, f) => sum + (f.aliases?.length || 0), 0)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            字体别名
          </div>
        </div>
        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {new Set(fonts.map(f => f.format)).size}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            字体格式
          </div>
        </div>
      </div>

      {/* 字体列表 */}
      <h2 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        color: '#2c3e50'
      }}>
        字体列表
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fonts.map((font, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: selectedFont === font.name ? '2px solid #3498db' : '2px solid transparent',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '20px', 
                  marginBottom: '5px',
                  color: '#2c3e50'
                }}>
                  {font.name}
                </h3>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#7f8c8d',
                  marginBottom: '10px'
                }}>
                  格式: {font.format.toUpperCase()} | 字重: {font.weight} | 样式: {font.style}
                </div>
                {font.aliases && font.aliases.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#95a5a6' }}>
                    别名: {font.aliases.join(', ')}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedFont(font.name)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: selectedFont === font.name ? '#2ecc71' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (selectedFont !== font.name) {
                    e.currentTarget.style.backgroundColor = '#2980b9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFont !== font.name) {
                    e.currentTarget.style.backgroundColor = '#3498db';
                  }
                }}
              >
                {selectedFont === font.name ? '✓ 已选择' : '预览'}
              </button>
            </div>

            {/* 字体预览 */}
            {selectedFont === font.name && (
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '15px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#7f8c8d',
                  marginBottom: '10px'
                }}>
                  预览：
                </div>
                <img
                  src={generatePreview(font.name)}
                  alt={`Preview of ${font.name}`}
                  style={{
                    maxWidth: '100%',
                    display: 'block',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 使用说明 */}
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
          使用说明
        </h2>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#34495e' }}>
          <p style={{ marginBottom: '15px' }}>
            <strong>1. 基本使用：</strong>在 texts 配置中指定 fontFamily 属性
          </p>
          <pre style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '13px',
            marginBottom: '15px',
            overflow: 'auto'
          }}>
{`{
  text: "你好世界",
  fontSize: 48,
  fontFamily: "Noto Sans SC"
}`}
          </pre>
          
          <p style={{ marginBottom: '15px' }}>
            <strong>2. 字体回退：</strong>使用逗号分隔多个字体，系统会按顺序尝试
          </p>
          <pre style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '13px',
            marginBottom: '15px',
            overflow: 'auto'
          }}>
{`{
  text: "Hello 你好",
  fontFamily: "DIN Pro, Noto Sans SC, Arial"
}`}
          </pre>

          <p style={{ marginBottom: '15px' }}>
            <strong>3. 使用别名：</strong>可以使用字体的任何别名
          </p>
          <pre style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`fontFamily: "DINPro"  // 等同于 "DIN Pro"
fontFamily: "noto-sans-sc"  // 等同于 "Noto Sans SC"`}
          </pre>
        </div>
      </div>

      {/* 相关链接 */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e1e8ed'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          marginBottom: '15px',
          color: '#2c3e50'
        }}>
          相关页面
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <a 
            href="/test-text"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            基础文字测试
          </a>
          <a 
            href="/test-fonts"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            多字体渲染测试
          </a>
          <a 
            href="/api/fonts"
            target="_blank"
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            字体 API
          </a>
        </div>
      </div>
    </div>
  );
}
