import { KjFooter } from './KjFooter';
import { Placeholder } from './Placeholder';
import { MultiColumnFooter } from './MultiColumnFooter';

// Footer patterns registry
export const footerRegistry: Record<string, React.ComponentType<any>> = {
  kj: KjFooter, // Map to 'kj' to match footer.json type
  placeholder: Placeholder, // Simple "powered by Blimpify" footer
  multiColumn: MultiColumnFooter, // Multi-column footer with navigation links and action buttons
};