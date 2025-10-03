// ===============================================
// design/system/components/primitives/CountUp/CountUp.tsx
// COUNT UP ANIMATION PRIMITIVE COMPONENT
// ===============================================

import React, { useEffect, useState, useRef } from 'react';
import { Typography, TypographyProps } from '../Typography';

export interface CountUpProps extends Omit<TypographyProps, 'children'> {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  separator?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  useEasing?: boolean;
  onComplete?: () => void;
  enableScrollTrigger?: boolean;
  triggerOffset?: number;
  resetOnPropsChange?: boolean; // New prop to allow reset when props change
}

export const CountUp: React.FC<CountUpProps> = ({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  separator = '',
  suffix = '',
  prefix = '',
  decimals = 0,
  useEasing = true,
  onComplete,
  enableScrollTrigger = true,
  triggerOffset = 100,
  resetOnPropsChange = false,
  variant = 'display-lg',
  weight = 'bold',
  color = 'primary',
  ...typographyProps
}) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false); // Track if animation completed
  const countRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  // Use refs to track state without causing useEffect re-runs
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Reset animation when key props change
  const resetAnimation = () => {
    console.log('🔄 Resetting CountUp animation');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCount(start);
    setHasStarted(false);
    setHasCompleted(false);
    hasStartedRef.current = false;
    hasCompletedRef.current = false;
  };

  // Easing function for smooth animation
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const formatNumber = (num: number): string => {
    const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    let formatted = rounded.toFixed(decimals);
    
    // Remove trailing zeros and decimal point if not needed
    if (decimals === 0) {
      formatted = Math.round(rounded).toString();
    }
    
    // Add thousands separator if needed and number is >= 1000
    if (separator && rounded >= 1000) {
      // Split into integer and decimal parts
      const parts = formatted.split('.');
      // Add separator to integer part
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      formatted = parts.join('.');
    }
    
    return `${prefix}${formatted}${suffix}`;
  };

  const startAnimation = () => {
    // Don't start if already completed or currently running (check refs for most current state)
    if (hasStartedRef.current || hasCompletedRef.current) {
      console.log('❌ Animation already started/completed, skipping', { 
        hasStarted: hasStartedRef.current, 
        hasCompleted: hasCompletedRef.current 
      });
      return;
    }
    
    console.log('🚀 Starting CountUp animation from', start, 'to', end);
    setHasStarted(true);
    hasStartedRef.current = true;
    
    const startTime = Date.now() + delay;
    const startValue = start;
    const endValue = end;
    const change = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);
      
      let easedProgress = progress;
      if (useEasing && progress < 1) {
        easedProgress = easeOutExpo(progress);
      }
      
      const currentValue = startValue + (change * easedProgress);
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        setHasCompleted(true); // Mark as completed
        hasCompletedRef.current = true;
        console.log('✅ CountUp animation completed:', endValue);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Intersection Observer for scroll trigger
  useEffect(() => {
    // If scroll trigger is disabled, start immediately
    if (!enableScrollTrigger) {
      console.log('⚡ Scroll trigger disabled, starting animation immediately');
      startAnimation();
      return;
    }

    // If already started or completed, don't set up observer
    if (hasStartedRef.current || hasCompletedRef.current) {
      console.log('✅ Animation already started/completed, skipping observer setup', { 
        hasStarted: hasStartedRef.current, 
        hasCompleted: hasCompletedRef.current 
      });
      return;
    }

    // Wait for element to be mounted
    const element = countRef.current;
    if (!element) {
      console.log('❌ CountUp element not mounted yet');
      return;
    }



    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('👁️ CountUp intersection:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasStarted: hasStartedRef.current,
          hasCompleted: hasCompletedRef.current,
          boundingRect: entry.boundingClientRect.top
        });
        
        // Only trigger if intersecting, hasn't started, and hasn't completed (use refs for current state)
        if (entry.isIntersecting && !hasStartedRef.current && !hasCompletedRef.current) {
          console.log('🎯 CountUp element is visible, starting animation');
          startAnimation();
        }
      },
      {
        root: null,
        rootMargin: `0px 0px -${triggerOffset}px 0px`,
        threshold: 0
      }
    );

    observer.observe(element);
    console.log('👀 Started observing CountUp element');

    return () => {
      observer.unobserve(element);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      console.log('🧹 Cleaned up CountUp observer');
    };
  }, [enableScrollTrigger, triggerOffset]); // Simplified dependencies to avoid re-renders

  // Reset animation when key props change (if enabled)
  useEffect(() => {
    if (resetOnPropsChange && (hasStartedRef.current || hasCompletedRef.current)) {
      console.log('🔄 Props changed, resetting animation');
      resetAnimation();
    }
  }, [start, end, duration, delay, resetOnPropsChange]);

  return (
    <Typography
      ref={countRef}
      variant={variant}
      weight={weight}
      color={color}
      {...typographyProps}
    >
      {formatNumber(count)}
    </Typography>
  );
}; 