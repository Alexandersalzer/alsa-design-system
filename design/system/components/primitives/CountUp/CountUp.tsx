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
    if (hasStarted) return;
    
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
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (!enableScrollTrigger) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          startAnimation();
        }
      },
      {
        rootMargin: `0px 0px -${triggerOffset}px 0px`,
        threshold: 0
      }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enableScrollTrigger, hasStarted, triggerOffset]);

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