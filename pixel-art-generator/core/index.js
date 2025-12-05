/**
 * 像素艺术生成器核心模块入口
 * 导出所有核心功能和类
 */

// 导出像素生成器类
export { default as PixelGenerator } from './pixelGenerator.js';

// 导出颜色调色板
export * from './colorPalettes.js';

// 导出版本信息
export const version = '1.0.0';

export const description = 'Core algorithms for pixel art generation';
