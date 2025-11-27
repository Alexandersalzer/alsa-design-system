import { loadJsonFile } from "../utils/loaders";
import type { WebsiteConfig } from "../types/config";

export async function getDefaultLocale(): Promise<string | null> {
  const config = await loadJsonFile<WebsiteConfig>("config/config.json");
  return config?.localization?.iso_code || null;
}