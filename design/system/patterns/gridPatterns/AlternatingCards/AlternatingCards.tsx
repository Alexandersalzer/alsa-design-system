// ===============================================
// AlternatingCards.tsx - COMPLETE FIX
// ===============================================

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
    gap = '2xl',
    cardGap = '20%',
    reverseFirst = false,
    imageAspectRatio = '4/3',
    textAlign = 'left',
    verticalAlign = 'center'
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
          console.warn(`Card type "${component.type}" not found in registry. Available: ${Object.keys(cardsRegistry).join(', ')}`);
          return null;
        }
        
        const shouldReverse = reverseFirst ? index % 2 === 0 : index % 2 !== 0;
        
        return (
          <div
            key={key}
            className={cn(
              "alternating-cards__item",
              shouldReverse && "alternating-cards__item--reverse",
              `alternating-cards__item--text-${textAlign}`,
              `alternating-cards__item--vertical-${verticalAlign}`
            )}
            style={{
              '--card-gap': cardGap
            } as React.CSSProperties}
          >
            <CardComponent
              componentKey={key}
              {...component.props}
              // ✅ FORCE: Pattern props override card defaults
              imageAspectRatio={imageAspectRatio}
              imageObjectFit="cover"
            />
          </div>
        );
      })}
    </VStack>
  );
};

export default AlternatingCards;