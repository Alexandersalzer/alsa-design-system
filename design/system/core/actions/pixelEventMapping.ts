/**
 * Universal pixel event mapping
 * Maps universal event names to provider-specific events
 */

export interface UniversalPixelEvent {
  event: string; // Universal event name (e.g., 'lead', 'purchase')
  parameters?: Record<string, any>;
}

export interface ProviderPixelEvent {
  provider: 'meta' | 'google' | 'tiktok';
  event: string;
  parameters?: Record<string, any>;
}

/**
 * Event mapping: Universal → Provider-specific
 */
export const EVENT_MAP: Record<string, { meta: string; google: string; tiktok: string }> = {
  // Lead generation
  'lead': {
    meta: 'Lead',
    google: 'generate_lead',
    tiktok: 'SubmitForm'
  },
  
  // E-commerce
  'purchase': {
    meta: 'Purchase',
    google: 'purchase',
    tiktok: 'CompletePayment'
  },
  'add_to_cart': {
    meta: 'AddToCart',
    google: 'add_to_cart',
    tiktok: 'AddToCart'
  },
  'begin_checkout': {
    meta: 'InitiateCheckout',
    google: 'begin_checkout',
    tiktok: 'InitiateCheckout'
  },
  'view_product': {
    meta: 'ViewContent',
    google: 'view_item',
    tiktok: 'ViewContent'
  },
  
  // Engagement
  'subscribe': {
    meta: 'Subscribe',
    google: 'sign_up',
    tiktok: 'Subscribe'
  },
  'download': {
    meta: 'Download',
    google: 'file_download',
    tiktok: 'Download'
  },
  'contact': {
    meta: 'Contact',
    google: 'contact',
    tiktok: 'Contact'
  },
  'search': {
    meta: 'Search',
    google: 'search',
    tiktok: 'Search'
  },
  'click_button': {
    meta: 'ClickButton',
    google: 'click',
    tiktok: 'ClickButton'
  },
  
  // Booking
  'schedule': {
    meta: 'Schedule',
    google: 'begin_checkout',
    tiktok: 'Schedule'
  },
  'book_appointment': {
    meta: 'Schedule',
    google: 'purchase',
    tiktok: 'CompletePayment'
  }
};

/**
 * Convert universal events to provider-specific events
 */
export function mapUniversalEvents(
  universalEvents: UniversalPixelEvent[]
): ProviderPixelEvent[] {
  const providerEvents: ProviderPixelEvent[] = [];

  universalEvents.forEach(({ event, parameters }) => {
    const mapping = EVENT_MAP[event];
    
    if (mapping) {
      // Add event for each provider
      providerEvents.push(
        { provider: 'meta', event: mapping.meta, parameters },
        { provider: 'google', event: mapping.google, parameters },
        { provider: 'tiktok', event: mapping.tiktok, parameters }
      );
    } else {
      // If no mapping exists, use custom event name for all providers
      console.warn(`[Pixel] No mapping found for event: ${event}. Using custom event.`);
      providerEvents.push(
        { provider: 'meta', event, parameters },
        { provider: 'google', event, parameters },
        { provider: 'tiktok', event, parameters }
      );
    }
  });

  return providerEvents;
}
