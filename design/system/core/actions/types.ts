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
    redirectAfterSubmit?: string;
    clearFormOnSuccess?: boolean;
    pixelEvents?: PixelEvent[];
  };
}

export interface NewsletterActionConfig extends BaseActionConfig {
  type: 'newsletter';
  settings?: {
    listId?: string;
    doubleOptIn?: boolean;
    tags?: string[];
    pixelEvents?: PixelEvent[];
  };
}

export interface BookingActionConfig extends BaseActionConfig {
  type: 'booking';
  settings?: {
    serviceId?: string;
    duration?: number;
    redirectToCalendar?: boolean;
    pixelEvents?: PixelEvent[];
  };
}

export interface DownloadActionConfig extends BaseActionConfig {
  type: 'download';
  settings: {
    fileUrl: string;
    trackConversion?: boolean;
    pixelEvents?: PixelEvent[];
  };
}

export interface ExternalLinkActionConfig extends BaseActionConfig {
  type: 'external-link';
  settings: {
    url: string;
    trackClick?: boolean;
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
