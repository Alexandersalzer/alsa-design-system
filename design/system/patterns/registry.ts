import { sharedPatterns } from './shared/registry';
import { clientRegistry } from './client/registry';
import { formsRegistry } from './forms/registry';
import { footerRegistry } from './footer/registry';
import { navbarRegistry } from './navbar/registry';
import { gridPatternsRegistry } from './gridPatterns/registry'; // ✅ Import this

// Parent pattern registry - combines all local registries
export const patternRegistry: Record<string, React.ComponentType<any>> = {
  ...sharedPatterns,
  ...clientRegistry,
  ...formsRegistry,
  ...footerRegistry,
  ...navbarRegistry,
  ...gridPatternsRegistry, // ✅ Add it here
};
