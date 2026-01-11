// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Using new Image component with CDN support
// ===============================================

'use client';

import React from 'react';
import Link from 'next/link';
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

  // Extract pattern props with defaults
  const {
    speed = 30,
    direction = 'left',
    imageWidth = '280px',
    imageHeight = '450px',
    imageBorderRadius = '12px',
    containerHeight = 'auto',
    backgroundColor = 'transparent',
    padding = '20px 0',
    gap = '20px',
    enableFadeEdges = true,
    fadeWidth = '200px',
    duplicateCount = 6,
    href,
    onImageClick
  } = getPatternProps();

  // Extract images using the order from PatternNode, including component keys
  const images: (CarouselImage & { componentKey: string })[] = componentOrder
    .reduce<(CarouselImage & { componentKey: string })[]>((acc, key) => {
      const component = components[key];
      if (!component || (component.type !== 'image' && component.type !== 'logo')) return acc;
      
      const src = component.props?.src || '';
      if (!src) return acc;
      
      acc.push({
        src,
        alt: component.props?.alt || 'Image',
        title: component.props?.title,
        componentKey: key
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
  const carouselItems: CarouselAnimationItem[] = images.map((image, index) => {
    const imageContent = (
      <div
        className="carousel-image-wrapper"
        {...(!href && onImageClick ? { onClick: () => onImageClick(image) } : {})}
        style={{
          cursor: href || onImageClick ? 'pointer' : 'default',
          width: '100%',
          height: '100%',
          position: 'relative'
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
          loading={index < 3 ? "eager" : "lazy"}
          loadingType="skeleton"
          showSkeleton={true}
          rootMargin="1000px"
          hoverZoom={false}
        />
      </div>
    );

    return {
      id: `${image.src}-${index}`,
      componentKey: image.componentKey,
      content: href ? (
        <Link href={href} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
          {imageContent}
        </Link>
      ) : (
        imageContent
      )
    };
  });

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
      enableHover={true}
    />
  );
};