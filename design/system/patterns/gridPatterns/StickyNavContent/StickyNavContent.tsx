// ===============================================
// StickyNavContent.tsx - Sticky navigation with scrollable content
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
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
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);

  const handleNavClick = (key: string) => {
    setActiveKey(key);

    // Scroll to the content item
    const element = document.querySelector(`[data-content-key="${key}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleExpanded = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isExpanded = (key: string) => expandedKeys.includes(key);
  const isActive = (key: string) => activeKey === key;

  // Build navigation items from components
  const navItems = componentOrder.map(key => {
    const component = components[key];
    if (!component) return null;

    const { itemKey = key, title, description } = component.props || {};

    return {
      key: itemKey,
      title: title || 'Untitled',
      description: description || '',
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
          <div className="sticky-nav-accordion">
            {navItems.map((item) => {
              if (!item) return null;
              const expanded = isExpanded(item.key);
              const active = isActive(item.key);

              return (
                <div
                  key={item.key}
                  className={`sticky-nav-accordion__item ${active ? 'is-active' : ''} ${expanded ? 'is-expanded' : ''}`}
                >
                  <button
                    className="sticky-nav-accordion__button"
                    onClick={() => handleNavClick(item.key)}
                  >
                    <span className="sticky-nav-accordion__title">
                      {item.title}
                    </span>
                    {item.description && (
                      <button
                        className="sticky-nav-accordion__toggle"
                        onClick={(e) => toggleExpanded(item.key, e)}
                        aria-label={expanded ? "Collapse" : "Expand"}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </button>
                  {expanded && item.description && (
                    <div className="sticky-nav-accordion__description">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {navVariant === 'list' && (
          <nav className="sticky-nav-list">
            {navItems.map((item) => {
              if (!item) return null;
              const active = isActive(item.key);

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
