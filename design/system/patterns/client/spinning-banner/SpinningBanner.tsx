'use client';
import React from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';

interface SpinningBannerProps {
  type?: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  settings?: {
    speed?: number;
    direction?: 'left' | 'right';
  };
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  type,
  components,
  settings,
  logos: legacyLogos,
  speed: legacySpeed,
  direction: legacyDirection,
  className = ''
}) => {
  let logos: Array<{ src: string; alt: string; width?: number; height?: number; }>;
  let speed: number;
  let direction: 'left' | 'right';

  if (components) {
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

  const instanceId = React.useId();
  const uniqueClass = `spinning-banner-logo-${instanceId.replace(/:/g, '')}`;

  const animationItems: CarouselAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <img
        src={logo.src}
        alt={logo.alt}
        className={uniqueClass}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          transition: 'filter 0.3s ease'
        }}
      />
    )
  }));

  return (
    <>
      <style>{`
        .${uniqueClass} {
          filter: grayscale(100%) opacity(0.6);
        }

        [data-theme="dark"] .${uniqueClass},
        .dark .${uniqueClass} {
          filter: grayscale(100%) opacity(0.6) invert(1);
        }
      `}</style>
      
      <CarouselAnimation
        items={animationItems}
        speed={speed}
        direction={direction}
        className={className}
        containerHeight="auto"
        backgroundColor="var(--surface-page)"
        padding="5px"
        itemWidth="120px"
        itemHeight="70px"
        itemPadding="15px"
        gap="50px"
        enableFadeEdges={true}
        fadeWidth="200px"
        duplicateCount={6}
      />
    </>
  );
};