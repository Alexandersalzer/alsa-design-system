// Generic interfaces that match database structure
export interface ContentBlock {
  type: string;
  content?: string;
  image_url?: string;
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
  image_url?: string;
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

// Language-specific content structure
export interface LanguageContent {
  pages: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
  meta?: WebsiteContentMeta;
}

// Available language metadata
export interface AvailableLanguage {
  code: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
}

// Metadata interface for website content
export interface WebsiteContentMeta {
  locale?: string | null;
  localeData?: AvailableLanguage | null;
  availableLanguages?: AvailableLanguage[];
  defaultLanguage?: string;
  totalRows?: number;
  version?: string;
}

// Main content structure type - now organized by language for client-side filtering
export interface WebsiteContent {
  // New structure: organized by language
  languages?: { [languageCode: string]: LanguageContent };
  meta?: WebsiteContentMeta;
  
  // Legacy structure for backward compatibility (deprecated)
  pages?: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
} 