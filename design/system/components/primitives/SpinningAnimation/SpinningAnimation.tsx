// ===============================================
// design/system/components/primitives/SpinningAnimation/SpinningAnimation.tsx
// SPINNING ANIMATION PRIMITIVE - Reusable infinite scroll animation
// ===============================================

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import './SpinningAnimation.css';

export interface SpinningAnimationItem {
  id: string | number;
  content: ReactNode;
}

export interface SpinningAnimationProps {
  items: SpinningAnimationItem[];
  speed?: number; // Animation speed in seconds
  direction?: 'left' | 'right';
  className?: string;
  
  // Layout configuration
  itemWidth?: string | number;
  itemHeight?: string | number;
  gap?: string | number;
  
  // Container styling
  backgroundColor?: string;
  padding?: string | number;
  
  // Fade effects
  fadeEdges?: boolean;
  fadeWidth?: string | number;
  
  // Number of duplicates for seamless loop
  duplicates?: number;
}

export const SpinningAnimation: React.FC<SpinningAnimationProps> = ({
  items,
  speed = 30,
  direction = 'left',
  className = '',
  itemWidth = '120px',
  itemHeight = '70px',
  gap = '50px',
  backgroundColor = '#f7f7f7',
  padding = '5px',
  fadeEdges = true,
  fadeWidth = '200px',
  duplicates = 6
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create duplicated items for seamless infinite loop
  const duplicatedItems = Array.from({ length: duplicates }, () => items).flat();

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    
    if (!track || !container) return;

    // Set CSS custom properties for animation
    track.style.setProperty('--animation-duration', `${speed}s`);
    track.style.setProperty('--animation-direction', direction === 'left' ? 'normal' : 'reverse');
    track.style.setProperty('--duplicates', duplicates.toString());
    
    // Set container styles
    container.style.setProperty('--background-color', backgroundColor);
    container.style.setProperty('--container-padding', typeof padding === 'number' ? `${padding}px` : padding);
    
    // Set item styles
    track.style.setProperty('--item-width', typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth);
    track.style.setProperty('--item-height', typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight);
    track.style.setProperty('--item-gap', typeof gap === 'number' ? `${gap}px` : gap);
    
    // Set fade styles
    if (fadeEdges) {
      container.style.setProperty('--fade-width', typeof fadeWidth === 'number' ? `${fadeWidth}px` : fadeWidth);
      container.style.setProperty('--fade-color', backgroundColor);
    }
  }, [speed, direction, duplicates, backgroundColor, padding, itemWidth, itemHeight, gap, fadeEdges, fadeWidth]);

  return (
    <div 
      ref={containerRef}
      className={`spinning-animation-container ${fadeEdges ? 'with-fade' : ''} ${className}`}
    >
      <div ref={trackRef} className="spinning-animation-track">
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="spinning-animation-item">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 