/**
 * Hook för att köra actions med loading state och pixel tracking
 * Integrerar med ConsentProvider för GDPR-compliant pixel tracking
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConsent } from '../../patterns/cookieConsent/ConsentProvider';
import { useHref } from '../../hooks/useHref';
import { executeAction } from './actionHandlers';
import { ActionType, ActionConfig, PixelEvent, NavigationActionConfig } from './types';
import { mapUniversalEvents } from './pixelEventMapping';

export function useAction(config: ActionConfig) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { consent } = useConsent();
  const router = useRouter();
  const { buildHref } = useHref();

  const execute = async (data: Record<string, any>) => {
    // Reset states
    setLoading(true);
    setSuccess(false);
    setError(null);
    setMessage(null);

    // Handle navigation action (client-side only, no API call)
    if (config.type === 'navigation') {
      const navConfig = config as NavigationActionConfig;
      const href = navConfig.settings.href;
      
      if (!href) {
        console.error('[Action] Navigation action missing href');
        setLoading(false);
        setError('Navigation href missing');
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
        
        // Trigger pixel events from settings (if any)
        if (navConfig.settings.pixelEvents && consent.marketing) {
          triggerPixelEvents(navConfig.settings.pixelEvents);
        }
        
        setLoading(false);
        setSuccess(true);
        return { success: true };
      }
      
      // External navigation
      if (navConfig.settings.openInNewTab) {
        window.open(localeAwareHref, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = localeAwareHref;
      }
      
      // Trigger pixel events from settings (if any)
      if (navConfig.settings.pixelEvents && consent.marketing) {
        triggerPixelEvents(navConfig.settings.pixelEvents);
      }
      
      setLoading(false);
      setSuccess(true);
      return { success: true };
    }

    // Handle other actions (contact, newsletter, booking) via API
    try {
      const result = await executeAction(config.type, data);

      if (result.success) {
        // Merge pixel events from settings and backend response
        const allPixelEvents = [
          ...(config.settings?.pixelEvents || []),
          ...(result.pixelEvents || [])
        ];
        
        // Trigger pixel events (endast om marketing consent finns)
        if (allPixelEvents.length > 0 && consent.marketing) {
          triggerPixelEvents(allPixelEvents);
        }

        // Set success state
        setSuccess(true);
        setMessage(result.message);
        setLoading(false);

        // Optional redirect after success
        if (config.settings?.redirectAfterSubmit) {
          const redirectHref = buildHref(config.settings.redirectAfterSubmit);
          setTimeout(() => {
            router.push(redirectHref);
          }, 1500); // Wait 1.5s so user sees success message
        }

        return { success: true, message: result.message };
      } else {
        // Handle error
        setError(result.message);
        setLoading(false);
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Reset function to clear success/error states
  const reset = () => {
    setSuccess(false);
    setError(null);
    setMessage(null);
  };

  return { execute, loading, success, error, message, reset };
}

/**
 * Trigger pixel events (Meta, Google, etc.)
 * Supports both universal events and provider-specific events
 */
function triggerPixelEvents(events: PixelEvent[]) {
  events.forEach(({ provider, event, parameters }) => {
    try {
      // If provider is specified, track for that provider only
      if (provider) {
        trackProviderEvent(provider, event, parameters);
      } else {
        // Universal event - map to all providers
        const mapped = mapUniversalEvents([{ event, parameters }]);
        mapped.forEach(({ provider, event, parameters }) => {
          trackProviderEvent(provider, event, parameters);
        });
      }
    } catch (error) {
      console.error(`[Pixel] Failed to track event ${event}:`, error);
    }
  });
}

/**
 * Track event for a specific provider
 */
function trackProviderEvent(
  provider: 'meta' | 'google' | 'tiktok',
  event: string,
  parameters?: Record<string, any>
) {
  if (provider === 'meta' && typeof window.fbq !== 'undefined') {
    window.fbq('track', event, parameters);
  } else if (provider === 'google' && typeof window.gtag !== 'undefined') {
    window.gtag('event', event, parameters);
  } else if (provider === 'tiktok' && typeof window.ttq !== 'undefined') {
    window.ttq.track(event, parameters);
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
