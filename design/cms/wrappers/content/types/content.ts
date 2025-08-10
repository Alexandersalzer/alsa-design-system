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
  globals: { [key: string]: GlobalComponent };
  meta: {
    language: {
      code: string;
      name: string;
      is_default: boolean;
      is_active: boolean;
    };
  };
}

// Enhanced metadata interface for website content
export interface WebsiteContentMeta {
  // Single-language mode (backward compatibility)
  locale?: string | null;
  localeData?: {
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  } | null;
  
  // Multi-language mode (new structure)
  requestedLocale?: string | null;
  availableLanguages?: Array<{
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  }>;
  defaultLanguage?: string;
  fetchMode?: 'single-language' | 'all-languages';
}

// Main content structure type - supports both single and multi-language modes
export interface WebsiteContent {
  // Backward compatibility: single-language structure
  pages?: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
  
  // New structure: multi-language support
  languages?: { [languageCode: string]: LanguageContent };
  
  // Enhanced metadata
  meta?: WebsiteContentMeta;
} 