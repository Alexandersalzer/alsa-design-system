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
  // Calculate the minimum zoom required to fit the entire image inside the crop area
  // Using Math.max ensures the image fills at least one dimension (Instagram method)
  const zoom = Math.max(
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset state when image changes
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMinZoom(1);
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
    setImageSize({ width, height });
  }, []);

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
            setMinZoom(initialZoom);
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

      // Set minZoom to the calculated initial zoom (ensures we can't zoom out more than needed)
      setMinZoom(initialZoom);

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
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
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
    if (!croppedAreaPixels || !imageSize) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create cropped image
      const { blob } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      // Return crop data for backend
      const cropData = {
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
        zoom: zoom,
        rotation: rotation,
        imageWidth: imageSize.width,
        imageHeight: imageSize.height
      };

      onCropComplete(blob, cropData);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, rotation, zoom, imageSize, onCropComplete]);

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
            minZoom={minZoom} // Dynamic minZoom
            maxZoom={8} // Max zoom 8x
            restrictPosition={true} // Restrict position
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
              min={minZoom}
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
              disabled={!croppedAreaPixels || isProcessing}
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
