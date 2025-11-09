// ===============================================
// blimpify-ui/design/system/components/media/SimpleImage/SimpleImage.tsx
// Schema-driven Image component
// ===============================================

'use client';

import React from 'react';

interface SimpleImageProps {
  type?: string;
  props?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  };
}

export const SimpleImage = ({ type, props }: SimpleImageProps) => {
  if (!props?.src) {
    console.warn('SimpleImage: src prop is required');
    return null;
  }

  const {
    src,
    alt,
    width,
    height,
    className,
    objectFit = 'contain'
  } = props;

  const objectFitClass = objectFit === 'contain' ? 'object-contain' : 
                        objectFit === 'cover' ? 'object-cover' :
                        objectFit === 'fill' ? 'object-fill' :
                        objectFit === 'none' ? 'object-none' : 
                        'object-scale-down';

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${objectFitClass} ${className || ''}`}
    />
  );
};