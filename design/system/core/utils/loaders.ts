/**
 * Generic JSON file loader for server-side operations
 */
export async function loadJsonFile<T>(
  filePath: string,
  fallbackLocale?: string,
  fallbackData?: T
): Promise<T | null> {
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
    // Try fallback locale if provided
    if (fallbackLocale && filePath.includes('/')) {
      const pathParts = filePath.split('/');
      const localeIndex = pathParts.findIndex((part, index) => 
        index > 0 && part !== 'content' && part !== 'design'
      );
      
      if (localeIndex > -1 && pathParts[localeIndex] !== fallbackLocale) {
        pathParts[localeIndex] = fallbackLocale;
        const fallbackPath = pathParts.join('/');
        
        try {
          return await loadJsonFile<T>(fallbackPath, undefined, fallbackData);
        } catch {
          // Continue to fallback data
        }
      }
    }
    
    // Return fallback data or null
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    
    return null;
  }
}

/**
 * List directory contents on server-side
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
    console.error(`Failed to list directory ${dirPath}:`, error);
    return [];
  }
}