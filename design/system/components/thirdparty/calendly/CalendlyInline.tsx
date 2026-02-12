'use client';

import { useEffect, useRef } from 'react';

// ===== CALENDLY INLINE WIDGET =====
// Embeds Calendly booking interface directly on the page

export interface CalendlyInlineProps {
  calendlyUrl: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  primaryColor?: string;
  hideEventTypeDetails?: boolean;
  hideGdprBanner?: boolean;
  height?: string;
  minWidth?: string;
}

// Helper function to build Calendly URL with parameters
const buildCalendlyUrl = (
  baseUrl: string,
  options?: {
    primaryColor?: string;
    hideEventTypeDetails?: boolean;
    hideGdprBanner?: boolean;
  }
): string => {
  const url = new URL(baseUrl);

  if (options?.primaryColor) {
    url.searchParams.set('primary_color', options.primaryColor);
  }

  if (options?.hideEventTypeDetails) {
    url.searchParams.set('hide_event_type_details', '1');
  }

  if (options?.hideGdprBanner) {
    url.searchParams.set('hide_gdpr_banner', '1');
  }

  return url.toString();
};

export const CalendlyInline: React.FC<CalendlyInlineProps> = ({
  calendlyUrl,
  primaryColor,
  hideEventTypeDetails = true,
  hideGdprBanner = true,
  height = '700px',
  minWidth = '320px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const fullUrl = buildCalendlyUrl(calendlyUrl, {
    primaryColor,
    hideEventTypeDetails,
    hideGdprBanner,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Calendly CSS
    const existingLink = document.querySelector('link[href*="calendly.com/assets/external/widget.css"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load Calendly script - it auto-initializes widgets with data-url
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
      data-url={fullUrl}
      style={{
        minWidth,
        height,
        width: '100%',
      }}
    />
  );
};

CalendlyInline.displayName = 'CalendlyInline';

export default CalendlyInline;