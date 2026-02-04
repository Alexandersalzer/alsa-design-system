'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    setPageSlugMap(slugMap);
  }, [slugMap]);

  return <>{children}</>;
}
