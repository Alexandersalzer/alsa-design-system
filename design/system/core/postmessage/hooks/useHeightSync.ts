/**
 * Height Sync Hook
 * 
 * Hook för att synka höjd efter CSS-ändringar
 * @author William
 * @since 2025-11-25
 */

'use client';

import { useEffect, useCallback } from 'react';
import { ClientToParentMessage } from '../types';

/**
 * Hook som skickar höjduppdateringar till parent efter CSS-ändringar
 * Används av andra hooks när de gör ändringar som påverkar layouten
 */
export function useHeightSync(): (delay?: number) => void {
  const sendHeight = useCallback((delay: number = 100) => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    setTimeout(() => {
      const height = document.documentElement.scrollHeight;
      
      window.parent.postMessage({
        type: ClientToParentMessage.RequestedIframeHeight,
        payload: { height }
      }, '*');
      
      console.log(`[HeightSync] Height sent: ${height}px`);
    }, delay);
  }, []);

  return sendHeight;
}