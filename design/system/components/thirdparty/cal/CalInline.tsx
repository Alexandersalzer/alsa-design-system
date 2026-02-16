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

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const loadAndInitCal = () => {
      // Check if Cal is already loaded
      if ((window as any).Cal) {
        initializeCalInline();
        return;
      }

      // Load Cal.com embed script
      const scriptId = 'cal-embed-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://app.cal.com/embed/embed.js';
        script.async = true;
        
        script.onload = () => {
          initializeCalInline();
        };

        document.head.appendChild(script);
      } else if ((window as any).Cal) {
        // Script exists and Cal is loaded
        initializeCalInline();
      } else {
        // Script exists but Cal not loaded yet, wait for it
        script.addEventListener('load', initializeCalInline);
      }
    };

    const initializeCalInline = () => {
      if (!(window as any).Cal || !containerRef.current) return;

      const Cal = (window as any).Cal;

      // Initialize Cal if not already initialized
      if (!Cal.loaded) {
        Cal('init', {
          origin: 'https://app.cal.com',
        });
      }

      // Create inline embed
      Cal('inline', {
        elementOrSelector: `#${elementId}`,
        calLink,
        config: {
          ...config,
          branding: styles.branding,
        },
      });
    };

    loadAndInitCal();
  }, [calLink, config, styles, elementId]);

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
