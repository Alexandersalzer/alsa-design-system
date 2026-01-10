// ===============================================
// StickyTextContent.tsx - Sticky text beside content (row-by-row)
// ===============================================

'use client';

import React, { useMemo } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Accordion } from '../../../components/layout/Accordion/Accordion';
import { AccordionItem } from '../../../components/layout/Accordion/AccordionItem';
import './StickyTextContent.css';

export const StickyTextContent: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    contentLayout = 'stack',
    gap = 'xl',
    stickyOffset = '100px',
    textWidth = '280px',
  } = getPatternProps();

  // Create refs array for scroll tracking
  const contentRefs = useMemo(
    () => componentOrder.map(() => ({ current: null as HTMLElement | null })),
    [componentOrder]
  );

  // Use scroll animation hook to track active section
  const { activeIndex, scrollToIndex } = useScrollAnimation(contentRefs);

  return (
    <div className="sticky-text-content">
      {/* Sticky Sidebar with Accordion */}
      <aside
        className="sticky-text-content__sidebar"
        style={{
          '--text-width': textWidth,
          '--sticky-offset': stickyOffset,
        } as React.CSSProperties}
      >
        <Accordion
          selectionMode="single"
          variant="borderless"
          gap="none"
          showIndicator={false}
          expandedKeys={[String(activeIndex ?? 0)]}
          onSelectionChange={(keys: string[]) => {
            const index = parseInt(keys[0]);
            if (!isNaN(index)) {
              scrollToIndex(index);
            }
          }}
        >
          {componentOrder.map((key, index) => {
            const component = components[key];
            if (!component) return null;

            const { stickyTitle, stickyDescription } = component.props || {};

            return (
              <AccordionItem
                key={key}
                itemKey={String(index)}
                title={stickyTitle || `Section ${index + 1}`}
                className={activeIndex === index ? 'accordion-active' : ''}
              >
                {stickyDescription && (
                  <p className="sticky-text-content__description">
                    {stickyDescription}
                  </p>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </aside>

      {/* Scrolling Content Column */}
      <div className={`sticky-text-content__content layout-${contentLayout} gap-${gap}`}>
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

          const { stickyTitle, stickyDescription } = component.props || {};

          return (
            <div key={key} className="sticky-text-content__item">
              {/* Mobile Text - shown on mobile only */}
              <div className="sticky-text-content__mobile-text">
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
              </div>

              {/* Card Content */}
              <div
                ref={(el) => {
                  contentRefs[index].current = el;
                }}
                className="sticky-text-content__card"
              >
                <CardComponent
                  componentKey={key}
                  {...component.props}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StickyTextContent;
