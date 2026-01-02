'use client';

import React, { useState, useMemo } from 'react';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { Grid } from '../../../components';
import { PortfolioCard } from '../../cards/PortfolioCard/PortfolioCard';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';
import { getVideoThumbnailUrl } from '../../../core/utils/media';

// Tabs
import { TabGroup } from '../../../components';
import { Tab } from '../../../components';

import './PortfolioGrid.css';

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
  posterSrc?: string; // Thumbnail URL for videos
  description?: string;
  views?: number;
  category?: string | string[];
  countryCode?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export const PortfolioGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getComponent = componentProps(components);
  const getPatternProps = patternProps(patternNode);
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder(patternNode);

  // Extract pattern props with defaults
  const {
    cardDensity = 'standard',
    gap = 'lg',
    default: defaultValue = 'all',
    buttons = [],
    showFlags = true
  } = getPatternProps();

  const hasTabs = buttons.length > 0;
  const [active, setActive] = useState(defaultValue);

  // =====================================================
  // NORMALIZE PORTFOLIO ITEMS (FULLY TYPED)
  // =====================================================

  const allItems: PortfolioNormalizedItem[] = useMemo(() => {
    return componentOrder
      .reduce<PortfolioNormalizedItem[]>((acc, key) => {
        const component = components[key];
        if (!component || component.type !== 'portfolio' || !component.props) return acc;
        
        // Read all data from component.props (ComponentNode structure)
        const data = component.props;
        const mediaSrc = data.mediaSrc || '';
        if (!mediaSrc) return acc;

        // Handle CDN URL transformation
        let transformedMediaSrc = mediaSrc;
        if (mediaSrc.startsWith('/members/')) {
          transformedMediaSrc = `${CDN_BASE_URL}${mediaSrc.replace('/members', '')}`;
        }

        // Derive thumbnail URL for videos
        const mediaType = data.mediaType === 'video' ? 'video' : 'image';
        const posterSrc = mediaType === 'video' ? getVideoThumbnailUrl(transformedMediaSrc) : undefined;

        acc.push({
          key,
          componentKey: key,
          title: data.title || 'Untitled Project',
          mediaSrc: transformedMediaSrc,
          mediaAlt: data.mediaAlt || data.title || 'Portfolio media',
          mediaType,
          posterSrc, // Derived thumbnail URL for videos
          description: data.description,
          views: data.views,
          category: data.category,
          countryCode: data.countryCode
        });
        
        return acc;
      }, []);
  }, [components, componentOrder]);

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
          <TabGroup  variant="navigation" className="mb-6">
            {buttons.map((btn: { label: string; value: string }) => (
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
          justify='center'
        >
          {buttons.map((btn: { label: string; value: string }) => (
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
        ))}
      </Grid>
    </div>
  );
};

PortfolioGrid.displayName = 'PortfolioGrid';