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
    content?: any;
  }>;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({
  type,
  props: patternProps = {},
  components = {}
}) => {
  const speed = patternProps.speed || 30;
  const direction = patternProps.direction || 'left';

  const headingComponent = Object.values(components).find(comp => comp.type === 'heading');

  const logoComponents = Object.entries(components)
    .filter(([key, comp]: [string, any]) => comp.type === 'logo')
    .map(([key, comp]: [string, any]) => {
      if (comp.props) {
        return {
          src: comp.props.src || '',
          alt: comp.props.alt || 'Logo'
        };
      }
      if (comp.content) {
        return {
          src: comp.content.src || '',
          alt: comp.content.alt || 'Logo'
        };
      }
      return null;
    })
    .filter((logo): logo is NonNullable<typeof logo> => logo !== null && logo.src !== '');

  const logos = logoComponents.length > 0 ? logoComponents : [
    { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo' },
    { src: '/images/kjlogos/logoFazer.png', alt: 'Fazer Logo' },
    { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo' },
    { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo' },
    { src: '/images/kjlogos/philips.png', alt: 'Philips Logo' },
    { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo' },
    { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo' },
    { src: '/images/kjlogos/benandjerrylogo.png', alt: "Ben & Jerry's Logo" },
    { src: '/images/kjlogos/mindlerLogo.png', alt: 'Mindler Logo' },
    { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo' }
  ];

  // ✅ Transform logos - NO grayscale/opacity (track handles it)
  const animationItems: CarouselAnimationItem[] = logos.map((logo, index) => ({
    id: `${logo.src}-${index}`,
    content: (
      <Logo
        src={logo.src}
        alt={logo.alt}
        size="md"
        variant="contain"
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