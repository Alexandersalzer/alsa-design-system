/**
 * System Pages - Pre-built pages for common system states
 * 
 * These pages are designed to be used directly in Next.js apps
 * with minimal configuration in the consuming project.
 */

// Re-export individual pages
export { BlockedPage } from './blocked';
export type { BlockedPageProps } from './blocked';

// Re-export dynamic renderer
export { SystemPage } from './SystemPage';

// Import content for registry
import { blockedSvContent, blockedEnContent } from './blocked';

// ===== SYSTEM PAGES REGISTRY =====

export interface SystemPageConfig {
  id: string;
  slugs: Record<string, string>;  // locale -> slug mapping
}

export const SYSTEM_PAGES: SystemPageConfig[] = [
  {
    id: 'blocked',
    slugs: {
      sv: blockedSvContent.slug,  // 'blockerad'
      en: blockedEnContent.slug,  // 'blocked'
    },
  },
  // Add more system pages here as needed:
  // {
  //   id: 'maintenance',
  //   slugs: { sv: 'underhall', en: 'maintenance' },
  // },
];

/**
 * Get all system page slugs for a locale
 */
export function getSystemPageSlugs(locale: string): string[] {
  return SYSTEM_PAGES.map(page => page.slugs[locale] || page.slugs['en']);
}

/**
 * Find system page by slug and locale
 */
export function findSystemPage(slug: string, locale: string): SystemPageConfig | null {
  return SYSTEM_PAGES.find(page => 
    page.slugs[locale] === slug || 
    Object.values(page.slugs).includes(slug)
  ) || null;
}

/**
 * Check if a slug is a system page
 */
export function isSystemPage(slug: string, locale: string): boolean {
  return findSystemPage(slug, locale) !== null;
}
