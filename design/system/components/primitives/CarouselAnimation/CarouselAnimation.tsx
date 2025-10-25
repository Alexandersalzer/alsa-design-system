// ===============================================
// design/system/components/primitives/CarouselAnimation/CarouselAnimation.tsx
// Carousel ANIMATION PRIMITIVE - Reusable horizontal scrolling animation
// ===============================================

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import './CarouselAnimation.css';

export interface CarouselAnimationItem {
  id: string | number;
  content: ReactNode;
}

export interface CarouselAnimationProps {
  items: CarouselAnimationItem[];
  speed?: number; // Animation speed in seconds
  direction?: 'left' | 'right';
  className?: string;
  
  // Container styling
  containerHeight?: string;
  backgroundColor?: string;
  padding?: string;
  
  // Item styling
  itemWidth?: string;
  itemHeight?: string;
  itemPadding?: string;
  gap?: string;
  
  // Fade edges
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  
  // Animation behavior
  duplicateCount?: number; // How many times to duplicate items for seamless loop
}

export const CarouselAnimation: React.FC<CarouselAnimationProps> = ({
  items,
  speed = 30,
  direction = 'left',
  className = '',
  
  // Container defaults
  containerHeight = 'auto',
  backgroundColor = '#f7f7f7',
  padding = '5px',
  
  // Item defaults
  itemWidth = '120px',
  itemHeight = '70px',
  itemPadding = '15px',
  gap = '50px',
  
  // Fade edges defaults
  enableFadeEdges = true,
  fadeWidth = '200px',
  
  // Animation defaults
  duplicateCount = 6
}) => {
  const animationRef = useRef<HTMLDivElement>(null);

  // Create duplicated items for seamless infinite loop
  const duplicatedItems = Array.from({ length: duplicateCount }, () => items).flat();

  useEffect(() => {
    const element = animationRef.current;
    if (!element) return;

    // Set CSS custom properties for animation
    element.style.setProperty('--animation-duration', `${speed}s`);
    element.style.setProperty('--animation-direction', direction === 'left' ? 'normal' : 'reverse');
    element.style.setProperty('--duplicate-count', duplicateCount.toString());
  }, [speed, direction, duplicateCount]);

  const containerStyle: React.CSSProperties = {
    height: containerHeight,
    backgroundColor: backgroundColor,
    padding: padding,
    '--fade-width': fadeWidth,
    '--fade-color': backgroundColor,
  } as React.CSSProperties;

  const trackStyle: React.CSSProperties = {
    gap: gap,
  };

  const itemStyle: React.CSSProperties = {
    width: itemWidth,
    height: itemHeight,
    padding: itemPadding,
  };

  return (
    <div 
      className={`Carousel-animation-container ${enableFadeEdges ? 'with-fade-edges' : ''} ${className}`}
      style={containerStyle}
    >
      <div 
        ref={animationRef} 
        className="Carousel-animation-track"
        style={trackStyle}
      >
        {duplicatedItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="Carousel-animation-item"
            style={itemStyle}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 