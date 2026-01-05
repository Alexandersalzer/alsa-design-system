export { BlockedPage, contentByLocale as blockedContentByLocale } from './page';
export type { BlockedPageProps } from './page';

// Re-export content for slug lookups
import svContent from './content/sv.json';
import enContent from './content/en.json';
export { svContent as blockedSvContent, enContent as blockedEnContent };
