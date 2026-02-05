'use client';

import { useEffect, useRef } from 'react';

// ===== CALENDLY INLINE WIDGET =====
// Embeds Calendly booking interface directly on the page

export interface CalendlyInlineProps {
  calendlyUrl: string; // Full Calendly URL (e.g., https://calendly.com/kjmarketingsweden/30min)
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
  primaryColor?: string; // Hex color without # (e.g., "b899f8")
  hideEventTypeDetails?: boolean;
  hideGdprBanner?: boolean;
  height?: string; // e.g., "700px"
  minWidth?: string; // e.g., "320px"
}

// Helper function to build Calendly URL with parameters
const buildCalendlyUrl = (
  baseUrl: string,
  options?: {
    primaryColor?: string;
    hideEventTypeDetails?: boolean;
    hideGdprBanner?: boolean;
    prefill?: Record<string, string>;
    utm?: Record<string, string>;
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

  // Add prefill data
  if (options?.prefill) {
    Object.entries(options.prefill).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  // Add UTM parameters
  if (options?.utm) {
    Object.entries(options.utm).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
};

export const CalendlyInline: React.FC<CalendlyInlineProps> = ({
  calendlyUrl,
  prefill,
  utm,
  primaryColor,
  hideEventTypeDetails = true,
  hideGdprBanner = true,
  height = '700px',
  minWidth = '320px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || initializedRef.current) return;

    const fullUrl = buildCalendlyUrl(calendlyUrl, {
      primaryColor,
      hideEventTypeDetails,
      hideGdprBanner,
      prefill: prefill as Record<string, string>,
      utm: utm as Record<string, string>,
    });

    // Check if Calendly script already exists
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');

    const initWidget = () => {
      if (window.Calendly && containerRef.current && !initializedRef.current) {
        initializedRef.current = true;
        window.Calendly.initInlineWidget({
          url: fullUrl,
          parentElement: containerRef.current,
        });
      }
    };

    if (existingScript) {
      // Script already exists, check if Calendly is loaded
      if (window.Calendly) {
        initWidget();
      } else {
        // Wait for script to load
        const checkLoaded = setInterval(() => {
          if (window.Calendly) {
            clearInterval(checkLoaded);
            initWidget();
          }
        }, 100);
      }
      return;
    }

    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);

    // Load Calendly CSS
    const existingLink = document.querySelector('link[href*="calendly.com/assets/external/widget.css"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [calendlyUrl, primaryColor, hideEventTypeDetails, hideGdprBanner, prefill, utm]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
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
