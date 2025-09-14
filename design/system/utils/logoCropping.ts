// ===============================================
// src/design-system/utils/logoCropping.ts
// SMART LOGO CROPPING - Auto-crop logos for clean rectangular form
// ===============================================

// ===== TYPE DEFINITIONS =====
export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LogoCroppingOptions {
  /** Target aspect ratio for the cropped logo */
  targetAspectRatio?: number;
  /** Maximum size for the cropped logo */
  maxSize?: { width: number; height: number };
  /** Minimum size for the cropped logo */
  minSize?: { width: number; height: number };
  /** Padding around the cropped region */
  padding?: number;
  /** Strategy for finding the best crop region */
  strategy?: 'center' | 'smart' | 'content-aware';
}

export interface CroppedLogoResult {
  /** The cropped image as data URL */
  croppedImageUrl: string;
  /** The crop region that was used */
  cropRegion: CropRegion;
  /** Whether cropping was applied */
  wasCropped: boolean;
  /** Original dimensions */
  originalDimensions: { width: number; height: number };
  /** Cropped dimensions */
  croppedDimensions: { width: number; height: number };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate the best crop region for a logo
 */
function calculateBestCropRegion(
  imageWidth: number,
  imageHeight: number,
  targetAspectRatio: number,
  strategy: 'center' | 'smart' | 'content-aware' = 'smart'
): CropRegion {
  const imageAspectRatio = imageWidth / imageHeight;
  
  // If image is already close to target ratio, crop minimally
  if (Math.abs(imageAspectRatio - targetAspectRatio) < 0.1) {
    return {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight
    };
  }
  
  let cropWidth: number;
  let cropHeight: number;
  let x: number;
  let y: number;
  
  if (imageAspectRatio > targetAspectRatio) {
    // Image is wider than target - crop width
    cropHeight = imageHeight;
    cropWidth = imageHeight * targetAspectRatio;
    x = (imageWidth - cropWidth) / 2;
    y = 0;
  } else {
    // Image is taller than target - crop height
    cropWidth = imageWidth;
    cropHeight = imageWidth / targetAspectRatio;
    x = 0;
    y = (imageHeight - cropHeight) / 2;
  }
  
  // Apply smart cropping strategies
  switch (strategy) {
    case 'center':
      // Already calculated above
      break;
      
    case 'smart':
      // For logos, prefer to keep the center and upper portion
      // This helps preserve text and main logo elements
      if (imageAspectRatio > targetAspectRatio) {
        // When cropping width, prefer left-aligned (logo text usually starts left)
        x = Math.max(0, x - cropWidth * 0.1);
      } else {
        // When cropping height, prefer upper portion
        y = Math.max(0, y - cropHeight * 0.1);
      }
      break;
      
    case 'content-aware':
      // This would analyze the image content to find the best region
      // For now, fall back to smart cropping
      // In the future, this could use edge detection or saliency maps
      break;
  }
  
  // Ensure crop region is within image bounds
  x = Math.max(0, Math.min(x, imageWidth - cropWidth));
  y = Math.max(0, Math.min(y, imageHeight - cropHeight));
  cropWidth = Math.min(cropWidth, imageWidth - x);
  cropHeight = Math.min(cropHeight, imageHeight - y);
  
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight)
  };
}

/**
 * Analyze image to find content-rich regions
 */
async function analyzeImageContent(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Promise<{ centerOfMass: { x: number; y: number }; densityMap: number[][] }> {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;
  const densityMap: number[][] = [];
  
  // Create a grid for density analysis
  const gridSize = 10;
  const gridWidth = Math.ceil(canvas.width / gridSize);
  const gridHeight = Math.ceil(canvas.height / gridSize);
  
  // Initialize density map
  for (let i = 0; i < gridHeight; i++) {
    densityMap[i] = new Array(gridWidth).fill(0);
  }
  
  // Analyze each pixel
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % canvas.width;
    const y = Math.floor(pixelIndex / canvas.width);
    
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Calculate pixel "importance" based on contrast from white/black
    const brightness = (r + g + b) / 3;
    const contrast = Math.abs(brightness - 128); // Distance from middle gray
    const importance = contrast / 255; // Normalize to 0-1
    
    // Add to center of mass calculation
    totalWeight += importance;
    weightedX += x * importance;
    weightedY += y * importance;
    
    // Add to density map
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    if (gridX < gridWidth && gridY < gridHeight) {
      densityMap[gridY][gridX] += importance;
    }
  }
  
  return {
    centerOfMass: {
      x: totalWeight > 0 ? weightedX / totalWeight : canvas.width / 2,
      y: totalWeight > 0 ? weightedY / totalWeight : canvas.height / 2
    },
    densityMap
  };
}

// ===== MAIN CROPPING FUNCTION =====

/**
 * Smart crop a logo image for optimal display in sidebar
 */
export async function smartCropLogo(
  imageUrl: string,
  options: LogoCroppingOptions = {}
): Promise<CroppedLogoResult> {
  const {
    targetAspectRatio = 3, // 3:1 ratio for sidebar (wider than tall)
    maxSize = { width: 120, height: 40 },
    minSize = { width: 60, height: 20 },
    padding = 4,
    strategy = 'smart'
  } = options;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = async () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
  // Check if cropping is needed
  const needsCropping = Math.abs((originalWidth / originalHeight) - targetAspectRatio) > 0.2;
  
  // For very square logos (emblem/symbol), always apply some cropping to make them fit better
  const isVerySquare = Math.abs((originalWidth / originalHeight) - 1) < 0.3;
  const forceCropping = isVerySquare && targetAspectRatio > 1.2;
        
        if (!needsCropping && !forceCropping) {
          // No cropping needed, return original
          resolve({
            croppedImageUrl: imageUrl,
            cropRegion: { x: 0, y: 0, width: originalWidth, height: originalHeight },
            wasCropped: false,
            originalDimensions: { width: originalWidth, height: originalHeight },
            croppedDimensions: { width: originalWidth, height: originalHeight }
          });
          return;
        }
        
        // Create canvas for analysis and cropping
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        // Set canvas size to original image size for analysis
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        
        // Draw image for analysis
        ctx.drawImage(img, 0, 0);
        
        // Calculate best crop region
        let cropRegion = calculateBestCropRegion(
          originalWidth,
          originalHeight,
          targetAspectRatio,
          strategy
        );
        
        // Apply content-aware cropping if strategy is 'content-aware'
        if (strategy === 'content-aware') {
          try {
            const analysis = await analyzeImageContent(canvas, ctx);
            
            // Adjust crop region to center around content
            const contentCenterX = analysis.centerOfMass.x;
            const contentCenterY = analysis.centerOfMass.y;
            
            // Adjust crop region to better center around content
            const newX = Math.max(0, Math.min(
              contentCenterX - cropRegion.width / 2,
              originalWidth - cropRegion.width
            ));
            const newY = Math.max(0, Math.min(
              contentCenterY - cropRegion.height / 2,
              originalHeight - cropRegion.height
            ));
            
            cropRegion = {
              ...cropRegion,
              x: Math.round(newX),
              y: Math.round(newY)
            };
          } catch (error) {
            console.warn('Content analysis failed, falling back to smart cropping:', error);
          }
        }
        
        // Add padding to crop region
        const paddedRegion = {
          x: Math.max(0, cropRegion.x - padding),
          y: Math.max(0, cropRegion.y - padding),
          width: Math.min(originalWidth - Math.max(0, cropRegion.x - padding), cropRegion.width + padding * 2),
          height: Math.min(originalHeight - Math.max(0, cropRegion.y - padding), cropRegion.height + padding * 2)
        };
        
        // Create final cropped canvas
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        
        if (!croppedCtx) {
          reject(new Error('Could not create cropped canvas context'));
          return;
        }
        
        // Set final canvas size
        croppedCanvas.width = Math.min(maxSize.width, paddedRegion.width);
        croppedCanvas.height = Math.min(maxSize.height, paddedRegion.height);
        
        // Ensure minimum size
        croppedCanvas.width = Math.max(minSize.width, croppedCanvas.width);
        croppedCanvas.height = Math.max(minSize.height, croppedCanvas.height);
        
        // Draw cropped portion with high quality
        croppedCtx.imageSmoothingEnabled = true;
        croppedCtx.imageSmoothingQuality = 'high';
        croppedCtx.drawImage(
          img,
          paddedRegion.x, paddedRegion.y, paddedRegion.width, paddedRegion.height,
          0, 0, croppedCanvas.width, croppedCanvas.height
        );
        
        // Convert to data URL
        const croppedImageUrl = croppedCanvas.toDataURL('image/png', 0.9);
        
        console.log('🎨 Logo cropped successfully:', {
          original: { width: originalWidth, height: originalHeight },
          cropped: { width: croppedCanvas.width, height: croppedCanvas.height },
          cropRegion: paddedRegion,
          aspectRatio: {
            original: originalWidth / originalHeight,
            target: targetAspectRatio,
            cropped: croppedCanvas.width / croppedCanvas.height
          },
          strategy
        });
        
        resolve({
          croppedImageUrl,
          cropRegion: paddedRegion,
          wasCropped: true,
          originalDimensions: { width: originalWidth, height: originalHeight },
          croppedDimensions: { width: croppedCanvas.width, height: croppedCanvas.height }
        });
        
      } catch (error) {
        console.error('Logo cropping error:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('Image load error:', error);
      reject(new Error("Failed to load image for cropping"));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Get recommended cropping options for different use cases and logo types
 */
export function getCroppingOptionsForUseCase(
  useCase: 'sidebar' | 'header' | 'compact' | 'full',
  logoType?: 'text' | 'wordmark' | 'emblem' | 'symbol' | 'lettermark' | 'combination' | 'unknown'
): LogoCroppingOptions {
  switch (useCase) {
    case 'sidebar':
      // Different cropping strategies based on logo type
      if (logoType === 'emblem' || logoType === 'symbol' || logoType === 'lettermark') {
        // Square logos - make them smaller and more square
        return {
          targetAspectRatio: 1.2, // 1.2:1 - less wide for square logos
          maxSize: { width: 32, height: 28 },   // Mindre för kvadratiska logotyper
          minSize: { width: 24, height: 20 },   // Mindre minimum
          padding: 2,  // Mindre padding för kvadratiska logotyper
          strategy: 'center' // Center cropping for square logos
        };
      } else if (logoType === 'text' || logoType === 'wordmark') {
        // Text logos - make them wider
        return {
          targetAspectRatio: 3.5, // 3.5:1 - wide for text logos
          maxSize: { width: 140, height: 40 },  // Mindre för text
          minSize: { width: 80, height: 24 },  // Mindre minimum
          padding: 4,  // Mindre padding för text logotyper
          strategy: 'smart' // Smart cropping for text logos
        };
      } else if (logoType === 'combination') {
        // Combination logos - balanced approach
        return {
          targetAspectRatio: 2.2, // 2.2:1 - moderately wide
          maxSize: { width: 120, height: 40 },  // Mindre balanserad storlek
          minSize: { width: 60, height: 24 },   // Mindre minimum
          padding: 3,  // Mindre padding
          strategy: 'smart'
        };
      } else if (logoType === 'unknown') {
        // Unknown logos - conservative approach
        return {
          targetAspectRatio: 2.5, // 2.5:1 - conservative ratio
          maxSize: { width: 120, height: 48 },  // Conservative size
          minSize: { width: 60, height: 24 },   // Conservative minimum
          padding: 4,  // Conservative padding
          strategy: 'center' // Center cropping for unknown
        };
      } else {
        // Default for undefined or other types
        return {
          targetAspectRatio: 2.5, // 2.5:1 - default moderately wide rectangle
          maxSize: { width: 120, height: 48 },  // Mindre default storlek
          minSize: { width: 60, height: 24 },   // Mindre minimum
          padding: 4,  // Mindre padding
          strategy: 'smart'
        };
      }
      
    case 'header':
      return {
        targetAspectRatio: 2, // 2:1 - moderately wide
        maxSize: { width: 200, height: 100 },
        minSize: { width: 100, height: 50 },
        padding: 6,
        strategy: 'smart'
      };
      
    case 'compact':
      return {
        targetAspectRatio: 2.5, // 2.5:1
        maxSize: { width: 150, height: 60 },
        minSize: { width: 75, height: 30 },
        padding: 3,
        strategy: 'center'
      };
      
    case 'full':
      return {
        targetAspectRatio: 2, // 2:1
        maxSize: { width: 300, height: 150 },
        minSize: { width: 150, height: 75 },
        padding: 8,
        strategy: 'content-aware'
      };
      
    default:
      return {
        targetAspectRatio: 3,
        maxSize: { width: 120, height: 40 },
        minSize: { width: 60, height: 20 },
        padding: 4,
        strategy: 'smart'
      };
  }
}
