// ===============================================
// src/design-system/components/primitives/Tab/TabGroup.tsx
// ENHANCED VERSION - Added justify prop for flexible alignment
// ===============================================

import React, { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  animated?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

interface TabProps {
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  tabIndex?: number;
  onFocus?: (e: React.FocusEvent) => void;
  [key: string]: any;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  children,
  variant = 'navigation',
  orientation = 'horizontal',
  className = '',
  animated = true,
  justify = 'start'
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (variant !== 'navigation') return;

    const container = containerRef.current;
    if (!container) return;

    const navItems = Array.from(container.querySelectorAll('.nav-item:not(.nav-item--disabled)')) as HTMLElement[];
    if (navItems.length === 0) return;

    const currentIndex = navItems.findIndex(item => item === document.activeElement);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        // Both down and right go to next item (works for both orientations)
        e.preventDefault();
        newIndex = (currentIndex + 1) % navItems.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        // Both up and left go to previous item (works for both orientations)
        e.preventDefault();
        newIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = navItems.length - 1;
        break;
      case 'Enter':
      case ' ':
        // Space or Enter activates the focused item
        e.preventDefault();
        const focusedItem = navItems[currentIndex];
        if (focusedItem) {
          focusedItem.click();
        }
        break;
    }

    if (newIndex !== currentIndex && navItems[newIndex]) {
      setFocusedIndex(newIndex);
      navItems[newIndex].focus();
    }
  }, [variant]);

  useEffect(() => {
    if (!animated || variant === 'navigation' || orientation === 'vertical') return;

    let rafId: number | null = null;
    let lastWidth = 0;
    let lastLeft = 0;

    const updateIndicator = () => {
      // Cancel any pending animation frame to debounce updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeTab = container.querySelector(
          '.tab--active, .active, [aria-selected="true"]'
        ) as HTMLElement;

        if (activeTab) {
          const containerRect = container.getBoundingClientRect();
          const tabRect = activeTab.getBoundingClientRect();
          const newWidth = tabRect.width;
          const newLeft = tabRect.left - containerRect.left;

          // Only update state if values actually changed (prevents unnecessary re-renders)
          if (newWidth !== lastWidth || newLeft !== lastLeft) {
            lastWidth = newWidth;
            lastLeft = newLeft;
            setIndicatorStyle({
              width: newWidth,
              left: newLeft
            });
          }
        }
      });
    };

    updateIndicator();

    // Use throttled MutationObserver - only observe critical changes
    const observer = new MutationObserver((mutations) => {
      // Only update if there's a meaningful change (class or aria-selected attribute)
      const hasRelevantChange = mutations.some(mutation =>
        (mutation.type === 'attributes' &&
         (mutation.attributeName === 'class' || mutation.attributeName === 'aria-selected')) ||
        mutation.type === 'childList'
      );

      if (hasRelevantChange) {
        updateIndicator();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected']
      });
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [animated, variant, orientation]);

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      const childProps = child.props as TabProps;
      
      const enhancedProps = {
        ...childProps,
        className: [
          childProps.className || '',
          animated ? 'tab--animated' : ''
        ].filter(Boolean).join(' ').trim()
      };

      if (variant === 'navigation') {
        enhancedProps.tabIndex = index === focusedIndex ? 0 : -1;
        enhancedProps.onFocus = () => setFocusedIndex(index);
      }

      return React.cloneElement(child, enhancedProps as Partial<TabProps>);
    }
    return child;
  });

  if (variant === 'navigation') {
    return (
      <nav 
        ref={containerRef}
        className={`sidebar__nav ${animated ? 'sidebar__nav--animated' : ''} ${className}`.trim()}
        onKeyDown={handleKeyDown}
        role="navigation"
        aria-label="Main navigation"
      >
        {enhancedChildren}
      </nav>
    );
  }

  const classes = [
    'tab-group',
    `tab-group--${variant}`,
    `tab-group--${orientation}`,
    `tab-group--justify-${justify}`,
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
      aria-orientation={orientation}
    >
      {showIndicator && (
        <div
          className={`tab-group__indicator tab-group__indicator--${variant}`}
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
            opacity: indicatorStyle.width > 0 ? 1 : 0
          }}
          aria-hidden="true"
        />
      )}
      {enhancedChildren}
    </div>
  );
};