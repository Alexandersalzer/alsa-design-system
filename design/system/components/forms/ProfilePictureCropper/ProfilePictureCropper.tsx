// ===============================================
// design/system/components/forms/ProfilePictureCropper/ProfilePictureCropper.tsx
// PROFILE PICTURE CROPPER - Instagram-style with react-easy-crop
// ===============================================

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { cn } from '../../../utils/cn';
import { Button, VStack, HStack, Body, Label } from '../..';
import './ProfilePictureCropper.css';

export interface ProfilePictureCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob, cropData: { x: number; y: number; width: number; height: number; zoom: number; rotation: number; imageWidth: number; imageHeight: number }) => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Calculate initial zoom and position to center the image perfectly
 * 
 * @param imageWidth - Original image width
 * @param imageHeight - Original image height
 * @param cropSizePx - Size of the crop area (square, in pixels)
 * @returns { zoom, x, y } - Initial zoom and center position
 */
function getInitialZoomAndPosition(
  imageWidth: number,
  imageHeight: number,
  cropSizePx: number
): { zoom: number; x: number; y: number } {
  // Calculate the minimum zoom required to fit the ENTIRE image inside the crop area
  // Using Math.min ensures the entire image is visible (contain behavior)
  // This means:
  // - Wide images: scale to fit height (may have padding on sides)
  // - Tall images: scale to fit width (may have padding on top/bottom)
  // - Small images: scale up to fill at least one dimension
  const zoom = Math.min(
    cropSizePx / imageWidth,   // Scale to fit width
    cropSizePx / imageHeight   // Scale to fit height
  );

  // For react-easy-crop with objectFit="contain", centered position is always (0, 0)
  // The library handles centering automatically when the image is smaller than the container
  // or when zoomed to fit
  return {
    zoom: Math.max(0.1, Math.min(10, zoom)), // Clamp between 0.1 and 10
    x: 0,
    y: 0
  };
}

/**
 * ProfilePictureCropper - Instagram-style profile picture cropper
 * 
 * Guarantees:
 * - Image is always centered (horizontally and vertically)
 * - Image uses "contain" behavior (no parts cut off initially)
 * - Initial zoom shows entire image
 * - Works for all image sizes (small, wide, tall, transparent)
 */
export const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  className
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [minZoom, setMinZoom] = useState(1);
  const [initialZoom, setInitialZoom] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset state when image changes
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMinZoom(1);
    setInitialZoom(1);
    setIsInitialized(false);
    setImageSize(null);
    setCroppedAreaPixels(null);
  }, [imageSrc]);

  // Get crop area size from container
  const getCropSize = useCallback((): number => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Container is square (aspect-ratio: 1), use the smallest dimension
      // Subtract padding (16px on each side = 32px total)
      const padding = 32;
      return Math.min(rect.width, rect.height) - padding;
    }
    // Fallback size if container not ready
    return 400;
  }, []);

  // Store media size when image loads
  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number }) => {
    const { width, height } = mediaSize;
    console.log('[ProfilePictureCropper] onMediaLoaded:', { width, height });
    setImageSize({ width, height });
  }, []);

  // Fallback: Try to get image size from imageSrc if onMediaLoaded hasn't fired
  useEffect(() => {
    if (!imageSize && imageSrc) {
      const img = new Image();
      img.onload = () => {
        console.log('[ProfilePictureCropper] Fallback image load:', { width: img.width, height: img.height });
        setImageSize({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        console.error('[ProfilePictureCropper] Failed to load image for size detection');
      };
      img.src = imageSrc;
    }
  }, [imageSize, imageSrc]);

  // Initialize zoom and position after image size is set
  useEffect(() => {
    if (!imageSize || isInitialized) return;

    // Use requestAnimationFrame to ensure container is fully rendered
    requestAnimationFrame(() => {
      // Get crop area size
      const cropSize = getCropSize();

      if (cropSize <= 0) {
        // Container not ready, try again
        setTimeout(() => {
          const retrySize = getCropSize();
          if (retrySize > 0) {
            const { zoom: initialZoom, x, y } = getInitialZoomAndPosition(
              imageSize.width,
              imageSize.height,
              retrySize
            );
            // Set minZoom to allow zooming out (but not too much - minimum 10%)
            setMinZoom(Math.max(0.1, initialZoom * 0.5));
            setInitialZoom(initialZoom);
            setZoom(initialZoom);
            setCrop({ x, y });
            setIsInitialized(true);
          }
        }, 200);
        return;
      }

      // Calculate initial zoom and position using our function
      const { zoom: initialZoom, x, y } = getInitialZoomAndPosition(
        imageSize.width,
        imageSize.height,
        cropSize
      );

      console.log('[ProfilePictureCropper] Initializing:', {
        imageSize,
        cropSize,
        initialZoom,
        position: { x, y }
      });

      // Set minZoom to allow zooming out (but not too much - minimum 10%)
      // This allows users to zoom out if they want to see more of the image
      setMinZoom(Math.max(0.1, initialZoom * 0.5)); // Allow zooming out to 50% of initial zoom, but not less than 10%
      
      // Store initial zoom for position restriction logic
      setInitialZoom(initialZoom);

      // Set initial zoom and position
      setZoom(initialZoom);
      setCrop({ x, y });

      // Mark as initialized
      setIsInitialized(true);
    });
  }, [imageSize, isInitialized, getCropSize]);

  // Recalculate when container size changes (e.g., window resize)
  useEffect(() => {
    if (!isInitialized || !imageSize) return;

    const handleResize = () => {
      const cropSize = getCropSize();
      const { zoom: newZoom, x, y } = getInitialZoomAndPosition(
        imageSize.width,
        imageSize.height,
        cropSize
      );
      setMinZoom(newZoom);
      setZoom(newZoom);
      setCrop({ x, y });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isInitialized, imageSize, getCropSize]);

  // When crop area changes (react-easy-crop callback)
  const onCropAreaComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    // IMPORTANT: react-easy-crop returns croppedAreaPixels in the ORIGINAL image's coordinate space
    // (512x512 in our case). These coordinates are ALWAYS in original image space, regardless of zoom.
    //
    // However, when using objectFit="contain", the coordinates can be outside the image bounds
    // when the crop area extends beyond the visible image. We need to clamp them to the image bounds.
    
    if (!imageSize) {
      // If imageSize is not available yet, store croppedAreaPixels as-is
      // It will be clamped later in handleCropComplete
      setCroppedAreaPixels(croppedAreaPixels);
      return;
    }
    
    const imageWidth = imageSize.width; // Should be 512
    const imageHeight = imageSize.height; // Should be 512
    
    // Use croppedAreaPixels directly (already in original image space)
    // But clamp to image bounds
    let clampedArea: Area = {
      x: Math.max(0, Math.min(imageWidth - 1, Math.round(croppedAreaPixels.x))),
      y: Math.max(0, Math.min(imageHeight - 1, Math.round(croppedAreaPixels.y))),
      width: Math.max(1, Math.min(imageWidth, Math.round(croppedAreaPixels.width))),
      height: Math.max(1, Math.min(imageHeight, Math.round(croppedAreaPixels.height)))
    };
    
    // Adjust width/height if they extend beyond image bounds
    if (clampedArea.x + clampedArea.width > imageWidth) {
      clampedArea.width = imageWidth - clampedArea.x;
    }
    if (clampedArea.y + clampedArea.height > imageHeight) {
      clampedArea.height = imageHeight - clampedArea.y;
    }
    
    // Ensure we have a square crop (1:1 aspect ratio)
    // Take the smaller dimension to ensure it fits
    const minDimension = Math.min(clampedArea.width, clampedArea.height);
    clampedArea.width = minDimension;
    clampedArea.height = minDimension;
    
    // Adjust x/y if needed to keep within bounds
    if (clampedArea.x + clampedArea.width > imageWidth) {
      clampedArea.x = imageWidth - clampedArea.width;
    }
    if (clampedArea.y + clampedArea.height > imageHeight) {
      clampedArea.y = imageHeight - clampedArea.height;
    }
    
    console.log('[ProfilePictureCropper] onCropAreaComplete called:', {
      croppedArea, // Relative coordinates (0-1)
      croppedAreaPixels, // Absolute pixel coordinates from react-easy-crop (in original image space)
      clampedArea, // Clamped and squared to image bounds
      imageSize,
      zoom
    });
    setCroppedAreaPixels(clampedArea);
  }, [imageSize, zoom]);

  // Create image element from URL
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
      image.crossOrigin = 'anonymous';
    });

  // Convert degrees to radians
  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  // Calculate rotated image size
  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  // Generate cropped image as blob
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<{ blob: Blob; url: string }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // IMPORTANT: pixelCrop coordinates are in the ORIGINAL (non-rotated) image space (512x512)
    // We need to extract the crop area from the original image, then rotate if needed
    
    // Set canvas size to crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped area from the original image
    // pixelCrop coordinates are already in original image space (512x512)
    ctx.drawImage(
      image,
      pixelCrop.x,      // Source x
      pixelCrop.y,      // Source y
      pixelCrop.width,  // Source width
      pixelCrop.height, // Source height
      0,                // Destination x
      0,                // Destination y
      pixelCrop.width,  // Destination width
      pixelCrop.height  // Destination height
    );

    // Apply rotation if needed (rotate the cropped canvas)
    if (rotation !== 0 && Math.abs(rotation) > 0.1) {
      const rotRad = getRadianAngle(rotation);
      const rotatedCanvas = document.createElement('canvas');
      const rotatedCtx = rotatedCanvas.getContext('2d');
      
      if (!rotatedCtx) {
        throw new Error('No 2d context for rotation');
      }

      // Calculate rotated size
      const { width: rotatedWidth, height: rotatedHeight } = rotateSize(
        pixelCrop.width,
        pixelCrop.height,
        rotation
      );

      rotatedCanvas.width = rotatedWidth;
      rotatedCanvas.height = rotatedHeight;

      // Rotate and draw
      rotatedCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
      rotatedCtx.rotate(rotRad);
      rotatedCtx.drawImage(canvas, -pixelCrop.width / 2, -pixelCrop.height / 2);

      // Use rotated canvas
      return new Promise((resolve, reject) => {
        rotatedCanvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        }, 'image/png');
      });
    }

    // No rotation, return cropped canvas
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      }, 'image/png');
    });
  };

  // Handle crop confirmation
  const handleCropComplete = useCallback(async () => {
    console.log('[ProfilePictureCropper] handleCropComplete called', {
      imageSize,
      croppedAreaPixels,
      isProcessing
    });

    // If imageSize is not available, use default 512x512 (normalized image)
    let finalImageSize = imageSize;
    if (!finalImageSize) {
      console.warn('[ProfilePictureCropper] No image size, using default 512x512');
      finalImageSize = { width: 512, height: 512 };
    }

    if (isProcessing) {
      console.warn('[ProfilePictureCropper] Already processing');
      return;
    }

    if (!croppedAreaPixels) {
      console.warn('[ProfilePictureCropper] No crop area pixels, but proceeding anyway...');
      // Don't return - let the function try to calculate it
    }

    setIsProcessing(true);

    try {
      // If croppedAreaPixels is not available, we need to calculate it
      // This can happen if onCropAreaComplete hasn't fired yet
      let finalCropArea = croppedAreaPixels;
      
      if (!finalCropArea) {
        console.log('[ProfilePictureCropper] Calculating crop area manually...');
        // We need to get the crop area from react-easy-crop
        // For now, we'll use a workaround: trigger a manual calculation
        // by getting the current crop state and calculating the area
        
        // Get the crop size
        const cropSize = getCropSize();
        
        // Calculate the displayed image size at current zoom
        const displayedWidth = finalImageSize.width * zoom;
        const displayedHeight = finalImageSize.height * zoom;
        
        // Calculate crop area in pixels (centered crop)
        // The crop area is a square of size cropSize, centered in the displayed image
        const cropX = (displayedWidth - cropSize) / 2 + crop.x;
        const cropY = (displayedHeight - cropSize) / 2 + crop.y;
        
        finalCropArea = {
          x: Math.max(0, Math.round(cropX)),
          y: Math.max(0, Math.round(cropY)),
          width: Math.min(cropSize, Math.round(displayedWidth)),
          height: Math.min(cropSize, Math.round(displayedHeight))
        };
        
        console.log('[ProfilePictureCropper] Calculated crop area:', finalCropArea);
      }

      // IMPORTANT: react-easy-crop with objectFit="contain" can return croppedAreaPixels
      // that are OUTSIDE the image bounds when the image is zoomed out or positioned outside
      // We need to clamp the crop area to the actual image bounds (512x512)
      
      // The image is 512x512, so we need to ensure crop area is within [0, 512] for both x/y and width/height
      // If crop area extends outside, we need to adjust it to fit within bounds
      
      // Calculate the actual crop area within image bounds
      // If x/y is negative, start from 0 and reduce width/height accordingly
      // If width/height extends beyond 512, clamp it
      let cropX = Math.round(finalCropArea.x);
      let cropY = Math.round(finalCropArea.y);
      let cropWidth = Math.round(finalCropArea.width);
      let cropHeight = Math.round(finalCropArea.height);
      
      // Adjust if crop starts outside image bounds (negative coordinates)
      if (cropX < 0) {
        cropWidth += cropX; // Reduce width by the negative offset
        cropX = 0;
      }
      if (cropY < 0) {
        cropHeight += cropY; // Reduce height by the negative offset
        cropY = 0;
      }
      
      // Clamp to image bounds (512x512)
      cropX = Math.max(0, Math.min(511, cropX));
      cropY = Math.max(0, Math.min(511, cropY));
      const maxWidth = 512 - cropX;
      const maxHeight = 512 - cropY;
      cropWidth = Math.max(1, Math.min(maxWidth, cropWidth));
      cropHeight = Math.max(1, Math.min(maxHeight, cropHeight));
      
      const normalizedCropArea = {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
      };

      console.log('[ProfilePictureCropper] ===== CROP DATA =====');
      console.log('[ProfilePictureCropper] Original crop area from react-easy-crop:', finalCropArea);
      console.log('[ProfilePictureCropper] Normalized crop area (clamped to 512x512):', normalizedCropArea);
      console.log('[ProfilePictureCropper] Image size:', finalImageSize);
      console.log('[ProfilePictureCropper] Current zoom:', zoom);
      console.log('[ProfilePictureCropper] Current crop position:', crop);
      console.log('[ProfilePictureCropper] Current rotation:', rotation);
      console.log('[ProfilePictureCropper] ====================');

      // Create cropped image (this creates a preview blob for frontend)
      // Use the same coordinates that we send to backend for consistency
      console.log('[ProfilePictureCropper] Calling getCroppedImg with:', {
        imageSrc: imageSrc.substring(0, 50) + '...',
        normalizedCropArea,
        rotation
      });
      
      const { blob } = await getCroppedImg(
        imageSrc,
        normalizedCropArea, // Use normalized coordinates for canvas cropping (same as backend)
        rotation
      );
      
      console.log('[ProfilePictureCropper] getCroppedImg returned blob:', {
        size: blob.size,
        type: blob.type
      });

      // Return crop data for backend (use normalized coordinates for 512x512 image)
      const cropData = {
        x: normalizedCropArea.x,
        y: normalizedCropArea.y,
        width: normalizedCropArea.width,
        height: normalizedCropArea.height,
        zoom: 1, // Not used by backend since image is already normalized to 512x512
        rotation: rotation,
        imageWidth: finalImageSize.width,
        imageHeight: finalImageSize.height
      };

      console.log('[ProfilePictureCropper] Crop complete, calling onCropComplete with:', cropData);
      onCropComplete(blob, cropData);
    } catch (error) {
      console.error('[ProfilePictureCropper] Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, rotation, zoom, imageSize, onCropComplete, crop, getCropSize]);

  return (
    <div className={cn('profile-picture-cropper', className)}>
      <VStack spacing="lg">
        {/* Image with crop overlay */}
        <div 
          ref={containerRef}
          className="profile-picture-cropper__container"
        >
          <Cropper
            key={imageSrc} // Force re-render when image changes
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1} // Square (1:1)
            onCropChange={setCrop}
            onCropComplete={onCropAreaComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onMediaLoaded={onMediaLoaded}
            cropShape="round" // Circular crop mask
            objectFit="contain" // Show entire image (not cover)
            minZoom={0.1} // Allow zooming out to 10% (slider controls the actual min)
            maxZoom={8} // Max zoom 8x
            restrictPosition={zoom >= initialZoom} // Only restrict position when zoomed in (allow free movement when zoomed out)
            showGrid={false} // No grid
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'var(--surface-secondary, #f5f5f5)',
                borderRadius: 'var(--radius-md, 8px)',
              },
              cropAreaStyle: {
                border: '2px solid var(--accent-600, #3b82f6)',
              },
              mediaStyle: {
                objectFit: 'contain', // Important: contain, not cover
                maxWidth: 'none', // Disable contain shrinking
                maxHeight: 'none', // Disable contain shrinking
              },
            }}
          />
        </div>

        {/* Controls */}
        <VStack spacing="md">
          {/* Zoom control */}
          <VStack spacing="xs">
            <Label size="sm" weight="medium">Zoom</Label>
            <input
              type="range"
              min={0.1}
              max={8}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="profile-picture-cropper__slider"
            />
            <Body size="xs" color="secondary">{Math.round(zoom * 100)}%</Body>
          </VStack>

          {/* Rotate control */}
          <VStack spacing="xs">
            <Label size="sm" weight="medium">Rotera</Label>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="profile-picture-cropper__slider"
            />
            <Body size="xs" color="secondary">{rotation}°</Body>
          </VStack>

          {/* Actions */}
          <HStack spacing="sm" justify="end">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Avbryt
            </Button>
            <Button
              variant="primary"
              onClick={handleCropComplete}
              loading={isProcessing}
              disabled={isProcessing}
            >
              Bekräfta beskärning
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </div>
  );
};

ProfilePictureCropper.displayName = 'ProfilePictureCropper';

export default ProfilePictureCropper;
