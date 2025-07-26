// Database-aligned types
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

export interface WebsiteContent {
  pages: Page[] | { [key: string]: Page };
  navbar?: Template; // Global navbar template
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