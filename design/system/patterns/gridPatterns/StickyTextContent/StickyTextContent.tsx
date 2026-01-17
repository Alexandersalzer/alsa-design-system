// ===============================================
// StickyTextContent.tsx - Sticky text beside content (row-by-row)
// Each row has its own sticky text that sticks within that row only
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { GridPattern } from '../GridPattern/GridPattern';
import { MasonryGrid } from '../MasonryGrid/MasonryGrid';
import { AlternatingCards } from '../AlternatingCards/AlternatingCards';
import './StickyTextContent.css';
import { Body, H3 } from '@blimpify-im/ui';
import { Icon } from '../../../components/media/Icon';
import * as HeroIcons from '@heroicons/react/24/outline';

export const StickyTextContent: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    gap = '3xl',
    stickyOffset = '100px',
    textWidth = '280px',
  } = getPatternProps();

  return (
    <div className={`sticky-text-content gap-${gap}`}>
      {componentOrder.map((key) => {
        const component = components[key];
        if (!component) {
          console.warn(`Component "${key}" not found in components`);
          return null;
        }

        // Local patterns registry (to avoid circular dependency)
        const localPatternsRegistry: Record<string, React.ComponentType<any>> = {
          gridPattern: GridPattern,
          masonryGrid: MasonryGrid,
          alternatingCards: AlternatingCards,
        };

        // Check both card and pattern registries
        const CardComponent = cardsRegistry[component.type] || localPatternsRegistry[component.type];
        if (!CardComponent) {
          console.warn(`Component type "${component.type}" not found in registries. Available cards: ${Object.keys(cardsRegistry).join(', ')}. Available patterns: ${Object.keys(localPatternsRegistry).join(', ')}`);
          return null;
        }

        const { stickyTitle, stickyDescription, stickyIcon } = component.props || {};

        // Get icon component if specified
        const IconComponent = stickyIcon
          ? (HeroIcons as any)[stickyIcon + 'Icon']
          : null;

        return (
          <div
            key={key}
            className="sticky-text-content__row"
            style={{
              '--text-width': textWidth,
              '--sticky-offset': stickyOffset,
            } as React.CSSProperties}
          >
            {/* Sticky Text - sticks within this row only */}
            <aside className="sticky-text-content__text">
              {IconComponent && (
                <div className="sticky-text-content__icon">
                  <Icon size="xl" color="primary">
                    <IconComponent />
                  </Icon>
                </div>
              )}
              {stickyTitle && (
                <H3>
                  {stickyTitle}
                </H3>
              )}
              {stickyDescription && (
                <Body>
                  {stickyDescription}
                </Body>
              )}
            </aside>

            {/* Content */}
            <div className="sticky-text-content__content">
              <CardComponent
                componentKey={key}
                {...component}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StickyTextContent;
