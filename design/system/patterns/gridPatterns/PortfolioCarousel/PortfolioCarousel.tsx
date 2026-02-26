'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { CarouselAnimation } from '../../../components/animations/CarouselAnimation/CarouselAnimation';
import { Image } from '../../../components/media/Image';
import { VideoShowcase } from '../../../components/media/VideoShowcase';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { getVideoThumbnailUrl } from '../../../core/utils/media';
import './PortfolioCarousel.css';

// =====================================================
// TYPES
// =====================================================

interface PortfolioNormalizedItem {
  key: string;
  componentKey: string;
  title: string;
  mediaSrc: string;
  mediaAlt: string;
  mediaType: 'image' | 'video';
  posterSrc?: string;
  description?: string;
  views?: number;
  category?: string | string[];
  countryCode?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export const PortfolioCarousel: React.FC<PatternNode> = (patternNode) => {
  // Stöd både pattern.components och pattern.props.components (olika datakällor)
  const components = patternNode.components ?? patternNode.props?.components ?? {};
  const getPatternProps = patternProps(patternNode);
  const orderFromPattern =
    getPatternOrder(patternNode) ??
    (patternNode.props as { order?: string[] } | undefined)?.order;
  const componentOrder =
    orderFromPattern?.length > 0 ? orderFromPattern : Object.keys(components);

  const {
    speed = 40,
    direction = 'left',
    itemWidth = '280px',
    itemMinWidth,
    itemMaxWidth,
    gap = '24px',
    enableFadeEdges = true,
    fadeWidth = '100px',
    duplicateCount: rawDuplicateCount = 2,
    backgroundColor = 'transparent',
    showFlags = true,
    /** "mixed" = videor spelbara + bilder (default). "thumbnailsOnly" = alla som statiska thumbnails (inga play-knappar). */
    mediaDisplay = 'mixed',
  } = getPatternProps();
  // Max 2 kopior för portfolio – färre tomma rutor, lättare att klicka
  const duplicateCount = Math.min(rawDuplicateCount, 2);

  const allItems: PortfolioNormalizedItem[] = useMemo(() => {
    return componentOrder
      .reduce<PortfolioNormalizedItem[]>((acc, key) => {
        const component = components[key];
        if (!component || component.type !== 'portfolio' || !component.props) return acc;

        const data = component.props;
        const mediaSrc = data.mediaSrc || '';
        if (!mediaSrc) return acc;

        const mediaType = data.mediaType === 'video' ? 'video' : 'image';
        const posterSrc =
          data.posterSrc ||
          (mediaType === 'video' ? getVideoThumbnailUrl(mediaSrc) : undefined);

        acc.push({
          key,
          componentKey: key,
          title: data.title || 'Untitled Project',
          mediaSrc,
          mediaAlt: data.mediaAlt || data.title || 'Portfolio media',
          mediaType,
          posterSrc,
          description: data.description,
          views: data.views,
          category: data.category,
          countryCode: data.countryCode,
        });
        return acc;
      }, []);
  }, [components, componentOrder]);

  if (allItems.length === 0) {
    return (
      <p style={{ textAlign: 'center', opacity: 0.6 }}>Inga portfolioobjekt att visa.</p>
    );
  }

  const [carouselPaused, setCarouselPaused] = useState(false);
  const onVideoPlay = useCallback(() => setCarouselPaused(true), []);
  const onVideoPause = useCallback(() => setCarouselPaused(false), []);
  const showVideoAsThumbnailOnly = mediaDisplay === 'thumbnailsOnly';

  const carouselItems = allItems.map((item) => {
    const isVideo = item.mediaType === 'video';
    const showAsThumbnailOnly = isVideo && showVideoAsThumbnailOnly;

    const mediaContent = showAsThumbnailOnly ? (
      <Image
        src={item.posterSrc || item.mediaSrc}
        alt={item.mediaAlt}
        aspectRatio="2/3"
        objectFit="cover"
        radius="sm"
        loading="eager"
        priority={true}
        className="portfolio-carousel-media portfolio-carousel-media--image"
      />
    ) : isVideo ? (
      <VideoShowcase
        src={item.mediaSrc}
        poster={item.posterSrc}
        aspectRatio="2-3"
        variant="rounded"
        size="md"
        radius="md"
        showPlayButton={true}
        controls={false}
        frame="none"
        className="portfolio-carousel-media portfolio-carousel-media--video"
        onPlay={onVideoPlay}
        onPause={onVideoPause}
      />
    ) : (
      <Image
        src={item.mediaSrc}
        alt={item.mediaAlt}
        aspectRatio="2/3"
        objectFit="cover"
        radius="sm"
        loading="eager"
        priority={true}
        className="portfolio-carousel-media portfolio-carousel-media--image"
      />
    );

    return {
      id: item.key,
      componentKey: item.componentKey,
      content: (
        <div key={item.key} className="portfolio-carousel__card-wrapper">
          <div className="portfolio-carousel__media-wrap">
            {mediaContent}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="portfolio-carousel-wrapper">
    <CarouselAnimation
      items={carouselItems}
      speed={speed}
      direction={direction}
      itemWidth={itemWidth}
      itemMinWidth={itemMinWidth}
      itemMaxWidth={itemMaxWidth}
      itemHeight="auto"
      gap={gap}
      enableFadeEdges={enableFadeEdges}
      fadeWidth={fadeWidth}
      duplicateCount={duplicateCount}
      backgroundColor={backgroundColor}
      padding="0"
      className="portfolio-carousel"
      paused={carouselPaused}
    />
    </div>
  );
};

PortfolioCarousel.displayName = 'PortfolioCarousel';
