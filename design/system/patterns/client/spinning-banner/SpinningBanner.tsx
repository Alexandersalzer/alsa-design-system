// blimpify-ui/design/system/patterns/client/spinning-banner/SpinningBanner.tsx
'use client';

import React from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/CarouselAnimation';
import { Logo } from '../../../components/media/Logo';

interface SpinningBannerProps {
  type?: string;
  props?: {
    speed?: number;
    direction?: 'left' | 'right';
  };
  components?: Record<string, {
    type: string;
    props?: any;
    content?: any; // backward compatibility
  }>;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  type,
  props: patternProps = {},
  components = {}
}) => {
  // Extract speed and direction from pattern props
  const speed = patternProps.speed || 30;
  const direction = patternProps.direction || 'left';

  // Extract heading component if exists
  const headingComponent = Object.values(components).find(comp => comp.type === 'heading');

  // Extract logos from components (support both props and content)
  const logoComponents = Object.entries(components)
    .filter(([key, comp]: [string, any]) => comp.type === 'logo')
    .map(([key, comp]: [string, any]) => {
      // Support new props format
      if (comp.props) {
        return {
          src: comp.props.src || '',
          alt: comp.props.alt || 'Logo',
          size: comp.props.size || 'md',
          variant: comp.props.variant || 'contain',
          grayscale: comp.props.grayscale ?? true,
          opacity: comp.props.opacity ?? 0.6
        };
      }
      // Support old content format (backward compatible)
      if (comp.content) {
        return {
          src: comp.content.src || '',
          alt: comp.content.alt || 'Logo',
          size: 'md',
          variant: 'contain',
          grayscale: true,
          opacity: 0.6
        };
      }
      return null;
    })
    .filter((logo): logo is NonNullable<typeof logo> => logo !== null && logo.src !== '');

  // If no logos from JSON, use fallback
  const logos = logoComponents.length > 0 ? logoComponents : [
    { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/logoFazer.png', alt: 'Fazer Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/philips.png', alt: 'Philips Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/benandjerrylogo.png', alt: "Ben & Jerry's Logo", size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/mindlerLogo.png', alt: 'Mindler Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 },
    { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo', size: 'md', variant: 'contain', grayscale: true, opacity: 0.6 }
  ];

  // Transform logos using Logo component
  const animationItems: CarouselAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <Logo
        src={logo.src}
        alt={logo.alt}
        size={logo.size as any}
        variant={logo.variant as any}
        grayscale={logo.grayscale}
        opacity={logo.opacity}
      />
    )
  }));

  return (
    <>
      {headingComponent && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3>{headingComponent.props?.content || headingComponent.content}</h3>
        </div>
      )}
      <CarouselAnimation
        items={animationItems}
        speed={speed}
        direction={direction}
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