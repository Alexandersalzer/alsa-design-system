'use client';

import { useEffect, useRef } from 'react';

// ===== CALENDLY MODAL WIDGET =====
// Opens Calendly booking interface in a modal overlay

export interface CalendlyModalProps {
  url: string; // Full Calendly URL (e.g., https://calendly.com/kjmarketingsweden/30min)
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
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      closePopupWidget: () => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({
  url,
  prefill,
  utm,
  primaryColor,
  hideEventTypeDetails = true,
  hideGdprBanner = true,
}) => {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');

    if (existingScript) {
      return;
    }

    // Load Calendly widget script
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
      };

      document.head.appendChild(script);

      // Load Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  return null; // This component only loads scripts, doesn't render anything
};

CalendlyModal.displayName = 'CalendlyModal';

// Helper function to build Calendly URL with parameters
export const buildCalendlyUrl = (
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
      url.searchParams.set(`a1`, value); // Calendly uses a1, a2, etc for custom fields
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

// Helper function to open Calendly popup programmatically
export const openCalendlyPopup = (url: string): void => {
  if (typeof window !== 'undefined') {
    // Ensure scripts are loaded before opening popup
    ensureCalendlyScriptsLoaded().then(() => {
      if (window.Calendly) {
        window.Calendly.showPopupWidget(url);
      }
    });
  }
};

// Helper function to ensure Calendly scripts are loaded
const ensureCalendlyScriptsLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Check if already loaded
    if (window.Calendly) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.Calendly) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);

    // Load CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  });
};

// Helper function to close Calendly popup
export const closeCalendlyPopup = (): void => {
  if (typeof window !== 'undefined' && window.Calendly) {
    window.Calendly.closePopupWidget();
  }
};
