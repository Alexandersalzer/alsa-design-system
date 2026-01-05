/**
 * Generic JSON file loader for server-side operations.
 * Reads and parses JSON files from the public directory with type safety.
 * Returns null if file doesn't exist or parsing fails - no fallbacks provided.
 */
export async function loadJsonFile<T>(filePath: string): Promise<T | null> {
  if (typeof window !== 'undefined') {
    throw new Error('loadJsonFile is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const fileContent = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContent) as T;
    
  } catch (error) {
    return null;
  }
}

/**
 * List directory contents on server-side
 * Returns array of file and directory names. 
 * Exempel 1 listDirectory("content") → ["sv", "en", "de"]
 * Exempel 2 listDirectory("content/sv") → ["navbar.json", "footer.json", "start.json"]
 */
export async function listDirectory(dirPath: string): Promise<string[]> {
  if (typeof window !== 'undefined') {
    throw new Error('listDirectory is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'public', dirPath);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isFile() || entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
}

/**
 * Convert page prop value name to URL-safe slug
 * Centralized logic used by multiple functions
 */
export const nameToSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};