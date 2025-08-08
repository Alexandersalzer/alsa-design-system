// ===============================================
// src/design-system/components/primitives/Tab/TabGroup.tsx
// SIMPLIFIED VERSION - Clean and performant
// ===============================================

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  // Simplified animation options
  animated?: boolean;
}

interface TabProps {
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  [key: string]: any;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  children,
  variant = 'navigation',
  orientation = 'horizontal',
  className = '',
  animated = true
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple indicator update for horizontal tabs only
  useEffect(() => {
    if (!animated || variant === 'navigation' || orientation === 'vertical') return;

    const updateIndicator = () => {
      const container = containerRef.current;
      if (!container) return;

      // Find active tab by looking for active classes or aria-selected
      const activeTab = container.querySelector(
        '.tab--active, .active, [aria-selected="true"]'
      ) as HTMLElement;

      if (activeTab) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        
        setIndicatorStyle({
          width: tabRect.width,
          left: tabRect.left - containerRect.left
        });
      }
    };

    // Update indicator position
    updateIndicator();
    
    // Listen for tab changes (use MutationObserver for class changes)
    const observer = new MutationObserver(updateIndicator);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected']
      });
    }

    // Cleanup
    return () => observer.disconnect();
  }, [animated, variant, orientation]);

  // Simple children enhancement - no complex cloning
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      const childProps = child.props as TabProps;
      
      return React.cloneElement(child, {
        ...childProps,
        className: [
          childProps.className || '',
          animated ? 'tab--animated' : ''
        ].filter(Boolean).join(' ').trim()
      } as Partial<TabProps>);
    }
    return child;
  });

  // Navigation variant (sidebar)
  if (variant === 'navigation') {
    return (
      <div className={`sidebar__nav ${animated ? 'sidebar__nav--animated' : ''} ${className}`.trim()}>
        {enhancedChildren}
      </div>
    );
  }

  // Other variants with optional indicator
  const classes = [
    'tab-group',
    `tab-group--${variant}`,
    `tab-group--${orientation}`,
    animated && 'tab-group--animated',
    className
  ].filter(Boolean).join(' ');

  const showIndicator = animated && 
                       orientation === 'horizontal' && 
                       (variant === 'page' || variant === 'segment');

  return (
    <div 
      ref={containerRef}
      className={classes} 
      role="tablist"
    >
      {/* Simple sliding indicator for horizontal tabs only */}
      {showIndicator && (
        <div 
          className={`tab-group__indicator tab-group__indicator--${variant}`}
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
            opacity: indicatorStyle.width > 0 ? 1 : 0
          }}
        />
      )}
      
      {enhancedChildren}
    </div>
  );
};