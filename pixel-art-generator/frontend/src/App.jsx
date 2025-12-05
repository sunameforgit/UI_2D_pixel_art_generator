import { useState, useEffect } from 'react'
import './App.css'

// API配置
const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState('character');
  const [generateOptions, setGenerateOptions] = useState({
    size: 32,
    colorPalette: 'default',
    style: '8-bit'
  });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // 加载历史记录
  useEffect(() => {
    fetchHistory();
  }, []);
  
  // 获取历史记录
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };
  
  // 处理生成按钮点击
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedCategory,
          options: generateOptions
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedImage(`${API_BASE_URL}${data.imageUrl}`);
        // 重新加载历史记录
        fetchHistory();
      } else {
        setError(data.message || '生成失败');
      }
    } catch (err) {
      console.error('Error generating pixel art:', err);
      setError('生成时发生错误，请检查网络连接或后端服务');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 处理选项变化
  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setGenerateOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="app-container">
      {/* 头部 */}
      <header className="app-header">
        <h1>🎨 像素艺术生成器</h1>
        <p>Pixel Art Generator for 2D Game Development</p>
      </header>
      
      {/* 主内容区 */}
      <main className="main-content">
        {/* 左侧控制面板 */}
        <aside className="control-panel">
          <div className="panel-section">
            <h2>选择资源类型</h2>
            <div className="category-buttons">
              {['character', 'monster', 'prop', 'weapon', 'scene', 'map', 'ui'].map(category => (
                <button
                  key={category}
                  className={`pixel-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="panel-section">
            <h2>生成选项</h2>
            <div className="option-group">
              <label>尺寸:</label>
              <select 
                name="size" 
                value={generateOptions.size} 
                onChange={handleOptionChange}
                className="pixel-input"
              >
                {[16, 32, 64, 128].map(size => (
                  <option key={size} value={size}>{size}x{size}</option>
                ))}
              </select>
            </div>
            
            <div className="option-group">
              <label>调色板:</label>
              <select 
                name="colorPalette" 
                value={generateOptions.colorPalette} 
                onChange={handleOptionChange}
                className="pixel-input"
              >
                {['default', 'retro', 'pastel', 'dark', 'neon'].map(palette => (
                  <option key={palette} value={palette}>
                    {palette.charAt(0).toUpperCase() + palette.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="option-group">
              <label>风格:</label>
              <select 
                name="style" 
                value={generateOptions.style} 
                onChange={handleOptionChange}
                className="pixel-input"
              >
                {['8-bit', '16-bit', 'modern', 'minimal'].map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            <button className="pixel-btn generate-btn" onClick={handleGenerate}>
              生成像素艺术
            </button>
          </div>
          
          <div className="panel-section">
            <h2>下载选项</h2>
            <button 
              className="pixel-btn" 
              onClick={() => handleDownload('png')}
              disabled={!generatedImage}
            >
              PNG格式
            </button>
            <button 
              className="pixel-btn" 
              onClick={() => handleDownload('sprite')}
              disabled={!generatedImage}
            >
              Sprite Sheet
            </button>
            <button 
              className="pixel-btn" 
              onClick={() => handleDownload('json')}
              disabled={!generatedImage}
            >
              JSON数据
            </button>
          </div>
        </aside>
        
        {/* 右侧预览区 */}
        <section className="preview-section">
          <div className="preview-container">
            <h2>生成预览</h2>
            <div className="preview-canvas">
              {isGenerating ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>正在生成像素艺术...</p>
                </div>
              ) : error ? (
                <div className="error">
                  <p>❌ {error}</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated Pixel Art" 
                  className="generated-image"
                />
              ) : (
                <div className="placeholder">
                  <p>选择资源类型并点击生成按钮</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="history-section">
            <h2>历史记录</h2>
            <div className="history-grid">
              {history.length > 0 ? (
                history.map(item => (
                  <div 
                    key={item.id} 
                    className="history-item"
                    onClick={() => setGeneratedImage(`${API_BASE_URL}${item.imageUrl}`)}
                  >
                    <img 
                      src={`${API_BASE_URL}${item.imageUrl}`} 
                      alt={`Pixel Art ${item.id}`} 
                      className="history-image"
                    />
                    <div className="history-info">
                      <span className="history-type">{item.type}</span>
                      <span className="history-time">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="history-item">
                  <p>无历史记录</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* 底部 */}
      <footer className="app-footer">
        <p>Pixel Art Generator © 2025 - For 2D Game Developers</p>
      </footer>
    </div>
  )
}

  // 处理下载功能
  const handleDownload = (format) => {
    if (!generatedImage) return;
    
    switch (format) {
      case 'png':
        // 直接下载PNG
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `pixel-art-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'sprite':
        // 精灵表下载（模拟）
        alert('精灵表下载功能将在未来版本中实现');
        break;
      case 'json':
        // JSON数据下载（模拟）
        const jsonData = JSON.stringify({
          imageUrl: generatedImage,
          category: selectedCategory,
          options: generateOptions,
          timestamp: Date.now()
        }, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const jsonLink = document.createElement('a');
        jsonLink.href = URL.createObjectURL(blob);
        jsonLink.download = `pixel-art-${Date.now()}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        break;
      default:
        break;
    }
  };

export default App
