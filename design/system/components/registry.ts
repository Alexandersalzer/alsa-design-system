import { actionComponents } from './actions/registry';
import { animationComponents } from './animations/registry';
import { appIconComponents } from './app-icon/registry';
import { dataComponents } from './data/registry';
import { feedbackComponents } from './feedback/registry';
import { formComponents } from './forms/registry';
import { layoutComponents } from './layout/registry';
import { listComponents } from './lists/registry';
import { logoIconComponents } from './LogoIcon/registry';
import { mediaComponents } from './media/registry';
import { navigationComponents } from './navigation/registry';
import { overlayComponents } from './overlays/registry';
import { typographyComponents } from './Typography/registry';

// Parent component registry - combines all local registries
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  ...actionComponents,
  ...animationComponents,
  ...appIconComponents,
  ...dataComponents,
  ...feedbackComponents,
  ...formComponents,
  ...layoutComponents,
  ...listComponents,
  ...logoIconComponents,
  ...mediaComponents,
  ...navigationComponents,
  ...overlayComponents,
  ...typographyComponents,
};
