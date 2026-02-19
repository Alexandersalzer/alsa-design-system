'use client';

import React from 'react';
import { BentoGrid } from '../../../components/layout/BentoGrid/BentoGrid';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './BentoGridPattern.css';

export type CardLayoutPreset =
  | 'equal'         // alla lika (2×2, 3×2, 4×2 beroende på antal)
  | 'feature-top'   // stor topp (2×2), två små, en bred
  | 'three-col'     // 4×4×4 eller alla lika i 3 kolumner
  | 'two-col'       // två kolumner, alla lika
  | 'narrow-wide'   // 4+8, smal + bred (upprepas)
  | 'wide-narrow'   // 8+4, bred + smal (upprepas)
  | 'alternating'   // 4+8, 8+4, 4+8, 8+4 (8 kort)
  | 'stacked';      // 4+8 rad, 6×6 rad, 8+4 rad, 4×4×4 rad (14 kort)

const MAX_CARDS = 14;

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

/** Ger colSpan/rowSpan för ett visst antal kort. Presets stödjer upp till 14 kort. */
function getPresetSpans(
  preset: CardLayoutPreset,
  cardCount: number
): { columns: GridColumns; spans: Array<{ colSpan: number; rowSpan: number }> } {
  const n = Math.min(Math.max(1, cardCount), MAX_CARDS);

  switch (preset) {
    case 'equal': {
      const columns: GridColumns =
        n <= 4 ? 2 : n <= 6 ? 3 : n <= 8 ? 4 : n <= 10 ? 5 : 6;
      return {
        columns,
        spans: Array.from({ length: n }, () => ({ colSpan: 1, rowSpan: 1 })),
      };
    }
    case 'feature-top': {
      if (n < 4) {
        return { columns: 2, spans: Array.from({ length: n }, () => ({ colSpan: 1, rowSpan: 1 })) };
      }
      return {
        columns: 2,
        spans: [
          { colSpan: 2, rowSpan: 2 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 2, rowSpan: 1 },
          ...Array.from({ length: Math.max(0, n - 4) }, () => ({ colSpan: 1, rowSpan: 1 })),
        ].slice(0, n),
      };
    }
    case 'three-col': {
      const spans =
        n === 4
          ? [
              { colSpan: 1, rowSpan: 1 },
              { colSpan: 1, rowSpan: 1 },
              { colSpan: 1, rowSpan: 1 },
              { colSpan: 3, rowSpan: 1 },
            ]
          : Array.from({ length: n }, () => ({ colSpan: 1, rowSpan: 1 }));
      return { columns: 3, spans };
    }
    case 'two-col': {
      return {
        columns: 2,
        spans: Array.from({ length: n }, () => ({ colSpan: 1, rowSpan: 1 })),
      };
    }
    case 'narrow-wide': {
      const pattern = [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
      ];
      return {
        columns: 3,
        spans: Array.from({ length: n }, (_, i) => pattern[i % pattern.length]),
      };
    }
    case 'wide-narrow': {
      const pattern = [
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
      ];
      return {
        columns: 3,
        spans: Array.from({ length: n }, (_, i) => pattern[i % pattern.length]),
      };
    }
    case 'alternating': {
      // Rad 1: 4+8, rad 2: 8+4, rad 3: 4+8, rad 4: 8+4 (8 kort, 3 kolumner)
      const pattern = [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
      ];
      return {
        columns: 3,
        spans: n <= 8 ? pattern.slice(0, n) : [...pattern, ...Array.from({ length: n - 8 }, () => ({ colSpan: 1, rowSpan: 1 }))],
      };
    }
    case 'stacked': {
      // 6-kolumnsgrid: rad 1: 4+8 (2+4), rad 2: 6×6 (6×1), rad 3: 8+4 (4+2), rad 4: 4×4×4 (1+1+1+3) = 14 kort
      const stackedSpans: Array<{ colSpan: number; rowSpan: number }> = [
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 3, rowSpan: 1 },
      ];
      return {
        columns: 6,
        spans: stackedSpans.slice(0, n),
      };
    }
    default:
      return {
        columns: 2,
        spans: Array.from({ length: n }, () => ({ colSpan: 1, rowSpan: 1 })),
      };
  }
}

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

  const cardCount = componentOrder.length;
  const presetKey: CardLayoutPreset =
    (['equal', 'feature-top', 'three-col', 'two-col', 'narrow-wide', 'wide-narrow', 'alternating', 'stacked'] as const).includes(
      cardLayout as CardLayoutPreset
    )
      ? (cardLayout as CardLayoutPreset)
      : 'equal';
  const { columns, spans: spanByIndex } = getPresetSpans(presetKey, cardCount);

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
