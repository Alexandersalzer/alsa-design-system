// ===============================================
// StickyTextContent.tsx - Sticky text beside content (row-by-row)
// Each row has its own sticky text that sticks within that row only
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './StickyTextContent.css';

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

        const CardComponent = cardsRegistry[component.type];
        if (!CardComponent) {
          console.warn(`Card type "${component.type}" not found in registry. Available: ${Object.keys(cardsRegistry).join(', ')}`);
          return null;
        }

        const { stickyTitle, stickyDescription } = component.props || {};

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
              {stickyTitle && (
                <h3 className="sticky-text-content__title">
                  {stickyTitle}
                </h3>
              )}
              {stickyDescription && (
                <p className="sticky-text-content__description">
                  {stickyDescription}
                </p>
              )}
            </aside>

            {/* Content */}
            <div className="sticky-text-content__content">
              <CardComponent
                componentKey={key}
                {...component.props}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StickyTextContent;
