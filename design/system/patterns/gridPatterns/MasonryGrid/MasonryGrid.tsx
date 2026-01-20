'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { Button } from '../../../components/actions/Button/Button';
import './MasonryGrid.css';

export const MasonryGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const {
    columns = 3,
    gap = 'md',
    maxItemsMobile = 6,
    maxItemsTablet = 12,
    showMoreLabel = 'Visa fler',
    showLessLabel = 'Visa färre'
  } = getPatternProps();

  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate the limit based on screen size
  const currentLimit = React.useMemo(() => {
    if (isMobile) return maxItemsMobile;
    if (isTablet) return maxItemsTablet;
    return componentOrder.length;
  }, [isMobile, isTablet, maxItemsMobile, maxItemsTablet, componentOrder.length]);

  // Determine if we need to show the button
  const hasMoreItems = componentOrder.length > currentLimit;

  // Get visible items
  const visibleItems = React.useMemo(() => {
    if (showAll || !hasMoreItems) {
      return componentOrder;
    }
    return componentOrder.slice(0, currentLimit);
  }, [componentOrder, showAll, hasMoreItems, currentLimit]);

  return (
    <div className="masonry-grid-wrapper">
      <div className={`masonry-grid-container masonry-grid--columns-${columns} masonry-grid--gap-${gap}`}>
        {visibleItems.map(key => {
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
      </div>
      {hasMoreItems && (
        <div className="masonry-grid-show-more">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? showLessLabel : showMoreLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
