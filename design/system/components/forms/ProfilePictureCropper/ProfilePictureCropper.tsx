// ===============================================
// design/system/components/forms/ProfilePictureCropper/ProfilePictureCropper.tsx
// PROFILE PICTURE CROPPER - Instagram-style, no auto-zoom
// ===============================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
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
 * - Visar originalbilden i true 100% scale (ingen auto-zoom)
 * - Användaren zoomar/roterar manuellt
 * - Container är alltid kvadratisk
 * - object-fit: contain för att undvika stretching
 */
export const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  className
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1); // Start på 100% (true scale)
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);

  // Initialize crop when image loads - Instagram-style: 100% crop, no auto-zoom
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    // Spara naturlig storlek för crop-beräkningar
    setImageNaturalSize({ width: naturalWidth, height: naturalHeight });
    
    // Instagram-style: Starta alltid med 100% crop (ingen auto-zoom)
    // Bilden visas i sin naturliga storlek, användaren zoomar manuellt
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100, // Alltid 100% - ingen auto-zoom
        },
        1, // Kvadratisk (1:1)
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );
    
    setCrop(initialCrop);
    setScale(1); // Start på 100% zoom (true scale)
  }, []);

  // Convert crop to blob with crop data
  const getCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current || !imageNaturalSize) {
      return null;
    }

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = canvasRef.current;
      const crop = completedCrop;

      // Beräkna scale faktorer från visad bild till naturlig storlek
      // Vi behöver ta hänsyn till både CSS transform (scale) och faktisk bildstorlek
      const displayedWidth = image.width; // Visad bredd (efter CSS transform)
      const displayedHeight = image.height; // Visad höjd (efter CSS transform)
      
      // Scale faktorer för att konvertera från visad storlek till naturlig storlek
      const scaleX = imageNaturalSize.width / displayedWidth;
      const scaleY = imageNaturalSize.height / displayedHeight;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // Canvas storlek baserat på crop-området i naturlig storlek
      const pixelRatio = window.devicePixelRatio;
      const cropWidthNatural = crop.width * scaleX;
      const cropHeightNatural = crop.height * scaleY;
      
      canvas.width = cropWidthNatural * pixelRatio;
      canvas.height = cropHeightNatural * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      // Konvertera crop-koordinater från visad bild till naturlig storlek
      // Crop-koordinaterna är i visad bild-space, vi behöver konvertera till naturlig storlek
      const cropXNatural = crop.x * scaleX;
      const cropYNatural = crop.y * scaleY;

      // För rotation och zoom: vi behöver räkna med att bilden är transformerad
      const rotateRads = (rotate * Math.PI) / 180;
      const centerX = imageNaturalSize.width / 2;
      const centerY = imageNaturalSize.height / 2;

      ctx.save();

      // Flytta canvas origin till crop-områdets övre vänstra hörn
      ctx.translate(-cropXNatural, -cropYNatural);
      
      // Applicera rotation och zoom från bildens centrum
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.scale(scale, scale); // Applicera zoom
      ctx.translate(-centerX, -centerY);

      // Draw circular crop mask
      ctx.beginPath();
      ctx.arc(
        cropWidthNatural / 2,
        cropHeightNatural / 2,
        Math.min(cropWidthNatural, cropHeightNatural) / 2,
        0,
        2 * Math.PI
      );
      ctx.clip();

      // Rita bilden i sin naturliga storlek
      ctx.drawImage(
        image,
        0,
        0,
        imageNaturalSize.width,
        imageNaturalSize.height,
        0,
        0,
        imageNaturalSize.width,
        imageNaturalSize.height
      );

      ctx.restore();

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/png',
          0.95
        );
      });

      // Returnera crop data för backend (i naturlig bildstorlek)
      // Backend behöver veta var crop-området är i originalbilden
      const cropData = {
        x: Math.round(cropXNatural),
        y: Math.round(cropYNatural),
        width: Math.round(cropWidthNatural),
        height: Math.round(cropHeightNatural),
        zoom: scale,
        rotation: rotate,
        imageWidth: imageNaturalSize.width,
        imageHeight: imageNaturalSize.height
      };

      return { blob, cropData };
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, scale, rotate, imageNaturalSize]);

  const handleCropComplete = useCallback(async () => {
    try {
      const result = await getCroppedImage();
      if (result) {
        onCropComplete(result.blob, result.cropData);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [getCroppedImage, onCropComplete]);

  return (
    <div className={cn('profile-picture-cropper', className)}>
      <VStack spacing="lg">
        {/* Image with crop overlay */}
        <div className="profile-picture-cropper__container">
          <ReactCrop
            crop={crop}
            onChange={(percentCrop: Crop) => setCrop(percentCrop)}
            onComplete={(c: PixelCrop) => setCompletedCrop(c)}
            aspect={1} // Kvadratisk
            minWidth={50}
            minHeight={50}
            circularCrop={true}
            className="profile-picture-cropper__crop"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              crossOrigin="anonymous"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: 'none', // Ingen max-width - visa true size
                maxHeight: 'none',
                width: 'auto',
                height: 'auto',
                display: 'block',
                objectFit: 'contain' // Behåll aspect ratio
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {/* Hidden canvas for processing */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Controls */}
        <VStack spacing="md">
          {/* Zoom control */}
          <VStack spacing="xs">
            <Label size="sm" weight="medium">Zoom</Label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="profile-picture-cropper__slider"
            />
            <Body size="xs" color="secondary">{Math.round(scale * 100)}%</Body>
          </VStack>

          {/* Rotate control */}
          <VStack spacing="xs">
            <Label size="sm" weight="medium">Rotera</Label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
              className="profile-picture-cropper__slider"
            />
            <Body size="xs" color="secondary">{rotate}°</Body>
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
              disabled={!completedCrop || isProcessing}
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
