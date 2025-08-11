// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Image carousel using SpinningAnimation primitive
// ===============================================

'use client';

import React from 'react';
import { SpinningAnimation, SpinningAnimationItem } from '../../../../../system/components/primitives/SpinningAnimation';

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
  speed = 40, // Slower than logos for better viewing
  direction = 'left',
  className = '',
  
  // Image defaults - similar to KJ Marketing carousel
  imageWidth = '300px',
  imageHeight = '200px',
  imageBorderRadius = '12px',
  
  // Container defaults
  containerHeight = 'auto',
  backgroundColor = 'transparent',
  padding = '20px 0',
  gap = '20px',
  
  // Fade edges defaults
  enableFadeEdges = true,
  fadeWidth = '150px',
  
  // Animation defaults
  duplicateCount = 4, // Fewer duplicates needed for larger items
  
  onImageClick
}) => {
  // Transform images into SpinningAnimationItem format
  const carouselItems: SpinningAnimationItem[] = images.map((image, index) => ({
    id: `${image.src}-${index}`,
    content: (
      <div
        className="carousel-image-container"
        onClick={() => onImageClick?.(image)}
        style={{
          cursor: onImageClick ? 'pointer' : 'default',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          borderRadius: imageBorderRadius,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          if (onImageClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (onImageClick) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }
        }}
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
          }}
        />
        
        {/* Optional overlay for better text readability */}
        {image.title && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: 'white',
              padding: '20px 15px 15px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {image.title}
          </div>
        )}
      </div>
    )
  }));

  return (
    <SpinningAnimation
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