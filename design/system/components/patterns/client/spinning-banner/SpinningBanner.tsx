'use client';

import React from 'react';
import { SpinningAnimation } from '../../../../../system/components/primitives/SpinningAnimation';

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
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pauseOnHover?: boolean;
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
  className = '',
  gap = 'lg',
  pauseOnHover = false
}) => {
  return (
    <SpinningAnimation
      type="horizontal"
      direction={direction}
      speed={speed}
      gap={gap}
      pauseOnHover={pauseOnHover}
      className={className}
      itemHeight="60px" // Standard logo height
    >
      {logos.map((logo, index) => (
        <img
          key={`${logo.src}-${index}`}
          src={logo.src}
          alt={logo.alt}
          style={{
            height: logo.height || 60,
            width: logo.width || 'auto',
            objectFit: 'contain',
            filter: 'grayscale(100%)',
            opacity: 0.7,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'grayscale(0%)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'grayscale(100%)';
            e.currentTarget.style.opacity = '0.7';
          }}
        />
      ))}
    </SpinningAnimation>
  );
}; 