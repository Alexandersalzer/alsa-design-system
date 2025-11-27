// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Using new Image component with CDN support
// ===============================================

'use client';

import React, { useState } from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';

export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
}

export interface SpinningCarouselProps {
  components?: Record<string, {
    type: 'image' | 'video' | 'icon' | 'logo';
    content: {
      src: string;
      alt: string;
      title?: string;
    };
  }>;
  
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
  components,
  settings = {},
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

  // Merge settings with direct props
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

  // Transform components object into images array
  const images: CarouselImage[] = components
    ? Object.values(components)
        .filter(comp => comp.type === 'image' || comp.type === 'logo')
        .map(comp => ({
          src: comp.content.src,
          alt: comp.content.alt,
          title: comp.content.title
        }))
    : imagesProp || [];

  // Map radius string to Image component radius
  const getRadiusVariant = (radius: string): 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' => {
    const numericRadius = parseInt(radius);
    if (numericRadius <= 4) return 'sm';
    if (numericRadius <= 8) return 'md';
    if (numericRadius <= 12) return 'lg';
    if (numericRadius <= 16) return 'xl';
    if (radius.includes('full') || radius.includes('9999')) return 'full';
    return 'lg';
  };

  // Transform images into CarouselAnimationItem format using Image component
  const carouselItems: CarouselAnimationItem[] = images.map((image, index) => ({
    id: `${image.src}-${index}`,
    content: (
      <div
        className="carousel-image-wrapper"
        onClick={() => onImageClick?.(image)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          cursor: onImageClick ? 'pointer' : 'default',
          width: '100%',
          height: '100%',
          position: 'relative',
          opacity: isHovering ? 0.7 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <Image
          src={`${CDN_BASE_URL}${image.src}`}
          alt={image.alt}
          title={image.title}
          width="100%"
          height="100%"
          objectFit="cover"
          radius={getRadiusVariant(imageBorderRadius)}
          loading="lazy"
          showSkeleton={true}
          hoverZoom={!!onImageClick}
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