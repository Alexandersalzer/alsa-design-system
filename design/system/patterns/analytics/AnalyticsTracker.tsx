'use client';

import { useEffect } from 'react';

/**
 * AnalyticsTracker - Client Component
 * 
 * Tracks page views by sending analytics data to backend.
 * Uses browser's location.hostname for website identification.
 * 
 * Note: Since this is a client component for static export compatibility,
 * geo data will be determined by the backend based on the request IP.
 * This is less accurate than CloudFront headers but works with static hosting.
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
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const trackPageView = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devapi.blimpify-im.com';
        const host = window.location.hostname;

        if (!host) return;

        await fetch(`${apiUrl}/api/v1/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Origin-Host': host,
          },
          body: JSON.stringify({
            pathname: window.location.pathname,
            referrer: document.referrer || undefined,
          }),
        });
      } catch (error) {
        // Fail silently - analytics should never break the user experience
      }
    };

    // Track initial page view
    trackPageView();
  }, []);

  // This component renders nothing
  return null;
}
