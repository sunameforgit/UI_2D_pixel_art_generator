/**
 * 像素艺术生成器后端API
 * 提供像素艺术生成的RESTful API接口
 * 更新时间：2024-05-05
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import PixelGenerator from '../core/pixelGenerator.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体

// 静态文件服务
app.use('/images', express.static(join(__dirname, 'images')));

// 内存存储生成历史（生产环境建议使用数据库）
let generationHistory = [];

/**
 * 生成像素艺术的API接口
 * POST /api/generate
 * Body: { type, options }
 * Response: { success, imageUrl, historyId, timestamp }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { type, options } = req.body;
    
    // 验证请求参数
    if (!type) {
      return res.status(400).json({ success: false, message: 'Missing required parameter: type' });
    }
    
    // 支持的资源类型
    const supportedTypes = ['character', 'monster', 'prop', 'weapon', 'scene', 'map', 'ui'];
    if (!supportedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: `Unsupported type: ${type}. Supported types: ${supportedTypes.join(', ')}` });
    }
    
    // 创建生成器实例
    const generator = new PixelGenerator(options);
    
    // 生成像素艺术
    const imageBuffer = await generator.generate(type);
    
    // 生成唯一ID和文件名
    const timestamp = Date.now();
    const historyId = `gen_${timestamp}_${Math.floor(Math.random() * 1000)}`;
    const imageFileName = `${historyId}.png`;
    const imagePath = join(__dirname, 'images', imageFileName);
    
    // 保存图像到文件系统
    await fs.promises.writeFile(imagePath, imageBuffer);
    
    // 保存到历史记录
    const historyEntry = {
      id: historyId,
      type,
      options,
      imageUrl: `/images/${imageFileName}`,
      timestamp,
      fullPath: imagePath
    };
    generationHistory.push(historyEntry);
    
    // 限制历史记录数量（最多保存100条）
    if (generationHistory.length > 100) {
      generationHistory.shift();
    }
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      imageUrl: `/images/${imageFileName}`,
      historyId,
      timestamp
    });
    
  } catch (error) {
    console.error('Error generating pixel art:', error);
    res.status(500).json({ success: false, message: 'Failed to generate pixel art', error: error.message });
  }
});

/**
 * 获取生成历史的API接口
 * GET /api/history
 * Query params: limit (optional)
 * Response: { success, history }
 */
app.get('/api/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = generationHistory.slice(-limit).reverse();
    
    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ success: false, message: 'Failed to get history', error: error.message });
  }
});

/**
 * 获取历史记录详情的API接口
 * GET /api/history/:id
 * Response: { success, entry }
 */
app.get('/api/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    const entry = generationHistory.find(item => item.id === id);
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'History entry not found' });
    }
    
    res.status(200).json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Error getting history entry:', error);
    res.status(500).json({ success: false, message: 'Failed to get history entry', error: error.message });
  }
});

/**
 * 获取支持的调色板的API接口
 * GET /api/palettes
 * Response: { success, palettes }
 */
app.get('/api/palettes', (req, res) => {
  try {
    // 导入调色板
    import('../core/colorPalettes.js').then(({ colorPalettes }) => {
      res.status(200).json({
        success: true,
        palettes: Object.keys(colorPalettes)
      });
    });
  } catch (error) {
    console.error('Error getting palettes:', error);
    res.status(500).json({ success: false, message: 'Failed to get palettes', error: error.message });
  }
});

/**
 * 健康检查API接口
 * GET /api/health
 * Response: { status, timestamp }
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    message: 'Pixel Art Generator API is running'
  });
});

// 确保images目录存在
import fs from 'fs';
const imagesDir = join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`Pixel Art Generator API is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// 导出应用（用于测试）
export default app;