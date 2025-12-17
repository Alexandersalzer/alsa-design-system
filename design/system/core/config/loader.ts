/**
 * Config Loader
 * Load and parse config.json for applications
 */

import { loadJsonFile } from '../utils/loaders';
import type { Config } from '../applications/types';

/**
 * Load config.json from public directory
 */
export async function loadConfig(): Promise<Config | null> {
  console.log('[CONFIG LOADER] 🔍 Loading config.json...');
  
  const config = await loadJsonFile<Config>('config/config.json');
  
  if (config) {
    console.log('[CONFIG LOADER] ✅ Config loaded successfully');
    console.log('[CONFIG LOADER] Config contents:', JSON.stringify(config, null, 2));
  } else {
    console.warn('[CONFIG LOADER] ⚠️  Config is null - file not found or invalid');
  }
  
  return config;
}