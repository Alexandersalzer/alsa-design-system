// ===============================================
// src/design-system/components/forms/ImageCropper/ImageCropper.tsx
// IMAGE CROPPER COMPONENT - Integrated with Design System
// ===============================================

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, type PixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '../../../utils/cn';
import { Button, VStack, HStack, Body, Label } from '../..';
import './ImageCropper.css';

export interface ImageCropperProps {
  imageSrc: string;
  aspect?: number; // Aspect ratio (width/height), e.g., 1 for square, 16/9 for widescreen
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  circularCrop?: boolean;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  aspect = 1,
  onCropComplete,
  onCancel,
  minWidth = 50,
  minHeight = 50,
  maxWidth,
  maxHeight,
  circularCrop = false,
  className
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize crop when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    // Create initial centered crop
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );
    
    setCrop(initialCrop);
  }, [aspect]);

  // Convert crop to blob
  const getCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = canvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = (rotate * Math.PI) / 180;
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      // Move canvas origin to center of image
      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);

      // Draw circular crop if needed
      if (circularCrop) {
        ctx.beginPath();
        ctx.arc(
          crop.width / 2,
          crop.height / 2,
          Math.min(crop.width, crop.height) / 2,
          0,
          2 * Math.PI
        );
        ctx.clip();
      }

      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );

      ctx.restore();

      // Convert to blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.95
        );
      });
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, scale, rotate, circularCrop]);

  const handleCropComplete = useCallback(async () => {
    try {
      const blob = await getCroppedImage();
      if (blob) {
        onCropComplete(blob);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [getCroppedImage, onCropComplete]);

  return (
    <div className={cn('image-cropper', className)}>
      <VStack spacing="lg">
        {/* Image with crop overlay */}
        <div className="image-cropper__container">
          <ReactCrop
            crop={crop}
            onChange={(percentCrop: Crop) => setCrop(percentCrop)}
            onComplete={(c: PixelCrop) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={minWidth}
            minHeight={minHeight}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            circularCrop={circularCrop}
            className="image-cropper__crop"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: '100%',
                maxHeight: '70vh'
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
          {/* Scale control */}
          <VStack spacing="xs">
            <Label size="sm" weight="medium">Zoom</Label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="image-cropper__slider"
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
              className="image-cropper__slider"
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

ImageCropper.displayName = 'ImageCropper';

export default ImageCropper;

