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

// Main content structure type
export interface WebsiteContent {
  pages: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
} 