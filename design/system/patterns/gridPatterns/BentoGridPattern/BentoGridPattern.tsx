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
  | 'alternating'   // 4+8, 8+4 × 6 rader = 12 kort, fyller 3 kolumner
  | 'stacked';      // 4+8, 6×6, 8+4, 3+3 = 12 kort, fyller 6 kolumner

const MAX_CARDS = 12;
const ROW_TOTAL = 12; // Varje rad ska summera till 12 – fast 12-kolumnsgrid

/** Ger colSpan/rowSpan för 12-kolumnsgrid. Varje rad summerar alltid till 12. */
function getPresetSpans(
  preset: CardLayoutPreset,
  cardCount: number
): { columns: 12; spans: Array<{ colSpan: number; rowSpan: number }> } {
  const n = Math.min(Math.max(1, cardCount), MAX_CARDS);

  switch (preset) {
    case 'equal': {
      // Varje rad = 12: 2 kort → 6+6, 4 kort → 6+6 per rad, 6 kort → 4+4+4, 8 kort → 3+3+3+3, 12 kort → 3+3+3+3
      const colSpanPerCard =
        n <= 2 ? 6 : n <= 4 ? 6 : n <= 6 ? 4 : n <= 8 ? 3 : 3;
      const cardsPerRow = ROW_TOTAL / colSpanPerCard;
      const spans = Array.from({ length: n }, () => ({
        colSpan: colSpanPerCard as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
        rowSpan: 1,
      }));
      return { columns: 12, spans };
    }
    case 'feature-top': {
      // Rad 1–2: ett stort kort 6 colSpan rowSpan 2, två kort 6+6. Rad 2: 6+6. Summa per rad = 12
      if (n < 4) {
        const colSpan = n <= 2 ? 6 : 4;
        return {
          columns: 12,
          spans: Array.from({ length: n }, () => ({ colSpan: colSpan as 6 | 4, rowSpan: 1 })),
        };
      }
      return {
        columns: 12,
        spans: [
          { colSpan: 6, rowSpan: 2 },
          { colSpan: 6, rowSpan: 1 },
          { colSpan: 6, rowSpan: 1 },
          { colSpan: 6, rowSpan: 1 },
          ...Array.from({ length: Math.max(0, n - 4) }, () => ({ colSpan: 6, rowSpan: 1 })),
        ].slice(0, n) as Array<{ colSpan: number; rowSpan: number }>,
      };
    }
    case 'three-col': {
      // 4 kort: 4+4+4, 12.  Övriga: 4+4+4 per rad (= 12)
      const spans =
        n === 4
          ? [
              { colSpan: 4, rowSpan: 1 },
              { colSpan: 4, rowSpan: 1 },
              { colSpan: 4, rowSpan: 1 },
              { colSpan: 12, rowSpan: 1 },
            ]
          : Array.from({ length: n }, () => ({ colSpan: 4, rowSpan: 1 }));
      return { columns: 12, spans };
    }
    case 'two-col': {
      // 6+6 = 12 per rad
      return {
        columns: 12,
        spans: Array.from({ length: n }, () => ({ colSpan: 6, rowSpan: 1 })),
      };
    }
    case 'narrow-wide': {
      // 4+8 = 12 per rad
      const pattern = [
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
      ];
      return {
        columns: 12,
        spans: Array.from({ length: n }, (_, i) => pattern[i % pattern.length]),
      };
    }
    case 'wide-narrow': {
      // 8+4 = 12 per rad
      const pattern = [
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
      ];
      return {
        columns: 12,
        spans: Array.from({ length: n }, (_, i) => pattern[i % pattern.length]),
      };
    }
    case 'alternating': {
      // Varje rad 12: 4+8, 8+4, 4+8, 8+4, …
      const pattern = [
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
      ];
      return {
        columns: 12,
        spans: pattern.slice(0, n),
      };
    }
    case 'stacked': {
      // Rad 1: 4+8, rad 2: 2×6, rad 3: 8+4, rad 4: 6+6 – alla rader = 12, totalt 12 kort
      const stackedSpans: Array<{ colSpan: number; rowSpan: number }> = [
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 2, rowSpan: 1 },
        { colSpan: 8, rowSpan: 1 },
        { colSpan: 4, rowSpan: 1 },
        { colSpan: 6, rowSpan: 1 },
        { colSpan: 6, rowSpan: 1 },
      ];
      return {
        columns: 12,
        spans: stackedSpans.slice(0, n),
      };
    }
    default:
      return {
        columns: 12,
        spans: Array.from({ length: n }, () => ({ colSpan: 6, rowSpan: 1 })),
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
