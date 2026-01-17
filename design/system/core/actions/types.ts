/**
 * Action system types
 */

export type ActionType = 
  | 'navigation' 
  | 'contact' 
  | 'newsletter' 
  | 'booking'
  | 'download'
  | 'external-link';

export interface PixelEvent {
  provider?: 'meta' | 'google' | 'tiktok'; // Optional för universal events
  event: string; // Universal event name (e.g., 'lead') eller provider-specific
  parameters?: Record<string, any>;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: string[];
  pixelEvents?: PixelEvent[];
}

// ===== BASE CONFIG =====
export interface BaseActionConfig {
  type: ActionType;
  settings?: Record<string, any>;
}

// ===== SPECIFIC ACTION CONFIGS =====
export interface NavigationActionConfig extends BaseActionConfig {
  type: 'navigation';
  settings: {
    href: string;
    openInNewTab?: boolean;
    scrollToTop?: boolean;
    pixelEvents?: PixelEvent[];
  };
}

export interface ContactActionConfig extends BaseActionConfig {
  type: 'contact';
  settings?: {
    redirectAfterSubmit?: string; // e.g., '/thank-you'
    clearFormOnSuccess?: boolean; // Default: true
    pixelEvents?: PixelEvent[];
  };
}

export interface NewsletterActionConfig extends BaseActionConfig {
  type: 'newsletter';
  settings?: {
    listId?: string;
    doubleOptIn?: boolean;
    tags?: string[];
    redirectAfterSubmit?: string;
    pixelEvents?: PixelEvent[];
  };
}

export interface BookingActionConfig extends BaseActionConfig {
  type: 'booking';
  settings?: {
    calendlyUrl?: string; // Calendly booking URL (e.g., https://calendly.com/username/30min)
    primaryColor?: string; // Hex color without # (e.g., "b899f8")
    hideEventTypeDetails?: boolean;
    hideGdprBanner?: boolean;
    serviceId?: string;
    duration?: number;
    redirectToCalendar?: boolean;
    redirectAfterSubmit?: string;
    pixelEvents?: PixelEvent[];
  };
}

export interface DownloadActionConfig extends BaseActionConfig {
  type: 'download';
  settings: {
    fileUrl: string;
    trackConversion?: boolean;
    redirectAfterSubmit?: string;
    pixelEvents?: PixelEvent[];
  };
}

export interface ExternalLinkActionConfig extends BaseActionConfig {
  type: 'external-link';
  settings: {
    url: string;
    trackClick?: boolean;
    redirectAfterSubmit?: string;
    pixelEvents?: PixelEvent[];
  };
}

// ===== UNION TYPE =====
export type ActionConfig = 
  | NavigationActionConfig 
  | ContactActionConfig 
  | NewsletterActionConfig
  | BookingActionConfig
  | DownloadActionConfig
  | ExternalLinkActionConfig;
