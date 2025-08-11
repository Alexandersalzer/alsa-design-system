'use client';

import React from 'react';
import { SpinningAnimation, SpinningAnimationItem } from '../../../../../system/components/primitives/SpinningAnimation';

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
  // Convert logos to SpinningAnimationItem format
  const logoItems: SpinningAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <div className="logo-item" style={{ padding: '15px' }}>
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
      </div>
    )
  }));

  return (
    <SpinningAnimation
      items={logoItems}
      speed={speed}
      direction={direction}
      className={className}
      itemWidth="120px"
      itemHeight="70px"
      gap="50px"
      backgroundColor="#f7f7f7"
      padding="5px"
      fadeEdges={true}
      fadeWidth="200px"
      duplicates={6}
    />
  );
}; 