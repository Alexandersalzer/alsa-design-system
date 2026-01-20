'use client';

import { useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect on client, useEffect on server (to avoid SSR warnings)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * ThemeSync - Client component that syncs system theme preference
 *
 * This component handles theme synchronization in two phases:
 * 1. Immediately on mount (useLayoutEffect) - applies correct theme before paint
 * 2. Removes the 'theme-pending' class to reveal content
 *
 * For "system" mode, it:
 * - Applies the correct theme based on OS preference
 * - Listens for OS theme changes and updates accordingly
 *
 * The 'theme-pending' class on <html> can be used with CSS to hide content
 * until the theme is resolved, preventing flash of wrong theme.
 */
export function ThemeSync() {
  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    const themeMode = html.getAttribute('data-theme-mode');

    function applyTheme() {
      if (themeMode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        html.setAttribute('data-theme', theme);
        html.style.setProperty('--is-dark', prefersDark ? '1' : '0');
      } else if (themeMode === 'dark') {
        html.setAttribute('data-theme', 'dark');
        html.style.setProperty('--is-dark', '1');
      } else {
        // Default to light
        html.setAttribute('data-theme', 'light');
        html.style.setProperty('--is-dark', '0');
      }
    }

    // Apply theme immediately (before browser paint due to useLayoutEffect)
    applyTheme();

    // Remove the pending class to reveal content
    html.classList.remove('theme-pending');

    // For system mode, listen for OS preference changes
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        html.style.setProperty('--is-dark', e.matches ? '1' : '0');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []); // Run once on mount (after hydration)

  // This component renders nothing - it's purely for side effects
  return null;
}

export default ThemeSync;
