/**
 * Action system types
 */

export type ActionType = 
  | 'navigation' 
  | 'contact' 
  | 'newsletter' 
  | 'booking'
  | 'form'
  | 'download'
  | 'external-link'
  | 'thirdparty';

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
    navigationType?: 'section' | 'page' | 'external'; // Type of navigation
    href?: string;           // Direct URL (for external, anchor, or fallback)
    pageId?: string;         // Page ID reference - resolves to locale-aware slug
    sectionId?: string;      // Section ID for scrolling to section on same page
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

export interface FormActionConfig extends BaseActionConfig {
  type: 'form';
  settings?: {
    formId?: string; // e.g. 'contact_form' or 'booking_form'
    redirectAfterSubmit?: string;
    clearFormOnSuccess?: boolean; // Default: true
    pixelEvents?: PixelEvent[];
  };
}

export interface BookingActionConfig extends BaseActionConfig {
  type: 'booking';
  settings?: {
    calendlyUrl?: string; // Calendly booking URL (e.g., https://calendly.com/username/30min)
    calUrl?: string; // Cal.com booking URL (e.g., https://cal.com/smpl-growth/60min)
    primaryColor?: string; // Hex color without # (e.g., "b899f8")
    brandColor?: string; // For Cal.com branding
    theme?: 'light' | 'dark' | 'auto'; // For Cal.com theme
    layout?: 'month_view' | 'week_view' | 'column_view'; // For Cal.com layout
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

export interface ThirdPartyActionConfig extends BaseActionConfig {
  type: 'thirdparty';
  settings?: {
    serviceType?: 'calendly' | 'cal' | 'typeform' | 'custom';
    url?: string;
    openInNewTab?: boolean;
    primaryColor?: string;
    redirectAfterSubmit?: string; // Redirect user after third-party action
    pixelEvents?: PixelEvent[];
  };
}

// ===== FORM PAYLOAD (for type: 'form' action) =====
export interface FormStepPayload {
  id: string;
  fields: Record<string, any>;
}

export interface FormSubmissionPayload {
  formId: string;
  submittedAt: number;
  steps: FormStepPayload[];
  meta?: Record<string, any>;
}

// ===== UNION TYPE =====
export type ActionConfig = 
  | NavigationActionConfig 
  | ContactActionConfig 
  | NewsletterActionConfig 
  | BookingActionConfig 
  | FormActionConfig 
  | DownloadActionConfig 
  | ExternalLinkActionConfig 
  | ThirdPartyActionConfig;
