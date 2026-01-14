// ===============================================
// design/system/components/media/Image/index.ts
// IMAGE COMPONENT - Barrel exports
// ===============================================

export { Image, AvatarImage, LogoImage } from './Image';
export type { ImageProps, AvatarImageProps, LogoImageProps } from './Image';

// Progressive loading utilities
export {
  generateLQIP,
  getDominantColor,
  useImagePlaceholder,
  PLACEHOLDER_COLORS
} from './image-placeholders';
export type { ImagePlaceholders } from './image-placeholders';