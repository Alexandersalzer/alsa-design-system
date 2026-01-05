import { KjFooter } from './KjFooter';
import { Placeholder } from './Placeholder';

// Footer patterns registry
export const footerRegistry: Record<string, React.ComponentType<any>> = {
  kj: KjFooter, // Map to 'kj' to match footer.json type
  placeholder: Placeholder, // Simple "powered by Blimpify" footer
};