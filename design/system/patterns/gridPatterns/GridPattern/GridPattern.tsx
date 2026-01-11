'use client';

import React from 'react';
import { Grid } from '../../../components';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './GridPattern.css';

export const GridPattern: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    columns = 3,
    cardDensity = 'standard',
    gap = 'lg'
  } = getPatternProps();

  return (
    <div className="grid-pattern-container">
      <Grid
        columns={columns}
        cardDensity={cardDensity}
        gap={gap}
        className="grid-pattern"
      >
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
      </Grid>
    </div>
  );
};

export default GridPattern;
