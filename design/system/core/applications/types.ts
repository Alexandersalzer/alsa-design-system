/**
 * Config Types
 * TypeScript types for config.json structure
 */

export interface PixelConfig {
  platform: 'meta' | 'tiktok' | 'snapchat' | 'google';
  pixel_id: string;
}

export interface FaviconFiles {
  ico: string;
  png16: string;
  png32: string;
  appleTouchIcon: string;
  androidChrome192: string;
  androidChrome512: string;
  webmanifest: string;
}

export interface FaviconConfig {
  basePath: string;
  files: FaviconFiles;
}

export interface SEOConfig {
  siteUrl?: string;
  siteName?: string;
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  twitterHandle?: string;
  favicon?: FaviconConfig;
}

export interface BusinessAddress {
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  countryCode?: string;
}

export interface BusinessSocial {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface BusinessConfig {
  legalName?: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  address?: BusinessAddress;
  social?: BusinessSocial;
}

export interface Config {
  version?: string;
  localization: {
    default_iso_code: string;
    available_locales: string[];
  };
  user: {
    external_id: string;
  };
  applications: {
    active: string[];
  };
  marketing?: {
    pixels: PixelConfig[];
  };
  seo?: SEOConfig;
  business?: BusinessConfig;
}