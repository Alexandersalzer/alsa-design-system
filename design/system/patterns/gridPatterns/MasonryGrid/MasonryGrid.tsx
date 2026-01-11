'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './MasonryGrid.css';

export const MasonryGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const { columns = 3, gap = 'md' } = getPatternProps();

  return (
    <div className={`masonry-grid-container masonry-grid--columns-${columns} masonry-grid--gap-${gap}`}>
      {componentOrder.map(key => {
        const component = components[key];

        if (!component) {
          console.warn(`Component "${key}" not found in components`);
          return null;
        }

        const CardComponent = cardsRegistry[component.type];

        if (!CardComponent) {
          console.warn(`Card type "${component.type}" not found in registry. Available types: ${Object.keys(cardsRegistry).join(', ')}`);
          return null;
        }

        return (
          <CardComponent
            key={key}
            componentKey={key}
            {...component.props}
          />
        );
      })}
    </div>
  );
};

export default MasonryGrid;
