import type { DesignConfig } from "../types/design";
import { loadJsonFile } from "../utils/loaders";

export async function getDesignConfig(): Promise<DesignConfig | null> {
  // Server-side: Läs från filsystem (som innan)
  if (typeof window === 'undefined') {
    return loadJsonFile<DesignConfig>("design/design.json");
  }
  
  // Client-side: Läs via fetch med cache-busting
  try {
    const timestamp = Date.now();
    const response = await fetch(`/design/design.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      console.warn('Could not load design.json');
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading design config:', error);
    return null;
  }
}
