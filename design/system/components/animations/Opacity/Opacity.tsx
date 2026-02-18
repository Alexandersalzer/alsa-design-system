// ===============================================
// design/system/components/animations/Opacity/Opacity.tsx
// OPACITY ANIMATION - Pure opacity fade animation
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './Opacity.css';

export interface OpacityProps {
  children: ReactNode;
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
  /** Disable animation and render children immediately */
  disabled?: boolean;
}

export const Opacity: React.FC<OpacityProps> = ({
  children,
  duration = 800,
  delay = 0,
  enableScrollTrigger = true,
  triggerOffset = 100,
  easing = 'ease-out',
  className = '',
  onComplete,
  disabled = false,
}) => {
  // Skip animation entirely if disabled
  if (disabled) {
    return <>{children}</>;
  }

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableScrollTrigger) {
      // Start animation immediately (delay is handled via transition delay)
      setIsVisible(true);
      return;
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
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}ms ${easing} ${delay}ms`,
    // Ensure hidden state is applied immediately on first render to prevent flash
    willChange: 'opacity',
  };

  return (
    <div
      ref={elementRef}
      className={`opacity-animation ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
