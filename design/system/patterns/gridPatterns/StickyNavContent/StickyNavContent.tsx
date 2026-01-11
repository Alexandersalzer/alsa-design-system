// ===============================================
// StickyNavContent.tsx - Sticky navigation with scrollable content
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { Accordion } from '../../../components/layout/Accordion/Accordion';
import { AccordionItem } from '../../../components/layout/Accordion/AccordionItem';
import { Body } from '../../../components/Typography';
import './StickyNavContent.css';

export const StickyNavContent: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    navVariant = 'list',
    contentLayout = 'stack',
    gridColumns = 1,
    gap = 'xl',
    stickyOffset = '100px',
    navWidth = '280px',
  } = getPatternProps();

  const [activeKey, setActiveKey] = React.useState<string>(componentOrder[0] || '');

  const handleNavClick = (key: string) => {
    setActiveKey(key);

    // Scroll to the content item
    const element = document.querySelector(`[data-content-key="${key}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Build navigation items from components
  const navItems = componentOrder.map(key => {
    const component = components[key];
    if (!component) return null;

    const { itemKey = key, title, navDescription } = component.props || {};

    return {
      key: itemKey,
      title: title || 'Untitled',
      description: navDescription || '',
      component
    };
  }).filter(Boolean);

  return (
    <div
      className="sticky-nav-content"
      style={{
        '--nav-width': navWidth,
      } as React.CSSProperties}
    >
      {/* Navigation Sidebar */}
      <aside
        className="sticky-nav-content__nav"
        style={{
          top: stickyOffset,
        }}
      >
        {navVariant === 'accordion' && (
          <Accordion
            selectionMode="single"
            variant="borderless"
            gap="none"
            showIndicator={true}
            expandedKeys={[activeKey]}
            onSelectionChange={(keys: string[]) => {
              if (keys[0]) {
                handleNavClick(keys[0]);
              }
            }}
          >
            {navItems.map((item) => {
              if (!item) return null;

              return (
                <AccordionItem
                  key={item.key}
                  itemKey={item.key}
                  title={item.title}
                  className={activeKey === item.key ? 'is-active' : ''}
                >
                  {item.description && (
                    <Body size="sm" color="secondary">
                      {item.description}
                    </Body>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {navVariant === 'list' && (
          <nav className="sticky-nav-list">
            {navItems.map((item) => {
              if (!item) return null;
              const active = activeKey === item.key;

              return (
                <button
                  key={item.key}
                  className={`sticky-nav-list__item ${active ? 'is-active' : ''}`}
                  onClick={() => handleNavClick(item.key)}
                >
                  <div className="sticky-nav-list__title">{item.title}</div>
                  {item.description && (
                    <div className="sticky-nav-list__description">
                      {item.description}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </aside>

      {/* Content Area */}
      <div className="sticky-nav-content__main">
        <div
          className={`
            sticky-nav-content__items
            layout-${contentLayout}
            gap-${gap}
          `}
          style={{
            ...(contentLayout === 'grid' && {
              '--grid-columns': gridColumns,
            } as React.CSSProperties),
          }}
        >
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

            const itemKey = component.props?.itemKey || key;

            return (
              <div
                key={key}
                className="sticky-nav-content__item"
                data-content-key={itemKey}
              >
                <CardComponent
                  componentKey={key}
                  {...component.props}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickyNavContent;
