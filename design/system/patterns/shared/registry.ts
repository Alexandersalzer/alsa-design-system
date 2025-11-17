import SectionBody from './sectionBody/SectionBody';
import ButtonGroup from './ButtonGroup';

/**
 * Shared patterns registry
 * Maps shared pattern types to their components
 */
export const sharedPatterns: Record<string, React.ComponentType<any>> = {
  sectionBody: SectionBody,
  buttonGroup: ButtonGroup,
};
