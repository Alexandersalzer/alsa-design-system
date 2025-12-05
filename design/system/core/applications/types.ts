/**
 * Config Types
 * TypeScript types for config.json structure
 */

export interface Config {
  localization: {
    endonym_name: string;
    iso_code: string;
    name: string;
    primary: boolean;
  };
  user: {
    user_id: number;
  };
  applications: {
    active: string[];
  };
}