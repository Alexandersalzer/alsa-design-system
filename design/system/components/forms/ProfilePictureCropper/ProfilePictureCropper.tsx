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
    console.log('[ProfilePictureCropper] onCropAreaComplete called:', {
      croppedArea, // Relative coordinates (0-1)
      croppedAreaPixels, // Absolute pixel coordinates in original image space
      imageSize,
      zoom
    });
    setCroppedAreaPixels(croppedAreaPixels);
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

    const rotRad = getRadianAngle(rotation);

    // Calculate rotated image size
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // Set canvas size to rotated image size
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Move canvas center to image center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw image
    ctx.drawImage(image, 0, 0);

    // IMPORTANT: pixelCrop coordinates are in the rotated image space
    // We need to extract the correct area from the rotated canvas
    // The coordinates are already in the rotated image coordinate system
    const data = ctx.getImageData(
      Math.max(0, Math.min(bBoxWidth - 1, pixelCrop.x)),
      Math.max(0, Math.min(bBoxHeight - 1, pixelCrop.y)),
      Math.min(pixelCrop.width, bBoxWidth - pixelCrop.x),
      Math.min(pixelCrop.height, bBoxHeight - pixelCrop.y)
    );

    // Create new canvas for cropped image
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.putImageData(
      data,
      0,
      0
    );

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

      // IMPORTANT: react-easy-crop with objectFit="contain" returns croppedAreaPixels
      // in the ORIGINAL image's coordinate space (512x512 in our case)
      // According to react-easy-crop docs, croppedAreaPixels is ALWAYS in original image space
      // regardless of zoom, so we can use them directly
      
      // The image is already normalized to 512x512, so croppedAreaPixels should already be correct
      // But we need to clamp them to ensure they're within bounds (0-512)
      const cropX = Math.max(0, Math.min(511, Math.round(finalCropArea.x)));
      const cropY = Math.max(0, Math.min(511, Math.round(finalCropArea.y)));
      const cropWidth = Math.max(1, Math.min(512 - cropX, Math.round(finalCropArea.width)));
      const cropHeight = Math.max(1, Math.min(512 - cropY, Math.round(finalCropArea.height)));
      
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
      const { blob } = await getCroppedImg(
        imageSrc,
        normalizedCropArea, // Use normalized coordinates for canvas cropping (same as backend)
        rotation
      );

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
