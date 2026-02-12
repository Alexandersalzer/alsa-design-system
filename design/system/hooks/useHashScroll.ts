'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles scrolling to hash elements on page load/navigation
 * Waits for content to render before scrolling to prevent layout shift issues
 * 
 * @param delay - Milliseconds to wait before scrolling (default: 600ms)
 */
export function useHashScroll(delay: number = 600) {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const elementId = hash.substring(1);
    if (!elementId) return;

    // Prevent default immediate scroll by browser
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Start at top to prevent flash of wrong position
    window.scrollTo(0, 0);

    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Primary scroll after delay (wait for images/content)
    const timer = setTimeout(scrollToElement, delay);

    // Backup: also try after window load event
    const handleLoad = () => {
      setTimeout(scrollToElement, 100);
    };
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname, delay]);
}
