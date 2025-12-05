# 部署指南 (Deployment Guide)

本指南将帮助您将像素艺术生成器应用部署到生产环境。

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- 具有基本配置的Web服务器（如Nginx或Apache）

## 部署步骤

### 1. 准备代码

首先，将代码克隆到您的服务器：

```bash
git clone <repository-url>
cd pixel-art-generator
```

### 2. 构建和部署核心模块

```bash
cd core
npm install
```

核心模块是一个本地依赖，不需要单独部署，它将被后端API使用。

### 3. 部署后端API

#### 3.1 配置环境变量

创建一个 `.env` 文件来存储环境变量：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，设置以下变量：

```
PORT=3001
NODE_ENV=production
```

#### 3.2 安装依赖并构建

```bash
npm install --production
```

#### 3.3 启动服务

使用进程管理器（如PM2）来管理Node.js应用：

```bash
npm install -g pm2
pm run start
```

PM2将自动启动并监控API服务器。

### 4. 部署前端应用

#### 4.1 配置API地址

编辑前端代码中的API地址：

```bash
cd frontend
```

在 `src/App.jsx` 文件中，将 `API_BASE_URL` 修改为您的后端API地址：

```javascript
const API_BASE_URL = 'http://your-server-domain:3001/api';
```

#### 4.2 构建应用

```bash
npm install
npm run build
```

构建完成后，将生成一个 `dist` 目录，包含所有静态文件。

#### 4.3 部署静态文件

将 `dist` 目录中的内容部署到您的Web服务器（如Nginx、Apache或CDN）：

**Nginx配置示例**：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/pixel-art-generator/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 配置CORS（跨域资源共享）

确保后端API配置了正确的CORS设置，允许前端域名访问：

在 `backend/server.js` 中，修改CORS配置：

```javascript
app.use(cors({
    origin: 'http://your-frontend-domain.com',
    credentials: true
}));
```

### 6. 验证部署

打开浏览器访问您的前端域名，确保应用能够正常工作：

1. 尝试生成一个像素艺术图像
2. 检查历史记录功能
3. 测试下载功能

## 维护和监控

### 监控后端API

使用PM2监控后端API：

```bash
pm run status  # 查看应用状态
npm run logs    # 查看日志
```

### 自动重启

PM2会在应用崩溃时自动重启。您可以配置PM2在服务器重启时自动启动应用：

```bash
pm run startup
```

### 日志管理

定期检查应用日志，以识别和解决问题：

```bash
# 后端日志
npm run logs

# 前端日志（浏览器开发者工具）
```

## 常见问题

### 1. 前端无法连接到后端API

- 确保后端API正在运行
- 检查API地址是否正确配置
- 验证CORS设置

### 2. 图像无法生成

- 检查核心模块是否正确安装
- 验证Jimp库是否正常工作
- 检查服务器是否有足够的磁盘空间

### 3. 前端路由问题

- 确保Web服务器配置了正确的路由重写规则
- 对于单页应用，所有请求都应指向index.html

## 安全建议

1. **使用HTTPS**：配置SSL证书以加密通信
2. **限制API访问**：使用API密钥或认证机制
3. **设置文件上传限制**：防止恶意文件上传
4. **定期更新依赖**：保持所有依赖的最新版本
5. **备份数据**：定期备份生成的图像和历史记录

## 更新应用

要更新应用，请执行以下步骤：

1. 拉取最新代码：`git pull`
2. 更新核心模块：`cd core && npm install`
3. 更新后端API：`cd backend && npm install && npm run build && npm run restart`
4. 更新前端应用：`cd frontend && npm install && npm run build`
5. 重新部署前端静态文件

## 联系方式

如有任何问题或建议，请联系项目维护者。
