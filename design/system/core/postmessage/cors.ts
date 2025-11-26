/**
 * CORS Configuration for PostMessage
 * 
 * Centraliserad CORS hantering för säker postMessage kommunikation
 * @author William
 * @since 2025-11-17
 */

/**
 * Tillåtna origins för postMessage kommunikation
 */
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://dashboard.blimpify.com',
  'https://im-dashboard.blimpify.com'
];

/**
 * Kontrollera om origin är tillåten
 */
export function isOriginAllowed(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin);
}