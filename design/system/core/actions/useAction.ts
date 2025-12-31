/**
 * Hook för att köra actions med loading state och pixel tracking
 * Integrerar med ConsentProvider för GDPR-compliant pixel tracking
 */

import { useState } from 'react';
import { useConsent } from '../../patterns/cookieConsent/ConsentProvider';
import { useHost } from '../../patterns/host/HostProvider';
import { executeAction } from './actionHandlers';
import { ActionType, ActionConfig, PixelEvent } from './types';

export function useAction(config: ActionConfig) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { consent } = useConsent();
  const { host } = useHost();

  const execute = async (data: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeAction(config.type, data, host);

      if (result.success) {
        // Trigger pixel events (endast om marketing consent finns)
        if (result.pixelEvents && consent.marketing) {
          triggerPixelEvents(result.pixelEvents);
        } else if (result.pixelEvents && !consent.marketing) {
          console.log('[Action] Pixel events skipped - no marketing consent');
        }

        // Show success message
        showToast(result.message, 'success');

        return { success: true, message: result.message };
      } else {
        // Handle error
        setError(result.message);
        showToast(result.message, 'error');

        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}

/**
 * Trigger pixel events (Meta, Google, etc.)
 */
function triggerPixelEvents(events: PixelEvent[]) {
  events.forEach(({ provider, event }) => {
    try {
      if (provider === 'meta' && typeof window.fbq !== 'undefined') {
        window.fbq('track', event);
        console.log(`[Pixel] Meta: ${event}`);
      } else if (provider === 'google' && typeof window.gtag !== 'undefined') {
        window.gtag('event', event);
        console.log(`[Pixel] Google: ${event}`);
      } else if (provider === 'tiktok' && typeof window.ttq !== 'undefined') {
        window.ttq.track(event);
        console.log(`[Pixel] TikTok: ${event}`);
      }
    } catch (error) {
      console.error(`[Pixel] Failed to track ${provider} ${event}:`, error);
    }
  });
}

/**
 * Show toast notification
 * TODO: Replace with your actual toast component
 */
function showToast(message: string, type: 'success' | 'error' = 'success') {
  // Placeholder - implement with your toast library
  console.log(`[Toast] ${type}:`, message);
  
  // Example with native alert (replace this)
  if (type === 'success') {
    alert(`✓ ${message}`);
  } else {
    alert(`✗ ${message}`);
  }
}

// TypeScript declarations
declare global {
  interface Window {
    fbq: any;
    gtag: any;
    ttq: any;
  }
}
