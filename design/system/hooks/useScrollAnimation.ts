// ===============================================
// useScrollAnimation Hook
// Scroll-driven animation hook with RAF for smooth 60fps
// ===============================================

import { useState, useEffect, useLayoutEffect, useRef, RefObject } from 'react';

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
  const configRef = useRef(fullConfig);
  configRef.current = fullConfig;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
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

  useLayoutEffect(() => {
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

        const cfg = configRef.current;
        // Smooth animation range based on element's journey through viewport
        const animationProgress =
          (scrollProgress - cfg.animationStart) /
          (cfg.animationEnd - cfg.animationStart);

        // Clamp between 0 and 1
        const clampedProgress = Math.max(0, Math.min(1, animationProgress));

        const s = stateRef.current[i];

        if (scrollDirectionRef.current === 'down') {
          // Scrolling down
          if (scrollProgress > cfg.animationStart) {
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
          // Scrolling up – target följer alltid scroll (smooth reverse, ingen hack)
          if (scrollProgress < -0.3) {
            s.target = 0;
            s.hasFullyAnimated = false;
            s.peakValue = 0;
          } else if (scrollProgress > 1.3) {
            const fadeOutProgress = (scrollProgress - 1.3) / 0.5;
            s.target = Math.max(0, 1 - fadeOutProgress);
            if (s.target < 1) s.hasFullyAnimated = false;
          } else {
            s.target = clampedProgress;
            if (clampedProgress < 1) s.hasFullyAnimated = false;
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

    function applyStyles(writeToDOM: boolean): { needsMoreFrames: boolean; newValues: ScrollAnimationValues[] } {
      let needsMoreFrames = false;
      const newValues: ScrollAnimationValues[] = [];
      const cfg = configRef.current;

      elementRefs.forEach((ref, i) => {
        const s = stateRef.current[i];

        const delta = (s.target - s.current) * cfg.smoothFactor;
        s.current += delta;

        if (Math.abs(delta) > 0.0001) {
          needsMoreFrames = true;
        }

        const easedProgress = easeInOutSine(s.current);
        const opacity =
          cfg.minOpacity +
          (cfg.maxOpacity - cfg.minOpacity) * easedProgress;
        const translateX = cfg.translateRange * (1 - easedProgress);
        const translateY = cfg.translateYRange * (1 - easedProgress);
        const scale =
          cfg.scaleMin + (cfg.scaleMax - cfg.scaleMin) * easedProgress;

        newValues.push({
          opacity,
          translateX,
          translateY,
          scale,
          progress: easedProgress,
        });

        if (writeToDOM && ref.current) {
          const el = ref.current as HTMLElement;
          el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
          el.style.opacity = String(opacity);
        }
      });

      return { needsMoreFrames, newValues };
    }

    function tick() {
      const newActiveIndex = computeTargets();
      const { needsMoreFrames } = applyStyles(true);

      if (newActiveIndex !== activeIndexRef.current) {
        activeIndexRef.current = newActiveIndex;
        setActiveIndex(newActiveIndex);
      }

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

    // Synka till nuvarande scroll innan första paint – undvik att allt "flyger" vid refresh
    function syncToScrollPosition() {
      lastScrollYRef.current = window.scrollY;
      scrollDirectionRef.current = 'down';
      const newActiveIndex = computeTargets();
      stateRef.current.forEach((s) => {
        s.current = s.target;
      });
      const { newValues } = applyStyles(true);
      setAnimationValues(newValues);
      activeIndexRef.current = newActiveIndex;
      setActiveIndex(newActiveIndex);
    }

    syncToScrollPosition();

    // Setup listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [elementRefs]);

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
