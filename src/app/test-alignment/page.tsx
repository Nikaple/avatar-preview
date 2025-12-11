'use client';

import { useState } from 'react';

export default function TestAlignmentPage() {
  const [imageUrl, setImageUrl] = useState('');

  const generateTestImage = () => {
    const config = {
      w: 800,
      h: 400,
      images: [
        {
          url: 'https://placehold.co/800x400/f0f0f0/cccccc?text=Background',
          position: [0, 0],
          width: 800,
        }
      ],
      texts: [
        // 左对齐 - 单行
        {
          text: "左对齐文字",
          position: [50, 40],
          fontSize: 28,
          color: "#34495e",
          fontFamily: "Noto Sans SC",
          textAlign: "left"
        },
        // 左对齐 - 多行
        {
          text: "左对齐多行文字测试\n第二行内容",
          position: [50, 100],
          fontSize: 24,
          color: "#34495e",
          fontFamily: "Noto Sans SC",
          textAlign: "left"
        },
        // 居中对齐 - 单行
        {
          text: "居中对齐文字",
          position: [400, 40],
          fontSize: 28,
          color: "#16a085",
          fontFamily: "Noto Sans SC",
          textAlign: "center"
        },
        // 居中对齐 - 多行
        {
          text: "居中对齐多行文字测试\n第二行内容",
          position: [400, 100],
          fontSize: 24,
          color: "#16a085",
          fontFamily: "Noto Sans SC",
          textAlign: "center"
        },
        // 右对齐 - 单行
        {
          text: "右对齐文字",
          position: [750, 40],
          fontSize: 28,
          color: "#8e44ad",
          fontFamily: "Noto Sans SC",
          textAlign: "right"
        },
        // 右对齐 - 多行
        {
          text: "右对齐多行文字测试\n第二行内容",
          position: [750, 100],
          fontSize: 24,
          color: "#8e44ad",
          fontFamily: "Noto Sans SC",
          textAlign: "right"
        },
        // 测试长文本换行
        {
          text: "这是一段很长的文字用来测试自动换行功能是否正常工作",
          position: [50, 250],
          fontSize: 20,
          color: "#e74c3c",
          fontFamily: "Noto Sans SC",
          textAlign: "left",
          maxWidth: 200
        },
        {
          text: "这是一段很长的文字用来测试自动换行功能是否正常工作",
          position: [400, 250],
          fontSize: 20,
          color: "#e67e22",
          fontFamily: "Noto Sans SC",
          textAlign: "center",
          maxWidth: 200
        },
        {
          text: "这是一段很长的文字用来测试自动换行功能是否正常工作",
          position: [750, 250],
          fontSize: 20,
          color: "#9b59b6",
          fontFamily: "Noto Sans SC",
          textAlign: "right",
          maxWidth: 200
        }
      ]
    };

    const params = new URLSearchParams({
      w: config.w.toString(),
      h: config.h.toString(),
      images: JSON.stringify(config.images),
      texts: JSON.stringify(config.texts)
    });

    const url = `/api/merge?${params.toString()}`;
    setImageUrl(url);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>文字对齐测试</h1>

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
          marginBottom: '20px'
        }}
      >
        生成测试图片
      </button>

      {imageUrl && (
        <div>
          <h2>生成的图片：</h2>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={imageUrl}
              alt="Alignment test"
              style={{
                maxWidth: '100%',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
            {/* 参考线 */}
            <div style={{
              position: 'absolute',
              left: '50px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'red',
              opacity: 0.5
            }} />
            <div style={{
              position: 'absolute',
              left: '400px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'green',
              opacity: 0.5
            }} />
            <div style={{
              position: 'absolute',
              left: '750px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'purple',
              opacity: 0.5
            }} />
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>
            参考线：<span style={{ color: 'red' }}>红色</span> = 左对齐基准 (x=50)，
            <span style={{ color: 'green' }}>绿色</span> = 居中基准 (x=400)，
            <span style={{ color: 'purple' }}>紫色</span> = 右对齐基准 (x=750)
          </p>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>说明：</h2>
        <ul>
          <li><strong>左对齐</strong>：文字从指定 x 坐标开始向右延伸</li>
          <li><strong>居中对齐</strong>：文字以指定 x 坐标为中心</li>
          <li><strong>右对齐</strong>：文字从指定 x 坐标向左延伸</li>
        </ul>
      </div>
    </div>
  );
}
