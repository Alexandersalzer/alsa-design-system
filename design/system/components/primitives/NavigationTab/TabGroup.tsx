// ===============================================
// src/design-system/components/primitives/Tab/TabGroup.tsx
// ENHANCED VERSION - Beautiful animations with motion tokens
// ===============================================

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  // 🎯 NEW: Animation options
  animated?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
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

  // Clone children to add refs and track active state
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ref: (el: HTMLElement) => {
          tabsRef.current[index] = el;
        },
        onClick: () => {
          setActiveIndex(index);
          if (child.props.onClick) {
            child.props.onClick();
          }
        },
        // Add animation classes
        className: `${child.props.className || ''} ${animated ? 'tab--animated' : ''} ${
          animationType ? `tab--animation-${animationType}` : ''
        }`.trim()
      });
    }
    return child;
  });

  // For navigation variant, use your existing sidebar__nav class
  if (variant === 'navigation') {
    return (
      <div className={`sidebar__nav ${animated ? 'sidebar__nav--animated' : ''} ${className}`}>
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