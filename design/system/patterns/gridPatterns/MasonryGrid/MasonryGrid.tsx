'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import './MasonryGrid.css';

export const MasonryGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);

  const { columns = 3, gap = 'md', maxItemsMobile = 6, maxItemsTablet = 12 } = getPatternProps();

  // Determine how many items to show based on screen size
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Limit items based on screen size
  const visibleItems = React.useMemo(() => {
    if (isMobile && maxItemsMobile) {
      return componentOrder.slice(0, maxItemsMobile);
    }
    if (isTablet && maxItemsTablet) {
      return componentOrder.slice(0, maxItemsTablet);
    }
    return componentOrder;
  }, [componentOrder, isMobile, isTablet, maxItemsMobile, maxItemsTablet]);

  return (
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
  );
};

export default MasonryGrid;
