import { sharedPatterns } from './shared/registry';
import { clientRegistry } from './animated/registry';
import { formsRegistry } from './forms/registry';
import { footerRegistry } from './footer/registry';
import { navbarRegistry } from './navbar/registry';
import { gridPatternsRegistry } from './gridPatterns/registry';
import { cardsRegistry } from './cards/registry';
import { widgetsRegistry } from './widgets/registry';
import { endingCtaRegistry } from './endingCta/registry';

// Parent pattern registry - combines all local registries
export const patternRegistry: Record<string, React.ComponentType<any>> = {
  ...sharedPatterns,
  ...clientRegistry,
  ...formsRegistry,
  ...footerRegistry,
  ...navbarRegistry,
  ...gridPatternsRegistry,
  ...cardsRegistry,
  ...widgetsRegistry,
  ...endingCtaRegistry,
};
