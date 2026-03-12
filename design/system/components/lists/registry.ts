import { List } from './List/List';
import { Listbox } from './Listbox/Listbox';
import { FeatureList } from './FeatureList/FeatureList';

export const listComponents: Record<string, React.ComponentType<any>> = {
  list: List,
  listbox: Listbox,
  featureList: FeatureList,
};