/**
 * Config Types
 * TypeScript types for config.json structure
 */

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
}