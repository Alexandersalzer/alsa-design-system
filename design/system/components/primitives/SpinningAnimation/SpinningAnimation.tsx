// ===============================================
// design/system/components/primitives/SpinningAnimation/SpinningAnimation.tsx
// SPINNING ANIMATION PRIMITIVE - Reusable for any content type
// ===============================================

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import './SpinningAnimation.css';

// ===== TYPE DEFINITIONS =====

export type SpinningAnimationType = 'horizontal' | 'vertical' | 'circular';
export type SpinningDirection = 'forward' | 'reverse' | 'left' | 'right' | 'up' | 'down';

export interface SpinningAnimationProps {
  children: ReactNode;
  className?: string;
  
  // Animation configuration
  type?: SpinningAnimationType;
  direction?: SpinningDirection;
  speed?: number; // Duration in seconds for one complete cycle
  
  // Layout configuration
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  itemWidth?: string | number;
  itemHeight?: string | number;
  
  // Behavior configuration
  pauseOnHover?: boolean;
  duplicateCount?: number; // How many times to duplicate content for seamless loop
  
  // Circular specific options
  radius?: number; // For circular animation
  itemCount?: number; // For calculating circular positions
}

// ===== MAIN SPINNING ANIMATION COMPONENT =====

export const SpinningAnimation: React.FC<SpinningAnimationProps> = ({
  children,
  className,
  type = 'horizontal',
  direction = 'forward',
  speed = 30,
  gap = 'md',
  itemWidth,
  itemHeight,
  pauseOnHover = false,
  duplicateCount = 6,
  radius = 200,
  itemCount
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Convert children to array for duplication
  const childrenArray = React.Children.toArray(children);
  
  // Calculate actual item count for circular animation
  const actualItemCount = itemCount || childrenArray.length;
  
  // Create duplicated content for seamless infinite loop
  const duplicatedContent = type === 'circular' 
    ? childrenArray // Circular doesn't need duplication
    : Array.from({ length: duplicateCount }, (_, i) => 
        childrenArray.map((child, index) => 
          React.cloneElement(child as React.ReactElement, {
            key: `${i}-${index}`
          })
        )
      ).flat();

  // Map direction aliases to standard directions
  const getStandardDirection = (dir: SpinningDirection): SpinningDirection => {
    switch (dir) {
      case 'left': return 'forward';
      case 'right': return 'reverse';
      case 'up': return 'forward';
      case 'down': return 'reverse';
      default: return dir;
    }
  };

  const standardDirection = getStandardDirection(direction);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Set CSS custom properties for animation
    container.style.setProperty('--animation-duration', `${speed}s`);
    container.style.setProperty('--animation-direction', standardDirection === 'forward' ? 'normal' : 'reverse');
    
    // Set item dimensions if provided
    if (itemWidth) {
      container.style.setProperty('--item-width', typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth);
    }
    if (itemHeight) {
      container.style.setProperty('--item-height', typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight);
    }
    
    // Set circular specific properties
    if (type === 'circular') {
      container.style.setProperty('--radius', `${radius}px`);
      container.style.setProperty('--item-count', actualItemCount.toString());
    }
  }, [speed, standardDirection, itemWidth, itemHeight, type, radius, actualItemCount]);

  // Build CSS classes
  const containerClasses = cn(
    'spinning-animation',
    `spinning-animation--${type}`,
    `spinning-animation--gap-${gap}`,
    pauseOnHover && 'spinning-animation--pause-on-hover',
    className
  );

  const trackClasses = cn(
    'spinning-animation__track',
    `spinning-animation__track--${type}`
  );

  const itemClasses = cn(
    'spinning-animation__item',
    `spinning-animation__item--${type}`
  );

  return (
    <div ref={containerRef} className={containerClasses}>
      <div ref={trackRef} className={trackClasses}>
        {(type === 'circular' ? childrenArray : duplicatedContent).map((child, index) => {
          const itemStyle: React.CSSProperties & { [key: string]: string } = {};
          
          // Calculate position for circular animation
          if (type === 'circular') {
            const angle = (360 / actualItemCount) * index;
            itemStyle['--rotation'] = `${angle}deg`;
          }
          
          return (
            <div
              key={index}
              className={itemClasses}
              style={itemStyle}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

SpinningAnimation.displayName = 'SpinningAnimation'; 