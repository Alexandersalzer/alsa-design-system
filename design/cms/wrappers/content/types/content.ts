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