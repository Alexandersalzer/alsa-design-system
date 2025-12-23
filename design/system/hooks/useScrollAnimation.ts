// ===============================================
// useScrollAnimation Hook
// Scroll-driven animation hook with RAF for smooth 60fps
// ===============================================

import { useState, useEffect, useRef, RefObject } from 'react';

export interface ScrollAnimationConfig {
  /** Smooth interpolation factor (0-1, lower = smoother) */
  smoothFactor?: number;
  /** When to start animation (normalized viewport position) */
  animationStart?: number;
  /** When to end animation (normalized viewport position) */
  animationEnd?: number;
  /** Minimum opacity value */
  minOpacity?: number;
  /** Maximum opacity value */
  maxOpacity?: number;
  /** Horizontal translate range in pixels */
  translateRange?: number;
  /** Vertical translate range in pixels */
  translateYRange?: number;
  /** Minimum scale value */
  scaleMin?: number;
  /** Maximum scale value */
  scaleMax?: number;
}

export interface ScrollAnimationState {
  current: number;
  target: number;
  hasFullyAnimated: boolean;
  peakValue: number;
}

export interface ScrollAnimationValues {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
  progress: number;
}

const DEFAULT_CONFIG: Required<ScrollAnimationConfig> = {
  smoothFactor: 0.06,
  animationStart: -0.2,
  animationEnd: 0.4,
  minOpacity: 0.1,
  maxOpacity: 1,
  translateRange: 80,
  translateYRange: 30,
  scaleMin: 0.92,
  scaleMax: 1,
};

// Smooth sine easing function
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * Hook that provides scroll-driven animation values for elements
 * Uses RAF for smooth 60fps animations tied to scroll position
 */
export function useScrollAnimation(
  elementRefs: RefObject<HTMLElement | null>[],
  config: ScrollAnimationConfig = {}
) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const [activeIndex, setActiveIndex] = useState(0);
  const [animationValues, setAnimationValues] = useState<ScrollAnimationValues[]>(
    elementRefs.map(() => ({
      opacity: fullConfig.minOpacity,
      translateX: fullConfig.translateRange,
      translateY: fullConfig.translateYRange,
      scale: fullConfig.scaleMin,
      progress: 0,
    }))
  );

  const tickingRef = useRef(false);
  const scrollDirectionRef = useRef<'down' | 'up'>('down');
  const lastScrollYRef = useRef(0);

  // State for each element
  const stateRef = useRef<ScrollAnimationState[]>(
    elementRefs.map(() => ({
      current: 0,
      target: 0,
      hasFullyAnimated: false,
      peakValue: 0,
    }))
  );

  useEffect(() => {
    function computeTargets(): number {
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      let bestIndex = 0;
      let bestScore = -1;

      elementRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const elementHeight = rect.height;
        const elementCenter = elementTop + elementHeight / 2;

        const viewportCenter = scrollY + viewportHeight / 2;

        // How far the element has traveled into the viewport (normalized 0-1)
        const scrollProgress =
          (scrollY + viewportHeight - elementTop) / (viewportHeight + elementHeight);

        // Smooth animation range based on element's journey through viewport
        const animationProgress =
          (scrollProgress - fullConfig.animationStart) /
          (fullConfig.animationEnd - fullConfig.animationStart);

        // Clamp between 0 and 1
        const clampedProgress = Math.max(0, Math.min(1, animationProgress));

        const s = stateRef.current[i];

        if (scrollDirectionRef.current === 'down') {
          // Scrolling down
          if (scrollProgress > fullConfig.animationStart) {
            s.target = clampedProgress;

            if (clampedProgress > s.peakValue) {
              s.peakValue = clampedProgress;
            }

            if (clampedProgress >= 1) {
              s.hasFullyAnimated = true;
              s.target = 1;
            } else if (s.hasFullyAnimated) {
              s.target = 1;
            }
          } else if (s.hasFullyAnimated) {
            s.target = 1;
          } else {
            s.target = 0;
          }
        } else {
          // Scrolling up
          if (scrollProgress < -0.3) {
            s.target = 0;
            s.hasFullyAnimated = false;
            s.peakValue = 0;
          } else if (scrollProgress > 1.3) {
            const fadeOutProgress = (scrollProgress - 1.3) / 0.5;
            s.target = Math.max(0, 1 - fadeOutProgress);
          } else if (
            scrollProgress > fullConfig.animationStart &&
            scrollProgress < fullConfig.animationEnd
          ) {
            s.target = clampedProgress;
          } else if (s.hasFullyAnimated || s.peakValue > 0.8) {
            s.target = Math.max(0.9, s.peakValue);
          }
        }

        // Track best visible element
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
        const proximityScore = 1 - Math.min(1, distanceFromCenter / viewportHeight);

        if (proximityScore > bestScore && scrollProgress > 0 && scrollProgress < 1) {
          bestScore = proximityScore;
          bestIndex = i;
        }
      });

      return bestIndex;
    }

    function applyStyles(): boolean {
      let needsMoreFrames = false;
      const newValues: ScrollAnimationValues[] = [];

      elementRefs.forEach((ref, i) => {
        const s = stateRef.current[i];

        // Smooth interpolation
        const delta = (s.target - s.current) * fullConfig.smoothFactor;
        s.current += delta;

        if (Math.abs(delta) > 0.0001) {
          needsMoreFrames = true;
        }

        // Apply easing
        const easedProgress = easeInOutSine(s.current);

        // Calculate animation values
        const opacity =
          fullConfig.minOpacity +
          (fullConfig.maxOpacity - fullConfig.minOpacity) * easedProgress;
        const translateX = fullConfig.translateRange * (1 - easedProgress);
        const translateY = fullConfig.translateYRange * (1 - easedProgress);
        const scale =
          fullConfig.scaleMin + (fullConfig.scaleMax - fullConfig.scaleMin) * easedProgress;

        newValues.push({
          opacity,
          translateX,
          translateY,
          scale,
          progress: easedProgress,
        });
      });

      setAnimationValues(newValues);
      return needsMoreFrames;
    }

    function tick() {
      const newActiveIndex = computeTargets();
      const needsMoreFrames = applyStyles();
      setActiveIndex(newActiveIndex);

      if (needsMoreFrames) {
        requestAnimationFrame(tick);
      } else {
        tickingRef.current = false;
      }
    }

    function onScroll() {
      const currentScrollY = window.scrollY;
      scrollDirectionRef.current = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
      lastScrollYRef.current = currentScrollY;

      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(tick);
      }
    }

    function onResize() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(tick);
      }
    }

    // Setup listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Initial render
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [elementRefs, fullConfig]);

  return {
    activeIndex,
    animationValues,
    scrollToIndex: (index: number) => {
      const target = elementRefs[index]?.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        const offset = 120;
        const targetPosition = window.scrollY + rect.top - offset;

        scrollDirectionRef.current = 'down';

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Force animation updates during smooth scroll
        setTimeout(() => {
          if (!tickingRef.current) {
            tickingRef.current = true;
            requestAnimationFrame(() => {});
          }
        }, 100);
      }
    },
  };
}
