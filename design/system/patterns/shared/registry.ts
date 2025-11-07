import { SectionBody } from './sectionBody/SectionBody';

/**
 * Shared patterns registry
 * Maps shared pattern types to their components
 */
export const sharedPatterns: Record<string, React.ComponentType<any>> = {
  sectionBody: SectionBody,
};
