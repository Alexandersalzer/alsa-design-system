import { KjFooter } from './KjFooter';
import { Placeholder } from './Placeholder';
import { ModernFooter } from './ModernFooter';

// Footer patterns registry
export const footerRegistry: Record<string, React.ComponentType<any>> = {
  kj: KjFooter, // Map to 'kj' to match footer.json type
  placeholder: Placeholder, // Simple "powered by Blimpify" footer
  modern: ModernFooter, // Modern multi-column footer with links and actions
};