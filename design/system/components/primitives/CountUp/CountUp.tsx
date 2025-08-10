// ===============================================
// design/system/components/primitives/CountUp/CountUp.tsx
// COUNT UP ANIMATION PRIMITIVE COMPONENT
// ===============================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
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

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    
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
        console.log('✅ CountUp animation completed:', endValue);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [hasStarted, start, end, delay, duration, useEasing, onComplete]);

  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (!enableScrollTrigger) {
      // Start immediately if scroll trigger is disabled
      startAnimation();
      return;
    }

    if (!countRef.current) {
      console.log('❌ CountUp ref not available yet');
      return;
    }

    console.log('🔍 Setting up Intersection Observer for CountUp');

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('👁️ CountUp intersection:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasStarted: hasStarted
        });
        
        if (entry.isIntersecting && !hasStarted) {
          console.log('🎯 CountUp element is visible, starting animation');
          startAnimation();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: `0px 0px -${triggerOffset}px 0px`,
        threshold: 0.1 // Trigger when 10% of element is visible
      }
    );

    const element = countRef.current;
    if (element) {
      observer.observe(element);
      console.log('👀 Started observing CountUp element');
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      console.log('🧹 Cleaned up CountUp observer');
    };
  }, [enableScrollTrigger, hasStarted, triggerOffset, startAnimation]);

  // Reset animation if end value changes
  useEffect(() => {
    if (hasStarted && count !== end) {
      setHasStarted(false);
      setCount(start);
    }
  }, [end, start, hasStarted, count]);

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