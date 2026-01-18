'use client';

import { useEffect } from 'react';
import { useConsent } from '../cookieConsent/ConsentProvider';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create session ID cookie (only if analytics consent given)
 * @param hasConsent - Whether user has given analytics consent
 * @returns Session ID or null if no consent
 */
function getOrCreateSessionId(hasConsent: boolean): string | null {
  if (typeof window === 'undefined') return null;
  if (!hasConsent) return null;

  const cookieName = 'blimpify_session_id';
  const cookies = document.cookie.split('; ');
  const existingCookie = cookies.find(c => c.startsWith(`${cookieName}=`));

  if (existingCookie) {
    return existingCookie.split('=')[1];
  }

  // Create new session ID with 365-day expiry
  const sessionId = generateSessionId();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 365);
  
  document.cookie = `${cookieName}=${sessionId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  
  return sessionId;
}

/**
 * AnalyticsTracker - Client Component
 * 
 * Tracks page views with GDPR-compliant cookie-based tracking.
 * 
 * WITHOUT consent:
 * - No tracking ID stored
 * - session_id = null in database
 * - Basic anonymous page view counting only
 * 
 * WITH analytics consent:
 * - Creates 365-day session ID cookie
 * - Tracks unique visitors and returning visitors
 * - Enables detailed analytics metrics
 * 
 * Uses browser's location.hostname for website identification.
 * Geo data is determined by the backend based on request IP.
 * 
 * @example
 * // In your root layout:
 * import { AnalyticsTracker } from '@blimpify-im/ui/analytics';
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AnalyticsTracker />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AnalyticsTracker() {
  const { consent } = useConsent();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const trackPageView = async () => {
      try {
        // Smart API URL detection:
        // 1. NEXT_PUBLIC_API_URL from environment (highest priority)
        // 2. Auto-detect based on NODE_ENV
        const apiUrl = process.env.NEXT_PUBLIC_API_URL 
          || (process.env.NODE_ENV === 'production'
            ? 'https://api.blimpify-im.com'      // Production default
            : 'https://devapi.blimpify-im.com'); // Development default
        
        const host = window.location.hostname;

        if (!host) return;

        // Get session ID only if analytics consent given
        const sessionId = getOrCreateSessionId(consent.analytics);

        await fetch(`${apiUrl}/api/v1/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Origin-Host': host,
          },
          body: JSON.stringify({
            pathname: window.location.pathname,
            referrer: document.referrer || undefined,
            sessionId: sessionId || undefined,
          }),
        });
      } catch (error) {
        // Fail silently - analytics should never break the user experience
      }
    };

    // Track initial page view
    trackPageView();
  }, [consent.analytics]);

  // This component renders nothing
  return null;
}
