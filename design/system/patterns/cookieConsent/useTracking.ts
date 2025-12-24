'use client';

import { useCallback } from 'react';
import { useConsent } from './ConsentProvider';

type Platform = 'meta' | 'tiktok' | 'snapchat' | 'google';

type StandardEvent = 
  | 'Lead'
  | 'Contact'
  | 'Purchase'
  | 'AddToCart'
  | 'ViewContent'
  | 'CompleteRegistration'
  | 'Subscribe';

interface TrackEventOptions {
  platforms?: Platform[];
  data?: Record<string, any>;
}

// 🛡️ Security: Sanitize event data
function sanitizeEventData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Only allow safe types
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value;
    } else if (value === null || value === undefined) {
      // Skip null/undefined
      continue;
    } else {
      console.warn(`[useTracking] Skipped unsafe value type for key "${key}":`, typeof value);
    }
  }
  
  return sanitized;
}

export function useTracking() {
  const { consent, isLoading } = useConsent();

  const trackEvent = useCallback((event: StandardEvent, options: TrackEventOptions = {}) => {
    // 🛡️ GDPR: Don't track if no marketing consent
    if (!consent.marketing) {
      console.debug(`[useTracking] Skipped "${event}" - no marketing consent`);
      return;
    }
    
    // ⏳ Don't track while consent is loading
    if (isLoading) {
      console.debug(`[useTracking] Skipped "${event}" - consent still loading`);
      return;
    }
    
    const { platforms, data = {} } = options;
    const sanitizedData = sanitizeEventData(data);

    // Meta Pixel
    if ((!platforms || platforms.includes('meta')) && typeof (window as any).fbq === 'function') {
      try {
        (window as any).fbq('track', event, sanitizedData);
        console.debug(`[useTracking] Meta: ${event}`, sanitizedData);
      } catch (error) {
        console.error('[useTracking] Meta Pixel error:', error);
      }
    }

    // TikTok Pixel
    if ((!platforms || platforms.includes('tiktok')) && typeof (window as any).ttq !== 'undefined') {
      const tiktokEventMap: Record<string, string> = {
        'Lead': 'SubmitForm',
        'Contact': 'Contact',
        'Purchase': 'CompletePayment',
        'AddToCart': 'AddToCart',
        'ViewContent': 'ViewContent',
        'CompleteRegistration': 'CompleteRegistration',
        'Subscribe': 'Subscribe',
      };
      
      try {
        const tiktokEvent = tiktokEventMap[event] || event;
        (window as any).ttq.track(tiktokEvent, sanitizedData);
        console.debug(`[useTracking] TikTok: ${tiktokEvent}`, sanitizedData);
      } catch (error) {
        console.error('[useTracking] TikTok Pixel error:', error);
      }
    }

    // Snapchat Pixel
    if ((!platforms || platforms.includes('snapchat')) && typeof (window as any).snaptr === 'function') {
      const snapEventMap: Record<string, string> = {
        'Lead': 'SIGN_UP',
        'Contact': 'SIGN_UP',
        'Purchase': 'PURCHASE',
        'AddToCart': 'ADD_CART',
        'ViewContent': 'VIEW_CONTENT',
      };
      
      try {
        const snapEvent = snapEventMap[event] || event;
        (window as any).snaptr('track', snapEvent, sanitizedData);
        console.debug(`[useTracking] Snapchat: ${snapEvent}`, sanitizedData);
      } catch (error) {
        console.error('[useTracking] Snapchat Pixel error:', error);
      }
    }

    // Google Ads
    if ((!platforms || platforms.includes('google')) && typeof (window as any).gtag === 'function') {
      try {
        (window as any).gtag('event', event.toLowerCase(), sanitizedData);
        console.debug(`[useTracking] Google: ${event}`, sanitizedData);
      } catch (error) {
        console.error('[useTracking] Google Tag error:', error);
      }
    }
  }, [consent.marketing, isLoading]);

  return { trackEvent };
}
