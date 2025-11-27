'use client';

import React, { useState, useMemo } from 'react';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { Grid } from '../../../components';
import { PortfolioCard } from '../../cards/PortfolioCard/PortfolioCard';

// Tabs
import { TabGroup } from '../../../components';
import { Tab } from '../../../components';

import './PortfolioGrid.css';

// =====================================================
// TYPES
// =====================================================

interface PortfolioNormalizedItem {
  key: string;
  title: string;
  mediaSrc: string;
  mediaAlt: string;
  mediaType: 'image' | 'video';
  description?: string;
  views?: number;
  category?: string | string[];
  countryCode?: string;
}

export interface PortfolioGridProps {
  props?: {
    cardDensity?: 'compact' | 'standard' | 'spacious';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    default?: string;
    buttons?: { label: string; value: string }[];
  };

  components?: Record<
    string,
    {
      type: string;
      title?: string;
      description?: string;
      mediaType?: 'image' | 'video';
      mediaSrc?: string;
      mediaAlt?: string;
      views?: number;
      category?: string;
      countryCode?: string;
    }
  >;
}

// =====================================================
// COMPONENT
// =====================================================

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    cardDensity = 'standard',
    gap = 'lg',
    default: defaultValue = 'all',
    buttons = []
  } = patternProps;

  const hasTabs = buttons.length > 0;
  const [active, setActive] = useState(defaultValue);

  // =====================================================
  // NORMALIZE PORTFOLIO ITEMS (FULLY TYPED)
  // =====================================================

  const allItems: PortfolioNormalizedItem[] = useMemo(() => {
    return Object.entries(components)
      .filter(([, comp]) => comp.type === 'portfolio' && comp.mediaSrc)
      .map(([key, comp]): PortfolioNormalizedItem => {
        let mediaSrc = comp.mediaSrc!;

        // Handle CDN URL transformation
        if (mediaSrc.startsWith('/members/')) {
          mediaSrc = `${CDN_BASE_URL}${mediaSrc.replace('/members', '')}`;
        }

        return {
          key,
          title: comp.title ?? 'Untitled Project',
          mediaSrc,
          mediaAlt: comp.mediaAlt || comp.title || 'Portfolio media',

          // Perfectly typed now
          mediaType: comp.mediaType === 'video' ? 'video' : 'image',

          description: comp.description,
          views: comp.views,
          category: comp.category,
          countryCode: comp.countryCode
        };
      });
  }, [components]);

  // =====================================================
  // FILTER (handles weird Swedish categories)
  // =====================================================

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[åä]/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/&/g, '')
      .trim();

  const visibleItems = useMemo(() => {
    if (!hasTabs) return allItems;
    if (active === 'all') return allItems;

    return allItems.filter(item => {
      if (!item.category) return false;
      if (Array.isArray(item.category)) {
        return item.category.some(cat => normalize(cat) === normalize(active));
      }
      return normalize(item.category) === normalize(active);
    });
  }, [active, allItems, hasTabs]);

  // =====================================================
  // EMPTY STATE — KEEP TABS VISIBLE
  // =====================================================

  if (visibleItems.length === 0) {
    return (
      <div className="portfolio-grid-container">
        {hasTabs && (
          <TabGroup variant="navigation" className="mb-6">
            {buttons.map(btn => (
              <Tab
                key={btn.value}
                isActive={active === btn.value}
                onClick={() => setActive(btn.value)}
              >
                {btn.label}
              </Tab>
            ))}
          </TabGroup>
        )}

        <p style={{ textAlign: 'center', opacity: 0.6 }}>
          Inga projekt i denna kategori ännu.
        </p>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="portfolio-grid-container">

      {hasTabs && (
        <TabGroup 
          variant="page" 
          orientation="horizontal"
          className="mb-6"
        >
          {buttons.map(btn => (
            <Tab
              key={btn.value}
              isActive={active === btn.value}
              onClick={() => setActive(btn.value)}
            >
              {btn.label}
            </Tab>
          ))}
        </TabGroup>
      )}

      <Grid cardDensity={cardDensity} gap={gap} className="portfolio-grid">
        {visibleItems.map((item) => (
          <PortfolioCard
            key={item.key}
            title={item.title}
            mediaSrc={item.mediaSrc}
            mediaAlt={item.mediaAlt}
            mediaType={item.mediaType}
            description={item.description}
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