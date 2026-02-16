'use client';

import { useEffect } from 'react';

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
  const calLink = extractCalLink(calUrl);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Cal.com embed script
    const scriptId = 'cal-embed-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Build data attributes for Cal.com auto-initialization
  const dataConfig = JSON.stringify(config);
  const dataStyles = JSON.stringify(styles);

  return (
    <div
      data-cal-link={calLink}
      data-cal-config={dataConfig}
      data-cal-styles={dataStyles}
      style={{
        minWidth,
        height,
        width: '100%',
      }}
    />
  );
};

CalInline.displayName = 'CalInline';
