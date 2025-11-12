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
    allowedPatterns: ['sectionBody', 'spinningCarousel', 'gallery'],
    requiredPatterns: ['sectionBody']
  },
  testimonials: {
    allowedPatterns: ['sectionBody', 'testimonials'],
    requiredPatterns: ['sectionBody']
  },
  contact: {
    allowedPatterns: ['sectionBody', 'form'],
    requiredPatterns: ['sectionBody']
  },
  featureGrid: {
    allowedPatterns: ['sectionBody', 'featureGrid'],
    requiredPatterns: ['sectionBody']
  }
} as const;

/**
 * Extract section type from config for type safety
 */
export type SectionType = keyof typeof sectionTypeConfig;

/**
 * Validates if pattern is allowed for section type
 */
export function isPatternAllowed(sectionType: string, patternType: string): boolean {
  const config = sectionTypeConfig[sectionType as SectionType];
  if (!config) {
    console.warn(`Unknown section type: ${sectionType}`);
    return true; // Fallback to allow if unknown
  }
  return (config.allowedPatterns as readonly string[]).includes(patternType);
}

/**
 * Validates if all required patterns are present
 */
export function validateRequiredPatterns(sectionType: string, patterns: Record<string, { type: string }>): boolean {
  const config = sectionTypeConfig[sectionType as SectionType];
  if (!config) return true;
  
  const presentPatternTypes = Object.values(patterns).map(p => p.type);
  return config.requiredPatterns.every(required => 
    presentPatternTypes.includes(required)
  );
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
