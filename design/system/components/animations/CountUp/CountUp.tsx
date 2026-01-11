// design/system/components/primitives/CountUp/CountUp.tsx

import React, { useEffect, useState, useRef } from 'react';
import { Typography, TypographyProps } from '../../Typography';

export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "expoOut";

export interface CountUpProps extends Omit<TypographyProps, 'children'> {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  separator?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  easing?: EasingType;
  onComplete?: () => void;
  enableScrollTrigger?: boolean;
  triggerOffset?: number;
  resetOnPropsChange?: boolean;
}

const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  expoOut: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

export const CountUp: React.FC<CountUpProps> = ({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  separator = '',
  suffix = '',
  prefix = '',
  decimals = 0,
  easing = "expoOut",
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
  const countRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  const resetAnimation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setCount(start);
    hasStartedRef.current = false;
    hasCompletedRef.current = false;
  };

  const formatNumber = (num: number) => {
    const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    let formatted = decimals > 0 ? rounded.toFixed(decimals) : Math.round(rounded).toString();

    if (separator && rounded >= 1000) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      formatted = parts.join('.');
    }

    return `${prefix}${formatted}${suffix}`;
  };

  const startAnimation = () => {
    if (hasStartedRef.current || hasCompletedRef.current) return;

    hasStartedRef.current = true;

    const startTime = Date.now() + delay;
    const startValue = start;
    const endValue = end;
    const change = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);

      const eased = easings[easing](progress);
      setCount(startValue + change * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        hasCompletedRef.current = true;
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Scroll-trigger observer
  useEffect(() => {
    if (!enableScrollTrigger) {
      startAnimation();
      return;
    }

    const element = countRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current && !hasCompletedRef.current) {
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

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enableScrollTrigger, triggerOffset]);

  // Reset when important props change
  useEffect(() => {
    if (resetOnPropsChange && (hasStartedRef.current || hasCompletedRef.current)) {
      resetAnimation();
      startAnimation();
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
