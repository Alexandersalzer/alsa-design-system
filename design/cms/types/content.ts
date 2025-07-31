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

// Database-aligned types (with required id and position)
export interface Block {
  id: number;
  type: 'title' | 'subtitle' | 'primaryButton' | 'secondaryButton' | 'text' | 'image' | 'navItem' | string;
  position: number;
  content?: string;
  image_url?: string;
  slug?: string; // For navigation items
}

export interface Pattern {
  id: number;
  type: string;
  position: number;
  blocks: Block[];
}

export interface Template {
  id: number;
  type: string;
  position: number;
  image_url?: string;
  patterns: Pattern[];
}

export interface Page {
  id: number | string;
  type: string;
  slug?: string;
  position?: number;
  templates: Template[];
}

// Content structure types
export interface WebsiteContent {
  pages: { [key: string]: JsonPage }; // Use JsonPage for file content
  globals?: { [key: string]: JsonTemplate }; // Use JsonTemplate for file content
}

// Enum for mapping block types
export enum BlockType {
  // Hero-specific block types
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  PRIMARY_BUTTON = 'primaryButton',
  SECONDARY_BUTTON = 'secondaryButton',
  TEXT = 'text',
  IMAGE = 'image',
}

// Constants for mapping block types in Hero section
export const BLOCK_TYPES = {
  HERO: {
    TITLE: 'title',
    SUBTITLE: 'subtitle',
    PRIMARY_BUTTON: 'primaryButton',
    SECONDARY_BUTTON: 'secondaryButton',
    TEXT: 'text',
    IMAGE: 'image',
  },
} as const; 