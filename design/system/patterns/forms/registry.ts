import { FormPattern, GridForm } from './form';

// Forms patterns registry
export const formsRegistry: Record<string, React.ComponentType<any>> = {
  form: FormPattern,
  gridForm: GridForm,
};