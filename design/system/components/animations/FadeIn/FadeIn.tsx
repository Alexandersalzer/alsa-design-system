// ===============================================
// design/system/components/animations/FadeIn/FadeIn.tsx
// FADE IN ANIMATION - Smooth entrance animation with scroll trigger
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './FadeIn.css';

export type FadeInDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface FadeInProps {
  children: ReactNode;
  /** Animation direction */
  direction?: FadeInDirection;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Distance to move during animation in pixels */
  distance?: number;
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

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  duration = 600,
  delay = 0,
  distance = 20,
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

  const [isVisible, setIsVisible] = useState(!enableScrollTrigger); // Start visible if no scroll trigger
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Calculate transform based on direction
  const getTransform = () => {
    if (direction === 'none' || isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return `translate(0, ${distance}px)`;
      case 'down':
        return `translate(0, -${distance}px)`;
      case 'left':
        return `translate(${distance}px, 0)`;
      case 'right':
        return `translate(-${distance}px, 0)`;
      default:
        return 'translate(0, 0)';
    }
  };

  // Only apply animation styles when mounted on client
  const style: React.CSSProperties = isMounted
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getTransform(),
        transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
        willChange: 'opacity, transform',
      }
    : {
        // Server-side: render visible without animation
        opacity: 1,
        transform: 'translate(0, 0)',
      };

  return (
    <div
      ref={elementRef}
      className={`fade-in ${!isVisible && isMounted ? 'fade-in-hidden' : ''} ${className}`}
      style={style}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
