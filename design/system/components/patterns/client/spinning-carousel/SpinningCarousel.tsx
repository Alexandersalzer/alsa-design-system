// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Image carousel using SpinningAnimation primitive
// ===============================================

'use client';

import React from 'react';
import { SpinningAnimation, SpinningAnimationItem } from '../../../../../system/components/primitives/SpinningAnimation';

interface SpinningCarouselProps {
  images?: Array<{
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  
  // Image sizing
  imageWidth?: string | number;
  imageHeight?: string | number;
  
  // Layout
  gap?: string | number;
  backgroundColor?: string;
  
  // Styling
  borderRadius?: string;
  showOverlay?: boolean;
}

export const SpinningCarousel: React.FC<SpinningCarouselProps> = ({
  images = [
    { src: '/images/carousel/image1.jpg', alt: 'Portfolio Image 1', title: 'UGC Video 1' },
    { src: '/images/carousel/image2.jpg', alt: 'Portfolio Image 2', title: 'TikTok Campaign' },
    { src: '/images/carousel/image3.jpg', alt: 'Portfolio Image 3', title: 'Brand Content' },
    { src: '/images/carousel/image4.jpg', alt: 'Portfolio Image 4', title: 'Social Media' },
    { src: '/images/carousel/image5.jpg', alt: 'Portfolio Image 5', title: 'Video Content' }
  ],
  speed = 25,
  direction = 'left',
  className = '',
  imageWidth = '300px',
  imageHeight = '400px',
  gap = '20px',
  backgroundColor = 'transparent',
  borderRadius = '12px',
  showOverlay = true
}) => {
  // Convert images to SpinningAnimationItem format
  const imageItems: SpinningAnimationItem[] = images.map((image, index) => ({
    id: `${image.src}-${index}`,
    content: (
      <div 
        className="carousel-image-container"
        style={{
          position: 'relative',
          borderRadius: borderRadius,
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        
        {/* Optional overlay with title/description */}
        {showOverlay && (image.title || image.description) && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '20px 16px 16px',
              color: 'white'
            }}
          >
            {image.title && (
              <h4 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {image.title}
              </h4>
            )}
            {image.description && (
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                opacity: 0.9 
              }}>
                {image.description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }));

  return (
    <SpinningAnimation
      items={imageItems}
      speed={speed}
      direction={direction}
      className={`spinning-carousel ${className}`}
      itemWidth={imageWidth}
      itemHeight={imageHeight}
      gap={gap}
      backgroundColor={backgroundColor}
      padding="0"
      fadeEdges={true}
      fadeWidth="100px"
      duplicates={4}
    />
  );
}; 