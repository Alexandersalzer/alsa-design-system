// ===============================================
// design/system/components/forms/ProfilePictureCropper/ProfilePictureCropper.tsx
// PROFILE PICTURE CROPPER - Instagram-style with react-easy-crop
// ===============================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
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
 * ProfilePictureCropper - Instagram-style profile picture cropper
 * 
 * - Visar hela bilden från början (dynamisk minZoom)
 * - Cirkulär crop mask
 * - objectFit="contain" (inte cover)
 * - Zoom och rotation
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

  // Beräkna minZoom dynamiskt baserat på bildstorlek och container
  const calculateMinZoom = useCallback((imageWidth: number, imageHeight: number, containerSize: number): number => {
    // Beräkna minZoom så att hela bilden passar inuti crop-området
    const calculatedMinZoom = Math.min(
      containerSize / imageWidth,
      containerSize / imageHeight
    );
    
    // Säkerställ att minZoom är minst 0.1 (10%) och max 1 (100%)
    return Math.max(0.1, Math.min(1, calculatedMinZoom));
  }, []);

  // När bilden laddas - sätt minZoom och initial zoom
  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number }) => {
    const { width, height } = mediaSize;
    setImageSize({ width, height });

    // Hämta container-storlek
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // Container är kvadratisk, använd minsta dimensionen
      const containerSize = Math.min(containerRect.width, containerRect.height);
      
      // Beräkna minZoom så att hela bilden syns
      const calculatedMinZoom = calculateMinZoom(width, height, containerSize);
      setMinZoom(calculatedMinZoom);
      
      // Sätt initial zoom till minZoom (så hela bilden syns)
      setZoom(calculatedMinZoom);
      
      // Centrera bilden
      setCrop({ x: 0, y: 0 });
    } else {
      // Fallback om container inte finns ännu
      const estimatedContainerSize = 400;
      const calculatedMinZoom = calculateMinZoom(width, height, estimatedContainerSize);
      setMinZoom(calculatedMinZoom);
      setZoom(calculatedMinZoom);
      setCrop({ x: 0, y: 0 });
    }
  }, [calculateMinZoom]);

  // När crop-området ändras (react-easy-crop callback)
  const onCropAreaComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Skapa cropped bild
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
      image.crossOrigin = 'anonymous';
    });

  // Konvertera radianer till grader
  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  // Rotera bild
  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  // Generera cropped bild som blob
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

    // Beräkna roterad bildstorlek
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // Sätt canvas-storlek till roterad bildstorlek
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Flytta canvas center till bildens center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Rita bilden
    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // Skapa ny canvas för cropped bild
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

  // Hantera bekräfta beskärning
  const handleCropComplete = useCallback(async () => {
    if (!croppedAreaPixels || !imageSize) {
      return;
    }

    setIsProcessing(true);

    try {
      // Skapa cropped bild
      const { blob } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      // Returnera crop data för backend
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
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1} // Kvadratisk (1:1)
            onCropChange={setCrop}
            onCropComplete={onCropAreaComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onMediaLoaded={onMediaLoaded}
            cropShape="round" // Cirkulär crop mask
            objectFit="contain" // Visa hela bilden (inte cover)
            minZoom={minZoom} // Dynamisk minZoom
            maxZoom={8} // Max zoom 8x
            restrictPosition={true} // Begränsa position
            showGrid={false} // Ingen grid
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
                objectFit: 'contain', // Viktigt: contain, inte cover
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
