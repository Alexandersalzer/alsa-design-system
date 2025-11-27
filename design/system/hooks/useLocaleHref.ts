'use client';

import { usePathname } from 'next/navigation';

/**
 * Hook för att automatiskt hantera locale i href:s
 * Lägger automatiskt till aktuell locale till relativa länkar
 * 
 * @example
 * const { buildHref } = useLocaleHref();
 * const localeHref = buildHref('/portfolio'); // blir '/sv/portfolio' om locale är 'sv'
 */
export function useLocaleHref() {
  const pathname = usePathname();

  /**
   * Bygger en locale-medveten href från en given href
   * 
   * @param href - Original href som kan vara relativ eller absolut
   * @returns Href med locale tillagd om det behövs
   */
  const buildHref = (href: string): string => {
    // Returnera som den är om:
    // - href är tom/undefined
    // - href är extern (börjar med http/https)
    // - href redan innehåller locale (/sv/ eller /en/)
    // - href är en anchor link (#section)
    // - href är en mailto/tel länk
    if (!href || 
        href.startsWith('http') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.includes('/sv/') || 
        href.includes('/en/')) {
      return href;
    }

    // För relativa länkar som börjar med /, lägg till locale
    if (href.startsWith('/')) {
      return `/${'start'}${href}`;
    }

    // För andra typer av länkar, returnera som de är
    return href;
  };

  return { 
    buildHref
  };
}
