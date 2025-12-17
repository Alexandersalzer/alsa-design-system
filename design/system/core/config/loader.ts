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
  return loadJsonFile<Config>('config/config.json');
}