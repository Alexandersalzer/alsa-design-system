import { KjFooter } from './KjFooter';

// Footer patterns registry
export const footerRegistry: Record<string, React.ComponentType<any>> = {
  kj: KjFooter, // Map to 'kj' to match footer.json type
};