// ===============================================
// design/system/components/animations/Scale/Scale.tsx
// SCALE ANIMATION - Zoom/scale animation
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './Scale.css';

export interface ScaleProps {
  children: ReactNode;
  /** Starting scale (0.8 = 80%, 1.2 = 120%) */
  from?: number;
  /** Ending scale (1 = 100%) */
  to?: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Enable scroll trigger (animate when element enters viewport) */
  enableScrollTrigger?: boolean;
  /** Offset from bottom of viewport to trigger animation (in pixels) */
  triggerOffset?: number;
  /** Easing function */
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  /** Custom className */
  className?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

export const Scale: React.FC<ScaleProps> = ({
  children,
  from = 0.8,
  to = 1,
  duration = 600,
  delay = 0,
  enableScrollTrigger = true,
  triggerOffset = 100,
  easing = 'ease-out',
  className = '',
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableScrollTrigger) {
      // Start animation after brief delay to ensure initial render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        root: null,
        rootMargin: `0px 0px -${triggerOffset}px 0px`,
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enableScrollTrigger, triggerOffset, hasAnimated]);

  // Handle animation complete
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration + delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, delay, onComplete]);

  const style: React.CSSProperties = {
    transform: `scale(${isVisible ? to : from})`,
    transition: `transform ${duration}ms ${easing} ${delay}ms`,
  };

  return (
    <div
      ref={elementRef}
      className={`scale-animation ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
