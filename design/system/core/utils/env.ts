export const CDN_BASE_URL = 'https://cdn.blimpify-im.com/members';
/** CDN root för stockLibrary m.m. (bucket root) */
export const CDN_ROOT_URL = 'https://cdn.blimpify-im.com';

/**
 * Resolverar bild-URL: full URL används som den är, stockLibrary/ använder CDN root, övrigt använder members.
 */
export function resolveCdnImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  if (path.startsWith('stockLibrary/')) return `${CDN_ROOT_URL}/${path}`;
  const base = path.startsWith('/') ? CDN_BASE_URL : CDN_BASE_URL + '/';
  return base + (path.startsWith('/') ? path.slice(1) : path);
}

export type Locale = string;