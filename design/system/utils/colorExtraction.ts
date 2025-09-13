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
  /** Whether the logo is monochrome (black/white only) */
  isMonochrome?: boolean;
  /** Whether any brand colors were found */
  hasBrandColors?: boolean;
}

export interface LogoAnalysis {
  /** Aspect ratio (width/height) */
  aspectRatio: number;
  /** Logo shape classification */
  shape: 'square' | 'wide' | 'tall' | 'landscape' | 'portrait';
  /** Recommended CSS classes for optimal display */
  cssClasses: {
    width: string;
    height: string;
    objectFit: 'contain' | 'cover' | 'fill';
  };
  /** Recommended positioning */
  positioning: {
    alignSelf: 'start' | 'center' | 'end';
    justifySelf: 'start' | 'center' | 'end';
  };
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
  
  // Prioritize brighter colors for better visual impact
  // Sort by brightness (descending) and frequency (descending)
  const sortedColors = candidateColors.sort((a, b) => {
    const brightnessA = getBrightness(a.rgb[0], a.rgb[1], a.rgb[2]);
    const brightnessB = getBrightness(b.rgb[0], b.rgb[1], b.rgb[2]);
    
    // First sort by brightness (brighter colors first)
    if (Math.abs(brightnessA - brightnessB) > 10) {
      return brightnessB - brightnessA;
    }
    
    // If brightness is similar, sort by frequency (more frequent colors first)
    return b.frequency - a.frequency;
  });
  
  // Use the brightest color that's not too dark
  const bestColor = sortedColors.find(color => {
    const brightness = getBrightness(color.rgb[0], color.rgb[1], color.rgb[2]);
    return brightness > 40; // Prefer colors that are not too dark
  }) || sortedColors[0]; // Fallback to first color if none meet criteria
  
  return bestColor.color;
}

// ===== MAIN EXTRACTION FUNCTION =====

/**
 * Extract dominant colors from an image using improved algorithm
 */
export async function extractColorsFromImage(
  imageUrl: string,
  options: ColorExtractionOptions = {}
): Promise<ExtractedColors> {
  const {
    maxColors = 8,
    minFrequency = 0.005, // Lower threshold for better results
    skipWhites = true,
    skipBlacks = true,
    targetBrightness = 60
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Create canvas with higher resolution for better color detection
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not create canvas context"));
          return;
        }
        
        // Use higher resolution for better color analysis
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw image with better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Count color frequencies with quantization for better grouping
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
          
          // Quantize colors to reduce noise (group similar colors)
          const quantizedR = Math.round(r / 10) * 10;
          const quantizedG = Math.round(g / 10) * 10;
          const quantizedB = Math.round(b / 10) * 10;
          
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Convert to array and sort by frequency
        const totalPixels = Array.from(colorMap.values()).reduce((sum, count) => sum + count, 0);
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
        
        // Group similar colors with tighter threshold
        const groupedColors = groupSimilarColors(colors, 30);
        
        // Limit to maxColors
        const palette = groupedColors.slice(0, maxColors);
        
        // Filter out white and black colors from palette for better brand color detection
        const brandColors = palette.filter(color => {
          const brightness = getBrightness(color.rgb[0], color.rgb[1], color.rgb[2]);
          // Keep colors that are not near white or black (between 20 and 235 brightness)
          return brightness > 20 && brightness < 235;
        });
        
        // If we have brand colors, use them; otherwise fall back to original palette
        const effectivePalette = brandColors.length > 0 ? brandColors : palette;
        
        // If the entire palette is white/black, don't change anything
        if (effectivePalette.length === 0) {
          console.log('🎨 Logo is entirely white/black - no color changes applied');
          resolve({
            primary: "#3B82F6", // Keep default
            secondary: "#3B82F6",
            accent: "#3B82F6",
            palette: [],
            isMonochrome: true,
            hasBrandColors: false
          });
          return;
        }
        
        // Find best accent color from effective palette (brighter/stronger color)
        const accent = findBestAccentColor(effectivePalette, targetBrightness);
        
        // Use the accent color as primary for better visual impact
        const primary = accent;
        const secondary = effectivePalette[0]?.color;
        
        console.log('🎨 Extracted colors (prioritizing brighter colors):', {
          primary,
          secondary,
          accent,
          paletteCount: palette.length,
          totalColors: colors.length,
          brandColorsCount: brandColors.length,
          effectivePaletteCount: effectivePalette.length,
          isMonochrome: effectivePalette.length === 0,
          note: 'Primary color is now the brighter/more vibrant color for better visual impact'
        });
        
        resolve({
          primary,
          secondary,
          accent,
          palette: effectivePalette.map(({ frequency, ...rest }) => ({
            ...rest,
            frequency: Math.round(frequency * 100) / 100 // Round to 2 decimals
          })),
          isMonochrome: false,
          hasBrandColors: true
        });
        
      } catch (error) {
        console.error('Color extraction error:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('Image load error:', error);
      reject(new Error("Failed to load image"));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Generate CSS custom properties from extracted colors
 */
export function generateColorCSS(colors: ExtractedColors): Record<string, string> {
  // Convert hex colors to RGB values for CSS custom properties
  const hexToRgb = (hex: string) => {
    const result = hex.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(', ') || '59, 130, 246';
    return result;
  };

  // Generate a full color scale based on the primary color (similar to ThemeManager)
  const generateColorScale = (baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    return {
      '100': `rgb(${rgb}, 0.1)`,
      '200': `rgb(${rgb}, 0.2)`,
      '300': `rgb(${rgb}, 0.3)`,
      '400': `rgb(${rgb}, 0.4)`,
      '500': `rgb(${rgb}, 0.5)`,
      '600': baseColor, // Use the extracted color as the main accent
      '700': `rgb(${rgb}, 0.7)`,
      '800': `rgb(${rgb}, 0.8)`,
      '900': `rgb(${rgb}, 0.9)`,
      '950': `rgb(${rgb}, 0.95)`,
      '1000': `rgb(${rgb}, 1)`,
      '1100': `rgb(${rgb}, 1)`,
      '1200': `rgb(${rgb}, 1)`
    };
  };

  const primaryScale = generateColorScale(colors.primary);
  const accentScale = generateColorScale(colors.accent);

  return {
    // Legacy support
    '--accent-primary': colors.primary,
    '--accent-secondary': colors.secondary || colors.primary,
    '--accent-ui': colors.accent,
    '--accent-primary-rgb': hexToRgb(colors.primary),
    '--accent-secondary-rgb': hexToRgb(colors.secondary || colors.primary),
    
    // ThemeManager compatible properties
    ...Object.entries(accentScale).reduce((acc, [level, value]) => {
      acc[`--accent-${level}`] = value;
      return acc;
    }, {} as Record<string, string>),
    
    // Semantic tokens that ThemeManager uses
    '--interactive-accent': colors.primary,
    '--interactive-accent-hover': colors.accent,
    '--interactive-accent-active': colors.accent,
    '--border-focus': colors.primary,
    '--icon-brand': colors.accent,
    '--text-nav-item-selected': colors.accent,
    '--icon-nav-item-selected': colors.accent,
  };
}

/**
 * Apply extracted colors to the document
 */
export function applyColorsToDocument(colors: ExtractedColors): void {
  // If palette is empty (logo was all white/black), don't apply any changes
  if (colors.palette.length === 0) {
    console.log('🎨 No brand colors to apply - keeping default theme');
    return;
  }
  
  const cssVars = generateColorCSS(colors);
  
  console.log('🎨 Applying colors to document:', {
    colors,
    cssVarsCount: Object.keys(cssVars).length,
    primaryColor: colors.primary,
    accentColor: colors.accent
  });
  
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
    console.log(`🎨 Set CSS property: ${property} = ${value}`);
  });
  
  // Note: All theme system properties are now handled by generateColorCSS
  
  // Store in localStorage for persistence
  localStorage.setItem('extracted-brand-colors', JSON.stringify(colors));
  
  // Trigger a custom event so components can react to color changes
  window.dispatchEvent(new CustomEvent('brandColorsUpdated', { 
    detail: { colors, cssVars } 
  }));
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

/**
 * Apply colors using ThemeManager for better integration
 */
export function applyColorsWithThemeManager(colors: ExtractedColors): void {
  if (colors.palette.length === 0) {
    console.log('🎨 No brand colors to apply - keeping default theme');
    return;
  }

  console.log('🎨 Applying colors with ThemeManager compatibility:', colors);
  
  // Try to import ThemeManager dynamically to avoid circular dependencies
  try {
    // This will be available at runtime
    const { ThemeManager } = require('../utils/themeManager');
    const themeManager = ThemeManager.getInstance();
    
    // Apply the accent color directly to ThemeManager
    // We'll use the accent color as the primary accent
    console.log('🎨 ThemeManager found, applying colors via CSS:', colors.accent);
    
    // Note: ThemeManager expects predefined color scales, so we'll apply via CSS
    // This ensures compatibility with the existing theme system
    applyColorsToDocument(colors);
    
  } catch (error) {
    console.warn('🎨 ThemeManager not available, falling back to direct CSS application:', error);
    applyColorsToDocument(colors);
  }
}

/**
 * Analyze logo shape and provide optimal display recommendations
 */
export function analyzeLogoShape(imageUrl: string): Promise<LogoAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let shape: LogoAnalysis['shape'];
      let cssClasses: LogoAnalysis['cssClasses'];
      let positioning: LogoAnalysis['positioning'];
      
      // Classify shape based on aspect ratio
      if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
        shape = 'square';
        cssClasses = {
          width: 'w-4 h-4',  // Square: equal width and height
          height: 'h-4',
          objectFit: 'contain'
        };
        positioning = {
          alignSelf: 'center',
          justifySelf: 'center'
        };
      } else if (aspectRatio > 1.5) {
        shape = 'wide';
        cssClasses = {
          width: 'w-8 h-4',  // Wide: more width, less height
          height: 'h-4',
          objectFit: 'contain'
        };
        positioning = {
          alignSelf: 'center',
          justifySelf: 'center'
        };
      } else if (aspectRatio > 1.1) {
        shape = 'landscape';
        cssClasses = {
          width: 'w-6 h-4',  // Landscape: slightly wider than tall
          height: 'h-4',
          objectFit: 'contain'
        };
        positioning = {
          alignSelf: 'center',
          justifySelf: 'center'
        };
      } else if (aspectRatio < 0.5) {
        shape = 'tall';
        cssClasses = {
          width: 'w-4 h-8',  // Tall: more height, less width
          height: 'h-8',
          objectFit: 'contain'
        };
        positioning = {
          alignSelf: 'start',  // Align to top for tall logos
          justifySelf: 'center'
        };
      } else {
        shape = 'portrait';
        cssClasses = {
          width: 'w-4 h-6',  // Portrait: slightly taller than wide
          height: 'h-6',
          objectFit: 'contain'
        };
        positioning = {
          alignSelf: 'start',  // Align to top for portrait logos
          justifySelf: 'center'
        };
      }
      
      const analysis: LogoAnalysis = {
        aspectRatio,
        shape,
        cssClasses,
        positioning
      };
      
      console.log('📐 Logo shape analysis:', {
        url: imageUrl,
        dimensions: `${img.width}x${img.height}`,
        aspectRatio: aspectRatio.toFixed(2),
        shape,
        recommendations: cssClasses
      });
      
      resolve(analysis);
    };
    
    img.onerror = () => {
      console.warn('📐 Failed to analyze logo shape:', imageUrl);
      // Return default square analysis
      resolve({
        aspectRatio: 1,
        shape: 'square',
        cssClasses: {
          width: 'w-4 h-4',
          height: 'h-4',
          objectFit: 'contain'
        },
        positioning: {
          alignSelf: 'center',
          justifySelf: 'center'
        }
      });
    };
    
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  });
}
