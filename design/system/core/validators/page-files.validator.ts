/**
 * Page Files Validator
 * 
 * Validates file and folder structure for pages.
 * Can be reused in CLI scripts, editor, and CI/CD pipelines.
 */

import fs from 'fs';
import path from 'path';
import { PageNamePattern, ReservedPageNames } from '../schemas/page.schema';

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  details?: {
    foundPages?: string[];
    missingContentFiles?: Array<{ page: string; locale: string }>;
    invalidPageNames?: string[];
    detectedLocales?: string[];
  };
}

/**
 * Check if required directories exist
 */
export function validateRequiredDirectories(publicDir: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredDirs = [
    'pages',
    'content',
    'shells',
    'design'
  ];

  for (const dir of requiredDirs) {
    const dirPath = path.join(publicDir, dir);
    if (!fs.existsSync(dirPath)) {
      errors.push(`Required directory missing: /public/${dir}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate required root files
 */
export function validateRequiredFiles(publicDir: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredFiles = [
    'shells/navbar.json',
    'shells/footer.json',
    'pages/start.json',
    'design/design.json'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Required file missing: /public/${file}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate page file names
 */
export function validatePageNames(publicDir: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const invalidPageNames: string[] = [];

  const pagesDir = path.join(publicDir, 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    return {
      valid: false,
      errors: ['Pages directory does not exist'],
      warnings
    };
  }

  const pageFiles = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  for (const slug of pageFiles) {
    // Check lowercase
    if (slug !== slug.toLowerCase()) {
      errors.push(`Page name must be lowercase: ${slug}`);
      invalidPageNames.push(slug);
    }

    // Check pattern
    if (!PageNamePattern.test(slug)) {
      errors.push(`Page name contains invalid characters: ${slug}`);
      invalidPageNames.push(slug);
    }

    // Check reserved names
    if (ReservedPageNames.includes(slug as any)) {
      errors.push(`Page name is reserved and cannot be used: ${slug}`);
      invalidPageNames.push(slug);
    }

    // Check length
    if (slug.length < 2 || slug.length > 50) {
      errors.push(`Page name must be between 2-50 characters: ${slug} (${slug.length} chars)`);
      invalidPageNames.push(slug);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    details: {
      foundPages: pageFiles,
      missingContentFiles: [],
      invalidPageNames
    }
  };
}

/**
 * Validate content files exist for all locales
 */
export function validateContentFiles(
  publicDir: string,
  locales: string[]
): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingContentFiles: Array<{ page: string; locale: string }> = [];

  const pagesDir = path.join(publicDir, 'pages');
  const contentDir = path.join(publicDir, 'content');

  if (!fs.existsSync(pagesDir)) {
    return {
      valid: false,
      errors: ['Pages directory does not exist'],
      warnings
    };
  }

  const pageFiles = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  // Check each locale has required structure
  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale);
    if (!fs.existsSync(localeDir)) {
      errors.push(`Content directory missing for locale: ${locale}`);
      continue;
    }

    const localeShellsDir = path.join(localeDir, 'shells');
    const localePagesDir = path.join(localeDir, 'pages');

    // Check required locale directories
    if (!fs.existsSync(localeShellsDir)) {
      errors.push(`Shells directory missing for locale: ${locale} (/content/${locale}/shells)`);
    }
    if (!fs.existsSync(localePagesDir)) {
      errors.push(`Pages directory missing for locale: ${locale} (/content/${locale}/pages)`);
      continue;
    }

    // Check required locale files
    const requiredLocaleFiles = [
      path.join(localeShellsDir, 'navbar.json'),
      path.join(localeShellsDir, 'footer.json'),
      path.join(localePagesDir, 'start.json')
    ];

    for (const file of requiredLocaleFiles) {
      if (!fs.existsSync(file)) {
        const relativePath = path.relative(publicDir, file);
        errors.push(`Required content file missing: /public/${relativePath}`);
      }
    }

    // Check each page has content file
    for (const page of pageFiles) {
      const contentFile = path.join(localePagesDir, `${page}.json`);
      if (!fs.existsSync(contentFile)) {
        missingContentFiles.push({ page, locale });
        errors.push(`Content file missing: /content/${locale}/pages/${page}.json`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    details: {
      foundPages: pageFiles,
      missingContentFiles,
      invalidPageNames: []
    }
  };
}

/**
 * Validate file name consistency between structure and content
 */
export function validateFileNameConsistency(
  publicDir: string,
  locales: string[]
): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const pagesDir = path.join(publicDir, 'pages');
  const contentDir = path.join(publicDir, 'content');

  const structurePages = new Set(
    fs.existsSync(pagesDir)
      ? fs.readdirSync(pagesDir)
          .filter(f => f.endsWith('.json'))
          .map(f => f.replace('.json', ''))
      : []
  );

  for (const locale of locales) {
    const localePagesDir = path.join(contentDir, locale, 'pages');
    
    if (!fs.existsSync(localePagesDir)) continue;

    const contentPages = fs.readdirSync(localePagesDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));

    // Check for orphaned content files
    for (const contentPage of contentPages) {
      if (!structurePages.has(contentPage)) {
        warnings.push(
          `Orphaned content file (no matching structure): /content/${locale}/pages/${contentPage}.json`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get all locales from content directory
 */
export function detectLocales(publicDir: string): string[] {
  const contentDir = path.join(publicDir, 'content');
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item);
      return fs.statSync(itemPath).isDirectory() && /^[a-z]{2}$/.test(item);
    });
}
