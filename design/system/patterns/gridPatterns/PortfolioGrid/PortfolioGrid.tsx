'use client';

import React, { useState, useMemo } from 'react';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import { Grid } from '../../../components';
import { PortfolioCard } from '../../cards/PortfolioCard/PortfolioCard';

// Tabs
import { TabGroup } from '../../../components';
import { Tab } from '../../../components';

import './PortfolioGrid.css';

// =====================================================
// TYPES
// =====================================================

export interface PortfolioGridProps {
  props?: {
    cardDensity?: 'compact' | 'standard' | 'spacious';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    default?: string;
    buttons?: {
      label: string;
      value: string;
    }[];
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
  // NORMALIZE PORTFOLIO ITEMS
  // =====================================================

  const allItems = useMemo(() => {
    return Object.entries(components)
      .filter(([, comp]) => comp.type === 'portfolio' && comp.mediaSrc)
      .map(([key, comp]) => {
        const mediaSrc = comp.mediaSrc!.startsWith('/members/')
          ? `${CDN_BASE_URL}${comp.mediaSrc!.replace('/members', '')}`
          : comp.mediaSrc!;

        return {
          key,

          // Required props — strictly typed
          title: comp.title ?? 'Untitled Project',
          mediaSrc,
          mediaAlt: comp.mediaAlt || comp.title || 'Portfolio media',

          // 🔥 FIXED TYPE: cast to strict union type
          mediaType: (comp.mediaType === 'video' ? 'video' : 'image') as
            | 'video'
            | 'image',

          // Optional props — kept safe
          description: comp.description,
          views: comp.views,
          category: comp.category,
          countryCode: comp.countryCode
        };
      });
  }, [components]);

  // =====================================================
  // FILTER BY TABS
  // =====================================================

  const visibleItems = useMemo(() => {
    if (!hasTabs) return allItems;
    if (active === 'all') return allItems;

    return allItems.filter(
      item =>
        item.category &&
        item.category.toLowerCase() === active.toLowerCase()
    );
  }, [active, allItems, hasTabs]);

  if (visibleItems.length === 0) return null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="portfolio-grid-container">

      {/* ---------- TABS ---------- */}
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

      {/* ---------- GRID ---------- */}
      <Grid cardDensity={cardDensity} gap={gap} className="portfolio-grid">
        {visibleItems.map((item, index) => (
          <PortfolioCard
            key={`portfolio-${index}`}
            title={item.title}
            mediaSrc={item.mediaSrc}
            mediaAlt={item.mediaAlt}
            mediaType={item.mediaType}   // <–– now STRICT & TS-SAFE
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
