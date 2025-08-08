// ===============================================
// src/design-system/components/primitives/Tab/TabGroup.tsx
// FIXED VERSION - Proper TypeScript types and error handling
// ===============================================

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  // 🎯 Animation options
  animated?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
}

// 🎯 FIXED: Proper type for Tab props
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
  animated = true,
  animationType = 'slide'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLElement | null)[]>([]);

  // Track active tab for indicator animation
  useEffect(() => {
    if (!animated || variant === 'navigation') return;

    const updateIndicator = () => {
      const activeTab = tabsRef.current[activeIndex];
      if (activeTab && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        
        if (variant === 'page') {
          // Underline indicator for page tabs
          setIndicatorStyle({
            width: tabRect.width,
            left: tabRect.left - containerRect.left,
            opacity: 1
          });
        } else if (variant === 'segment') {
          // Background indicator for segment tabs
          setIndicatorStyle({
            width: tabRect.width,
            height: tabRect.height,
            left: tabRect.left - containerRect.left,
            top: tabRect.top - containerRect.top,
            opacity: 1
          });
        }
      }
    };

    // Update on mount and resize
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex, animated, variant]);

  // 🎯 FIXED: Proper type handling for React children
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      const childProps = child.props as TabProps;
      
      return React.cloneElement(child, {
        // 🎯 FIXED: Proper ref handling with forwardRef pattern
        ...childProps,
        // Custom click handler that tracks active index
        onClick: () => {
          setActiveIndex(index);
          // 🎯 FIXED: Safe property access
          if (childProps.onClick) {
            childProps.onClick();
          }
        },
        // 🎯 FIXED: Safe className concatenation
        className: [
          childProps.className || '',
          animated ? 'tab--animated' : '',
          animationType ? `tab--animation-${animationType}` : ''
        ].filter(Boolean).join(' ').trim(),
        // Pass through ref callback for indicator positioning
        'data-tab-index': index
      } as Partial<TabProps>);
    }
    return child;
  });

  // 🎯 FIXED: Effect to collect tab references from DOM
  useEffect(() => {
    if (!animated || variant === 'navigation') return;
    
    // Collect tab elements by data attribute
    const tabElements = containerRef.current?.querySelectorAll('[data-tab-index]');
    if (tabElements) {
      tabsRef.current = Array.from(tabElements) as HTMLElement[];
    }
  }, [enhancedChildren, animated, variant]);

  // For navigation variant, use your existing sidebar__nav class
  if (variant === 'navigation') {
    return (
      <div className={`sidebar__nav ${animated ? 'sidebar__nav--animated' : ''} ${className}`.trim()}>
        {enhancedChildren}
      </div>
    );
  }

  // For other variants, use tab-group classes with animation support
  const classes = [
    'tab-group',
    `tab-group--${variant}`,
    `tab-group--${orientation}`,
    animated && 'tab-group--animated',
    animationType && `tab-group--animation-${animationType}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={containerRef}
      className={classes} 
      role="tablist"
    >
      {/* Animated indicator for page and segment variants */}
      {animated && (variant === 'page' || variant === 'segment') && (
        <div 
          className={`tab-group__indicator tab-group__indicator--${variant}`}
          style={indicatorStyle}
        />
      )}
      
      {enhancedChildren}
    </div>
  );
};