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
  provider: 'meta' | 'google' | 'tiktok';
  event: string;
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
  };
}

export interface ContactActionConfig extends BaseActionConfig {
  type: 'contact';
  settings?: {
    redirectAfterSubmit?: string;
    clearFormOnSuccess?: boolean;
  };
}

export interface NewsletterActionConfig extends BaseActionConfig {
  type: 'newsletter';
  settings?: {
    listId?: string;
    doubleOptIn?: boolean;
    tags?: string[];
  };
}

export interface BookingActionConfig extends BaseActionConfig {
  type: 'booking';
  settings?: {
    serviceId?: string;
    duration?: number;
    redirectToCalendar?: boolean;
  };
}

export interface DownloadActionConfig extends BaseActionConfig {
  type: 'download';
  settings: {
    fileUrl: string;
    trackConversion?: boolean;
  };
}

export interface ExternalLinkActionConfig extends BaseActionConfig {
  type: 'external-link';
  settings: {
    url: string;
    trackClick?: boolean;
    pixelEvent?: string;
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
