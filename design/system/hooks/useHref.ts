'use client';

import { usePathname } from 'next/navigation';

export function useHref() {
  const pathname = usePathname();

  /**
   * Bygger en locale-medveten href från en given href
   * 
   * @param href - Original href som kan vara relativ eller absolut
   * @returns Href med locale tillagd om det behövs
   */
  const buildHref = (href: string): string => {
    if (!href || 
        href.startsWith('http') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('#')) {
      return href;
    }

    // Extrahera aktuell locale från pathname
    const currentLocale = pathname.split('/')[1];

    // Lägger till locale för relativa länkar
    if (href.startsWith('/')) {
      return `/${currentLocale}${href}`;
    }

    // För andra typer av länkar, returnera som de är
    return href;
  };

  return { 
    buildHref
  };
}
