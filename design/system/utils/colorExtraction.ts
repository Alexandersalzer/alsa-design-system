// ===============================================
// src/design-system/utils/colorExtraction.ts
// COLOR EXTRACTION UTILITIES - Extract colors from images
// ===============================================

// ===== TYPE DEFINITIONS =====
export interface ExtractedColors {
  /** Primary color (most dominant) */
  primary: string;
  /** Secondary color (second most dominant) */
  secondary?: string;
  /** Accent color (best for UI accent) */
  accent: string;
  /** All detected colors with their frequency */
  palette: Array<{
    color: string;
    frequency: number;
    rgb: [number, number, number];
  }>;
}

export interface ColorExtractionOptions {
  /** Maximum number of colors to extract */
  maxColors?: number;
  /** Minimum frequency threshold for color inclusion */
  minFrequency?: number;
  /** Skip near-white colors */
  skipWhites?: boolean;
  /** Skip near-black colors */
  skipBlacks?: boolean;
  /** Target brightness for accent color */
  targetBrightness?: number;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Convert RGB values to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Calculate brightness of a color
 */
function getBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Calculate color distance (for grouping similar colors)
 */
function getColorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  return Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );
}

/**
 * Check if a color is near white
 */
function isNearWhite(r: number, g: number, b: number, threshold: number = 240): boolean {
  return r > threshold && g > threshold && b > threshold;
}

/**
 * Check if a color is near black
 */
function isNearBlack(r: number, g: number, b: number, threshold: number = 15): boolean {
  return r < threshold && g < threshold && b < threshold;
}

/**
 * Group similar colors together
 */
function groupSimilarColors(
  colors: Array<{ color: string; frequency: number; rgb: [number, number, number] }>,
  threshold: number = 50
): Array<{ color: string; frequency: number; rgb: [number, number, number] }> {
  const grouped: Array<{ color: string; frequency: number; rgb: [number, number, number] }> = [];
  
  for (const color of colors) {
    let found = false;
    
    for (const group of grouped) {
      const distance = getColorDistance(
        color.rgb[0], color.rgb[1], color.rgb[2],
        group.rgb[0], group.rgb[1], group.rgb[2]
      );
      
      if (distance < threshold) {
        // Merge with existing group
        const totalFrequency = group.frequency + color.frequency;
        group.rgb = [
          Math.round((group.rgb[0] * group.frequency + color.rgb[0] * color.frequency) / totalFrequency),
          Math.round((group.rgb[1] * group.frequency + color.rgb[1] * color.frequency) / totalFrequency),
          Math.round((group.rgb[2] * group.frequency + color.rgb[2] * color.frequency) / totalFrequency)
        ];
        group.color = rgbToHex(group.rgb[0], group.rgb[1], group.rgb[2]);
        group.frequency = totalFrequency;
        found = true;
        break;
      }
    }
    
    if (!found) {
      grouped.push({ ...color });
    }
  }
  
  return grouped.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Find the best accent color from the palette
 */
function findBestAccentColor(
  palette: Array<{ color: string; frequency: number; rgb: [number, number, number] }>,
  targetBrightness: number = 60
): string {
  // Filter out whites and blacks
  const candidateColors = palette.filter(color => {
    const brightness = getBrightness(color.rgb[0], color.rgb[1], color.rgb[2]);
    return brightness > 20 && brightness < 240;
  });
  
  if (candidateColors.length === 0) {
    // Fallback to a default accent color
    return "#3B82F6"; // Blue
  }
  
  // Find color closest to target brightness
  let bestColor = candidateColors[0];
  let smallestDifference = Math.abs(getBrightness(bestColor.rgb[0], bestColor.rgb[1], bestColor.rgb[2]) - targetBrightness);
  
  for (const color of candidateColors.slice(1)) {
    const brightness = getBrightness(color.rgb[0], color.rgb[1], color.rgb[2]);
    const difference = Math.abs(brightness - targetBrightness);
    
    if (difference < smallestDifference) {
      bestColor = color;
      smallestDifference = difference;
    }
  }
  
  return bestColor.color;
}

// ===== MAIN EXTRACTION FUNCTION =====

/**
 * Extract dominant colors from an image
 */
export async function extractColorsFromImage(
  imageUrl: string,
  options: ColorExtractionOptions = {}
): Promise<ExtractedColors> {
  const {
    maxColors = 8,
    minFrequency = 0.01,
    skipWhites = true,
    skipBlacks = true,
    targetBrightness = 60
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not create canvas context"));
          return;
        }
        
        // Set canvas size (resize for performance)
        const maxSize = 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Count color frequencies
        const colorMap = new Map<string, number>();
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Skip whites if option is enabled
          if (skipWhites && isNearWhite(r, g, b)) continue;
          
          // Skip blacks if option is enabled
          if (skipBlacks && isNearBlack(r, g, b)) continue;
          
          const colorKey = `${r},${g},${b}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Convert to array and sort by frequency
        const totalPixels = colorMap.size;
        const colors = Array.from(colorMap.entries())
          .map(([colorKey, frequency]) => {
            const [r, g, b] = colorKey.split(',').map(Number);
            return {
              color: rgbToHex(r, g, b),
              frequency: frequency / totalPixels,
              rgb: [r, g, b] as [number, number, number]
            };
          })
          .filter(color => color.frequency >= minFrequency)
          .sort((a, b) => b.frequency - a.frequency);
        
        // Group similar colors
        const groupedColors = groupSimilarColors(colors);
        
        // Limit to maxColors
        const palette = groupedColors.slice(0, maxColors);
        
        // Find primary and secondary colors
        const primary = palette[0]?.color || "#3B82F6";
        const secondary = palette[1]?.color;
        
        // Find best accent color
        const accent = findBestAccentColor(palette, targetBrightness);
        
        resolve({
          primary,
          secondary,
          accent,
          palette: palette.map(({ frequency, ...rest }) => ({
            ...rest,
            frequency: Math.round(frequency * 100) / 100 // Round to 2 decimals
          }))
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Generate CSS custom properties from extracted colors
 */
export function generateColorCSS(colors: ExtractedColors): Record<string, string> {
  return {
    '--accent-primary': colors.primary,
    '--accent-secondary': colors.secondary || colors.primary,
    '--accent-ui': colors.accent,
    '--accent-primary-rgb': colors.primary.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(', ') || '59, 130, 246',
    '--accent-secondary-rgb': (colors.secondary || colors.primary).replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(', ') || '59, 130, 246',
  };
}

/**
 * Apply extracted colors to the document
 */
export function applyColorsToDocument(colors: ExtractedColors): void {
  const cssVars = generateColorCSS(colors);
  
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Store in localStorage for persistence
  localStorage.setItem('extracted-brand-colors', JSON.stringify(colors));
}

/**
 * Load saved colors from localStorage
 */
export function loadSavedColors(): ExtractedColors | null {
  try {
    const saved = localStorage.getItem('extracted-brand-colors');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
