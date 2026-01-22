import SectionBody from './sectionBody/SectionBody';
import SectionHeader from './SectionHeader/SectionHeader';
import ButtonGroup from './ButtonGroup';
import { Divider } from '../../components/layout/divider';

/**
 * Shared patterns registry
 * Maps shared pattern types to their components
 */
export const sharedPatterns: Record<string, React.ComponentType<any>> = {
  sectionBody: SectionBody,
  sectionHeader: SectionHeader,
  buttonGroup: ButtonGroup,
  divider: Divider,
};
