'use client';

import React, { useMemo } from 'react';
import { CarouselAnimation, CarouselAnimationItem } from '../../../components/animations/CarouselAnimation';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { SlideIn } from '../../../components/animations/SlideIn/SlideIn';
import { Opacity } from '../../../components/animations/Opacity/Opacity';
import { Scale } from '../../../components/animations/Scale/Scale';
import { LogoImage } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';
import { useAction } from '../../../core/actions/useAction';
import { ActionConfig } from '../../../core/actions/types';
import { AnimationConfig } from '../../../core/animations/types';

interface SpinningBannerProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

export const SpinningBanner: React.FC<SpinningBannerProps> = ({ components = {}, sectionKey, patternKey, ...patternNode }) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  const getPatternProps = patternProps({ components, ...patternNode });
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder({ components, ...patternNode });

  const {
    speed = 25,
    direction = 'left',
    logoSize = 'md',
    logoOpacity = 1,
    grayscale = true,
    animated = true,
    action,
    animation
  } = getPatternProps();

  // Initialize action handler if action is configured
  const { execute } = action ? useAction(action as ActionConfig) : { execute: null };

  // Handle logo click
  const handleLogoClick = () => {
    if (execute) {
      execute({});
    }
  };

  // Extract logo data using the order from PatternNode
  const logos = componentOrder
    .map(key => {
      const component = components[key];
      if (!component || component.type !== 'logo') return null;
      return {
        src: component.props?.src || '',
        alt: component.props?.alt || 'Logo',
        componentKey: key, // Use the actual component key
      };
    })
    .filter((logo): logo is { src: string; alt: string; componentKey: string } => logo !== null && logo.src !== '' && logo.componentKey !== undefined);

  // Fallback set (these would also come from JSON in production)
  const fallback = [
    { src: '/2194716412/images/logos/huellogo.png', alt: 'Huel', componentKey: undefined },
    { src: '/2194716412/images/logos/logoFazer.png', alt: 'Fazer', componentKey: undefined },
    { src: '/2194716412/images/logos/wolt.png', alt: 'Wolt', componentKey: undefined },
    { src: '/2194716412/images/logos/tradera.png', alt: 'Tradera', componentKey: undefined },
    { src: '/2194716412/images/logos/philips.png', alt: 'Philips', componentKey: undefined },
    { src: '/2194716412/images/logos/skyshowtime.png', alt: 'SkyShowtime', componentKey: undefined },
    { src: '/2194716412/images/logos/aftonbladet.png', alt: 'Aftonbladet', componentKey: undefined },
    { src: '/2194716412/images/logos/mindlerLogo.png', alt: 'Mindler', componentKey: undefined },
  ];

  const allLogos: Array<{ src: string; alt: string; componentKey: string | undefined }> = logos.length ? logos : fallback;

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
    componentKey: logo.componentKey,
    content: (
      <div
        {...(action ? { onClick: handleLogoClick } : {})}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: logoOpacity,
          transition: 'opacity 0.2s ease-in-out',
          cursor: action ? 'pointer' : 'default'
        }}
      >
        <LogoImage
          src={`${CDN_BASE_URL}${logo.src}`}
          alt={logo.alt}
          width={sizeMap.width}
          height={sizeMap.height}
          objectFit="contain"
          loading="eager"
          showSkeleton={true}
          {...(logo.componentKey && { componentKey: logo.componentKey })}
          style={{
            transition: 'filter 0.3s ease'
          }}
        />
      </div>
    )
  }));

  // Smooth scroll duplication
  const duplicateCount = 6;

  // Map EasingType to CSS easing string
  const mapEasing = (easing?: string): 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' => {
    switch (easing) {
      case 'easeIn': return 'ease-in';
      case 'easeOut': return 'ease-out';
      case 'easeInOut': return 'ease-in-out';
      case 'linear': return 'linear';
      default: return 'ease-out';
    }
  };

  // Render with animation wrapper if configured
  const renderWithAnimation = (content: React.ReactNode) => {
    const animationConfig = animation as AnimationConfig | undefined;

    if (!animationConfig || animationConfig.type === 'none') {
      return content;
    }

    if (animationConfig.type === 'fadeIn') {
      const settings = animationConfig.settings || {};
      return (
        <FadeIn
          direction={settings.direction || 'up'}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          distance={20}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {content}
        </FadeIn>
      );
    }

    if (animationConfig.type === 'opacity') {
      const settings = animationConfig.settings || {};
      return (
        <Opacity
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {content}
        </Opacity>
      );
    }

    if (animationConfig.type === 'slideIn') {
      const settings = animationConfig.settings || {};
      return (
        <SlideIn
          direction={settings.direction || 'up'}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          distance={settings.distance || 20}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {content}
        </SlideIn>
      );
    }

    if (animationConfig.type === 'scale') {
      const settings = animationConfig.settings || {};
      return (
        <Scale
          from={settings.from || 0.8}
          to={settings.to || 1}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {content}
        </Scale>
      );
    }

    return content;
  };

  if (!animated) {
    // Non-animated version
    const staticContent = (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: `${sizeMap.gap}px`,
          padding: '10px 0'
        }}
      >
        {allLogos.map((logo, index) => (
          <div
            key={`${logo.src}-${index}`}
            {...(action ? { onClick: handleLogoClick } : {})}
            style={{
              width: `${sizeMap.width}px`,
              height: `${sizeMap.height}px`,
              padding: `${sizeMap.padding}px`,
              cursor: action ? 'pointer' : 'default'
            }}
          >
            <LogoImage
              src={`${CDN_BASE_URL}${logo.src}`}
              alt={logo.alt}
              width={sizeMap.width}
              height={sizeMap.height}
              objectFit="contain"
              loading="eager"
              showSkeleton={true}
              {...(logo.componentKey && { componentKey: logo.componentKey })}
              style={{
                opacity: logoOpacity,
                transition: 'filter 0.3s ease'
              }}
            />
          </div>
        ))}
      </div>
    );

    return <>{renderWithAnimation(staticContent)}</>;
  }

  // ✅ Animated version
  const carouselContent = (
    <CarouselAnimation
      items={animationItems}
      speed={speed}
      direction={direction}
      backgroundColor={subtleBackground ? "var(--surface-page)" : "transparent"}
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

  return <>{renderWithAnimation(carouselContent)}</>;
};