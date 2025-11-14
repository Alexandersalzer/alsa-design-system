'use client';
import React from 'react';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import { Grid } from '../../../components';
import { PortfolioCard } from '../../cards/PortfolioCard/PortfolioCard';
import './PortfolioGrid.css';

export interface PortfolioItemData {
  type: 'portfolio';
  title: string;
  description?: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  mediaAlt?: string;
  views?: number;
  category?: string;
  countryCode?: string;
}

export interface PortfolioGridProps {
  props?: {
    cardDensity?: 'compact' | 'standard' | 'spacious';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };
  components?: Record<string, {
    type: string;
    title?: string;
    description?: string;
    mediaType?: 'image' | 'video';
    mediaSrc?: string;
    mediaAlt?: string;
    views?: number;
    category?: string;
    countryCode?: string;
  }>;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    cardDensity = 'standard',
    gap = 'lg'
  } = patternProps;

  const portfolioItems = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'portfolio' && comp.title && comp.mediaSrc)
    .map(([_, comp]) => {
      let mediaSrc = comp.mediaSrc || '';
      // Prefix with CDN_BASE_URL if relative
      if (mediaSrc.startsWith('/members/')) {
        mediaSrc = `${CDN_BASE_URL}${mediaSrc.replace('/members', '')}`;
      }
      return {
        type: 'portfolio' as const,
        title: comp.title || '',
        description: comp.description,
        mediaType: (comp.mediaType || 'image') as 'image' | 'video',
        mediaSrc,
        mediaAlt: comp.mediaAlt || comp.title,
        views: comp.views,
        category: comp.category,
        countryCode: comp.countryCode,
      };
    });

  if (portfolioItems.length === 0) return null;

  return (
    <div className="portfolio-grid-container">
      <Grid
        cardDensity={cardDensity}
        gap={gap}
        className="portfolio-grid"
      >
        {portfolioItems.map((item, index) => (
          <PortfolioCard
            key={`portfolio-${index}`}
            title={item.title}
            description={item.description}
            mediaType={item.mediaType}
            mediaSrc={item.mediaSrc}
            mediaAlt={item.mediaAlt}
            views={item.views}
            category={item.category}
            countryCode={item.countryCode}
          />
        ))}
      </Grid>
    </div>
  );
};

PortfolioGrid.displayName = 'PortfolioGrid';
