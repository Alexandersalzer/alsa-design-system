'use client';

import React from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';
import { Logo } from '../../../components/media/Logo';

interface SpinningBannerProps {
  type?: string;
  props?: {
    speed?: number;
    direction?: 'left' | 'right';
    logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    logoOpacity?: number;
    animated?: boolean;
    levels?: number;
    subtleBackground?: boolean;
  };
  components?: Record<string, {
    type: string;
    props?: any;
    content?: any;
  }>;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  type,
  props: patternProps = {},
  components = {}
}) => {
  // 🎛️ Configurable props
  const {
    speed = 30,
    direction = 'left',
    logoSize = 'md',
    logoOpacity = 1,
    animated = true,
    levels = 1,
    subtleBackground = false,
  } = patternProps;

  // 🧩 Extract logos from components
  const logoComponents = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'logo')
    .map(([_, comp]) => ({
      src: comp.props?.src || comp.content?.src || '',
      alt: comp.props?.alt || comp.content?.alt || 'Logo',
      size: comp.props?.size || logoSize,
      opacity: comp.props?.opacity ?? logoOpacity,
    }))
    .filter((logo) => logo.src !== '');

  // 🪄 Default fallback logos
  const logos = logoComponents.length > 0 ? logoComponents : [
    { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/logoFazer.png', alt: 'Fazer Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/philips.png', alt: 'Philips Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/benandjerrylogo.png', alt: "Ben & Jerry's Logo", size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/mindlerLogo.png', alt: 'Mindler Logo', size: logoSize, opacity: logoOpacity },
    { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo', size: logoSize, opacity: logoOpacity },
  ];

  // 🌀 Build Carousel items
  const animationItems: CarouselAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <div
        style={{
          backgroundColor: subtleBackground ? 'var(--surface-muted)' : 'transparent',
          borderRadius: '8px',
          padding: subtleBackground ? '8px' : '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo
          src={logo.src}
          alt={logo.alt}
          size={logo.size}
          variant="contain"
          opacity={logo.opacity}
        />
      </div>
    ),
  }));

  // 🎞️ Render multiple stacked banners if levels > 1
  const banners = Array.from({ length: levels }, (_, i) => (
    <CarouselAnimation
      key={`banner-${i}`}
      items={animationItems}
      speed={animated ? speed : 0}
      direction={i % 2 === 0 ? direction : direction === 'left' ? 'right' : 'left'}
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
  ));

  return <>{banners}</>;
};
