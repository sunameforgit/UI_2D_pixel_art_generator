# 扩展功能指南 (Extensions Guide)

本指南将帮助您扩展像素艺术生成器的功能，添加新的资源类型、风格和其他特性。

## 1. 添加新的资源类型

要添加新的资源类型，请按照以下步骤操作：

### 1.1 在核心模块中添加生成方法

编辑 `core/pixelGenerator.js` 文件，添加新的生成方法：

```javascript
/**
 * 生成新资源类型
 * @returns {Promise<Buffer>} - 生成的图像Buffer
 */
async generateNewResourceType() {
  const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
  const palette = colorPalettes[this.options.colorPalette];
  
  // 实现您的生成逻辑
  // 示例：绘制一个简单的形状
  const centerX = Math.floor(this.options.size / 2);
  const centerY = Math.floor(this.options.size / 2);
  const size = Math.floor(this.options.size / 2);
  
  this.drawRect(image, centerX - size/2, centerY - size/2, size, size, palette[0]);
  
  return await this.imageToBuffer(image);
}
```

### 1.2 在generate方法中添加新类型

在同一个文件的 `generate` 方法中添加新的类型：

```javascript
async generate(type) {
  switch (type) {
    case 'character':
      return this.generateCharacter();
    case 'monster':
      return this.generateMonster();
    // ... 其他类型
    case 'new-resource-type':  // 添加新类型
      return this.generateNewResourceType();
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
```

### 1.3 在前端添加新的资源类型选项

编辑 `frontend/src/App.jsx` 文件，在资源类型列表中添加新类型：

```javascript
{['character', 'monster', 'prop', 'weapon', 'scene', 'map', 'ui', 'new-resource-type'].map(category => (
  <button
    key={category}
    className={`pixel-btn ${selectedCategory === category ? 'active' : ''}`}
    onClick={() => setSelectedCategory(category)}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </button>
))}
```

## 2. 添加新的调色板

要添加新的调色板，请编辑 `core/colorPalettes.js` 文件：

```javascript
// 添加新的调色板
export const colorPalettes = {
  // 现有调色板...
  myNewPalette: [
    0xFF0000FF,  // 红色
    0x00FF00FF,  // 绿色
    0x0000FFFF,  // 蓝色
    0xFFFF00FF,  // 黄色
    0xFF00FFFF,  // 紫色
    0x00FFFFFF,  // 青色
    0xFFFFFFFF,  // 白色
    0x000000FF   // 黑色
  ]
};
```

## 3. 添加新的风格

要添加新的风格，请按照以下步骤操作：

### 3.1 在核心模块中添加风格逻辑

在 `core/pixelGenerator.js` 文件中，修改现有生成方法或创建新方法以支持新风格：

```javascript
async generateCharacter() {
  // ... 现有代码
  
  // 根据风格调整生成逻辑
  if (this.options.style === 'new-style') {
    // 新风格的生成逻辑
  } else {
    // 原有风格的生成逻辑
  }
  
  // ... 现有代码
}
```

### 3.2 在前端添加风格选项

编辑 `frontend/src/App.jsx` 文件，在风格选项列表中添加新风格：

```javascript
<select
  name="style"
  value={generateOptions.style}
  onChange={handleOptionChange}
  className="pixel-input"
>
  <option value="8-bit">8-bit</option>
  <option value="16-bit">16-bit</option>
  <option value="new-style">New Style</option>
</select>
```

## 4. 添加动画支持

要为生成的像素艺术添加动画支持，请按照以下步骤操作：

### 4.1 扩展核心生成器

在 `core/pixelGenerator.js` 文件中添加动画生成方法：

```javascript
/**
 * 生成动画帧
 * @param {number} frameCount - 帧数
 * @returns {Promise<Buffer[]>} - 动画帧数组
 */
async generateAnimation(type, frameCount) {
  const frames = [];
  
  for (let i = 0; i < frameCount; i++) {
    // 为每一帧生成不同的图像
    const frame = await this.generate(type);
    frames.push(frame);
  }
  
  return frames;
}
```

### 4.2 在后端API中添加动画端点

在 `backend/server.js` 文件中添加新的API端点：

```javascript
// 生成动画
app.post('/api/generate-animation', async (req, res) => {
  // 实现动画生成逻辑
});
```

### 4.3 在前端添加动画生成功能

在 `frontend/src/App.jsx` 文件中添加动画生成按钮和选项：

```javascript
// 添加动画生成功能
<button
  className="pixel-btn"
  onClick={handleGenerateAnimation}
  disabled={isGenerating}
>
  Generate Animation
</button>
```

## 5. 添加自定义模板支持

要支持自定义模板，请按照以下步骤操作：

### 5.1 创建模板系统

在 `core/templates.js` 文件中定义模板系统：

```javascript
export const templates = {
  // 定义不同类型的模板
  character: {
    knight: 'knight-template',
    wizard: 'wizard-template'
  }
};
```

### 5.2 扩展生成器支持模板

在 `core/pixelGenerator.js` 文件中添加模板支持：

```javascript
async generate(type, template = null) {
  // 根据模板调整生成逻辑
  if (template) {
    // 使用模板生成
  } else {
    // 默认生成逻辑
  }
}
```

## 6. 添加导出多种格式支持

要支持导出多种格式（如PNG、JPEG、GIF），请按照以下步骤操作：

### 6.1 扩展核心生成器

在 `core/pixelGenerator.js` 文件中添加格式转换方法：

```javascript
/**
 * 将图像转换为指定格式
 * @param {Buffer} imageBuffer - 图像Buffer
 * @param {string} format - 目标格式
 * @returns {Promise<Buffer>} - 转换后的图像Buffer
 */
async convertFormat(imageBuffer, format) {
  const image = await Jimp.read(imageBuffer);
  
  switch (format.toLowerCase()) {
    case 'jpeg':
      return await image.quality(90).getBufferAsync(Jimp.MIME_JPEG);
    case 'gif':
      // GIF支持需要额外的库
      return imageBuffer;
    default: // PNG
      return imageBuffer;
  }
}
```

### 6.2 在API中添加格式选项

在 `backend/server.js` 文件中添加格式参数支持：

```javascript
app.post('/api/generate', async (req, res) => {
  // 获取格式参数
  const format = req.body.format || 'png';
  
  // 生成图像并转换格式
  // ...
});
```

## 7. 添加批量生成功能

要支持批量生成多个图像，请按照以下步骤操作：

### 7.1 在API中添加批量生成端点

在 `backend/server.js` 文件中添加批量生成端点：

```javascript
// 批量生成
app.post('/api/batch-generate', async (req, res) => {
  const { count, type, options } = req.body;
  const results = [];
  
  for (let i = 0; i < count; i++) {
    // 生成单个图像
    const result = await generateImage(type, options);
    results.push(result);
  }
  
  res.json({
    success: true,
    results
  });
});
```

### 7.2 在前端添加批量生成功能

在 `frontend/src/App.jsx` 文件中添加批量生成选项：

```javascript
// 添加批量生成功能
<input
  type="number"
  name="batchCount"
  value={batchCount}
  onChange={handleBatchCountChange}
  min="1"
  max="10"
  className="pixel-input"
/>
<button
  className="pixel-btn"
  onClick={handleBatchGenerate}
  disabled={isGenerating}
>
  Generate Batch
</button>
```

## 8. 性能优化

### 8.1 缓存生成的图像

在 `backend/server.js` 文件中添加缓存机制：

```javascript
// 使用Map作为简单缓存
const cache = new Map();

app.post('/api/generate', async (req, res) => {
  const key = JSON.stringify(req.body);
  
  // 检查缓存
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }
  
  // 生成图像
  // ...
  
  // 保存到缓存
  cache.set(key, result);
  
  res.json(result);
});
```

### 8.2 使用Worker线程

在 `backend/server.js` 文件中使用Worker线程处理图像生成：

```javascript
const { Worker } = require('worker_threads');

app.post('/api/generate', async (req, res) => {
  const worker = new Worker('./worker.js', {
    workerData: req.body
  });
  
  worker.on('message', (result) => {
    res.json(result);
  });
  
  worker.on('error', (error) => {
    res.status(500).json({ success: false, message: error.message });
  });
});
```

## 9. 测试扩展功能

添加新功能后，请确保进行充分测试：

1. 测试核心生成功能
2. 测试API端点
3. 测试前端功能
4. 进行性能测试

## 10. 贡献扩展

如果您开发了有用的扩展，请考虑贡献回项目：

1. Fork仓库
2. 创建功能分支
3. 实现扩展功能
4. 编写测试
5. 提交Pull Request

## 联系方式

如有任何问题或建议，请联系项目维护者。
