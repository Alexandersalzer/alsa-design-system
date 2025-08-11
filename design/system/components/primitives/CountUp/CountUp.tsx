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
    // Don't start if already completed or currently running
    if (hasStarted || hasCompleted) {
      console.log('🚫 Animation already started or completed:', { hasStarted, hasCompleted });
      return;
    }
    
    console.log('🚀 Starting CountUp animation from', start, 'to', end);
    setHasStarted(true);
    
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
      console.log('🔄 Animation step:', { progress, currentValue, elapsed, duration });
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        setHasCompleted(true); // Mark as completed
        console.log('✅ CountUp animation completed:', endValue);
        onComplete?.();
      }
    };

    // Start animation immediately or after delay
    if (delay > 0) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Intersection Observer for scroll trigger
  useEffect(() => {
    // If scroll trigger is disabled, start immediately
    if (!enableScrollTrigger) {
      console.log('⚡ Scroll trigger disabled, starting animation immediately');
      startAnimation();
      return;
    }

    // If already completed, don't set up observer
    if (hasCompleted) {
      console.log('✅ Animation already completed, skipping observer setup');
      return;
    }

    // Wait for element to be mounted
    const element = countRef.current;
    if (!element) {
      console.log('❌ CountUp element not mounted yet');
      return;
    }

    console.log('🔍 Setting up Intersection Observer for CountUp');

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('👁️ CountUp intersection:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasStarted: hasStarted,
          hasCompleted: hasCompleted,
          boundingRect: entry.boundingClientRect.top
        });
        
        // Only trigger if intersecting, hasn't started, and hasn't completed
        if (entry.isIntersecting && !hasStarted && !hasCompleted) {
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
  }, [enableScrollTrigger, hasStarted, hasCompleted, start, end, duration, delay]); // Fixed dependencies

  // Test if element is already visible on mount (fallback)
  useEffect(() => {
    if (!enableScrollTrigger || hasStarted || hasCompleted) return;
    
    const element = countRef.current;
    if (!element) return;

    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = rect.top < windowHeight - triggerOffset;
      
      console.log('🔍 Manual visibility check:', {
        elementTop: rect.top,
        windowHeight: windowHeight,
        triggerOffset: triggerOffset,
        isVisible: isVisible,
        hasStarted: hasStarted,
        hasCompleted: hasCompleted
      });
      
      if (isVisible && !hasStarted && !hasCompleted) {
        console.log('👁️ Element is visible on mount, starting animation');
        startAnimation();
      }
    };

    // Check immediately and after a short delay
    checkVisibility();
    const timeoutId = setTimeout(checkVisibility, 100);
    
    return () => clearTimeout(timeoutId);
  }, [enableScrollTrigger, hasStarted, hasCompleted, triggerOffset, start, end, duration, delay]); // Fixed dependencies

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