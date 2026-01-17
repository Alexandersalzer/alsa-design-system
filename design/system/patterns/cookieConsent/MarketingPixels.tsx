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
    console.error(`[MarketingPixels] Invalid pixel_id format: ${pixelId}`);
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
    console.warn('[MarketingPixels] Meta Pixel already loaded');
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
    console.log('[MarketingPixels] Meta Pixel loaded');
    (window as any).fbq('init', pixelId, {
      autoConfig: false,
      autoLogAppEvents: false
    });
    (window as any).fbq('track', 'PageView');
  };
  script.onerror = () => {
    console.error('[MarketingPixels] Failed to load Meta Pixel');
  };
  
  document.head.appendChild(script);
}

function loadTikTokPixel(pixelId: string) {
  if ((window as any).ttq) {
    console.warn('[MarketingPixels] TikTok Pixel already loaded');
    return;
  }
  
  // Initialize ttq
  const ttq: any = ((window as any).ttq = []);
  ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
  ttq.setAndDefer = function(t: any, e: string) {
    t[e] = function() {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  
  // Load script
  const script = document.createElement('script');
  script.async = true;
  script.src = `${PIXEL_SOURCES.tiktok}?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
  script.onload = () => {
    console.log('[MarketingPixels] TikTok Pixel loaded');
    (window as any).ttq.page();
  };
  script.onerror = () => {
    console.error('[MarketingPixels] Failed to load TikTok Pixel');
  };
  
  document.head.appendChild(script);
}

function loadSnapchatPixel(pixelId: string) {
  if ((window as any).snaptr) {
    console.warn('[MarketingPixels] Snapchat Pixel already loaded');
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
    console.log('[MarketingPixels] Snapchat Pixel loaded');
    (window as any).snaptr('init', pixelId);
    (window as any).snaptr('track', 'PAGE_VIEW');
  };
  script.onerror = () => {
    console.error('[MarketingPixels] Failed to load Snapchat Pixel');
  };
  
  document.head.appendChild(script);
}

function loadGoogleTag(tagId: string) {
  if ((window as any).gtag) {
    console.warn('[MarketingPixels] Google Tag already loaded');
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
    console.log('[MarketingPixels] Google Tag loaded');
    (window as any).gtag('config', tagId);
  };
  script.onerror = () => {
    console.error('[MarketingPixels] Failed to load Google Tag');
  };
  
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
      console.error(`[MarketingPixels] Invalid platform: ${pixel.platform}`);
      return;
    }
    
    // Validate pixel_id
    if (!isValidPixelId(pixel.platform, pixel.pixel_id)) {
      console.error(`[MarketingPixels] Invalid pixel_id for ${pixel.platform}: ${pixel.pixel_id}`);
      return;
    }
    
    // Load pixel
    console.log(`[MarketingPixels] Loading ${pixel.platform} pixel: ${pixel.pixel_id}`);
    
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
      console.error(`[MarketingPixels] Error loading ${pixel.platform} pixel:`, error);
    }
  }, []);

  useEffect(() => {
    // 🛡️ Security: Only run in browser
    if (typeof window === 'undefined') return;
    
    // ⏳ Wait for consent to load
    if (isLoading) return;
    
    // 🛡️ GDPR: Only load if marketing consent granted
    if (!consent.marketing) {
      console.log('[MarketingPixels] Marketing consent not granted, skipping pixel load');
      return;
    }
    
    // 🔒 Security: Validate pixels array
    if (!Array.isArray(pixels) || pixels.length === 0) {
      return;
    }
    
    // Load each pixel
    pixels.forEach(loadPixel);
  }, [consent.marketing, isLoading, pixels, loadPixel]);

  return null; // No UI
}
