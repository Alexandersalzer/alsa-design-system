'use client';

// ===== CAL.COM MODAL WIDGET =====
// Opens Cal.com booking interface in a modal overlay

export interface CalModalProps {
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

declare global {
  interface Window {
    Cal?: {
      (namespace: string, options: any): void;
      ns?: Record<string, any>;
    };
  }
}

export const CalModal: React.FC<CalModalProps> = () => {
  // This component only ensures scripts are loaded, doesn't render anything
  return null;
};

CalModal.displayName = 'CalModal';

// Helper function to build Cal.com URL with parameters
export const buildCalUrl = (
  calUrl: string,
  options?: {
    theme?: 'light' | 'dark' | 'auto';
    brandColor?: string;
    layout?: 'month_view' | 'week_view' | 'column_view';
  }
): { calLink: string; config: any; styles: any } => {
  const calLink = extractCalLink(calUrl);
  const config: any = {};
  const styles: any = { branding: {} };

  if (options?.layout) {
    config.layout = options.layout;
  }

  if (options?.theme) {
    config.theme = options.theme;
  }

  if (options?.brandColor) {
    styles.branding.brandColor = `#${options.brandColor}`;
  }

  return {
    calLink,
    config,
    styles,
  };
};

// Helper function to open Cal.com popup programmatically
export const openCalPopup = (
  calUrl: string,
  options?: {
    theme?: 'light' | 'dark' | 'auto';
    brandColor?: string;
    layout?: 'month_view' | 'week_view' | 'column_view';
  }
): void => {
  if (typeof window !== 'undefined') {
    ensureCalScriptsLoaded().then(() => {
      if (window.Cal && window.Cal.ns) {
        const { calLink, config, styles } = buildCalUrl(calUrl, options);
        const namespace = `modal-${Date.now()}`;

        window.Cal(namespace, {
          calLink,
          config,
          styles,
        });

        window.Cal.ns[namespace]('ui', {
          theme: options?.theme || 'auto',
          styles,
          hideEventTypeDetails: false,
          cssVarsPerTheme: styles.branding,
        });
      }
    });
  }
};

// Helper function to ensure Cal.com scripts are loaded
const ensureCalScriptsLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Check if already loaded
    if (window.Cal) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="app.cal.com/embed/embed.js"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.Cal) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

// Helper function to close Cal.com popup
export const closeCalPopup = (): void => {
  if (typeof window !== 'undefined' && window.Cal) {
    // Cal.com doesn't have a built-in close method, but you can use modal close
    const calModals = document.querySelectorAll('[data-cal-namespace]');
    calModals.forEach((modal) => modal.remove());
  }
};
