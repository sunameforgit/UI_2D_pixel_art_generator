/**
 * 像素艺术调色板定义
 * 为不同风格的像素艺术提供预定义色彩方案
 */

// 基础调色板
export const colorPalettes = {
  // 默认调色板
  default: [
    '#000000', // 黑色
    '#ffffff', // 白色
    '#888888', // 灰色
    '#ff0000', // 红色
    '#00ff00', // 绿色
    '#0000ff', // 蓝色
    '#ffff00', // 黄色
    '#ff00ff', // 品红
    '#00ffff', // 青色
    '#ff8800', // 橙色
    '#8800ff', // 紫色
    '#0088ff', // 浅蓝色
    '#88ff00', // 浅绿色
    '#ff88ff', // 粉色
    '#888800', // 橄榄绿
    '#880088', // 深紫色
  ],
  
  // 复古8位风格
  retro: [
    '#000000', // 黑色
    '#111111', // 深灰色
    '#222222', // 中灰色
    '#444444', // 浅灰色
    '#888888', // 亮灰色
    '#ffffff', // 白色
    '#ff0000', // 红色
    '#00ff00', // 绿色
    '#0000ff', // 蓝色
    '#ffff00', // 黄色
    '#ff00ff', // 品红
    '#00ffff', // 青色
    '#ff8800', // 橙色
    '#8800ff', // 紫色
    '#0088ff', // 浅蓝色
    '#88ff00', // 浅绿色
  ],
  
  // 柔和色调
  pastel: [
    '#ffffff', // 白色
    '#f0f0f0', // 浅灰色
    '#e0e0e0', // 灰色
    '#ffaaaa', // 浅红色
    '#aaffaa', // 浅绿色
    '#aaaaff', // 浅蓝色
    '#ffffaa', // 浅黄色
    '#ffaaff', // 浅粉色
    '#aaffff', // 浅蓝色
    '#ffaa88', // 浅橙色
    '#88aaff', // 淡蓝色
    '#88ffaa', // 淡绿色
    '#ffaaff', // 淡粉色
    '#aaaa88', // 淡橄榄色
    '#aa88aa', // 淡紫色
    '#88aaaa', // 淡青色
  ],
  
  // 暗黑风格
  dark: [
    '#000000', // 黑色
    '#111111', // 深灰色
    '#222222', // 中灰色
    '#333333', // 浅灰色
    '#880000', // 深红色
    '#008800', // 深绿色
    '#000088', // 深蓝色
    '#888800', // 深黄色
    '#880088', // 深紫色
    '#008888', // 深青色
    '#884400', // 深橙色
    '#440088', // 暗紫色
    '#004488', // 暗蓝色
    '#448800', // 暗绿色
    '#880044', // 暗粉色
    '#008844', // 暗青色
  ],
  
  // 霓虹风格
  neon: [
    '#000000', // 黑色
    '#111111', // 深灰色
    '#ffffff', // 白色
    '#ff0000', // 红色
    '#00ff00', // 绿色
    '#0000ff', // 蓝色
    '#ffff00', // 黄色
    '#ff00ff', // 品红
    '#00ffff', // 青色
    '#ff8800', // 橙色
    '#8800ff', // 紫色
    '#0088ff', // 浅蓝色
    '#88ff00', // 浅绿色
    '#ffaaff', // 粉色
    '#88ffff', // 亮青色
    '#ffff88', // 亮黄色
  ],
};

// 随机获取调色板中的颜色
export const getRandomColor = (paletteName = 'default') => {
  const palette = colorPalettes[paletteName] || colorPalettes.default;
  return palette[Math.floor(Math.random() * palette.length)];
};

// 获取相邻颜色（用于渐变和阴影）
export const getAdjacentColor = (color, paletteName = 'default', direction = 1) => {
  const palette = colorPalettes[paletteName] || colorPalettes.default;
  const index = palette.indexOf(color);
  if (index === -1) return color;
  
  const newIndex = (index + direction + palette.length) % palette.length;
  return palette[newIndex];
};

// 获取对比色
export const getContrastColor = (color) => {
  // 简单的对比度计算，返回黑色或白色
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#ffffff';
};