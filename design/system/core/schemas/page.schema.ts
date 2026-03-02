/**
 * Page Schema Type Definitions
 * 
 * Defines the complete type system for page-level configuration,
 * including required files, folder structure, and naming conventions.
 */

// ============================================
// NAMING CONVENTIONS
// ============================================

/**
 * Valid page name pattern
 * - Must be lowercase
 * - Can contain letters, numbers, hyphens
 * - Cannot start or end with hyphen
 * - Min 2, max 50 characters
 */
export const PageNamePattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Reserved page names (system pages)
 */
export const ReservedPageNames = [
  'blocked',
  'maintenance',
  '404',
  '500',
  'error'
] as const;

/**
 * Valid component/pattern ID pattern
 * - Lowercase letters + numbers
 * - Exactly 6 characters
 */
export const ComponentIdPattern = /^[a-z0-9]{6}$/;

/**
 * Valid section key pattern
 * - Type name + underscore + ID
 * - Example: hero_jVaWmY, services_K9mN2x
 */
export const SectionKeyPattern = /^[a-z]+_[a-zA-Z0-9]{6}$/;

// ============================================
// FILE STRUCTURE SCHEMA
// ============================================

/**
 * Required files in /public directory
 */
export const RequiredPublicFiles = {
  pages: {
    description: 'Page structure files (layout + sections)',
    pattern: '/public/pages/{slug}.json',
    required: true,
  },
  content: {
    description: 'Localized content files',
    pattern: '/public/content/{locale}/pages/{slug}.json',
    required: true,
  },
  assets: {
    description: 'Page-specific assets (images, videos)',
    pattern: '/public/assets/{slug}/*',
    required: false,
  },
} as const;

// ============================================
// PAGE VALIDATION RULES
// ============================================

/**
 * Page-level validation rules
 */
export const PageValidationRules = {
  // File naming
  naming: {
    pageSlugMustBeLowercase: {
      rule: (slug: string) => slug === slug.toLowerCase(),
      message: 'Page slug must be lowercase',
      severity: 'error' as const,
    },
    pageSlugMustMatchPattern: {
      rule: (slug: string) => PageNamePattern.test(slug),
      message: 'Page slug must contain only lowercase letters, numbers, and hyphens',
      severity: 'error' as const,
    },
    pageSlugCannotBeReserved: {
      rule: (slug: string) => !ReservedPageNames.includes(slug as any),
      message: 'Page slug cannot use reserved system names',
      severity: 'error' as const,
    },
    pageSlugLengthValid: {
      rule: (slug: string) => slug.length >= 2 && slug.length <= 50,
      message: 'Page slug must be between 2 and 50 characters',
      severity: 'error' as const,
    },
  },
  
  // File structure
  structure: {
    structureFileMustExist: {
      rule: (files: string[]) => files.some(f => f.match(/^\/public\/pages\/[^/]+\.json$/)),
      message: 'Page structure file (/public/pages/{slug}.json) is required',
      severity: 'error' as const,
    },
    contentFilesMustExist: {
      rule: (files: string[], locales: string[]) => 
        locales.every(locale => 
          files.some(f => f.match(new RegExp(`^/public/content/${locale}/pages/[^/]+\\.json$`)))
        ),
      message: 'Content files must exist for all configured locales',
      severity: 'error' as const,
    },
    fileNamesMustMatch: {
      rule: (structureFile: string, contentFiles: string[]) => {
        const structureSlug = structureFile.match(/\/pages\/([^/]+)\.json$/)?.[1];
        return contentFiles.every(f => {
          const contentSlug = f.match(/\/pages\/([^/]+)\.json$/)?.[1];
          return contentSlug === structureSlug;
        });
      },
      message: 'Structure and content files must use the same slug',
      severity: 'error' as const,
    },
  },
  
  // Content structure
  content: {
    sectionOrderMustMatchKeys: {
      rule: (sections: Record<string, any>, order: string[]) => 
        order.every(key => key in sections) && 
        Object.keys(sections).every(key => order.includes(key)),
      message: 'Section order array must match section keys exactly',
      severity: 'error' as const,
    },
    sectionKeysMustMatchPattern: {
      rule: (sections: Record<string, any>) => 
        Object.keys(sections).every(key => SectionKeyPattern.test(key)),
      message: 'Section keys must follow pattern: {type}_{id} (e.g., hero_jVaWmY)',
      severity: 'error' as const,
    },
    componentIdsMustBeUnique: {
      rule: (content: Record<string, any>) => {
        const ids = Object.keys(content.components || {});
        return ids.length === new Set(ids).size;
      },
      message: 'Component IDs must be unique within a page',
      severity: 'error' as const,
    },
    allComponentsMustHaveContent: {
      rule: (components: Record<string, any>) => 
        Object.values(components).every(c => 
          c.content !== undefined || c.alt !== undefined || c.placeholder !== undefined
        ),
      message: 'All components in content file must have at least one text property',
      severity: 'warning' as const,
    },
  },
  
  // SEO requirements
  seo: {
    titleMustExist: {
      rule: (seo: any) => !!seo?.title && seo.title.trim().length > 0,
      message: 'SEO title is required',
      severity: 'error' as const,
    },
    descriptionMustExist: {
      rule: (seo: any) => !!seo?.description && seo.description.trim().length > 0,
      message: 'SEO description is required',
      severity: 'error' as const,
    },
    titleLengthOptimal: {
      rule: (seo: any) => seo?.title && seo.title.length >= 30 && seo.title.length <= 60,
      message: 'SEO title should be between 30-60 characters for optimal display',
      severity: 'warning' as const,
    },
    descriptionLengthOptimal: {
      rule: (seo: any) => seo?.description && seo.description.length >= 120 && seo.description.length <= 160,
      message: 'SEO description should be between 120-160 characters for optimal display',
      severity: 'warning' as const,
    },
  },
};

// ============================================
// PAGE CREATION TEMPLATE
// ============================================

/**
 * Template for creating new pages
 */
export interface PageCreationTemplate {
  slug: string;
  locale: string;
  templateType?: 'minimal' | 'standard' | 'marketing';
}

/**
 * Generate file structure for new page
 */
export function generatePageFiles(template: PageCreationTemplate) {
  const { slug, locale, templateType = 'standard' } = template;
  
  return {
    structure: {
      path: `/public/pages/${slug}.json`,
      content: {
        props: {},
        sections: templateType === 'minimal' ? {
          [`hero_${generateId()}`]: {
            type: 'hero',
            props: {},
            patterns: {},
            order: [],
            layout: {},
          },
        } : generateStandardSections(),
        order: [],
      },
    },
    content: {
      path: `/public/content/${locale}/pages/${slug}.json`,
      content: {
        name: toTitleCase(slug),
        seo: {
          title: `${toTitleCase(slug)} - Site Name`,
          description: 'Default description for ' + slug,
          keywords: [],
        },
        components: {},
      },
    },
  };
}

/**
 * Generate random 6-character ID
 */
function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

/**
 * Convert slug to title case
 */
function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate standard section set
 */
function generateStandardSections() {
  return {
    [`hero_${generateId()}`]: {
      type: 'hero',
      props: {},
      patterns: {
        [`sectionHeader_${generateId()}`]: {
          type: 'sectionHeader',
          props: { spacing: 'lg' },
          components: {},
        },
      },
      order: [],
      layout: {
        alignSectionHeader: 'center',
        verticalAlign: 'center',
      },
    },
  };
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate page structure
 */
export function validatePageStructure(
  structureFile: any,
  contentFiles: Record<string, any>,
  locales: string[]
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate structure
  if (!structureFile.sections || typeof structureFile.sections !== 'object') {
    errors.push('Invalid structure: sections object is required');
  }
  
  if (!Array.isArray(structureFile.order)) {
    errors.push('Invalid structure: order array is required');
  }
  
  // Validate section keys
  if (structureFile.sections) {
    for (const key of Object.keys(structureFile.sections)) {
      if (!PageValidationRules.content.sectionKeysMustMatchPattern.rule({ [key]: {} })) {
        errors.push(`Invalid section key: ${key}`);
      }
    }
  }
  
  // Validate content files exist for all locales
  for (const locale of locales) {
    if (!contentFiles[locale]) {
      errors.push(`Missing content file for locale: ${locale}`);
    }
  }
  
  // Validate SEO in content files
  for (const [locale, content] of Object.entries(contentFiles)) {
    if (!PageValidationRules.seo.titleMustExist.rule(content.seo)) {
      errors.push(`Missing SEO title in ${locale} content`);
    }
    
    if (!PageValidationRules.seo.descriptionMustExist.rule(content.seo)) {
      errors.push(`Missing SEO description in ${locale} content`);
    }
    
    if (!PageValidationRules.seo.titleLengthOptimal.rule(content.seo)) {
      warnings.push(`SEO title length not optimal in ${locale} content`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
