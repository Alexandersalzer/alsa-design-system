// ===============================================
// src/design-system/utils/logoAnalysis.ts
// LOGO ANALYSIS UTILITIES - Detect logo type and characteristics
// ===============================================

// ===== TYPE DEFINITIONS =====
export interface LogoAnalysis {
  /** Type of logo detected */
  type: LogoType;
  /** Aspect ratio (width/height) */
  aspectRatio: number;
  /** Whether the logo is horizontal (wider than tall) */
  isHorizontal: boolean;
  /** Whether the logo is vertical (taller than wide) */
  isVertical: boolean;
  /** Whether the logo is square */
  isSquare: boolean;
  /** Recommended display size for sidebar */
  recommendedSize: LogoSize;
  /** Recommended positioning for sidebar */
  recommendedPosition: LogoPosition;
  /** Whether the logo should be centered */
  shouldCenter: boolean;
  /** Confidence score (0-1) */
  confidence: number;
}

export type LogoType = 
  | 'text'           // Text-based logos (like "Blimpify", "Google")
  | 'emblem'         // Emblem/icon logos (like Starbucks, BMW)
  | 'combination'    // Combination of text + icon (like Spotify, Uber)
  | 'symbol'         // Symbol/abstract logos (like Nike swoosh, Apple)
  | 'wordmark'       // Stylized text logos (like Coca-Cola, Disney)
  | 'lettermark'     // Letter-based logos (like IBM, CNN)
  | 'unknown';       // Unable to determine

export interface LogoSize {
  width: number;
  height: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface LogoPosition {
  alignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'center' | 'bottom';
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

// ===== LOGO TYPE DETECTION =====

/**
 * Analyze logo characteristics and determine optimal display settings
 */
export async function analyzeLogo(logoUrl: string): Promise<LogoAnalysis> {
  try {
    // Get image dimensions and basic info
    const imageInfo = await getImageInfo(logoUrl);
    
    // Calculate aspect ratio
    const aspectRatio = imageInfo.width / imageInfo.height;
    
    // Determine logo type based on characteristics
    const logoType = await detectLogoType(logoUrl, imageInfo);
    
    // Generate recommendations based on type and aspect ratio
    const recommendations = generateRecommendations(logoType, aspectRatio, imageInfo);
    
    return {
      type: logoType,
      aspectRatio,
      isHorizontal: aspectRatio > 1.2,
      isVertical: aspectRatio < 0.8,
      isSquare: aspectRatio >= 0.9 && aspectRatio <= 1.1,
      ...recommendations,
      confidence: calculateConfidence(logoType, aspectRatio, imageInfo)
    };
    
  } catch (error) {
    console.warn('Logo analysis failed:', error);
    
    // Return default analysis for unknown logos
    return {
      type: 'unknown',
      aspectRatio: 1,
      isHorizontal: false,
      isVertical: false,
      isSquare: true,
      recommendedSize: { width: 24, height: 24 },
      recommendedPosition: { alignment: 'left', verticalAlignment: 'center' },
      shouldCenter: false,
      confidence: 0.1
    };
  }
}

/**
 * Get basic image information
 */
async function getImageInfo(logoUrl: string): Promise<{ width: number; height: number; format: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: logoUrl.split('.').pop()?.toLowerCase() || 'unknown'
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = logoUrl;
  });
}

/**
 * Detect logo type based on image characteristics
 */
async function detectLogoType(logoUrl: string, imageInfo: { width: number; height: number; format: string }): Promise<LogoType> {
  const { width, height, format } = imageInfo;
  const aspectRatio = width / height;
  
  // Text-based logos are typically very wide (aspect ratio > 2.5)
  if (aspectRatio > 2.5) {
    return 'text';
  }
  
  // Emblems are typically square or slightly rectangular
  if (aspectRatio >= 0.8 && aspectRatio <= 1.3) {
    // Could be emblem, symbol, or combination
    if (format === 'svg') {
      // SVG logos are often more complex, likely combination or symbol
      return 'combination';
    }
    return 'emblem';
  }
  
  // Wordmarks are typically wide but not as extreme as text logos
  if (aspectRatio > 1.5 && aspectRatio <= 2.5) {
    return 'wordmark';
  }
  
  // Lettermarks are typically square or nearly square
  if (aspectRatio >= 0.9 && aspectRatio <= 1.1 && (width < 200 || height < 200)) {
    return 'lettermark';
  }
  
  // Vertical logos are often symbols or emblems
  if (aspectRatio < 0.8) {
    return 'symbol';
  }
  
  return 'unknown';
}

/**
 * Generate display recommendations based on logo type
 */
function generateRecommendations(
  logoType: LogoType, 
  aspectRatio: number, 
  imageInfo: { width: number; height: number }
): Pick<LogoAnalysis, 'recommendedSize' | 'recommendedPosition' | 'shouldCenter'> {
  
  switch (logoType) {
    case 'text':
    case 'wordmark':
      return {
        recommendedSize: { 
          width: Math.min(120, imageInfo.width * 0.3), 
          height: Math.min(24, imageInfo.height * 0.3),
          maxWidth: 120,
          maxHeight: 24
        },
        recommendedPosition: { 
          alignment: 'left', 
          verticalAlignment: 'center',
          padding: { top: 4, bottom: 4 }
        },
        shouldCenter: false
      };
      
    case 'emblem':
      return {
        recommendedSize: { 
          width: 32, 
          height: 32,
          maxWidth: 40,
          maxHeight: 40
        },
        recommendedPosition: { 
          alignment: 'center', 
          verticalAlignment: 'center',
          padding: { top: 8, bottom: 8 }
        },
        shouldCenter: true
      };
      
    case 'combination':
      return {
        recommendedSize: { 
          width: Math.min(80, imageInfo.width * 0.4), 
          height: Math.min(32, imageInfo.height * 0.4),
          maxWidth: 80,
          maxHeight: 32
        },
        recommendedPosition: { 
          alignment: 'left', 
          verticalAlignment: 'center',
          padding: { top: 6, bottom: 6 }
        },
        shouldCenter: false
      };
      
    case 'symbol':
    case 'lettermark':
      return {
        recommendedSize: { 
          width: 28, 
          height: 28,
          maxWidth: 32,
          maxHeight: 32
        },
        recommendedPosition: { 
          alignment: 'center', 
          verticalAlignment: 'center',
          padding: { top: 6, bottom: 6 }
        },
        shouldCenter: true
      };
      
    default:
      return {
        recommendedSize: { width: 24, height: 24 },
        recommendedPosition: { alignment: 'left', verticalAlignment: 'center' },
        shouldCenter: false
      };
  }
}

/**
 * Calculate confidence score for the analysis
 */
function calculateConfidence(
  logoType: LogoType, 
  aspectRatio: number, 
  imageInfo: { width: number; height: number }
): number {
  let confidence = 0.5; // Base confidence
  
  // Higher confidence for clear aspect ratio patterns
  if (logoType === 'text' && aspectRatio > 3) confidence += 0.3;
  if (logoType === 'emblem' && aspectRatio >= 0.8 && aspectRatio <= 1.2) confidence += 0.2;
  if (logoType === 'symbol' && aspectRatio < 0.8) confidence += 0.2;
  
  // Lower confidence for very small or very large images
  const totalPixels = imageInfo.width * imageInfo.height;
  if (totalPixels < 1000) confidence -= 0.2; // Too small
  if (totalPixels > 1000000) confidence -= 0.1; // Too large
  
  return Math.max(0, Math.min(1, confidence));
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get CSS classes for logo based on analysis
 */
export function getLogoClasses(analysis: LogoAnalysis): string {
  const classes = ['company-logo'];
  
  // Add type-specific classes
  classes.push(`logo-type-${analysis.type}`);
  
  // Add size classes
  if (analysis.isHorizontal) classes.push('logo-horizontal');
  if (analysis.isVertical) classes.push('logo-vertical');
  if (analysis.isSquare) classes.push('logo-square');
  
  // Add positioning classes
  if (analysis.shouldCenter) classes.push('logo-centered');
  
  return classes.join(' ');
}

/**
 * Get inline styles for logo based on analysis
 */
export function getLogoStyles(analysis: LogoAnalysis): React.CSSProperties {
  const { recommendedSize, recommendedPosition } = analysis;
  
  return {
    width: recommendedSize.width,
    height: recommendedSize.height,
    maxWidth: recommendedSize.maxWidth,
    maxHeight: recommendedSize.maxHeight,
    objectFit: 'contain' as const,
    ...recommendedPosition.padding && {
      paddingTop: recommendedPosition.padding.top,
      paddingBottom: recommendedPosition.padding.bottom,
      paddingLeft: recommendedPosition.padding.left,
      paddingRight: recommendedPosition.padding.right
    }
  };
}

/**
 * Get Tailwind classes for logo container based on analysis
 */
export function getLogoContainerClasses(analysis: LogoAnalysis): string {
  const classes = ['flex', 'items-center'];
  
  // Positioning
  if (analysis.recommendedPosition.alignment === 'center') {
    classes.push('justify-center');
  } else if (analysis.recommendedPosition.alignment === 'right') {
    classes.push('justify-end');
  } else {
    classes.push('justify-start');
  }
  
  // Vertical alignment
  if (analysis.recommendedPosition.verticalAlignment === 'center') {
    classes.push('items-center');
  } else if (analysis.recommendedPosition.verticalAlignment === 'bottom') {
    classes.push('items-end');
  } else {
    classes.push('items-start');
  }
  
  return classes.join(' ');
}
