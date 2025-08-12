// ===============================================
// KEEP YOUR EXISTING Tab.tsx - DON'T CHANGE IT
// Only update your TabGroup.tsx with this minimal addition
// ===============================================

import React, { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
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

  // ✅ ONLY ADDITION: Keyboard navigation for navigation variant
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Only handle keyboard for navigation variant
    if (variant !== 'navigation') return;

    const container = containerRef.current;
    if (!container) return;

    // Get all nav items
    const navItems = Array.from(container.querySelectorAll('.nav-item')) as HTMLElement[];
    if (navItems.length === 0) return;

    const currentIndex = navItems.findIndex(item => item === document.activeElement);
    let newIndex = currentIndex;

    const isHorizontal = orientation === 'horizontal';

    switch (e.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = (currentIndex + 1) % navItems.length;
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        }
        break;
      case 'ArrowDown':
        if (!isHorizontal) {
          e.preventDefault();
          newIndex = (currentIndex + 1) % navItems.length;
        }
        break;
      case 'ArrowUp':
        if (!isHorizontal) {
          e.preventDefault();
          newIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = navItems.length - 1;
        break;
    }

    if (newIndex !== currentIndex && navItems[newIndex]) {
      navItems[newIndex].focus();
    }
  }, [variant, orientation]);

  // YOUR EXISTING indicator update code - UNCHANGED
  useEffect(() => {
    if (!animated || variant === 'navigation' || orientation === 'vertical') return;
    
    const updateIndicator = () => {
      const container = containerRef.current;
      if (!container) return;
      
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
    
    updateIndicator();
    
    const observer = new MutationObserver(updateIndicator);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected']
      });
    }
    
    return () => observer.disconnect();
  }, [animated, variant, orientation]);

  // YOUR EXISTING children enhancement - UNCHANGED
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

  // YOUR EXISTING navigation variant - ONLY ADDED onKeyDown
  if (variant === 'navigation') {
    return (
      <div 
        ref={containerRef}
        className={`sidebar__nav ${animated ? 'sidebar__nav--animated' : ''} ${className}`.trim()}
        onKeyDown={handleKeyDown}
      >
        {enhancedChildren}
      </div>
    );
  }

  // YOUR EXISTING other variants - UNCHANGED
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
      onKeyDown={handleKeyDown}
    >
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