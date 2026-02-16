'use client';

import { useEffect, useRef } from 'react';

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
  const calNamespace = useRef<string>(`cal-${Math.random().toString(36).substring(7)}`);
  const calLink = extractCalLink(calUrl);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Load Cal.com embed script
    const scriptId = 'cal-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize Cal when script loads
    const initCal = () => {
      if (typeof window !== 'undefined' && (window as any).Cal) {
        const Cal = (window as any).Cal;
        const namespace = calNamespace.current;

        Cal(namespace, {
          calLink,
          config,
          styles,
        });

        Cal.ns[namespace]('inline', {
          elementOrSelector: containerRef.current,
          calLink,
          config,
          styles,
        });
      }
    };

    if ((window as any).Cal) {
      initCal();
    } else {
      script.addEventListener('load', initCal);
    }

    return () => {
      // Cleanup if needed
      if ((window as any).Cal?.ns?.[calNamespace.current]) {
        delete (window as any).Cal.ns[calNamespace.current];
      }
    };
  }, [calLink, config, styles]);

  return (
    <div
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
