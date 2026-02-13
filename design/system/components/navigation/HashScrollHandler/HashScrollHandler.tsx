'use client';

import { useHashScroll } from '../../../hooks/useHashScroll';

interface HashScrollHandlerProps {
  /** Delay in ms before scrolling (default: 600) */
  delay?: number;
}

/**
 * Client component that handles hash scroll navigation with delay
 * Add this to your layout to enable delayed hash scrolling
 */
export function HashScrollHandler({ delay = 600 }: HashScrollHandlerProps) {
  useHashScroll(delay);
  return null;
}
