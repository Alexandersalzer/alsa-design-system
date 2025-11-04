'use client';

import React from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';

interface SpinningBannerProps {
  // ===== NEW: JSON STRUCTURE SUPPORT =====
  type?: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  settings?: {
    speed?: number;
    direction?: 'left' | 'right';
  };
  
  // ===== LEGACY PROPS =====
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  speed?: number; // Animation speed in seconds
  direction?: 'left' | 'right';
  className?: string;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  // NEW: JSON Structure
  type,
  components,
  settings,
  
  // Legacy props
  logos: legacyLogos,
  speed: legacySpeed,
  direction: legacyDirection,
  className = ''
}) => {
  // ===== EXTRACT DATA FROM JSON COMPONENTS OR USE LEGACY PROPS =====
  let logos: Array<{ src: string; alt: string; width?: number; height?: number; }>;
  let speed: number;
  let direction: 'left' | 'right';

  if (components) {
    // Extract logos from JSON structure
    const logoComponents = Object.entries(components)
      .filter(([key, comp]: [string, any]) => comp.type === 'logo')
      .map(([key, comp]: [string, any]) => ({
        src: comp.content?.src || '',
        alt: comp.content?.alt || 'Logo'
      }))
      .filter(logo => logo.src);

    logos = logoComponents;
    speed = settings?.speed || 30;
    direction = settings?.direction || 'left';
  } else {
    // Use legacy props with defaults
    logos = legacyLogos || [
      { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo' },
      { src: '/images/kjlogos/fazerlogo.png', alt: 'Fazer Logo' },
      { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo' },
      { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo' },
      { src: '/images/kjlogos/philips.png', alt: 'Philips Logo' },
      { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo' },
      { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo' },
      { src: '/images/kjlogos/benandjerrylogo.png', alt: 'Ben & Jerry\'s Logo' },
      { src: '/images/kjlogos/mindler.png', alt: 'Mindler Logo' },
      { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo' }
    ];
    speed = legacySpeed || 30;
    direction = legacyDirection || 'left';
  }
  // Transform logos into SpinningAnimationItem format
  const animationItems: CarouselAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <img
        src={logo.src}
        alt={logo.alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          filter: 'grayscale(100%) opacity(0.6)'
        }}
      />
    )
  }));

  return (
    <CarouselAnimation
      items={animationItems}
      speed={speed}
      direction={direction}
      className={className}
      
      // Match original SpinningBanner styling exactly
      containerHeight="auto"
      backgroundColor="#f7f7f7"
      padding="5px"
      
      itemWidth="120px"
      itemHeight="70px"
      itemPadding="15px"
      gap="50px"
      
      enableFadeEdges={true}
      fadeWidth="200px"
      
      duplicateCount={6}
    />
  );
}; 