'use client';

import { useEffect, useRef, useId } from 'react';

// ===== CAL.COM INLINE WIDGET =====
// Embeds Cal.com booking interface directly on the page

export interface CalInlineProps {
  calUrl: string; // Full Cal.com URL (e.g., "https://cal.com/smpl-growth/60min")
  config?: {
    layout?: 'month_view' | 'week_view' | 'column_view';
    theme?: 'light' | 'dark' | 'auto';
  };
  styles?: {
    branding?: {
      brandColor?: string;
      lightColor?: string;
      lighterColor?: string;
      lightestColor?: string;
      highlightColor?: string;
      medianColor?: string;
    };
  };
  hideEventTypeDetails?: boolean;
  height?: string;
  minWidth?: string;
}

// Helper function to extract calLink from full URL
const extractCalLink = (calUrl: string): string => {
  // If it's already just a link (no https://), return as is
  if (!calUrl.includes('://')) {
    return calUrl;
  }
  
  // Extract username/event from URL
  // https://cal.com/smpl-growth/60min -> smpl-growth/60min
  try {
    const url = new URL(calUrl);
    return url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
  } catch {
    return calUrl;
  }
}

export const CalInline: React.FC<CalInlineProps> = ({
  calUrl,
  config = {},
  styles = {},
  height = '700px',
  minWidth = '320px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calLink = extractCalLink(calUrl);
  // Use React's useId for SSR-safe stable IDs
  const reactId = useId();
  const elementId = `cal-inline-${reactId.replace(/:/g, '-')}`;
  const namespace = `ns-${reactId.replace(/:/g, '-')}`;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || isInitialized.current) return;

    const loadAndInitCal = () => {
      // Initialize Cal object if it doesn't exist (using Cal.com's embed snippet pattern)
      if (!(window as any).Cal) {
        (function (C: any, A: string, L: string) {
          const p = function (a: any, ar: any) {
            a.q.push(ar);
          };
          const d = C.document;
          C.Cal =
            C.Cal ||
            function () {
              const cal = C.Cal;
              const ar = arguments;
              if (!cal.loaded) {
                p(cal, ar);
              } else {
                cal(...ar);
              }
            };
          C.Cal.ns = {};
          C.Cal.q = C.Cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
        })(window, "https://app.cal.com/embed/embed.js", "init");
      }

      // Now Cal exists (either queuing or loaded), we can call it
      const Cal = (window as any).Cal;
      
      // Initialize Cal with unique namespace
      Cal('init', namespace, {
        origin: 'https://app.cal.com',
      });

      // Create inline embed using namespace
      Cal.ns[namespace]('inline', {
        elementOrSelector: `#${elementId}`,
        calLink,
        config: {
          ...config,
          branding: styles.branding,
        },
      });

      isInitialized.current = true;
    };

    loadAndInitCal();

    // Cleanup function
    return () => {
      if ((window as any).Cal?.ns?.[namespace]) {
        // Remove the inline element
        const container = document.getElementById(elementId);
        if (container) {
          const calInlineElement = container.querySelector('cal-inline');
          if (calInlineElement) {
            calInlineElement.remove();
          }
        }
        // Clean up namespace
        delete (window as any).Cal.ns[namespace];
      }
      isInitialized.current = false;
    };
  }, [calLink, config, styles, elementId, namespace]);

  return (
    <div
      id={elementId}
      ref={containerRef}
      style={{
        minWidth,
        height,
        width: '100%',
      }}
    />
  );
};

CalInline.displayName = 'CalInline';
