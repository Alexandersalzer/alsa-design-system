/**
 * Config Types
 * TypeScript types for config.json structure
 */

export interface PixelConfig {
  platform: 'meta' | 'tiktok' | 'snapchat' | 'google';
  pixel_id: string;
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
}