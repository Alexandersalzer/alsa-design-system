'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles scrolling to hash elements on page load/navigation
 * Waits for page to be stable (no more layout changes) before scrolling
 */
export function useHashScroll() {
  const pathname = usePathname();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    hasScrolledRef.current = false;
    
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.substring(1);
    if (!elementId) return;

    // Prevent browser's default hash scroll behavior
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    let stabilityTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const scrollToElement = () => {
      if (hasScrolledRef.current) return;
      
      const element = document.getElementById(elementId);
      if (element) {
        hasScrolledRef.current = true;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Reset stability timer on any layout change
    const resetStabilityTimer = () => {
      if (hasScrolledRef.current) return;
      
      if (stabilityTimer) {
        clearTimeout(stabilityTimer);
      }
      // Wait 150ms of no changes before scrolling
      stabilityTimer = setTimeout(scrollToElement, 150);
    };

    const startObserving = () => {
      // Observe body for size changes (images loading, content appearing)
      resizeObserver = new ResizeObserver(() => {
        resetStabilityTimer();
      });
      
      // Observe main content areas
      const main = document.querySelector('main') || document.body;
      resizeObserver.observe(main);
      
      // Also observe the target element itself
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        resizeObserver.observe(targetElement);
      }

      // Initial trigger
      resetStabilityTimer();
    };

    // Wait for DOM to be ready
    if (document.readyState === 'complete') {
      startObserving();
    } else {
      window.addEventListener('load', startObserving, { once: true });
    }

    // Fallback: scroll after 2 seconds no matter what
    const fallbackTimer = setTimeout(() => {
      if (!hasScrolledRef.current) {
        scrollToElement();
      }
    }, 2000);

    return () => {
      if (stabilityTimer) clearTimeout(stabilityTimer);
      clearTimeout(fallbackTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('load', startObserving);
    };
  }, [pathname]);
}
