/**
 * Hook för att köra actions med loading state och pixel tracking
 * Integrerar med ConsentProvider för GDPR-compliant pixel tracking
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConsent } from '../../patterns/cookieConsent/ConsentProvider';
import { useToast } from '../../patterns/toast/ToastProvider';
import { useHref } from '../../hooks/useHref';
import { executeAction } from './actionHandlers';
import { ActionType, ActionConfig, PixelEvent, NavigationActionConfig } from './types';

export function useAction(config: ActionConfig) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { consent } = useConsent();
  const { showToast } = useToast();
  const router = useRouter();
  const { buildHref } = useHref();

  const execute = async (data: Record<string, any>) => {
    // Handle navigation action (client-side only, no API call)
    if (config.type === 'navigation') {
      const navConfig = config as NavigationActionConfig;
      const href = navConfig.settings.href;
      
      if (!href) {
        console.error('[Action] Navigation action missing href');
        return { success: false, error: 'Navigation href missing' };
      }

      const localeAwareHref = buildHref(href);
      
      // Scroll to top if specified
      if (navConfig.settings.scrollToTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Internal navigation (Next.js)
      if (localeAwareHref.startsWith('/') || localeAwareHref.startsWith('#')) {
        if (localeAwareHref.startsWith('#')) {
          // Anchor link
          const element = document.querySelector(localeAwareHref);
          element?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push(localeAwareHref);
        }
        return { success: true };
      }
      
      // External navigation
      if (navConfig.settings.openInNewTab) {
        window.open(localeAwareHref, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = localeAwareHref;
      }
      return { success: true };
    }

    // Handle other actions (contact, newsletter, booking) via API
    setLoading(true);
    setError(null);

    try {
      const result = await executeAction(config.type, data);

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

// TypeScript declarations
declare global {
  interface Window {
    fbq: any;
    gtag: any;
    ttq: any;
  }
}
