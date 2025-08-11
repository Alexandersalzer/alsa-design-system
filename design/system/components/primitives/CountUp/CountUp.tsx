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
    if (hasStarted || hasCompleted) return;
    
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
          boundingRect: entry.boundingClientRect,
          rootBounds: entry.rootBounds,
          start: start,
          end: end
        });
        
        // Only trigger if intersecting, hasn't started, and hasn't completed
        if (entry.isIntersecting && !hasStarted && !hasCompleted) {
          console.log('🎯 CountUp element is visible, starting animation');
          startAnimation();
        }
      },
      {
        root: null,
        rootMargin: `${triggerOffset}px 0px ${triggerOffset}px 0px`, // Trigger margin on both top and bottom
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] // Multiple thresholds for better sensitivity
      }
    );

    observer.observe(element);
    console.log('👀 Started observing CountUp element with config:', {
      triggerOffset,
      enableScrollTrigger,
      element: element.getBoundingClientRect()
    });

    return () => {
      observer.unobserve(element);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      console.log('🧹 Cleaned up CountUp observer');
    };
  }, [enableScrollTrigger, hasStarted, hasCompleted, triggerOffset, start, end]); // Added hasCompleted to dependencies

  // Test if element is already visible on mount (fallback)
  useEffect(() => {
    if (!enableScrollTrigger || hasStarted || hasCompleted) return;
    
    const element = countRef.current;
    if (!element) return;

    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = (
        rect.top >= -rect.height &&  // Element is not too far above viewport
        rect.top <= windowHeight &&  // Element's top is in viewport
        rect.bottom >= 0 &&          // Element's bottom is not above viewport
        rect.bottom <= windowHeight + rect.height // Element is not too far below viewport
      );
      
      console.log('🔍 Manual visibility check:', {
        elementTop: rect.top,
        elementBottom: rect.bottom,
        elementHeight: rect.height,
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

    // Check immediately
    checkVisibility();
    
    // Check after a short delay to handle any layout shifts
    const timeoutId = setTimeout(checkVisibility, 100);
    
    // Also check on scroll for better reliability
    const handleScroll = () => {
      if (!hasStarted && !hasCompleted) {
        checkVisibility();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableScrollTrigger, hasStarted, hasCompleted, triggerOffset]);

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