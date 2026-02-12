// ===============================================
// design/system/components/animations/OpacityBounce/OpacityBounce.tsx
// OPACITY + BOUNCE ANIMATION - Combined fade in with bounce effect
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './OpacityBounce.css';

export interface OpacityBounceProps {
  children: ReactNode;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Bounce intensity (higher = more bounce) */
  intensity?: number;
  /** Enable scroll trigger (animate when element enters viewport) */
  enableScrollTrigger?: boolean;
  /** Offset from bottom of viewport to trigger animation (in pixels) */
  triggerOffset?: number;
  /** Custom className */
  className?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

export const OpacityBounce: React.FC<OpacityBounceProps> = ({
  children,
  duration = 600,
  delay = 0,
  intensity = 1,
  enableScrollTrigger = true,
  triggerOffset = 100,
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

  return (
    <div
      ref={elementRef}
      className={`opacity-bounce-animation ${isVisible ? 'opacity-bounce-animation--active' : ''} ${className}`}
      style={{
        '--opacity-bounce-duration': `${duration}ms`,
        '--opacity-bounce-delay': `${delay}ms`,
        '--opacity-bounce-intensity': intensity,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
