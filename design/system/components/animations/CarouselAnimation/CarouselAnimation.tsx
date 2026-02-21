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
  itemMaxWidth?: string;
  itemMinWidth?: string;
  itemHeight?: string;
  itemPadding?: string;
  gap?: string;
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  duplicateCount?: number;
  enableHover?: boolean;
}

export const CarouselAnimation: React.FC<CarouselAnimationProps> = ({
  items,
  speed = 30,
  direction = 'left',
  className = '',
  containerHeight = 'auto',
  backgroundColor = 'var(--surface-page)', // ✅ Changed default
  padding = '5px',
  itemWidth = 'auto',
  itemMaxWidth,
  itemMinWidth,
  itemHeight = 'auto',
  itemPadding = '0px',
  gap = '50px',
  enableFadeEdges = true,
  fadeWidth = '200px',
  duplicateCount = 6,
  enableHover = false
}) => {
  const animationRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) {
    return (
      <div
        className={`Carousel-animation-container ${className}`}
        style={{
          height: containerHeight,
          minHeight: itemHeight !== 'auto' ? itemHeight : undefined,
          backgroundColor,
          padding,
        }}
      />
    );
  }

  const duplicatedItems = Array.from({ length: duplicateCount }, () => items).flat();

  // Preload all images in carousel to prevent white flashes
  useEffect(() => {
    const preloadImages = () => {
      items.forEach(item => {
        // Extract image src from React elements
        const extractImageSrc = (node: ReactNode): string[] => {
          const srcs: string[] = [];

          if (!node) return srcs;

          // Handle React elements
          if (typeof node === 'object' && 'props' in node) {
            const props = (node as any).props;

            // Direct image src
            if (props.src && typeof props.src === 'string') {
              srcs.push(props.src);
            }

            // Recurse through children
            if (props.children) {
              const children = Array.isArray(props.children) ? props.children : [props.children];
              children.forEach((child: ReactNode) => {
                srcs.push(...extractImageSrc(child));
              });
            }
          }

          return srcs;
        };

        const imageSrcs = extractImageSrc(item.content);

        // Preload each image
        imageSrcs.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      });
    };

    preloadImages();
  }, [items]);

  useEffect(() => {
    const element = animationRef.current;
    if (!element) return;

    element.style.setProperty('--animation-duration', `${speed}s`);
    element.style.setProperty('--animation-direction', direction === 'left' ? 'normal' : 'reverse');
    element.style.setProperty('--duplicate-count', duplicateCount.toString());

    // Keep-alive mechanism to prevent browser from pausing animation
    let animationFrameId: number;
    let lastTime = performance.now();

    const keepAlive = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime > 16) { // Roughly 60fps
        void element.offsetHeight; // Trigger reflow without causing layout shift
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(keepAlive);
    };

    animationFrameId = requestAnimationFrame(keepAlive);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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
    maxWidth: itemMaxWidth,
    minWidth: itemMinWidth,
    height: itemHeight,
    padding: itemPadding,
  };

  return (
    <div
      className={`Carousel-animation-container ${enableFadeEdges ? 'with-fade-edges' : ''} ${enableHover ? 'with-hover' : ''} ${className}`}
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
            {...(item.componentKey && { 'data-component-key': item.componentKey })}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};