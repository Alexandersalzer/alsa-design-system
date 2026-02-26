'use client';

import React, { useMemo } from 'react';
import { PortfolioCard } from '../../cards/PortfolioCard/PortfolioCard';
import { CarouselAnimation } from '../../../components/animations/CarouselAnimation/CarouselAnimation';
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
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    speed = 40,
    direction = 'left',
    itemWidth = '280px',
    itemMinWidth,
    itemMaxWidth,
    gap = '24px',
    enableFadeEdges = true,
    fadeWidth = '100px',
    duplicateCount = 2,
    backgroundColor = 'transparent',
    showFlags = true,
  } = getPatternProps();

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

  const carouselItems = allItems.map((item) => ({
    id: item.key,
    componentKey: item.componentKey,
    content: (
      <div className="portfolio-carousel__card-wrapper">
        <PortfolioCard
          key={item.key}
          componentKey={item.componentKey}
          title={item.title}
          mediaSrc={item.mediaSrc}
          mediaAlt={item.mediaAlt}
          mediaType={item.mediaType}
          posterSrc={item.posterSrc}
          description={item.description}
          views={item.views}
          category={item.category}
          countryCode={item.countryCode}
          showFlags={showFlags}
        />
      </div>
    ),
  }));

  return (
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
    />
  );
};

PortfolioCarousel.displayName = 'PortfolioCarousel';
