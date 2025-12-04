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
  componentKey?: string;
}

export interface CarouselAnimationProps {
  items: CarouselAnimationItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  containerHeight?: string;
  backgroundColor?: string;
  padding?: string;
  itemWidth?: string;
  itemHeight?: string;
  itemPadding?: string;
  gap?: string;
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  duplicateCount?: number;
}

export const CarouselAnimation: React.FC<CarouselAnimationProps> = ({
  items,
  speed = 30,
  direction = 'left',
  className = '',
  containerHeight = 'auto',
  backgroundColor = 'var(--surface-page)', // ✅ Changed default
  padding = '5px',
  itemWidth = '120px',
  itemHeight = '70px',
  itemPadding = '15px',
  gap = '50px',
  enableFadeEdges = true,
  fadeWidth = '200px',
  duplicateCount = 6
}) => {
  const animationRef = useRef<HTMLDivElement>(null);

  const duplicatedItems = Array.from({ length: duplicateCount }, () => items).flat();

  useEffect(() => {
    const element = animationRef.current;
    if (!element) return;

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