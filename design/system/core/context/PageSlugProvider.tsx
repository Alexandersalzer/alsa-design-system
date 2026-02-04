'use client';

import { useRef } from 'react';
import { setPageSlugMap } from '../../hooks/useHref';

type PageSlugMap = Record<string, Record<string, string>>;

interface PageSlugProviderProps {
  children: React.ReactNode;
  slugMap: PageSlugMap;
}

/**
 * Provider component that injects the page slug map for client-side navigation
 * The slugMap is built server-side and passed to this provider
 * 
 * Uses synchronous initialization to ensure the map is available
 * before any child components render (important for SSG/hydration)
 * 
 * Usage in layout:
 * ```tsx
 * import { getPageSlugMap } from '@blimpify-im/ui/routing';
 * import { PageSlugProvider } from '@blimpify-im/ui/context';
 * 
 * export default async function Layout({ children }) {
 *   const slugMap = await getPageSlugMap();
 *   return (
 *     <PageSlugProvider slugMap={slugMap}>
 *       {children}
 *     </PageSlugProvider>
 *   );
 * }
 * ```
 */
export function PageSlugProvider({ children, slugMap }: PageSlugProviderProps) {
  // Use ref to track if we've initialized to avoid double-setting
  const initialized = useRef(false);
  
  // Set synchronously on first render (not in useEffect)
  // This ensures the map is available before children render
  if (!initialized.current) {
    setPageSlugMap(slugMap);
    initialized.current = true;
  }

  return <>{children}</>;
}
