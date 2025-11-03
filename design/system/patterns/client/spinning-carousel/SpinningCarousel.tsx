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
  images?: CarouselImage[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  
  // Image styling
  imageWidth?: string;
  imageHeight?: string;
  imageBorderRadius?: string;
  
  // Container styling
  containerHeight?: string;
  backgroundColor?: string;
  padding?: string;
  gap?: string;
  
  // Fade edges
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  
  // Animation behavior
  duplicateCount?: number;
  
  // Interactive
  onImageClick?: (image: CarouselImage) => void;
}

export const SpinningCarousel: React.FC<SpinningCarouselProps> = ({
  images = [
    { src: '/images/thumbnails/dayinthelife.png', alt: 'Day in the life UGC video', title: 'Day in the Life' },
    { src: '/images/thumbnails/dog.png', alt: 'Dog UGC video', title: 'Pet Content' },
    { src: '/images/thumbnails/gardenugc.png', alt: 'Garden UGC video', title: 'Garden Content' },
    { src: '/images/thumbnails/herboxa.png', alt: 'Herboxa UGC video', title: 'Product Review' },
    { src: '/images/thumbnails/instagramad.png', alt: 'Instagram ad', title: 'Instagram Ad' },
    { src: '/images/thumbnails/interviewvoxpop.png', alt: 'Interview vox pop', title: 'Interview Style' },
    { src: '/images/thumbnails/offer-swap-ad.png', alt: 'Offer swap ad', title: 'Promotional Ad' },
    { src: '/images/thumbnails/oldintro.png', alt: 'Old intro video', title: 'Intro Video' },
    { src: '/images/thumbnails/oliveoilugc.png', alt: 'Olive oil UGC', title: 'Food Content' },
    { src: '/images/thumbnails/one of my clients tiktok.png', alt: 'Client TikTok', title: 'TikTok Content' },
    { src: '/images/thumbnails/perfume.png', alt: 'Perfume UGC', title: 'Beauty Content' },
    { src: '/images/thumbnails/realestate.png', alt: 'Real estate content', title: 'Real Estate' }
  ],
  speed = 40,
  direction = 'left',
  className = '',
  
  // Image defaults - matching KJ Marketing carousel dimensions (portrait format)
  imageWidth = '280px',
  imageHeight = '450px',
  imageBorderRadius = '12px',
  
  // Container defaults - no background color
  containerHeight = 'auto',
  backgroundColor = 'transparent', // Ensure transparent background
  padding = '20px 0',
  gap = '20px',
  
  // Fade edges defaults - disabled to avoid background issues
  enableFadeEdges = false, // Disable fade edges to avoid background color issues
  fadeWidth = '150px',
  
  // Animation defaults
  duplicateCount = 4,
  
  onImageClick
}) => {
  // State for global hover effect
  const [isHovering, setIsHovering] = useState(false);

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
            display: 'component',
            transition: 'opacity 0.3s ease',
            opacity: isHovering ? 0.3 : 1, // Global opacity effect like KJ Marketing
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