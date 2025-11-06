// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Image carousel using SpinningAnimation primitive
// ===============================================

'use client';

import React, { useState } from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';

export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
}

export interface SpinningCarouselProps {
  // NEW: Accept components object like other patterns
  components?: Record<string, {
    type: 'image' | 'video' | 'icon' | 'logo';
    content: {
      src: string;
      alt: string;
      title?: string;
    };
  }>;
  
  // NEW: Accept settings object like other patterns
  settings?: {
    speed?: number;
    direction?: 'left' | 'right';
    imageWidth?: string;
    imageHeight?: string;
    imageBorderRadius?: string;
    containerHeight?: string;
    backgroundColor?: string;
    padding?: string;
    gap?: string;
    enableFadeEdges?: boolean;
    fadeWidth?: string;
    duplicateCount?: number;
  };
  
  // OLD: Keep for backwards compatibility
  images?: CarouselImage[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageBorderRadius?: string;
  containerHeight?: string;
  backgroundColor?: string;
  padding?: string;
  gap?: string;
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  duplicateCount?: number;
  onImageClick?: (image: CarouselImage) => void;
}

export const SpinningCarousel: React.FC<SpinningCarouselProps> = ({
  // NEW props
  components,
  settings = {},
  
  // OLD props (fallbacks)
  images: imagesProp,
  speed: speedProp = 40,
  direction: directionProp = 'left',
  className = '',
  imageWidth: imageWidthProp = '280px',
  imageHeight: imageHeightProp = '450px',
  imageBorderRadius: imageBorderRadiusProp = '12px',
  containerHeight: containerHeightProp = 'auto',
  backgroundColor: backgroundColorProp = 'transparent',
  padding: paddingProp = '20px 0',
  gap: gapProp = '20px',
  enableFadeEdges: enableFadeEdgesProp = false,
  fadeWidth: fadeWidthProp = '150px',
  duplicateCount: duplicateCountProp = 4,
  onImageClick
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Merge settings with direct props (settings take priority)
  const speed = settings.speed ?? speedProp;
  const direction = settings.direction ?? directionProp;
  const imageWidth = settings.imageWidth ?? imageWidthProp;
  const imageHeight = settings.imageHeight ?? imageHeightProp;
  const imageBorderRadius = settings.imageBorderRadius ?? imageBorderRadiusProp;
  const containerHeight = settings.containerHeight ?? containerHeightProp;
  const backgroundColor = settings.backgroundColor ?? backgroundColorProp;
  const padding = settings.padding ?? paddingProp;
  const gap = settings.gap ?? gapProp;
  const enableFadeEdges = settings.enableFadeEdges ?? enableFadeEdgesProp;
  const fadeWidth = settings.fadeWidth ?? fadeWidthProp;
  const duplicateCount = settings.duplicateCount ?? duplicateCountProp;

  // Transform components object into images array OR use imagesProp
  const images: CarouselImage[] = components
    ? Object.values(components)
        .filter(comp => comp.type === 'image' || comp.type === 'logo')
        .map(comp => ({
          src: comp.content.src,
          alt: comp.content.alt,
          title: comp.content.title
        }))
    : imagesProp || [];

  // Transform images into CarouselAnimationItem format
  const carouselItems: CarouselAnimationItem[] = images.map((image, index) => ({
    id: `${image.src}-${index}`,
    content: (
      <div
        className="carousel-image-container"
        onClick={() => onImageClick?.(image)}
        style={{
          cursor: onImageClick ? 'pointer' : 'default',
          borderRadius: imageBorderRadius,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={image.src}
          alt={image.alt}
          title={image.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.3s ease',
            opacity: isHovering ? 0.3 : 1,
          }}
        />
      </div>
    )
  }));

  return (
    <CarouselAnimation
      items={carouselItems}
      speed={speed}
      direction={direction}
      className={`spinning-carousel ${className}`}
      
      containerHeight={containerHeight}
      backgroundColor={backgroundColor}
      padding={padding}
      
      itemWidth={imageWidth}
      itemHeight={imageHeight}
      itemPadding="0"
      gap={gap}
      
      enableFadeEdges={enableFadeEdges}
      fadeWidth={fadeWidth}
      
      duplicateCount={duplicateCount}
    />
  );
};