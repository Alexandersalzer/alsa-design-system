// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Using new Image component with CDN support
// ===============================================

'use client';

import React, { useState } from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';

export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
}


export const SpinningCarousel: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getComponent = componentProps(components);
  const getPatternProps = patternProps(patternNode);
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder(patternNode);

  const [isHovering, setIsHovering] = useState(false);

  // Extract pattern props with defaults
  const {
    speed = 40,
    direction = 'left',
    imageWidth = '280px',
    imageHeight = '450px',
    imageBorderRadius = '12px',
    containerHeight = 'auto',
    backgroundColor = 'transparent',
    padding = '20px 0',
    gap = '20px',
    enableFadeEdges = false,
    fadeWidth = '150px',
    duplicateCount = 4,
    onImageClick
  } = getPatternProps();

  // Extract images using the order from PatternNode
  const images: CarouselImage[] = componentOrder
    .reduce<CarouselImage[]>((acc, key) => {
      const component = components[key];
      if (!component || (component.type !== 'image' && component.type !== 'logo')) return acc;
      
      const src = component.props?.src || '';
      if (!src) return acc;
      
      acc.push({
        src,
        alt: component.props?.alt || 'Image',
        title: component.props?.title
      });
      
      return acc;
    }, []);

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
      className="spinning-carousel"
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