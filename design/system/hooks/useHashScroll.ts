'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles scrolling to hash elements on page load/navigation
 * Waits for content to render before scrolling to prevent layout shift issues
 * 
 * @param delay - Milliseconds to wait before scrolling (default: 600ms)
 */
export function useHashScroll(delay: number = 600) {
  const pathname = usePathname();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Reset on pathname change
    hasScrolledRef.current = false;
    
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.substring(1);
    if (!elementId) return;

    // Prevent default immediate scroll by browser
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const scrollToElement = () => {
      // Only scroll once
      if (hasScrolledRef.current) return;
      
      const element = document.getElementById(elementId);
      if (element) {
        hasScrolledRef.current = true;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Single scroll after delay (wait for images/content)
    const timer = setTimeout(scrollToElement, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, delay]);
}
