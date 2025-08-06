// JSON file content types (what we actually have in files)
export interface JsonBlock {
  type: 'title' | 'subtitle' | 'primaryButton' | 'secondaryButton' | 'text' | 'image' | 'navItem' | string;
  content?: string;
  image_url?: string;
  slug?: string; // For navigation items
}

export interface JsonPattern {
  type: string;
  blocks: JsonBlock[];
}

export interface JsonTemplate {
  type: string;
  image_url?: string;
  patterns: JsonPattern[];
}

export interface JsonPage {
  id?: number | string;
  type: string;
  slug?: string;
  position?: number;
  templates: JsonTemplate[];
}

// Content structure types
export interface WebsiteContent {
  pages: { [key: string]: JsonPage }; // Use JsonPage for file content
  globals?: { [key: string]: JsonTemplate }; // Use JsonTemplate for file content
}

