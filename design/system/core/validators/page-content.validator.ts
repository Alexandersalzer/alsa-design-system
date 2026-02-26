/**
 * Page Content Validator
 * 
 * Validates JSON structure and content within page files.
 * Validates against nodes.ts types and section.types.ts rules.
 */

import fs from 'fs';
import path from 'path';
import {
  isValidSectionType,
  getSectionPositionRequirement,
  type SectionType
} from '../schemas/section.types';

export interface ContentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  pageSlug: string;
  details?: {
    sectionCount?: number;
    sectionTypes?: string[];
    invalidSections?: string[];
    duplicateSections?: string[];
  };
}

/**
 * Validate structure file (/pages/*.json)
 */
export function validateStructureFile(
  filePath: string,
  slug: string
): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details = {
    sectionCount: 0,
    sectionTypes: [] as string[],
    invalidSections: [] as string[],
    duplicateSections: [] as string[]
  };

  try {
    const content: any = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // ============================================
    // 1. VALIDATE TOP-LEVEL STRUCTURE
    // ============================================
    
    if (!content.sections || typeof content.sections !== 'object') {
      errors.push('Missing or invalid "sections" object');
      return { valid: false, errors, warnings, pageSlug: slug };
    }

    if (!Array.isArray(content.order)) {
      errors.push('Missing or invalid "order" array');
      return { valid: false, errors, warnings, pageSlug: slug };
    }

    // ============================================
    // 2. VALIDATE SECTION ORDER vs SECTIONS
    // ============================================
    
    const sectionKeys = Object.keys(content.sections);
    const orderKeys = content.order;

    // Check all sections are in order
    for (const key of sectionKeys) {
      if (!orderKeys.includes(key)) {
        errors.push(`Section "${key}" exists but is not in order array`);
      }
    }

    // Check all order items exist as sections
    for (const key of orderKeys) {
      if (!sectionKeys.includes(key)) {
        errors.push(`Order references non-existent section: "${key}"`);
      }
    }

    // ============================================
    // 3. VALIDATE SECTION TYPES
    // ============================================
    
    const sectionTypeCount: Record<string, number> = {};
    const sectionsByType: Record<string, string[]> = {};

    for (const [sectionKey, section] of Object.entries(content.sections)) {
      const sectionData = section as any;
      
      if (!sectionData.type) {
        errors.push(`Section "${sectionKey}" missing type property`);
        details.invalidSections.push(sectionKey);
        continue;
      }

      const sectionType = sectionData.type;
      details.sectionTypes.push(sectionType);

      // Check if section type is allowed
      if (!isValidSectionType(sectionType)) {
        errors.push(
          `Section "${sectionKey}" has invalid type: "${sectionType}". ` +
          `Allowed types: hero, about, services, testimonials, faq, pricing, cta, logos, stats, team, process, contact`
        );
        details.invalidSections.push(sectionKey);
        continue;
      }

      // Track section type occurrences
      sectionTypeCount[sectionType] = (sectionTypeCount[sectionType] || 0) + 1;
      if (!sectionsByType[sectionType]) {
        sectionsByType[sectionType] = [];
      }
      sectionsByType[sectionType].push(sectionKey);
    }

    details.sectionCount = sectionKeys.length;

    // ============================================
    // 4. VALIDATE MAX ONE PER TYPE RULE
    // ============================================
    
    for (const [type, count] of Object.entries(sectionTypeCount)) {
      if (count > 1) {
        errors.push(
          `Section type "${type}" appears ${count} times. Only one section of each type is allowed per page. ` +
          `Found in: ${sectionsByType[type].join(', ')}`
        );
        details.duplicateSections.push(...sectionsByType[type]);
      }
    }

    // ============================================
    // 5. VALIDATE SECTION POSITIONING RULES
    // ============================================
    
    // Get ordered section types
    const orderedSectionTypes = orderKeys
      .map((key: string) => content.sections[key])
      .filter((s: any) => s && s.type)
      .map((s: any) => s.type);

    // Rule: Hero must be first (if present)
    const heroIndex = orderedSectionTypes.indexOf('hero');
    if (heroIndex !== -1 && heroIndex !== 0) {
      errors.push(
        `Hero section must be the first section in the page. ` +
        `Currently at position ${heroIndex + 1}`
      );
    }

    // Rule: Hero is required as first section
    if (orderedSectionTypes.length > 0 && orderedSectionTypes[0] !== 'hero') {
      errors.push(
        `First section must be a hero section. ` +
        `Current first section: "${orderedSectionTypes[0]}"`
      );
    }

    // Rule: Contact must be last (if present)
    const contactIndex = orderedSectionTypes.indexOf('contact');
    if (contactIndex !== -1 && contactIndex !== orderedSectionTypes.length - 1) {
      errors.push(
        `Contact section must be the last section in the page. ` +
        `Currently at position ${contactIndex + 1} of ${orderedSectionTypes.length}`
      );
    }

    // ============================================
    // 6. VALIDATE SECTION STRUCTURE
    // ============================================
    
    for (const [sectionKey, section] of Object.entries(content.sections)) {
      const sectionData = section as any;

      // Check patterns exist
      if (!sectionData.patterns || typeof sectionData.patterns !== 'object') {
        warnings.push(`Section "${sectionKey}" missing or invalid patterns object`);
      }

      // Check order array exists
      if (!Array.isArray(sectionData.order)) {
        warnings.push(`Section "${sectionKey}" missing or invalid order array`);
      }

      // Validate pattern order matches pattern keys
      if (sectionData.patterns && sectionData.order) {
        const patternKeys = Object.keys(sectionData.patterns);
        const patternOrder = sectionData.order;

        for (const key of patternKeys) {
          if (!patternOrder.includes(key)) {
            warnings.push(`Section "${sectionKey}": pattern "${key}" not in order array`);
          }
        }

        for (const key of patternOrder) {
          if (!patternKeys.includes(key)) {
            errors.push(`Section "${sectionKey}": order references non-existent pattern "${key}"`);
          }
        }

        // Check for required sectionHeader pattern
        let hasSectionHeader = false;
        let sectionHeaderKey: string | null = null;

        for (const [patternKey, pattern] of Object.entries(sectionData.patterns)) {
          const patternData = pattern as any;
          if (patternData && patternData.type === 'sectionHeader') {
            hasSectionHeader = true;
            sectionHeaderKey = patternKey;
            break;
          }
        }

        if (!hasSectionHeader) {
          errors.push(
            `Section "${sectionKey}" missing required pattern with type "sectionHeader". ` +
            `Every section must have a sectionHeader pattern.`
          );
        } else if (sectionHeaderKey && patternOrder.length > 0 && patternOrder[0] !== sectionHeaderKey) {
          errors.push(
            `Section "${sectionKey}" has sectionHeader pattern "${sectionHeaderKey}" but it's not first in order. ` +
            `SectionHeader must be the first pattern in the section. ` +
            `Current first: "${patternOrder[0]}"`
          );
        }
      }
    }

  } catch (error) {
    errors.push(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    pageSlug: slug,
    details
  };
}

/**
 * Validate content file (/content/[locale]/pages/*.json)
 */
export function validateContentFile(
  filePath: string,
  slug: string,
  locale: string
): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Check required top-level keys
    if (!content.name || typeof content.name !== 'string') {
      errors.push('Missing or invalid "name" field');
    }

    if (!content.seo || typeof content.seo !== 'object') {
      errors.push('Missing or invalid "seo" object');
    } else {
      // Validate SEO fields
      if (!content.seo.title || content.seo.title.trim().length === 0) {
        errors.push('SEO title is required');
      }

      if (!content.seo.description || content.seo.description.trim().length === 0) {
        errors.push('SEO description is required');
      }

      // SEO length warnings
      if (content.seo.title) {
        const titleLength = content.seo.title.length;
        if (titleLength < 30 || titleLength > 60) {
          warnings.push(
            `SEO title length not optimal (${titleLength} chars, recommended 30-60)`
          );
        }
      }

      if (content.seo.description) {
        const descLength = content.seo.description.length;
        if (descLength < 120 || descLength > 160) {
          warnings.push(
            `SEO description length not optimal (${descLength} chars, recommended 120-160)`
          );
        }
      }
    }

    if (!content.components || typeof content.components !== 'object') {
      warnings.push('Missing or invalid "components" object');
    } else {
      // Check component IDs are unique (already guaranteed by object keys)
      const componentIds = Object.keys(content.components);
      
      // Check all components have some content
      for (const [id, component] of Object.entries(content.components)) {
        const comp = component as any;
        const hasContent = 
          comp.content !== undefined || 
          comp.alt !== undefined || 
          comp.placeholder !== undefined;
        
        if (!hasContent) {
          warnings.push(`Component "${id}" has no text content (content, alt, or placeholder)`);
        }
      }
    }

  } catch (error) {
    errors.push(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors.map(e => `[${locale}] ${e}`),
    warnings: warnings.map(w => `[${locale}] ${w}`),
    pageSlug: slug
  };
}

/**
 * Validate all content for a single page across locales
 */
export function validatePageContent(
  publicDir: string,
  slug: string,
  locales: string[]
): ContentValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let structureDetails;

  // Validate structure file
  const structurePath = path.join(publicDir, 'pages', `${slug}.json`);
  
  if (!fs.existsSync(structurePath)) {
    return {
      valid: false,
      errors: [`Structure file not found: /pages/${slug}.json`],
      warnings: [],
      pageSlug: slug
    };
  }

  const structureResult = validateStructureFile(structurePath, slug);
  allErrors.push(...structureResult.errors);
  allWarnings.push(...structureResult.warnings);
  structureDetails = structureResult.details;

  // Validate content files
  for (const locale of locales) {
    const contentPath = path.join(publicDir, 'content', locale, 'pages', `${slug}.json`);
    
    if (!fs.existsSync(contentPath)) {
      allErrors.push(`Content file missing for locale: ${locale}`);
      continue;
    }

    const contentResult = validateContentFile(contentPath, slug, locale);
    allErrors.push(...contentResult.errors);
    allWarnings.push(...contentResult.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    pageSlug: slug,
    details: structureDetails
  };
}
