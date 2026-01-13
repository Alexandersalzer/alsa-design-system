import { headers } from 'next/headers';

interface AnalyticsData {
  countryCode?: string;
  countryName?: string;
  region?: string;
  city?: string;
  host: string;
}

async function trackPageView(data: AnalyticsData): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devapi.blimpify-im.com';
    
    const response = await fetch(`${apiUrl}/api/v1/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Origin-Host': data.host,
      },
      body: JSON.stringify({
        countryCode: data.countryCode,
        countryName: data.countryName,
        region: data.region,
        city: data.city,
      }),
    });

    if (!response.ok) {
      console.warn('[Analytics] Failed to track page view:', response.statusText);
    }
  } catch (error) {
    // Fail silently - analytics should never break the user experience
    console.warn('[Analytics] Error tracking page view:', error);
  }
}

/**
 * AnalyticsTracker - Server Component
 * 
 * Reads CloudFront geo headers and sends analytics data to backend.
 * Should be placed in the root layout to track all page views.
 * 
 * CloudFront headers used:
 * - CloudFront-Viewer-Country (e.g., "SE")
 * - CloudFront-Viewer-Country-Name (e.g., "Sweden")
 * - CloudFront-Viewer-Country-Region (e.g., "AB")
 * - CloudFront-Viewer-Country-Region-Name (e.g., "Stockholm County")
 * - CloudFront-Viewer-City (e.g., "Stockholm")
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
export async function AnalyticsTracker() {
  // Get headers from Next.js
  const headersList = await headers();
  
  // Read CloudFront geo headers
  const countryCode = headersList.get('cloudfront-viewer-country') || undefined;
  const countryName = headersList.get('cloudfront-viewer-country-name') || undefined;
  const region = headersList.get('cloudfront-viewer-country-region-name') || undefined;
  const city = headersList.get('cloudfront-viewer-city') || undefined;
  const host = headersList.get('host') || '';

  // Only track if we have at least host (for website identification)
  if (!host) {
    return null;
  }

  // Track page view (async, non-blocking)
  trackPageView({
    countryCode,
    countryName,
    region,
    city,
    host,
  }).catch(() => {
    // Fail silently
  });

  // This component renders nothing
  return null;
}
