import type { DesignConfig } from "../types/design";
import { loadJsonFile } from "../utils/loaders";

export async function getDesignConfig(): Promise<DesignConfig | null> {
  return loadJsonFile<DesignConfig>("design/design.json");
}
