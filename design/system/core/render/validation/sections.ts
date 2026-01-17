/**
 * Section Type Configuration
 * Defines which patterns are allowed and required for each section type
 */
export const sectionTypeConfig = {
  hero: {
    allowedPatterns: ['sectionBody', 'media', 'spinningLogos'],
    requiredPatterns: ['sectionBody']
  },
  portfolio: {
    allowedPatterns: ['sectionBody', 'spinningCarousel', 'portfolioGrid', 'stats'],
    requiredPatterns: ['sectionBody']
  },
  testimonials: {
    allowedPatterns: ['sectionBody', 'testimonialGrid'],
    requiredPatterns: ['sectionBody']
  },
  contact: {
    allowedPatterns: ['sectionBody', 'gridForm'],
    requiredPatterns: ['sectionBody']
  },
  featureGrid: {
    allowedPatterns: ['sectionBody', 'featureGrid'],
    requiredPatterns: ['sectionBody']
  },
  resultsGrid: {
    allowedPatterns: ['sectionBody', 'resultsGrid'],
    requiredPatterns: ['sectionBody']
  },
  cta: {
    allowedPatterns: ['sectionBody'],
    requiredPatterns: ['sectionBody']
  }
} as const;

/**
 * Extract section type from config for type safety
 */
export type SectionType = keyof typeof sectionTypeConfig;

/**
 * Validates if section type exists in config
 */
export function isValidSectionType(sectionType: string): sectionType is SectionType {
  return sectionType in sectionTypeConfig;
}

/**
 * Validates if pattern is allowed for section type
 */
export function isPatternAllowed(sectionType: string, patternType: string): boolean {
  if (!isValidSectionType(sectionType)) {
    return false; // Don't log here, let renderSection handle it
  }
  
  const config = sectionTypeConfig[sectionType];
  const isAllowed = (config.allowedPatterns as readonly string[]).includes(patternType);
  
  if (!isAllowed) {
    console.warn(`❌ Pattern "${patternType}" is not allowed in section type "${sectionType}". Allowed patterns: ${config.allowedPatterns.join(', ')}`);
  }
  
  return isAllowed;
}

/**
 * Validates if all required patterns are present
 */
export function validateRequiredPatterns(sectionType: string, patterns: Record<string, { type: string }>): boolean {
  if (!isValidSectionType(sectionType)) {
    return false; // Don't log here, let renderSection handle it
  }
  
  const config = sectionTypeConfig[sectionType];
  const presentPatternTypes = Object.values(patterns).map(p => p.type);
  const missingPatterns = config.requiredPatterns.filter(required => 
    !presentPatternTypes.includes(required)
  );
  
  if (missingPatterns.length > 0) {
    console.error(`❌ Section type "${sectionType}" is missing required patterns: ${missingPatterns.join(', ')}`);
    return false;
  }
  
  return true;
}

/**
 * Get allowed patterns for a section type
 */
export function getAllowedPatterns(sectionType: SectionType): readonly string[] {
  return sectionTypeConfig[sectionType].allowedPatterns;
}

/**
 * Get required patterns for a section type
 */
export function getRequiredPatterns(sectionType: SectionType): readonly string[] {
  return sectionTypeConfig[sectionType].requiredPatterns;
}
