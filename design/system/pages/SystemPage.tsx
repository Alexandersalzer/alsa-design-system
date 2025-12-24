/**
 * SystemPage - Dynamic system page renderer
 * 
 * Renders the correct system page based on the slug.
 * Used by blimpify-core's catch-all system route.
 */
'use client';

import { BlockedPage } from './blocked';
import type { SystemPageSlug } from './index';

interface SystemPageProps {
  page: SystemPageSlug;
}

/**
 * Renders the appropriate system page based on slug
 */
export function SystemPage({ page }: SystemPageProps) {
  switch (page) {
    case 'blocked':
      return <BlockedPage />;
    // Add more cases as system pages are added:
    // case 'maintenance':
    //   return <MaintenancePage />;
    default:
      // Fallback to blocked page
      return <BlockedPage />;
  }
}

export default SystemPage;
