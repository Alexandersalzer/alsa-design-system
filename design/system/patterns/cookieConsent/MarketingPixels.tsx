'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useConsent } from './ConsentProvider';

// ===== TYPES =====

export interface PixelConfig {
  platform: 'meta' | 'tiktok' | 'snapchat' | 'google';
  pixel_id: string;
}

interface MarketingPixelsProps {
  pixels: PixelConfig[];
}

// ===== SECURITY: Whitelist allowed pixel platforms =====

const ALLOWED_PLATFORMS = ['meta', 'tiktok', 'snapchat', 'google'] as const;

const PIXEL_SOURCES = {
  meta: 'https://connect.facebook.net/en_US/fbevents.js',
  tiktok: 'https://analytics.tiktok.com/i18n/pixel/events.js',
  snapchat: 'https://sc-static.net/scevent.min.js',
  google: 'https://www.googletagmanager.com/gtag/js',
} as const;

// ===== SECURITY: Validate pixel_id format =====

function isValidPixelId(platform: string, pixelId: string): boolean {
  // Prevent XSS via malicious pixel IDs
  const alphanumericRegex = /^[a-zA-Z0-9_-]+$/;
  
  if (!alphanumericRegex.test(pixelId)) {
    return false;
  }
  
  // Platform-specific validation
  switch (platform) {
    case 'meta':
      return pixelId.length >= 15 && pixelId.length <= 16; // Meta Pixel IDs are ~15-16 digits
    case 'tiktok':
      return pixelId.length >= 10; // TikTok Pixel IDs
    case 'snapchat':
      return pixelId.length >= 20; // Snapchat Pixel IDs
    case 'google':
      return pixelId.startsWith('G-') || pixelId.startsWith('AW-') || pixelId.startsWith('GT-'); // Google Tag formats
    default:
      return false;
  }
}

// ===== PIXEL LOADING FUNCTIONS =====

function loadMetaPixel(pixelId: string) {
  if ((window as any).fbq) {
    return;
  }
  
  // Initialize fbq queue with proper typing
  const fbq: any = ((window as any).fbq = function(...args: any[]) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  });
  
  if (!(window as any)._fbq) (window as any)._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  
  // Load script
  const script = document.createElement('script');
  script.async = true;
  script.src = PIXEL_SOURCES.meta;
  script.onload = () => {
    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');
  };
  script.onerror = () => {};
  
  document.head.appendChild(script);
}

function loadTikTokPixel(pixelId: string) {
  if ((window as any).ttq) {
    return;
  }
  
  // Set global analytics object name (required by TikTok SDK)
  (window as any).TiktokAnalyticsObject = 'ttq';
  
  // Initialize ttq with full SDK structure
  const ttq: any = ((window as any).ttq = (window as any).ttq || []);
  ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
  ttq.setAndDefer = function(t: any, e: string) {
    t[e] = function() {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  
  ttq.instance = function(e: string) {
    const t = ttq._i[e] || [];
    for (let n = 0; n < ttq.methods.length; n++) {
      ttq.setAndDefer(t, ttq.methods[n]);
    }
    return t;
  };
  
  ttq.load = function(e: string, n?: any) {
    const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = i;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    
    const o = document.createElement('script');
    o.type = 'text/javascript';
    o.async = true;
    o.src = i + '?sdkid=' + e + '&lib=ttq';
    o.onload = () => {};
    o.onerror = () => {};
    
    const a = document.getElementsByTagName('script')[0];
    if (a && a.parentNode) {
      a.parentNode.insertBefore(o, a);
    } else {
      document.head.appendChild(o);
    }
  };
  
  // Initialize pixel and track page view
  ttq.load(pixelId);
  ttq.page();
}

function loadSnapchatPixel(pixelId: string) {
  if ((window as any).snaptr) {
    return;
  }
  
  // Initialize snaptr
  const snaptr: any = ((window as any).snaptr = function(...args: any[]) {
    snaptr.handleRequest ? snaptr.handleRequest.apply(snaptr, args) : snaptr.queue.push(args);
  });
  snaptr.queue = [];
  
  // Load script
  const script = document.createElement('script');
  script.async = true;
  script.src = PIXEL_SOURCES.snapchat;
  script.onload = () => {
    (window as any).snaptr('init', pixelId);
    (window as any).snaptr('track', 'PAGE_VIEW');
  };
  script.onerror = () => {};
  
  document.head.appendChild(script);
}

function loadGoogleTag(tagId: string) {
  if ((window as any).gtag) {
    return;
  }
  
  // Initialize dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  const gtag = ((window as any).gtag = function(...args: any[]) {
    (window as any).dataLayer.push(args);
  });
  gtag('js', new Date());
  
  // Load script
  const script = document.createElement('script');
  script.async = true;
  script.src = `${PIXEL_SOURCES.google}?id=${encodeURIComponent(tagId)}`;
  script.onload = () => {
    (window as any).gtag('config', tagId);
  };
  script.onerror = () => {};
  
  document.head.appendChild(script);
}

// ===== MAIN COMPONENT =====

export function MarketingPixels({ pixels }: MarketingPixelsProps) {
  const { consent, isLoading } = useConsent();
  const loadedPixelsRef = useRef<Set<string>>(new Set());

  const loadPixel = useCallback((pixel: PixelConfig) => {
    const key = `${pixel.platform}-${pixel.pixel_id}`;
    
    // Already loaded?
    if (loadedPixelsRef.current.has(key)) {
      return;
    }
    
    // Validate platform
    if (!ALLOWED_PLATFORMS.includes(pixel.platform)) {
      return;
    }
    
    // Validate pixel_id
    if (!isValidPixelId(pixel.platform, pixel.pixel_id)) {
      return;
    }
    
    // Load pixel
    try {
      switch (pixel.platform) {
        case 'meta':
          loadMetaPixel(pixel.pixel_id);
          break;
        case 'tiktok':
          loadTikTokPixel(pixel.pixel_id);
          break;
        case 'snapchat':
          loadSnapchatPixel(pixel.pixel_id);
          break;
        case 'google':
          loadGoogleTag(pixel.pixel_id);
          break;
      }
      
      loadedPixelsRef.current.add(key);
    } catch (error) {
      // Silently handle errors
    }
  }, []);

  // Per-pixel consent: Google (GA) kräver analytics, övriga (Meta, TikTok, Snap) kräver marketing
  const hasConsentForPixel = useCallback((pixel: PixelConfig) => {
    if (pixel.platform === 'google') return consent.analytics;
    return consent.marketing;
  }, [consent.analytics, consent.marketing]);

  useEffect(() => {
    // 🛡️ Security: Only run in browser
    if (typeof window === 'undefined') return;
    
    // ⏳ Wait for consent to load
    if (isLoading) return;
    
    // 🔒 Security: Validate pixels array
    if (!Array.isArray(pixels) || pixels.length === 0) {
      return;
    }
    
    // GDPR: Load only pixels the user has consented to
    pixels.filter(hasConsentForPixel).forEach(loadPixel);
  }, [consent.analytics, consent.marketing, isLoading, pixels, loadPixel, hasConsentForPixel]);

  return null; // No UI
}
