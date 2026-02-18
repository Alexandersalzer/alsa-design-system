'use client';

import React from 'react';
import { BentoGrid } from '../../../components/layout/BentoGrid/BentoGrid';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './BentoGridPattern.css';

export interface BentoGridPatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

export const BentoGridPattern: React.FC<BentoGridPatternProps> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const patternPropsObj = getPatternProps();
  const {
    columns = 2,
    gap = 'lg',
    alignItems = 'stretch',
    defaultFooterStyle,
    defaultVariant,
    defaultShowImage,
  } = patternPropsObj;
  const hasFooterDefault = 'defaultFooterStyle' in patternPropsObj;
  const hasVariantDefault = 'defaultVariant' in patternPropsObj;
  const hasShowImageDefault = 'defaultShowImage' in patternPropsObj;

  return (
    <div className="bento-grid-pattern-container">
      <BentoGrid
        columns={columns}
        gap={gap}
        alignItems={alignItems}
        className="bento-grid-pattern"
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

          const resolveShowImage = (v: unknown) =>
            v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined;
          const mergedProps = {
            ...component.props,
            ...(hasFooterDefault && { footerStyle: component.props?.footerStyle ?? defaultFooterStyle }),
            ...(hasVariantDefault && { variant: component.props?.variant ?? defaultVariant }),
            ...(hasShowImageDefault && {
              showImage: resolveShowImage(component.props?.showImage) ?? resolveShowImage(defaultShowImage) ?? true,
            }),
          };

          return (
            <CardComponent
              key={key}
              componentKey={key}
              {...mergedProps}
            />
          );
        })}
      </BentoGrid>
    </div>
  );
};

BentoGridPattern.displayName = 'BentoGridPattern';

export default BentoGridPattern;
