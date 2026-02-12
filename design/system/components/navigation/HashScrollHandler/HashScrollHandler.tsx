'use client';

import { useHashScroll } from '../../../hooks/useHashScroll';

/**
 * Client component that handles hash scroll navigation
 * Waits for page stability before scrolling to hash target
 */
export function HashScrollHandler() {
  useHashScroll();
  return null;
}
