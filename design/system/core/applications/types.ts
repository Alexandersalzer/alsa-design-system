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
    endonym_name: string;
    iso_code: string;
    name: string;
    primary: boolean;
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