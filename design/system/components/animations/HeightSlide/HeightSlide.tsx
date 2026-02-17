// ===============================================
// design/system/components/animations/HeightSlide/HeightSlide.tsx
// HEIGHT SLIDE ANIMATION - Smooth height expansion/collapse
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './HeightSlide.css';

export interface HeightSlideProps {
  children: ReactNode;
  /** Whether the content is expanded */
  isOpen: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Easing function */
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  /** Custom className */
  className?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Additional transform distance during animation (in pixels) */
  translateY?: number;
}

export const HeightSlide: React.FC<HeightSlideProps> = ({
  children,
  isOpen,
  duration = 350,
  delay = 0,
  easing = 'spring',
  className = '',
  onComplete,
  translateY = 8,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

  // Easing function map
  const easingMap = {
    'ease': 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring with overshoot
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    if (isOpen) {
      // Opening animation
      // First, get the full content height
      element.style.height = 'auto';
      element.style.overflow = 'hidden';
      const fullHeight = element.scrollHeight;

      // Reset to 0 for animation
      element.style.height = '0px';
      element.style.opacity = '0';
      element.style.transform = `translateY(-${translateY}px)`;

      // Force reflow
      void element.offsetHeight;

      // Animate to full height
      requestAnimationFrame(() => {
        element.style.transition = `height ${duration}ms ${easingMap[easing]} ${delay}ms,
                                    opacity ${duration}ms ${easingMap[easing]} ${delay}ms,
                                    transform ${duration}ms ${easingMap[easing]} ${delay}ms`;
        element.style.height = `${fullHeight}px`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        setHeight(fullHeight);
      });

      // After animation completes, set height to auto for responsive behavior
      const timer = setTimeout(() => {
        if (element) {
          element.style.height = 'auto';
          element.style.overflow = 'visible';
          setHeight('auto');
        }
        onComplete?.();
      }, duration + delay);

      return () => clearTimeout(timer);
    } else {
      // Closing animation
      const currentHeight = element.scrollHeight;

      // Set explicit height before animating to 0
      element.style.height = `${currentHeight}px`;
      element.style.overflow = 'hidden';

      // Force reflow
      void element.offsetHeight;

      // Animate to 0
      requestAnimationFrame(() => {
        element.style.transition = `height ${duration}ms ${easingMap[easing]} ${delay}ms,
                                    opacity ${duration}ms ${easingMap[easing]} ${delay}ms,
                                    transform ${duration}ms ${easingMap[easing]} ${delay}ms`;
        element.style.height = '0px';
        element.style.opacity = '0';
        element.style.transform = `translateY(-${translateY}px)`;
        setHeight(0);
      });

      const timer = setTimeout(() => {
        onComplete?.();
      }, duration + delay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, delay, easing, translateY, onComplete]);

  return (
    <div
      ref={contentRef}
      className={`height-slide ${className}`}
      style={{
        height: height === 'auto' ? 'auto' : `${height}px`,
      }}
    >
      {children}
    </div>
  );
};
