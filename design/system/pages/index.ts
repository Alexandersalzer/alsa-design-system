/**
 * System Pages - Pre-built pages for common system states
 * 
 * These pages are designed to be used directly in Next.js apps
 * with minimal configuration in the consuming project.
 */

// Re-export individual pages
export { BlockedPage, blockedMetadata } from './blocked';
export type { BlockedPageProps } from './blocked';

// Re-export dynamic renderer
export { SystemPage } from './SystemPage';

// ===== SYSTEM PAGE REGISTRY =====

/**
 * Registry of all system pages
 * Used by generateStaticParams to auto-generate these pages
 */
export const SYSTEM_PAGES = [
  'blocked',
  // Add more system pages here as needed:
  // 'maintenance',
  // 'error',
] as const;

export type SystemPageSlug = typeof SYSTEM_PAGES[number];

/**
 * Get all system page paths for generateStaticParams
 */
export function getSystemPageParams() {
  return SYSTEM_PAGES.map(page => ({ systemPage: page }));
}

/**
 * Check if a slug is a valid system page
 */
export function isSystemPage(slug: string): slug is SystemPageSlug {
  return SYSTEM_PAGES.includes(slug as SystemPageSlug);
}
