/**
 * 像素艺术生成器核心模块
 * 实现不同类型资源的生成算法
 */

import Jimp from 'jimp';
import { colorPalettes, getRandomColor, getAdjacentColor } from './colorPalettes.js';

/**
 * 像素艺术生成器类
 */
class PixelGenerator {
  constructor(options = {}) {
    this.options = {
      size: 32,
      colorPalette: 'default',
      style: '8-bit',
      ...options
    };
  }

  /**
   * 生成像素艺术
   * @param {string} type - 资源类型: character, monster, prop, weapon, scene, map, ui
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generate(type) {
    switch (type) {
      case 'character':
        return this.generateCharacter();
      case 'monster':
        return this.generateMonster();
      case 'prop':
        return this.generateProp();
      case 'weapon':
        return this.generateWeapon();
      case 'scene':
        return this.generateScene();
      case 'map':
        return this.generateMap();
      case 'ui':
        return this.generateUI();
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * 生成角色
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateCharacter() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    const palette = colorPalettes[this.options.colorPalette];
    
    // 随机选择皮肤、头发和服装颜色
    const skinColor = getRandomColor(this.options.colorPalette);
    const hairColor = getRandomColor(this.options.colorPalette);
    const clothesColor = getRandomColor(this.options.colorPalette);
    const pantsColor = getRandomColor(this.options.colorPalette);
    
    // 简单的角色结构：头、身体、手臂、腿
    const centerX = Math.floor(this.options.size / 2);
    const centerY = Math.floor(this.options.size / 2);
    const headSize = Math.floor(this.options.size / 3);
    const bodySize = Math.floor(this.options.size / 2);
    
    // 绘制头部
    this.drawRect(image, centerX - headSize/2, 0, headSize, headSize, skinColor);
    
    // 绘制头发
    this.drawRect(image, centerX - headSize/2 - 1, -1, headSize + 2, 4, hairColor);
    
    // 绘制身体
    this.drawRect(image, centerX - bodySize/3, headSize, bodySize/1.5, bodySize, clothesColor);
    
    // 绘制手臂
    this.drawRect(image, centerX - bodySize/1.5, headSize + 2, bodySize/6, bodySize/1.5, clothesColor);
    this.drawRect(image, centerX + bodySize/3, headSize + 2, bodySize/6, bodySize/1.5, clothesColor);
    
    // 绘制腿
    this.drawRect(image, centerX - bodySize/6, headSize + bodySize, bodySize/6, bodySize/2, pantsColor);
    this.drawRect(image, centerX, headSize + bodySize, bodySize/6, bodySize/2, pantsColor);
    
    // 绘制眼睛
    const eyeSize = Math.max(1, Math.floor(headSize / 6));
    this.drawRect(image, centerX - headSize/4, headSize/4, eyeSize, eyeSize, 0x000000FF);
    this.drawRect(image, centerX + headSize/6, headSize/4, eyeSize, eyeSize, 0x000000FF);
    
    // 绘制嘴巴
    this.drawRect(image, centerX - headSize/6, headSize/2, headSize/3, eyeSize, 0xFF0000FF);
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成怪物
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateMonster() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    
    // 随机选择怪物颜色
    const mainColor = getRandomColor(this.options.colorPalette);
    const secondaryColor = getAdjacentColor(mainColor, this.options.colorPalette);
    const accentColor = getRandomColor(this.options.colorPalette);
    
    // 绘制不规则的怪物形状
    const centerX = Math.floor(this.options.size / 2);
    const centerY = Math.floor(this.options.size / 2);
    const bodyRadius = Math.floor(this.options.size / 3);
    
    // 绘制主体（使用不规则圆形）
    for (let x = 0; x < this.options.size; x++) {
      for (let y = 0; y < this.options.size; y++) {
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distance < bodyRadius) {
          image.setPixelColor(Jimp.cssColorToHex(mainColor), x, y);
        }
      }
    }
    
    // 绘制眼睛（可能是多个）
    const eyeCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < eyeCount; i++) {
      const eyeX = centerX + Math.floor(Math.random() * bodyRadius) - bodyRadius/2;
      const eyeY = centerY + Math.floor(Math.random() * bodyRadius/2) - bodyRadius/4;
      const eyeSize = Math.max(1, Math.floor(bodyRadius / 5));
      this.drawRect(image, eyeX, eyeY, eyeSize, eyeSize, 0x000000FF);
      this.drawRect(image, eyeX + 1, eyeY + 1, eyeSize - 2, eyeSize - 2, 0xFFFFFF00);
    }
    
    // 绘制尖牙或触角
    for (let i = 0; i < 5; i++) {
      const toothX = centerX + Math.floor(Math.random() * bodyRadius) - bodyRadius/2;
      const toothY = centerY + bodyRadius - 2;
      const toothSize = Math.max(1, Math.floor(Math.random() * 4) + 1);
      this.drawRect(image, toothX, toothY, 1, toothSize, secondaryColor);
    }
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成道具
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateProp() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    
    // 随机选择道具类型和颜色
    const propTypes = ['coin', 'potion', 'key', 'gem', 'box'];
    const propType = propTypes[Math.floor(Math.random() * propTypes.length)];
    const mainColor = getRandomColor(this.options.colorPalette);
    const secondaryColor = getAdjacentColor(mainColor, this.options.colorPalette);
    
    const centerX = Math.floor(this.options.size / 2);
    const centerY = Math.floor(this.options.size / 2);
    
    switch (propType) {
      case 'coin':
        // 绘制金币
        this.drawCircle(image, centerX, centerY, Math.floor(this.options.size / 3), '#FFD700');
        this.drawCircle(image, centerX, centerY, Math.floor(this.options.size / 5), '#FFA500');
        break;
        
      case 'potion':
        // 绘制药水
        this.drawRect(image, centerX - 3, centerY - 6, 6, 10, '#00FF00');
        this.drawRect(image, centerX - 4, centerY - 8, 8, 2, '#8B4513');
        break;
        
      case 'key':
        // 绘制钥匙
        this.drawRect(image, centerX - 2, centerY - 5, 4, 10, '#FFD700');
        this.drawRect(image, centerX + 2, centerY - 3, 3, 2, '#FFD700');
        break;
        
      case 'gem':
        // 绘制宝石
        this.drawDiamond(image, centerX, centerY, Math.floor(this.options.size / 4), '#00FFFF');
        break;
        
      case 'box':
        // 绘制箱子
        this.drawRect(image, centerX - 4, centerY - 4, 8, 8, '#8B4513');
        this.drawRect(image, centerX - 3, centerY - 3, 6, 6, '#A0522D');
        break;
    }
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成武器
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateWeapon() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    
    // 随机选择武器类型和颜色
    const weaponTypes = ['sword', 'axe', 'bow', 'staff', 'dagger'];
    const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    const mainColor = getRandomColor(this.options.colorPalette);
    const secondaryColor = getAdjacentColor(mainColor, this.options.colorPalette);
    
    const centerX = Math.floor(this.options.size / 2);
    const centerY = Math.floor(this.options.size / 2);
    
    switch (weaponType) {
      case 'sword':
        // 绘制剑
        this.drawRect(image, centerX - 1, centerY - 8, 2, 12, '#C0C0C0');
        this.drawRect(image, centerX - 3, centerY - 10, 6, 4, '#8B4513');
        break;
        
      case 'axe':
        // 绘制斧头
        this.drawRect(image, centerX - 1, centerY - 6, 2, 10, '#8B4513');
        this.drawRect(image, centerX + 1, centerY - 8, 4, 6, '#C0C0C0');
        break;
        
      case 'bow':
        // 绘制弓
        this.drawRect(image, centerX - 5, centerY, 10, 2, '#8B4513');
        this.drawRect(image, centerX - 5, centerY - 1, 1, 4, '#8B4513');
        this.drawRect(image, centerX + 4, centerY - 1, 1, 4, '#8B4513');
        break;
        
      case 'staff':
        // 绘制法杖
        this.drawRect(image, centerX - 1, centerY - 10, 2, 14, '#8B4513');
        this.drawCircle(image, centerX, centerY - 12, 3, '#FF00FF');
        break;
        
      case 'dagger':
        // 绘制匕首
        this.drawRect(image, centerX - 1, centerY - 4, 2, 8, '#C0C0C0');
        this.drawRect(image, centerX - 2, centerY + 2, 4, 3, '#8B4513');
        break;
    }
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成场景
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateScene() {
    const image = new Jimp(this.options.size, this.options.size, 0x0080FFFF);
    
    // 绘制天空
    this.drawRect(image, 0, 0, this.options.size, Math.floor(this.options.size / 2), '#87CEEB');
    
    // 绘制地面
    this.drawRect(image, 0, Math.floor(this.options.size / 2), this.options.size, Math.floor(this.options.size / 2), '#228B22');
    
    // 绘制一些树木
    for (let i = 0; i < 3; i++) {
      const treeX = Math.floor(Math.random() * this.options.size);
      const treeY = Math.floor(this.options.size / 2) + Math.floor(Math.random() * (this.options.size / 4));
      this.drawRect(image, treeX, treeY - 4, 1, 5, '#8B4513');
      this.drawCircle(image, treeX, treeY - 5, 3, '#006400');
    }
    
    // 绘制云朵
    this.drawCircle(image, 10, 8, 3, '#FFFFFF');
    this.drawCircle(image, 13, 9, 3, '#FFFFFF');
    this.drawCircle(image, 11, 11, 3, '#FFFFFF');
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成地图
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateMap() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    
    // 生成随机地图（简单的瓦片地图）
    const tileSize = Math.floor(this.options.size / 8);
    
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let tileColor;
        const random = Math.random();
        
        if (random < 0.6) {
          tileColor = '#228B22'; // 草地
        } else if (random < 0.7) {
          tileColor = '#87CEEB'; // 水
        } else if (random < 0.85) {
          tileColor = '#A0522D'; // 泥土
        } else if (random < 0.95) {
          tileColor = '#8B4513'; // 树木
        } else {
          tileColor = '#C0C0C0'; // 石头
        }
        
        this.drawRect(image, x * tileSize, y * tileSize, tileSize, tileSize, tileColor);
      }
    }
    
    return await this.imageToBuffer(image);
  }

  /**
   * 生成UI元素
   * @returns {Promise<Buffer>} - 生成的图像Buffer
   */
  async generateUI() {
    const image = new Jimp(this.options.size, this.options.size, 0x000000FF);
    
    // 随机选择UI类型
    const uiTypes = ['button', 'healthbar', 'coinDisplay', 'inventorySlot', 'menuIcon'];
    const uiType = uiTypes[Math.floor(Math.random() * uiTypes.length)];
    const mainColor = getRandomColor(this.options.colorPalette);
    const secondaryColor = getAdjacentColor(mainColor, this.options.colorPalette);
    
    const centerX = Math.floor(this.options.size / 2);
    const centerY = Math.floor(this.options.size / 2);
    
    switch (uiType) {
      case 'button':
        // 绘制按钮
        this.drawRect(image, 2, 2, this.options.size - 4, this.options.size - 4, '#4A90E2');
        this.drawRect(image, 3, 3, this.options.size - 6, this.options.size - 6, '#5AA0F2');
        break;
        
      case 'healthbar':
        // 绘制血条
        this.drawRect(image, 2, Math.floor(this.options.size / 2) - 3, this.options.size - 4, 6, '#333333');
        this.drawRect(image, 4, Math.floor(this.options.size / 2) - 1, this.options.size - 8, 2, '#FF0000');
        break;
        
      case 'coinDisplay':
        // 绘制金币显示
        this.drawCircle(image, 8, Math.floor(this.options.size / 2), 4, '#FFD700');
        this.drawRect(image, 15, Math.floor(this.options.size / 2) - 2, 4, 4, '#FFFFFF');
        this.drawRect(image, 20, Math.floor(this.options.size / 2) - 2, 4, 4, '#FFFFFF');
        break;
        
      case 'inventorySlot':
        // 绘制背包槽
        this.drawRect(image, 1, 1, this.options.size - 2, this.options.size - 2, '#8B8B8B');
        this.drawRect(image, 2, 2, this.options.size - 4, this.options.size - 4, '#333333');
        break;
        
      case 'menuIcon':
        // 绘制菜单图标
        for (let i = 0; i < 3; i++) {
          this.drawRect(image, 4, 6 + i * 5, this.options.size - 8, 3, '#FFFFFF');
        }
        break;
    }
    
    return await this.imageToBuffer(image);
  }

  // 辅助方法：绘制矩形
  drawRect(image, x, y, width, height, color) {
    const hexColor = Jimp.cssColorToHex(color);
    for (let i = Math.max(0, x); i < Math.min(image.bitmap.width, x + width); i++) {
      for (let j = Math.max(0, y); j < Math.min(image.bitmap.height, y + height); j++) {
        image.setPixelColor(hexColor, i, j);
      }
    }
  }

  // 辅助方法：绘制圆形
  drawCircle(image, x, y, radius, color) {
    const hexColor = Jimp.cssColorToHex(color);
    for (let i = Math.max(0, x - radius); i < Math.min(image.bitmap.width, x + radius); i++) {
      for (let j = Math.max(0, y - radius); j < Math.min(image.bitmap.height, y + radius); j++) {
        const distance = Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2));
        if (distance <= radius) {
          image.setPixelColor(hexColor, i, j);
        }
      }
    }
  }

  // 辅助方法：绘制菱形
  drawDiamond(image, x, y, radius, color) {
    const hexColor = Jimp.cssColorToHex(color);
    for (let i = Math.max(0, x - radius); i < Math.min(image.bitmap.width, x + radius); i++) {
      for (let j = Math.max(0, y - radius); j < Math.min(image.bitmap.height, y + radius); j++) {
        const distance = Math.abs(i - x) + Math.abs(j - y);
        if (distance <= radius) {
          image.setPixelColor(hexColor, i, j);
        }
      }
    }
  }

  // 辅助方法：将图像转换为Buffer
  async imageToBuffer(image) {
    return await image.getBufferAsync(Jimp.MIME_PNG);
  }

  // 辅助方法：设置图像透明度
  setTransparency(image) {
    // 将黑色背景设置为透明
    for (let i = 0; i < image.bitmap.width; i++) {
      for (let j = 0; j < image.bitmap.height; j++) {
        const color = image.getPixelColor(i, j);
        if (color === 0x000000FF) {
          image.setPixelColor(0x00000000, i, j);
        }
      }
    }
  }
}

// 导出生成器
export default PixelGenerator;