import SectionBody from './sectionBody/SectionBody';
import SectionHeader from './SectionHeader/SectionHeader';
import { Divider } from '../../components/layout/divider';
import { ProcessSteps } from '../../components/process/ProcessSteps/ProcessSteps';

/**
 * Shared patterns registry
 * Maps shared pattern types to their components
 */
export const sharedPatterns: Record<string, React.ComponentType<any>> = {
  sectionBody: SectionBody,
  sectionHeader: SectionHeader,
  divider: Divider,
  processSteps: ProcessSteps,
};
