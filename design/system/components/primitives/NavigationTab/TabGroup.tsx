// ===============================================
// src/design-system/components/primitives/Tab/TabGroup.tsx
// SIMPLIFIED VERSION - Clean and performant + KEYBOARD NAVIGATION
// ===============================================
import React, { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
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
  tabIndex?: number;
  onFocus?: (e: React.FocusEvent) => void;
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
  const [focusedIndex, setFocusedIndex] = useState(0);

  // ✅ NEW: Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (variant !== 'navigation') return;

    const container = containerRef.current;
    if (!container) return;

    const navItems = Array.from(container.querySelectorAll('.nav-item:not(.nav-item--disabled)')) as HTMLElement[];
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
      setFocusedIndex(newIndex);
      navItems[newIndex].focus();
    }
  }, [variant, orientation]);

  // Simple indicator update for horizontal tabs only (UNCHANGED)
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

  // ✅ ENHANCED: Children with focus management for navigation
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      const childProps = child.props as TabProps;
      
      // Enhanced props for navigation variant
      const enhancedProps = {
        ...childProps,
        className: [
          childProps.className || '',
          animated ? 'tab--animated' : ''
        ].filter(Boolean).join(' ').trim()
      };

      // Add focus management for navigation variant
      if (variant === 'navigation') {
        enhancedProps.tabIndex = index === focusedIndex ? 0 : -1;
        enhancedProps.onFocus = () => setFocusedIndex(index);
      }

      return React.cloneElement(child, enhancedProps as Partial<TabProps>);
    }
    return child;
  });

  // Navigation variant (sidebar) - ✅ ADDED: keyboard handling
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

  // Other variants with optional indicator (UNCHANGED except keyboard handling)
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
      aria-orientation={orientation}
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
          aria-hidden="true"
        />
      )}
      {enhancedChildren}
    </div>
  );
};