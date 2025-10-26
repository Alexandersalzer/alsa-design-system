'use client';

import React from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';

interface SpinningBannerProps {
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
  logos = [
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
  ],
  speed = 30,
  direction = 'left',
  className = ''
}) => {
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