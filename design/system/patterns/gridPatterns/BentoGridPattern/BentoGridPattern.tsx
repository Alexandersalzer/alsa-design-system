'use client';

import React from 'react';
import { BentoGrid } from '../../../components/layout/BentoGrid/BentoGrid';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './BentoGridPattern.css';

export type CardLayoutPreset =
  | 'equal'        // 2×2, alla lika höga
  | 'feature-top'  // stor topp (2×2), två små, en bred
  | 'three-col'    // 4×4×4, tre kolumner
  | 'two-col'      // 6×6, två kolumner (samma som equal)
  | 'narrow-wide'; // 4+8, smal + bred

const LAYOUT_PRESETS: Record<
  CardLayoutPreset,
  { columns: 1 | 2 | 3; spans: Array<{ colSpan: number; rowSpan: number }> }
> = {
  equal: {
    columns: 2,
    spans: [
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ],
  },
  'feature-top': {
    columns: 2,
    spans: [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
    ],
  },
  'three-col': {
    columns: 3,
    spans: [
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 3, rowSpan: 1 },
    ],
  },
  'two-col': {
    columns: 2,
    spans: [
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ],
  },
  'narrow-wide': {
    columns: 3,
    spans: [
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
    ],
  },
};

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
    columns: columnsProp = 2,
    gap = 'lg',
    alignItems = 'stretch',
    defaultFooterStyle,
    defaultVariant,
    defaultShowImage,
    cardLayout,
  } = patternPropsObj;
  const hasFooterDefault = 'defaultFooterStyle' in patternPropsObj;
  const hasVariantDefault = 'defaultVariant' in patternPropsObj;
  const hasShowImageDefault = 'defaultShowImage' in patternPropsObj;

  const preset = (cardLayout && LAYOUT_PRESETS[cardLayout as CardLayoutPreset]) || LAYOUT_PRESETS.equal;
  const columns = preset.columns;
  const spanByIndex = preset.spans;

  return (
    <div className="bento-grid-pattern-container">
      <BentoGrid
        columns={columns}
        gap={gap}
        alignItems={alignItems}
        className="bento-grid-pattern"
      >
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

          const resolveShowImage = (v: unknown) =>
            v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined;
          const span = spanByIndex[index] ?? { colSpan: 1, rowSpan: 1 };
          const mergedProps = {
            ...component.props,
            colSpan: span.colSpan,
            rowSpan: span.rowSpan,
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
