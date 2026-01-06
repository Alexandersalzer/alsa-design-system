'use client';

import React from 'react';
import { VStack } from '../../../components';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { cn } from '../../../utils/cn';
import './AlternatingCards.css';

export const AlternatingCards: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    gap = 'lg',
    reverseFirst = false,
    imageAspectRatio = '4/3'
  } = getPatternProps();

  return (
    <VStack spacing={gap} className="alternating-cards">
      {componentOrder.map((key, index) => {
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

        const shouldReverse = reverseFirst ? index % 2 === 0 : index % 2 !== 0;

        return (
          <div
            key={key}
            className={cn(
              "alternating-cards__item",
              shouldReverse && "alternating-cards__item--reverse"
            )}
          >
            <CardComponent
              componentKey={key}
              {...component.props}
              imageAspectRatio={imageAspectRatio}
            />
          </div>
        );
      })}
    </VStack>
  );
};

export default AlternatingCards;
