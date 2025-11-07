import { FormPattern } from './form';

// Forms patterns registry
export const formsRegistry: Record<string, React.ComponentType<any>> = {
  form: FormPattern,
};