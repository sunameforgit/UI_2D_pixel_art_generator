# 像素艺术生成器 (Pixel Art Generator)

一个用于2D游戏开发的像素艺术生成器，支持生成角色、怪物、道具、武器、场景、地图和UI元素等多种资源类型。

## 功能特性

- 🎨 **多种资源类型**：支持生成角色、怪物、道具、武器、场景、地图和UI元素
- 🎯 **可定制选项**：支持调整尺寸、调色板和风格
- 📱 **响应式设计**：适配不同屏幕尺寸
- 🔄 **历史记录**：保存生成历史，方便查看和下载
- ⬇️ **一键下载**：支持下载生成的像素艺术图像

## 技术栈

- **前端**：React + Vite + CSS
- **后端**：Node.js + Express
- **图像处理**：Jimp（JavaScript图像处理库）

## 项目结构

```
pixel-art-generator/
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── App.jsx     # 主应用组件
│   │   ├── App.css     # 样式文件
│   │   └── main.jsx    # 入口文件
│   ├── public/         # 静态资源
│   └── package.json    # 前端依赖
├── backend/            # 后端API
│   ├── server.js       # API服务器
│   └── package.json    # 后端依赖
├── core/               # 核心生成功能
│   ├── pixelGenerator.js  # 像素生成器
│   ├── colorPalettes.js   # 调色板定义
│   └── package.json    # 核心依赖
└── README.md           # 项目说明文档
```

## 安装和运行

### 1. 安装依赖

#### 核心模块
```bash
cd core
npm install
```

#### 后端API
```bash
cd backend
npm install
```

#### 前端应用
```bash
cd frontend
npm install
```

### 2. 启动服务

#### 后端API（端口3001）
```bash
cd backend
npm run dev
```

#### 前端应用（端口5173）
```bash
cd frontend
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:5173

## API端点

### POST /api/generate

生成像素艺术图像。

**请求参数**：
```json
{
  "type": "character",  // 资源类型：character, monster, prop, weapon, scene, map, ui
  "options": {
    "size": 32,         // 图像尺寸
    "colorPalette": "default",  // 调色板
    "style": "8-bit"   // 风格
  }
}
```

**响应示例**：
```json
{
  "success": true,
  "imageUrl": "/images/gen_1764902608183_84.png",
  "historyId": "gen_1764902608183_84",
  "timestamp": 1764902608183
}
```

### GET /api/history

获取生成历史记录。

**响应示例**：
```json
{
  "success": true,
  "history": [
    {
      "id": "gen_1764902608183_84",
      "type": "character",
      "imageUrl": "/images/gen_1764902608183_84.png",
      "timestamp": 1764902608183,
      "options": {
        "size": 32,
        "colorPalette": "default",
        "style": "8-bit"
      }
    }
  ]
}
```

### GET /api/health

检查API健康状态。

**响应示例**：
```json
{
  "success": true,
  "message": "Pixel Art Generator API is running"
}
```

### GET /api/palettes

获取可用的调色板列表。

**响应示例**：
```json
{
  "success": true,
  "palettes": ["default", "retro", "pastel", "dark"]
}
```

## 自定义调色板

在 `core/colorPalettes.js` 文件中可以添加自定义调色板：

```javascript
export const colorPalettes = {
  // 现有的调色板...
  myPalette: [
    0xFF0000FF,  // 红色
    0x00FF00FF,  // 绿色
    0x0000FFFF   // 蓝色
  ]
};
```

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
