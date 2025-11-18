'use client';

import React, { useMemo } from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';
import { LogoImage } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/helpers';

interface SpinningBannerProps {
  props?: {
    speed?: number;
    direction?: 'left' | 'right';
    logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    logoOpacity?: number;
    grayscale?: boolean;
    animated?: boolean;
  };
  components?: Record<string, {
    type: string;
    props?: any;
    content?: any;
  }>;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    speed = 25,
    direction = 'left',
    logoSize = 'md',
    logoOpacity = 1,
    grayscale = true,
    animated = true
  } = patternProps;

  // Extract logo data only
  const logos = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'logo')
    .map(([_, comp]) => ({
      src: comp.props?.src || comp.content?.src || '',
      alt: comp.props?.alt || comp.content?.alt || 'Logo',
    }))
    .filter((l) => l.src);

  // Fallback set (these would also come from JSON in production)
  const fallback = [
    { src: '/2194716412/images/logos/huellogo.png', alt: 'Huel' },
    { src: '/2194716412/images/logos/logoFazer.png', alt: 'Fazer' },
    { src: '/2194716412/images/logos/wolt.png', alt: 'Wolt' },
    { src: '/2194716412/images/logos/tradera.png', alt: 'Tradera' },
    { src: '/2194716412/images/logos/philips.png', alt: 'Philips' },
    { src: '/2194716412/images/logos/skyshowtime.png', alt: 'SkyShowtime' },
    { src: '/2194716412/images/logos/aftonbladet.png', alt: 'Aftonbladet' },
    { src: '/2194716412/images/logos/mindlerLogo.png', alt: 'Mindler' },
  ];

  const allLogos = logos.length ? logos : fallback;

  // ✅ Proportional sizing using design tokens
  const sizeMap = useMemo(() => {
    switch (logoSize) {
      case 'xs':
        return { width: 80, height: 40, gap: 32, padding: 8 };
      case 'sm':
        return { width: 100, height: 50, gap: 40, padding: 10 };
      case 'md':
        return { width: 130, height: 65, gap: 52, padding: 12 };
      case 'lg':
        return { width: 160, height: 80, gap: 68, padding: 14 };
      case 'xl':
        return { width: 200, height: 100, gap: 86, padding: 16 };
      default:
        return { width: 130, height: 65, gap: 52, padding: 12 };
    }
  }, [logoSize]);

  const animationItems: CarouselAnimationItem[] = allLogos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: logoOpacity,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <LogoImage
          src={`${CDN_BASE_URL}${logo.src}`}
          alt={logo.alt}
          width={sizeMap.width}
          height={sizeMap.height}
          objectFit="contain"
          loading="lazy"
          showSkeleton={true}
          style={{
            transition: 'filter 0.3s ease'
          }}
        />
      </div>
    )
  }));

  // Smooth scroll duplication
  const duplicateCount = 6;

  if (!animated) {
    // Non-animated version
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: `${sizeMap.gap}px`,
          padding: '10px 0'
        }}
      >
        {animationItems.map((item) => (
          <div
            key={item.id}
            style={{
              width: `${sizeMap.width}px`,
              height: `${sizeMap.height}px`,
              padding: `${sizeMap.padding}px`
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  }

  // ✅ Animated version
  return (
    <CarouselAnimation
      items={animationItems}
      speed={speed}
      direction={direction}
      backgroundColor="var(--surface-page)"
      padding="5px"
      itemWidth={`${sizeMap.width}px`}
      itemHeight={`${sizeMap.height}px`}
      itemPadding={`${sizeMap.padding}px`}
      gap={`${sizeMap.gap}px`}
      enableFadeEdges={true}
      fadeWidth="200px"
      duplicateCount={duplicateCount}
    />
  );
};