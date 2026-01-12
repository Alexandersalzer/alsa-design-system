// ===============================================
// design/system/components/media/Image/image-placeholders.ts
// UTILITIES FOR GENERATING PROGRESSIVE IMAGE PLACEHOLDERS
// ===============================================

/**
 * Generate a low quality image placeholder (LQIP) from an image
 * This should be done at build time or by your backend/CDN
 *
 * @example
 * // At build time or server-side:
 * const lqip = await generateLQIP('https://cdn.example.com/photo.jpg');
 * // Returns: 'data:image/jpeg;base64,/9j/4AAQ...' (tiny ~500 byte image)
 *
 * // In your component:
 * <Image src="photo.jpg" lqip={lqip} alt="Photo" />
 */
export async function generateLQIP(
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): Promise<string> {
  const { width = 20, height = 20, quality = 20 } = options;

  // This is a client-side example - in production, do this server-side or at build time
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to low quality JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      resolve(dataUrl);
    };

    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * Extract dominant color from an image
 * This can be done at build time or by your backend
 *
 * @example
 * const color = await getDominantColor('https://cdn.example.com/photo.jpg');
 * // Returns: '#3B82F6'
 *
 * <Image src="photo.jpg" placeholderColor={color} alt="Photo" />
 */
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Sample center of image at low resolution
      const sampleSize = 10;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      resolve(hex);
    };

    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * Color palette for common placeholder colors
 */
export const PLACEHOLDER_COLORS = {
  gray: '#e5e7eb',
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#f59e0b',
  purple: '#8b5cf6',
  pink: '#ec4899',
} as const;

/**
 * Example: How to generate placeholders at build time or server-side
 *
 * For Next.js with sharp (recommended production approach):
 * ```typescript
 * import sharp from 'sharp';
 *
 * export async function generateImagePlaceholders(imagePath: string) {
 *   const buffer = await fs.readFile(imagePath);
 *
 *   // Generate LQIP (20x20px, 20% quality)
 *   const lqipBuffer = await sharp(buffer)
 *     .resize(20, 20, { fit: 'cover' })
 *     .jpeg({ quality: 20 })
 *     .toBuffer();
 *
 *   const lqip = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;
 *
 *   // Get dominant color
 *   const { dominant } = await sharp(buffer).stats();
 *   const color = `#${dominant.r.toString(16)}${dominant.g.toString(16)}${dominant.b.toString(16)}`;
 *
 *   return { lqip, color };
 * }
 * ```
 *
 * For BlurHash (most efficient, ~30 bytes):
 * ```typescript
 * import { encode } from 'blurhash';
 * import sharp from 'sharp';
 *
 * export async function generateBlurHash(imagePath: string) {
 *   const { data, info } = await sharp(imagePath)
 *     .raw()
 *     .ensureAlpha()
 *     .resize(32, 32, { fit: 'inside' })
 *     .toBuffer({ resolveWithObject: true });
 *
 *   const blurHash = encode(
 *     new Uint8ClampedArray(data),
 *     info.width,
 *     info.height,
 *     4,
 *     4
 *   );
 *
 *   return blurHash; // e.g., 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'
 * }
 * ```
 */

// Type definitions for placeholder generation
export interface ImagePlaceholders {
  lqip?: string;
  blurHash?: string;
  dominantColor?: string;
}

/**
 * Hook to generate placeholders on the fly (client-side)
 * Note: In production, generate these server-side or at build time!
 */
export function useImagePlaceholder(
  imageUrl: string,
  type: 'lqip' | 'color' | 'both' = 'color'
): ImagePlaceholders | null {
  const [placeholders, setPlaceholders] = React.useState<ImagePlaceholders | null>(null);

  React.useEffect(() => {
    if (!imageUrl) return;

    const generate = async () => {
      const result: ImagePlaceholders = {};

      try {
        if (type === 'lqip' || type === 'both') {
          result.lqip = await generateLQIP(imageUrl);
        }
        if (type === 'color' || type === 'both') {
          result.dominantColor = await getDominantColor(imageUrl);
        }
        setPlaceholders(result);
      } catch (error) {
        console.error('Failed to generate placeholder:', error);
      }
    };

    generate();
  }, [imageUrl, type]);

  return placeholders;
}

// Import React for the hook
import React from 'react';
