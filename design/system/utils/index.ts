// ===============================================
// blimpify-ui/design/system/utils/index.ts
// Add theme manager to your existing utils exports
// ===============================================

// Your existing exports
export * from './locale';
export * from './navigation';

// Add theme management
export { 
  ThemeManager, 
  type ThemeConfig, 
  type ColorScale, 
  type RadiusScale 
} from './themeManager';

// Add color extraction
export * from './colorExtraction';

// Add logo analysis
export * from './logoAnalysis';
export * from './logoCropping';