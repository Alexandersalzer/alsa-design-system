/**
 * SystemPage - Dynamic system page renderer
 * 
 * Renders the correct system page based on the slug and locale.
 * Used by blimpify-core's [locale]/[slug] route.
 */
'use client';

import { BlockedPage } from './blocked';
import { findSystemPage } from './index';

interface SystemPageProps {
  slug: string;
  locale: string;
}

/**
 * Renders the appropriate system page based on slug and locale
 */
export function SystemPage({ slug, locale }: SystemPageProps) {
  const page = findSystemPage(slug, locale);
  
  if (!page) {
    // Fallback to blocked page
    return <BlockedPage locale={locale} />;
  }
  
  switch (page.id) {
    case 'blocked':
      return <BlockedPage locale={locale} />;
    // Add more cases as system pages are added:
    // case 'maintenance':
    //   return <MaintenancePage locale={locale} />;
    default:
      return <BlockedPage locale={locale} />;
  }
}

export default SystemPage;
