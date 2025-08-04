/**
 * Content loader types and constants for blimpify-ui
 * These are shared across all client implementations
 */

export interface LayoutItem {
  template: string;
  [key: string]: unknown;
}

export interface PageContent {
  slug: string;
  templates: any[];
  [key: string]: unknown;
}

export interface GlobalComponentContent {
  [key: string]: unknown;
}

export interface WebsiteContentStructure {
  pages: { [key: string]: PageContent };
  globals?: { [key: string]: GlobalComponentContent };
}

/**
 * Content structure constants - paths and file names
 */
export const CONTENT_PATHS = {
  BASE: 'public/content',
  PAGES: 'pages',
  GLOBALS: 'globals',
  TEMPLATES: 'templates',
  PAGE_FILE: 'page.json',
  LAYOUT_FILE: 'layout.json'
} as const;

/**
 * Default locale for content loading
 */
export const DEFAULT_LOCALE = 'sv';

/**
 * Content path builder utilities
 */
export class ContentPathBuilder {
  /**
   * Build template path
   */
  static getTemplatePath(basePath: string, locale: string, templateName: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.TEMPLATES, `${templateName}.json`].join('/');
  }

  /**
   * Build layout path
   */
  static getLayoutPath(basePath: string, locale: string, pageSlug: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.PAGES, pageSlug, CONTENT_PATHS.LAYOUT_FILE].join('/');
  }

  /**
   * Build page path
   */
  static getPagePath(basePath: string, locale: string, pageSlug: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.PAGES, pageSlug, CONTENT_PATHS.PAGE_FILE].join('/');
  }

  /**
   * Build global component path
   */
  static getGlobalPath(basePath: string, locale: string, componentType: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.GLOBALS, componentType, `${componentType}.json`].join('/');
  }

  /**
   * Build pages directory path
   */
  static getPagesDir(basePath: string, locale: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.PAGES].join('/');
  }

  /**
   * Build content directory path
   */
  static getContentDir(basePath: string, locale: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale].join('/');
  }

  /**
   * Build globals directory path
   */
  static getGlobalsDir(basePath: string, locale: string): string {
    return [basePath, CONTENT_PATHS.BASE, locale, CONTENT_PATHS.GLOBALS].join('/');
  }

  /**
   * Build base content directory path
   */
  static getBaseContentDir(basePath: string): string {
    return [basePath, CONTENT_PATHS.BASE].join('/');
  }
}

/**
 * Content processing utilities
 */
export class ContentProcessor {
  /**
   * Process page data with templates
   */
  static processPageData(
    pageData: any,
    pageSlug: string,
    templates: any[]
  ): PageContent {
    return {
      ...pageData,
      slug: pageSlug,
      templates: templates.filter(t => t !== null)
    };
  }

  /**
   * Convert pages array to object keyed by slug
   */
  static convertPagesToObject(pages: PageContent[]): { [key: string]: PageContent } {
    const pagesObject: { [key: string]: PageContent } = {};
    pages.filter(Boolean).forEach(page => {
      if (page.slug) {
        pagesObject[page.slug] = page;
      }
    });
    return pagesObject;
  }

  /**
   * Create website content structure
   */
  static createWebsiteContent(
    pages: { [key: string]: PageContent },
    globals?: { [key: string]: any }
  ): WebsiteContentStructure {
    return {
      pages,
      globals: globals && Object.keys(globals).length > 0 ? globals : undefined
    };
  }
} 