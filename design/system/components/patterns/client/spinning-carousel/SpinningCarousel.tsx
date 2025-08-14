// ===============================================
// design/system/components/patterns/client/spinning-carousel/SpinningCarousel.tsx
// SPINNING CAROUSEL PATTERN - Image carousel using SpinningAnimation primitive
// ===============================================

'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SpinningAnimation, SpinningAnimationItem } from '../../../../../system/components/primitives/SpinningAnimation';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigationMessaging } from '../../../../../system/utils/navigation';

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
  
  // Navigation
  isEditingMode?: boolean;
  navigationTarget?: string; // Target page to navigate to (e.g., '/about')
  
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
  
  // Navigation defaults
  isEditingMode = false,
  navigationTarget = '/about',
  
  onImageClick
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Setup navigation messaging
  const { handleNavigationClick } = useNavigationMessaging(
    router,
    pathname,
    isEditingMode,
    '🎠' // Carousel emoji for logging
  );
  // State for individual hover effects
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle navigation click
  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers
    console.log('🎠 Carousel navigation clicked, navigating to:', navigationTarget);
    
    // Extract slug from navigationTarget (e.g., '/about' -> 'about')
    const slug = navigationTarget.replace('/', '') || 'about';
    handleNavigationClick(navigationTarget, slug);
  };

  // Transform images into SpinningAnimationItem format
  const carouselItems: SpinningAnimationItem[] = images.map((image, index) => ({
    id: `${image.src}-${index}`,
    content: (
      <div
        className="carousel-image-container"
        onClick={() => onImageClick?.(image)}
        style={{
          cursor: 'pointer',
          borderRadius: imageBorderRadius,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
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
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: hoveredIndex === index ? 0.4 : 1,
            transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* Navigation Overlay Button */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: hoveredIndex === index ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: hoveredIndex === index ? 'auto' : 'none',
            zIndex: 10,
          }}
        >
          <Button
            variant="primary"
            size="lg"
            rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
            onClick={handleNavigation}
            style={{
              borderRadius: '50px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.3s ease',
            }}
          >
            Se Portfolio
          </Button>
        </div>
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