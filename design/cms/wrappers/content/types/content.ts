// ============================================================
// LEGACY CONTENT STRUCTURE (Database/API format)
// ============================================================

// Generic interfaces that match database structure
export interface ContentBlock {
  type: string;
  content?: string;
  media_src?: string;
  config?: any;
  slug?: string;
  position?: number;
}

export interface ContentPattern {
  type: string;
  blocks?: ContentBlock[];
  config?: any;
  position?: number;
}

export interface ContentTemplate {
  type: string;
  patterns: ContentPattern[];
  position?: number;
  media_src?: string;
}

export interface GlobalComponent {
  type: string;
  patterns: ContentPattern[];
}

export interface ContentPage {
  type: string;
  language: string;
  slug: string;
  templates: ContentTemplate[];
}

// Metadata interface for website content
export interface WebsiteContentMeta {
  locale?: string | null;
  localeData?: {
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  } | null;
}

// Main content structure type
export interface WebsiteContent {
  pages: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
  meta?: WebsiteContentMeta;
}

// ============================================================
// NEW NESTED CONTENT STRUCTURE (hem.json format)
// ============================================================

/**
 * Component - Lowest level content unit
 * Examples: tag, heading, body, button, video
 */
export interface ContentComponent {
  type: string;
  content?: string | ContentButtonContent;
  settings?: Record<string, any>;
}

/**
 * Button-specific content structure
 */
export interface ContentButtonContent {
  type: string;
  content: string;
}

/**
 * Pattern - Collection of components
 * Examples: sectionBody, spinningLogos, media
 */
export interface ContentPatternV2 {
  type: string;
  components: Record<string, ContentComponent>;
  settings?: Record<string, any>;
}

/**
 * Section - Collection of patterns with ordering
 * Examples: hero, features, contact
 */
export interface ContentSection {
  type: string;
  patterns: Record<string, ContentPatternV2>;
  order: string[]; // Order of pattern IDs
}

/**
 * Page with nested sections structure
 */
export interface ContentPageV2 {
  type: string;
  name: string;
  language: string;
  slug: string;
  sections: Record<string, ContentSection>;
  order: string[]; // Order of section IDs
}

/**
 * Website content in new nested format
 */
export interface WebsiteContentV2 {
  pages: { [key: string]: ContentPageV2 };
  globals?: { [key: string]: any };
  meta?: WebsiteContentMeta;
}

/**
 * Union type for supporting both formats
 */
export type AnyWebsiteContent = WebsiteContent | WebsiteContentV2; 